<template>
  <article
    class="group relative min-w-0 flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300"
  >
    <!-- Accent line in the contestant's color -->
    <div class="h-1 w-full" :style="{ backgroundColor: color }"></div>

    <!-- Photo with name overlay -->
    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800">
      <img
        :src="contestant.photo"
        :alt="contestant.name"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>

      <!-- Vote share pill -->
      <div
        class="absolute top-3 right-3 rounded-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur px-3 py-1 text-sm font-extrabold tabular-nums shadow-sm"
        :style="{ color: textColor }"
      >
        {{ pct }}%
      </div>

      <!-- Identity -->
      <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end gap-3">
        <div
          class="h-11 w-11 shrink-0 rounded-full bg-white p-1 shadow-md ring-2"
          :style="{ '--tw-ring-color': color }"
        >
          <img :src="badge" :alt="contestant.universityCode" class="h-full w-full object-contain" />
        </div>
        <div class="min-w-0">
          <h3 class="truncate text-lg sm:text-xl font-extrabold leading-tight text-white">
            {{ contestant.name }}
          </h3>
          <p class="truncate text-xs font-medium text-white/75">
            <span
              class="mr-1.5 inline-block rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-wider"
              :style="{ backgroundColor: color, color: onColor }"
            >
              {{ contestant.universityCode }}
            </span>
            {{ contestant.university }}
          </p>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-4 p-4 sm:p-5">
      <!-- Vote share meter -->
      <div>
        <div class="mb-1.5 flex items-baseline justify-between text-xs">
          <span class="font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {{ t('taifa.nani.voteShare') }}
          </span>
          <span class="font-extrabold tabular-nums text-gray-900 dark:text-white">{{ pct }}%</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${pct}%`, backgroundColor: color }"
          ></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-auto flex gap-2">
        <button
          v-if="active"
          type="button"
          class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-sm transition-all hover:brightness-95 active:scale-[0.98]"
          :style="{ backgroundColor: color, color: onColor }"
          @click="emit('vote')"
        >
          <span class="material-icons text-lg">how_to_vote</span>
          {{ t('taifa.nani.vote') }}
        </button>
        <div
          v-else
          class="flex h-11 flex-1 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 text-sm font-semibold text-gray-500 dark:text-gray-400"
        >
          {{ t('taifa.nani.battleEnded') }}
        </div>

        <button
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors"
          :class="
            contestant.videoUrl
              ? 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
              : 'border-gray-100 dark:border-zinc-800 text-gray-300 dark:text-zinc-600 cursor-not-allowed'
          "
          :style="contestant.videoUrl ? { color: textColor } : {}"
          :disabled="!contestant.videoUrl"
          :title="t('taifa.nani.watchClip')"
          :aria-label="t('taifa.nani.watchClip')"
          @click="emit('watch')"
        >
          <span class="material-icons text-xl">play_circle</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Contestant } from '../../stores/nani-ni-nani'

const props = defineProps<{
  contestant: Contestant
  color: string
  pct: number
  badge: string
  active: boolean
}>()

const emit = defineEmits<{ vote: []; watch: [] }>()
const { t } = useI18n()

const luminance = (hex: string) => {
  const c = (hex || '').replace('#', '')
  if (c.length < 6) return 0
  return 0.299 * parseInt(c.slice(0, 2), 16) + 0.587 * parseInt(c.slice(2, 4), 16) + 0.114 * parseInt(c.slice(4, 6), 16)
}

/** Readable text on top of the contestant color. */
const onColor = computed(() => (luminance(props.color) > 150 ? '#111827' : '#ffffff'))
/** The color itself as text, darkened when it's too light to read on white. */
const textColor = computed(() => (luminance(props.color) > 170 ? '#374151' : props.color))
</script>
