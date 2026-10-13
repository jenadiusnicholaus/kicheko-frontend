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
        icon: 'smart_display',
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
      name: 'admin-videos',
      displayName: 'kicheko.admin.nav.videos',
      meta: {
        icon: 'video_call',
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
      name: 'payments',
      displayName: 'kicheko.admin.nav.payments',
      meta: {
        icon: 'payments',
      },
      children: [
        {
          name: 'billing',
          displayName: 'kicheko.admin.nav.billing',
        },
        {
          name: 'payment-methods',
          displayName: 'kicheko.admin.nav.paymentMethods',
        },
        {
          name: 'pricing-plans',
          displayName: 'kicheko.admin.nav.pricingPlans',
        },
      ],
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
