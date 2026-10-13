<template>
  <VaSidebar
    v-model="writableVisible"
    :width="sidebarWidth"
    :minimized="minimized"
    :minimized-width="minimizedWidth"
    :animated="animated"
    :color="color"
    class="kicheko-admin-sidebar border-r border-gray-200 dark:border-gray-800"
  >
    <VaAccordion v-model="value" multiple>
      <VaCollapse v-for="(route, index) in navigationRoutes.routes" :key="index">
        <template #header="{ value: isCollapsed }">
          <VaSidebarItem
            :to="route.children ? undefined : { name: route.name }"
            :active="routeHasActiveChild(route)"
            :active-color="activeColor"
            :text-color="textColor(route)"
            :aria-label="`Nenda kwenye ${getDisplayName(route)}`"
            role="button"
            hover-opacity="0.08"
            class="my-0.5 rounded-lg mx-1"
          >
            <VaSidebarItemContent class="py-2.5 pr-2 pl-3">
              <VaIcon
                v-if="route.meta.icon"
                aria-hidden="true"
                :name="route.meta.icon"
                size="20px"
                :color="iconColor(route)"
              />
              <VaSidebarItemTitle
                v-if="!minimized"
                class="flex justify-between items-center leading-5 text-sm font-medium"
              >
                {{ getDisplayName(route) }}
                <VaIcon v-if="route.children" :name="arrowDirection(isCollapsed)" size="16px" />
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </template>

        <template #body>
          <div v-for="(childRoute, index2) in route.children" :key="index2">
            <VaSidebarItem
              :to="{ name: childRoute.name }"
              :active="isActiveChildRoute(childRoute)"
              :active-color="activeColor"
              :text-color="textColor(childRoute)"
              :aria-label="`Nenda kwenye ${getDisplayName(childRoute)}`"
              hover-opacity="0.08"
              class="my-0.5 rounded-lg mx-1"
            >
              <VaSidebarItemContent class="py-2 pr-2 pl-9">
                <VaSidebarItemTitle class="leading-5 text-xs font-normal">
                  {{ getDisplayName(childRoute) }}
                </VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
          </div>
        </template>
      </VaCollapse>
    </VaAccordion>

    <!-- Footer -->
    <template #bottom>
      <div v-if="!minimized" class="p-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400">
        <p class="font-medium text-gray-500 dark:text-gray-400">Kicheko Studio v1.0</p>
        <p class="text-[10px] mt-0.5">Cheka • Tazama • Piga Kura</p>
      </div>
    </template>
  </VaSidebar>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'

import navigationRoutes, { type INavigationRoute } from './NavigationRoutes'

export default defineComponent({
  name: 'AppSidebar',
  props: {
    visible: { type: Boolean, default: true },
    minimized: { type: Boolean, default: false },
    animated: { type: Boolean, default: true },
    mobile: { type: Boolean, default: false },
  },
  emits: ['update:visible'],

  setup: (props, { emit }) => {
    const { getColor, colorToRgba } = useColors()
    const route = useRoute()
    const { t, te } = useI18n()

    const value = ref<boolean[]>([])

    const writableVisible = computed({
      get: () => props.visible,
      set: (v: boolean) => emit('update:visible', v),
    })

    const getDisplayName = (r: INavigationRoute | { displayName: string }) => {
      if (te(r.displayName)) return t(r.displayName)
      return r.displayName
    }

    const isActiveChildRoute = (child: { name: string }) => route.name === child.name

    const routeHasActiveChild = (section: INavigationRoute) => {
      if (route.name === section.name) return true
      if (!section.children) {
        return route.path.endsWith(`${section.name}`)
      }
      return section.children.some(({ name }) => route.name === name || route.path.endsWith(`${name}`))
    }

    const setActiveExpand = () =>
      (value.value = navigationRoutes.routes.map((r: INavigationRoute) => routeHasActiveChild(r)))

    const sidebarWidth = computed(() => (props.mobile ? '100vw' : '256px'))
    const minimizedWidth = computed(() => '4rem')
    const color = computed(() => getColor('background-secondary'))

    // Neutral active highlight — subtle gray, no red
    const activeColor = computed(() => colorToRgba(getColor('textPrimary') || '#111111', 0.08))

    // Icons: active gets text-primary color, inactive gets secondary/muted
    const iconColor = (r: INavigationRoute) => (routeHasActiveChild(r) ? 'textPrimary' : 'secondary')
    const textColor = (r: INavigationRoute) => (routeHasActiveChild(r) ? 'textPrimary' : 'textPrimary')
    const arrowDirection = (state: boolean) => (state ? 'va-arrow-up' : 'va-arrow-down')

    watch(() => route.fullPath, setActiveExpand, { immediate: true })

    return {
      writableVisible,
      sidebarWidth,
      minimizedWidth,
      value,
      color,
      activeColor,
      navigationRoutes,
      routeHasActiveChild,
      isActiveChildRoute,
      getDisplayName,
      iconColor,
      textColor,
      arrowDirection,
    }
  },
})
</script>

<style lang="scss" scoped>
.kicheko-admin-sidebar {
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
