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
      displayName: 'Jukwaa la Video (Public)',
      meta: {
        icon: 'smart_display',
      },
    },
    {
      name: 'admin-dashboard',
      displayName: 'Studio ya Kicheko',
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'admin-videos',
      displayName: 'Pakia & Simamia Video',
      meta: {
        icon: 'video_call',
      },
    },
    {
      name: 'users',
      displayName: 'Wasanii & Watumiaji',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'payments',
      displayName: 'Malipo & Mauzo',
      meta: {
        icon: 'payments',
      },
      children: [
        {
          name: 'billing',
          displayName: 'Miamala ya Mauzo',
        },
        {
          name: 'payment-methods',
          displayName: 'Njia za Malipo',
        },
        {
          name: 'pricing-plans',
          displayName: 'Gharama za Video',
        },
      ],
    },
    {
      name: 'preferences',
      displayName: 'Wasifu wa Msanii',
      meta: {
        icon: 'badge',
      },
    },
    {
      name: 'settings',
      displayName: 'Mipangilio ya Mfumo',
      meta: {
        icon: 'settings',
      },
    },
    {
      name: 'faq',
      displayName: 'Msaada & Maswali',
      meta: {
        icon: 'help_outline',
      },
    },
  ] as INavigationRoute[],
}
