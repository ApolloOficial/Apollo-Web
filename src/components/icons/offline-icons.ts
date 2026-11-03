import { addIcon } from '@iconify/react/offline'

const OFFLINE_ICONS = {
  'lucide:bell': {
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    width: 24,
    height: 24,
  },
  'lucide:chevron-up': {
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 15l-6-6l-6 6"/>',
    width: 24,
    height: 24,
  },
  'lucide:circle-alert': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:circle-check': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16 9l-5.5 5.5L8 12"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:circle-chevron-left': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m14 16l-4-4l4-4"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:circle-chevron-right': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 8l4 4l-4 4"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:circle-x': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9l-6 6m0-6l6 6"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:clipboard-check': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14l2 2l4-4"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:clipboard-list': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m4 7h4m-4 5h4m-8-5h.01M8 16h.01"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:route': {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></g>',
    width: 24,
    height: 24,
  },
  'lucide:siren': {
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 18v-6a5 5 0 1 1 10 0v6M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2zm16-9h1m-3.5-7.5L18 5M2 12h1m9-10v1M4.929 4.929l.707.707M12 12v6"/>',
    width: 24,
    height: 24,
  },
  'lucide:x': {
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>',
    width: 24,
    height: 24,
  },
  'boxicons:calendar-event': {
    body: '<path fill="currentColor" d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M5 20V8h14V6v14z"/><path fill="currentColor" d="M12 13h5v5h-5z"/>',
    width: 24,
    height: 24,
  },
  'fluent:square-hint-sparkles-16-regular': {
    body: '<path fill="currentColor" d="m13.798 2.217l-.015-.004l-.765-.248a1.58 1.58 0 0 1-1-.999L11.77.202a.302.302 0 0 0-.57 0l-.25.764a1.58 1.58 0 0 1-.983.999l-.765.248a.302.302 0 0 0 0 .57l.765.249a1.58 1.58 0 0 1 1 1.002l.248.764A.3.3 0 0 0 11.5 5h.004a.3.3 0 0 0 .281-.202l.249-.764a1.58 1.58 0 0 1 .999-.999l.765-.248a.303.303 0 0 0 0-.57m1.416 3.355l.612.199l.013.003a.242.242 0 0 1 0 .455l-.613.2a1.26 1.26 0 0 0-.799.798l-.199.612a.241.241 0 0 1-.456 0l-.2-.612a1.26 1.26 0 0 0-.798-.802l-.613-.199a.242.242 0 0 1 0-.455l.613-.2a1.26 1.26 0 0 0 .787-.798l.199-.612a.242.242 0 0 1 .456 0l.199.612a1.26 1.26 0 0 0 .799.799M8 2.5c0-.173.035-.343.1-.5H7a.5.5 0 0 0 0 1h1.1a1.3 1.3 0 0 1-.1-.5M4.5 2a.5.5 0 0 1 0 1A1.5 1.5 0 0 0 3 4.5a.5.5 0 0 1-1 0A2.5 2.5 0 0 1 4.5 2m9 9a.5.5 0 0 1 .5.5a2.5 2.5 0 0 1-2.5 2.5a.5.5 0 0 1 0-1a1.5 1.5 0 0 0 1.5-1.5a.5.5 0 0 1 .5-.5m-7 2.5A.5.5 0 0 1 7 13h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5m-2-.5a.5.5 0 0 1 0 1A2.5 2.5 0 0 1 2 11.5a.5.5 0 0 1 1 0A1.5 1.5 0 0 0 4.5 13m-2-3.5A.5.5 0 0 0 3 9V7a.5.5 0 0 0-1 0v2a.5.5 0 0 0 .5.5"/>',
    width: 16,
    height: 16,
  },
}

for (const [name, data] of Object.entries(OFFLINE_ICONS)) {
  addIcon(name, data)
}
