import { useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../types/ui.types'

export function useLayoutContext() {
  return useOutletContext<LayoutContext>()
}
