import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import YouTubeLayout from '../layouts/YouTubeLayout.vue'
import RouteViewComponent from '../layouts/RouterBypass.vue'
import { useAuthStore } from '../stores/auth-store'

declare module 'vue-router' {
  interface RouteMeta {
    /** Area requires an authenticated session — bounced to login otherwise. */
    requiresAuth?: boolean
    /** Area is for guests only — authenticated users go to the app. */
    guestOnly?: boolean
  }
}

const routes: Array<RouteRecordRaw> = [
  // 1. Public Video Platform (YouTube-Like Experience)
  {
    path: '/',
    component: YouTubeLayout,
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('../pages/public/HomePage.vue'),
      },
      {
        name: 'watch',
        path: 'watch/:id',
        component: () => import('../pages/public/WatchPage.vue'),
      },
      {
        name: 'shorts',
        path: 'shorts',
        component: () => import('../pages/public/ShortsPage.vue'),
      },
      {
        name: 'short-detail',
        path: 'shorts/:id',
        component: () => import('../pages/public/ShortsPage.vue'),
      },
      {
        name: 'comedians',
        path: 'comedians',
        component: () => import('../pages/public/ComediansPage.vue'),
      },
      {
        name: 'comedian-profile',
        path: 'comedians/:id',
        component: () => import('../pages/public/ComedianProfilePage.vue'),
      },
      {
        name: 'search',
        path: 'search',
        component: () => import('../pages/public/SearchPage.vue'),
      },
      {
        name: 'library',
        path: 'library',
        component: () => import('../pages/public/LibraryPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // 2. Auth Pages (Clean, Plain, No Dashboard Layout)
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },

  // 3. Admin & Creator Studio Area
  {
    path: '/admin',
    component: AppLayout,
    meta: { requiresAuth: true },
    redirect: { name: 'admin-dashboard' },
    children: [
      {
        name: 'admin-dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'dashboard',
        path: 'dashboard-alias',
        redirect: { name: 'admin-dashboard' },
      },
      {
        name: 'admin-videos',
        path: 'videos',
        component: () => import('../pages/admin/VideoManagementPage.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
      },
      {
        name: 'payments',
        path: 'payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
          },
        ],
      },
      {
        name: 'faq',
        path: 'faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },
    ],
  },

  // Direct settings route redirect
  {
    path: '/settings',
    redirect: { name: 'settings' },
  },

  // 4. 404 & Wildcard fallback
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Refresh profile once per page load if token exists but user profile is missing
  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
    }
  }

  // Protected routes bounce to login with redirect param
  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Guest-only routes (login, signup) redirect to home if already authenticated
  if (to.matched.some((record) => record.meta.guestOnly) && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
