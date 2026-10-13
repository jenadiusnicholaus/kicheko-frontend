<template>
  <div class="relative flex items-center w-full py-2 bg-white/95 dark:bg-[#0f0f12]/95 backdrop-blur-sm z-10">
    <!-- Left Scroll Button -->
    <button
      v-if="canScrollLeft"
      type="button"
      class="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1f1f23] shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 absolute left-0 z-10 hover:bg-gray-100"
      @click="scroll('left')"
    >
      <span class="material-icons text-base">chevron_left</span>
    </button>

    <!-- Scrollable container -->
    <div
      ref="scrollContainer"
      class="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 w-full"
      @scroll="updateScrollButtons"
    >
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="chip-button"
        :class="{ active: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Right Scroll Button -->
    <button
      v-if="canScrollRight"
      type="button"
      class="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1f1f23] shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 absolute right-0 z-10 hover:bg-gray-100"
      @click="scroll('right')"
    >
      <span class="material-icons text-base">chevron_right</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  selectedCategory: string
}>()

const emit = defineEmits<{
  (e: 'select', category: string): void
}>()

const categories = ['All', 'Stand-up Comedy', 'Skits', 'Short Comedy', 'Trending', 'Free', 'Premium']

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const selectCategory = (cat: string) => {
  emit('select', cat)
}

const updateScrollButtons = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 10
}

const scroll = (direction: 'left' | 'right') => {
  if (!scrollContainer.value) return
  const offset = direction === 'left' ? -250 : 250
  scrollContainer.value.scrollBy({ left: offset, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollButtons()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chip-button {
  flex-shrink: 0;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid transparent;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
}

:global(.dark) .chip-button {
  background-color: #27272a;
  color: #e4e4e7;
}

.chip-button:hover {
  background-color: #e5e7eb;
}

:global(.dark) .chip-button:hover {
  background-color: #3f3f46;
}

.chip-button.active {
  background-color: #febf01;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(254, 191, 1, 0.35);
}

:global(.dark) .chip-button.active {
  background-color: #febf01;
  color: #09090b;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(254, 191, 1, 0.45);
}
</style>
