import type { PanelDto } from '../types/panel.types'
import { request } from './http'

export function getPanelById(id: string) {
  return request<PanelDto>(`/panels/${encodeURIComponent(id)}`)
}
