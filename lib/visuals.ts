export const visuals = {
  logo: '/visuals/logo-mark.svg',
  dashboard: '/visuals/dashboard.svg',
  requests: '/visuals/requests.svg',
  employees: '/visuals/employees.svg',
  assets: '/visuals/assets.svg',
  inventory: '/visuals/inventory.svg',
  tickets: '/visuals/tickets.svg',
  announcements: '/visuals/announcements.svg',
  reports: '/visuals/reports.svg',
  settings: '/visuals/settings.svg',
  profile: '/visuals/profile.svg',
  security: '/visuals/security.svg',
  notification: '/visuals/notification.svg',
  search: '/visuals/search.svg',
  laptop: '/visuals/laptop.svg',
  officeScene: '/visuals/office-scene.svg',
  authHero: '/visuals/auth-hero.svg',
  empty: '/visuals/empty.svg',
  command: '/visuals/command.svg',
  lowStock: '/visuals/low-stock.svg',
  offboarding: '/visuals/offboarding.svg'
} as const;

export type VisualName = keyof typeof visuals;
