import type { PanelDto } from '../types/panel.types'
import { request, toApiError } from './http'

export async function getPanelById(id: string): Promise<PanelDto> {
  try {
    return await request<PanelDto>(`/panels/${encodeURIComponent(id)}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}
