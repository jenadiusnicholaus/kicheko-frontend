export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'home',
      displayName: 'kicheko.admin.nav.public',
      meta: {
        icon: 'home',
      },
    },
    {
      name: 'admin-dashboard',
      displayName: 'kicheko.admin.nav.studio',
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'admin-applications',
      displayName: 'taifa.admin.applicationsTitle',
      meta: {
        icon: 'how_to_reg',
      },
    },
    {
      name: 'admin-voting-batches',
      displayName: 'taifa.admin.batches.nav',
      meta: {
        icon: 'how_to_vote',
      },
    },
    {
      name: 'admin-vote-stats',
      displayName: 'taifa.voteStats.nav',
      meta: {
        icon: 'how_to_vote',
      },
    },
    {
      name: 'admin-universities',
      displayName: 'taifa.admin.universitiesNav',
      meta: {
        icon: 'school',
      },
    },
    {
      name: 'admin-nani-ni-nani',
      displayName: 'taifa.layout.naniNiNani',
      meta: {
        icon: 'sports_kabaddi',
      },
    },
    {
      name: 'admin-wall-of-fame',
      displayName: 'taifa.layout.wallOfFame',
      meta: {
        icon: 'emoji_events',
      },
    },
    {
      name: 'users',
      displayName: 'kicheko.admin.nav.users',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'preferences',
      displayName: 'kicheko.admin.nav.profile',
      meta: {
        icon: 'badge',
      },
    },
    {
      name: 'settings',
      displayName: 'kicheko.admin.nav.settings',
      meta: {
        icon: 'settings',
      },
    },
    {
      name: 'faq',
      displayName: 'kicheko.admin.nav.faq',
      meta: {
        icon: 'help_outline',
      },
    },
  ] as INavigationRoute[],
}
