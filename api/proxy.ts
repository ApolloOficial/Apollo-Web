const HOP_BY_HOP_HEADERS = ['host', 'connection', 'content-length']

async function handle(request: Request): Promise<Response> {
  const origin = process.env.API_ORIGIN

  if (!origin) {
    return Response.json(
      { message: 'API_ORIGIN não configurada no ambiente.' },
      { status: 500 },
    )
  }

  const url = new URL(request.url)
  const path = url.searchParams.get('path') ?? ''
  url.searchParams.delete('path')
  const query = url.searchParams.toString()
  const target = `${origin.replace(/\/$/, '')}/api/${path}${query ? `?${query}` : ''}`

  const headers = new Headers(request.headers)
  HOP_BY_HOP_HEADERS.forEach((name) => headers.delete(name))

  const hasBody = !['GET', 'HEAD'].includes(request.method)

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
    })

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    })
  } catch {
    return Response.json(
      { message: 'Não foi possível conectar à API.' },
      { status: 502 },
    )
  }
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
