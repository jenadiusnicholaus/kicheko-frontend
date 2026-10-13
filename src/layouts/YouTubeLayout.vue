<template>
  <div
    class="min-h-screen bg-white dark:bg-[#0f0f12] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors"
  >
    <!-- YouTube Top Navbar -->
    <YouTubeNavbar @toggleSidebar="toggleSidebar" />

    <!-- Main Body: Sidebar + RouterView -->
    <div class="flex-1 flex">
      <!-- Left Sidebar -->
      <YouTubeSidebar :minimized="isSidebarMinimized" :is-mobile="isMobile" @closeMobile="closeMobileSidebar" />

      <!-- Content Area -->
      <main class="flex-1 overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useBreakpoint } from 'vuestic-ui'
import YouTubeNavbar from '../components/youtube/YouTubeNavbar.vue'
import YouTubeSidebar from '../components/youtube/YouTubeSidebar.vue'

const breakpoint = useBreakpoint()

const isSidebarMinimized = ref(false)
const isMobile = ref(false)

const handleResize = () => {
  isMobile.value = breakpoint.mdDown
  if (isMobile.value) {
    isSidebarMinimized.value = true
  }
}

const toggleSidebar = () => {
  isSidebarMinimized.value = !isSidebarMinimized.value
}

const closeMobileSidebar = () => {
  isSidebarMinimized.value = true
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
