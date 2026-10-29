import type { PanelLookupDto } from '../types/panel.types'
import { request } from './http'

export function getPanelById(id: string) {
  return request<PanelLookupDto>(`/panels/${encodeURIComponent(id)}`)
}
