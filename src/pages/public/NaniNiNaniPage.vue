<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-w-5xl mx-auto w-full">
    <!-- Loading state while fetching battle from API -->
    <div v-if="naniStore.isLoading" class="flex flex-col items-center justify-center py-20">
      <span class="material-icons text-5xl text-[#FEBF01] animate-spin">sync</span>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-4">{{ t('taifa.nani.loading') }}</p>
    </div>

    <template v-else-if="battle">
      <!-- Brush Highlight Title matching Page 3 of PDF -->
      <div class="text-center mb-8 sm:mb-12 relative">
        <div class="inline-block relative">
          <!-- Yellow brush stroke behind text -->
          <span class="absolute -inset-x-6 -inset-y-2 bg-[#FEBF01] rounded-2xl -rotate-1 skew-x-3 shadow-sm z-0"></span>
          <h1 class="relative z-10 text-3xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight px-4 py-1">
            {{ t('taifa.nani.title') }}
          </h1>
        </div>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-semibold mt-4">
          {{ t('taifa.nani.subtitle') }}
        </p>

        <!-- Live Battle Status Pill -->
        <div
          v-if="battle.status === 'active'"
          class="inline-flex items-center gap-2 px-3 py-1 mt-2.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{{ t('taifa.nani.roundOngoing', { round: battle.roundNumber }) }}</span>
        </div>
        <div
          v-else
          class="inline-flex items-center gap-2 px-3 py-1 mt-2.5 rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-zinc-700"
        >
          <span>{{ t('taifa.nani.endedPill', { round: battle.roundNumber }) }}</span>
        </div>
      </div>

      <!-- Battles Arena — transform track: exactly one battle visible, auto-advances, pauses on hover -->
      <div class="relative w-full max-w-5xl mx-auto mb-4">
        <!-- Prev / Next arrows -->
        <template v-if="displayBattles.length > 1">
          <button
            type="button"
            class="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform"
            :aria-label="t('taifa.nani.prevBattle')"
            @click="manualPrev"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <button
            type="button"
            class="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform"
            :aria-label="t('taifa.nani.nextBattle')"
            @click="manualNext"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </template>
        <div
          class="w-full overflow-hidden touch-pan-y select-none"
          :class="displayBattles.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''"
          @mouseenter="stopAutoScroll"
          @mouseleave="startAutoScroll"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="endDrag"
          @click.capture="onClickCapture"
          @wheel="onWheel"
          @dragstart.prevent
        >
          <div
            class="flex"
            :class="{ 'transition-transform duration-500 ease-out': animate }"
            :style="{ transform: trackTransform }"
            @transitionend="onTransitionEnd"
          >
            <div v-for="(b, i) in loopBattles" :key="`${b.id}-${i}`" class="w-full shrink-0 px-1">
              <!-- Battle Title -->
              <div class="text-center mb-5">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  {{ b.title }}
                </h2>
                <p class="text-xs font-bold text-gray-400 mt-0.5">
                  {{ t('taifa.admin.nani.roundLabel') }} {{ b.roundNumber }}
                  <span v-if="b.categoryName"> • {{ b.categoryName }}</span>
                </p>
              </div>

              <!-- Matchup Battle Arena (Two Cards + VS Star) -->
              <div
                class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] gap-4 md:gap-5 items-center relative"
              >
                <ContestantCard
                  :contestant="b.contestantA"
                  :color="colorA(b)"
                  :pct="pctOf(b, b.contestantA.votes)"
                  :badge="badgeFor(b.contestantA)"
                  :active="b.status === 'active'"
                  @vote="openVoteModal(b.contestantA, b)"
                  @watch="openVideoModal(b.contestantA)"
                />

                <!-- Center: live vote graph in the battle's colors
                 (vertical between the cards on desktop, horizontal when stacked) -->
                <div class="flex md:flex-col items-center justify-center gap-2 md:gap-2.5 z-20 md:self-stretch md:py-6">
                  <span class="text-sm md:text-base font-black tabular-nums" :style="{ color: colorA(b) }">
                    {{ pctOf(b, b.contestantA.votes) }}%
                  </span>
                  <div
                    class="relative flex-1 self-stretch md:self-auto md:w-6 flex items-center justify-center min-h-[1.5rem]"
                  >
                    <!-- Split bar: A then B, sized by vote share -->
                    <div
                      class="absolute flex md:flex-col inset-x-0 md:inset-x-auto md:inset-y-0 h-3.5 md:h-auto md:w-3.5 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 shadow-inner"
                      :title="`${b.contestantA.name}: ${pctOf(b, b.contestantA.votes)}% · ${b.contestantB.name}: ${pctOf(b, b.contestantB.votes)}%`"
                    >
                      <div
                        class="transition-all duration-700 ease-out"
                        :style="{ flex: `${pctOf(b, b.contestantA.votes)} 1 0%`, backgroundColor: colorA(b) }"
                      ></div>
                      <div
                        class="transition-all duration-700 ease-out"
                        :style="{ flex: `${pctOf(b, b.contestantB.votes)} 1 0%`, backgroundColor: colorB(b) }"
                      ></div>
                    </div>
                  </div>
                  <span class="text-sm md:text-base font-black tabular-nums" :style="{ color: colorB(b) }">
                    {{ pctOf(b, b.contestantB.votes) }}%
                  </span>
                  <span class="text-[10px] font-bold uppercase tracking-wide text-gray-400 tabular-nums">
                    {{ (b.contestantA.votes + b.contestantB.votes).toLocaleString() }} {{ t('taifa.nani.votes') }}
                  </span>
                </div>

                <ContestantCard
                  :contestant="b.contestantB"
                  :color="colorB(b)"
                  :pct="pctOf(b, b.contestantB.votes)"
                  :badge="badgeFor(b.contestantB)"
                  :active="b.status === 'active'"
                  @vote="openVoteModal(b.contestantB, b)"
                  @watch="openVideoModal(b.contestantB)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide dots — each in its battle's color -->
      <div v-if="displayBattles.length > 1" class="flex items-center justify-center gap-2 mb-8">
        <button
          v-for="(b, i) in displayBattles"
          :key="`dot-${b.id}`"
          type="button"
          class="h-2.5 rounded-full transition-all duration-300"
          :class="activeDot === i ? 'w-7' : 'w-2.5 opacity-40 hover:opacity-70'"
          :style="{ backgroundColor: b.themeColor }"
          :aria-label="b.title"
          @click="goTo(i)"
        ></button>
      </div>

      <!-- Vote Payment Modal matching Page 4 of PDF -->
      <div
        v-if="showVoteModal && selectedContestant"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      >
        <div
          class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative text-center"
        >
          <!-- Close 'X' Button -->
          <button
            v-if="voteStep !== 'waiting'"
            type="button"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            @click="closeVoteModal"
          >
            <span class="material-icons text-lg">close</span>
          </button>

          <!-- Credit/Debit Card Icon Graphic -->
          <div class="mb-4">
            <img
              src="/taifa/payment_cards_icon.png"
              :alt="t('taifa.pages.nani.cardsAlt')"
              class="h-16 mx-auto object-contain"
            />
          </div>

          <!-- Modal Headings matching PDF -->
          <h3 class="text-xl font-black text-gray-900 dark:text-white">
            {{ t('taifa.nani.completeVote') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
            {{ t('taifa.nani.payVoteDesc', { name: selectedContestant.name, fee: VOTE_FEE.toLocaleString() }) }}
          </p>

          <!-- Step 1: vote count + payer phone -->
          <template v-if="voteStep === 'form'">
            <!-- Votes count picker -->
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <button
                v-for="n in VOTE_COUNT_CHOICES"
                :key="n"
                type="button"
                class="px-3.5 py-2 rounded-xl text-sm font-bold border transition-all"
                :class="
                  votesCount === n
                    ? 'bg-[#FEBF01] border-[#FEBF01] text-gray-950'
                    : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-[#FEBF01]'
                "
                @click="votesCount = n"
              >
                {{ n }}
              </button>
            </div>

            <!-- Amount Box -->
            <div
              class="p-4 rounded-2xl bg-[#EBF4FE] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 mb-4 text-center"
            >
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">{{
                t('taifa.nani.amount')
              }}</span>
              <span class="text-2xl sm:text-3xl font-black text-[#183153] dark:text-blue-300 tabular-nums">
                TSh {{ voteTotal.toLocaleString() }}
              </span>
            </div>

            <input
              v-model="voterPhone"
              type="tel"
              inputmode="tel"
              :placeholder="t('taifa.nani.phonePlaceholder')"
              class="w-full mb-4 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
            />

            <p v-if="voteError" class="text-xs text-red-600 font-bold mb-3">{{ voteError }}</p>

            <div class="space-y-2">
              <button
                type="button"
                :disabled="isVoting || !canPayVote"
                class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                @click="submitVote"
              >
                <span v-if="isVoting" class="material-icons animate-spin text-base">sync</span>
                <span>{{ t('taifa.nani.payVoteBtn', { fee: voteTotal.toLocaleString() }) }}</span>
              </button>
              <button
                type="button"
                class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                @click="closeVoteModal"
              >
                {{ t('taifa.nani.cancel') }}
              </button>
            </div>
          </template>

          <!-- Step 2: waiting for the Pay-IT webhook -->
          <div v-else-if="voteStep === 'waiting'">
            <PaymentWaitingPanel
              :phone="voterPhone"
              :checking="checkingVote"
              @check="checkVoteNow"
              @back="backToVoteForm"
            />
          </div>

          <!-- Step 3: vote counted -->
          <div v-else-if="voteStep === 'done'" class="py-4">
            <span class="material-icons text-5xl text-emerald-500 mb-3">check_circle</span>
            <p class="font-black text-gray-900 dark:text-white text-sm mb-1">
              {{ t('taifa.nani.voteDoneTitle') }}
            </p>
            <p class="text-xs text-gray-500 mb-4">{{ voteDoneText }}</p>
            <button
              type="button"
              class="w-full py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm transition-all"
              @click="closeVoteModal"
            >
              {{ t('taifa.nani.done') }}
            </button>
          </div>

          <!-- Step 4: failed / still pending -->
          <div v-else class="py-4">
            <span
              class="material-icons text-5xl mb-3"
              :class="voteStep === 'failed' ? 'text-red-500' : 'text-amber-500'"
            >
              {{ voteStep === 'failed' ? 'error' : 'schedule' }}
            </span>
            <p class="font-black text-gray-900 dark:text-white text-sm mb-4">
              {{ voteStep === 'failed' ? t('taifa.nani.voteFailed') : t('taifa.nani.votePending') }}
            </p>
            <button
              type="button"
              class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-sm"
              @click="closeVoteModal"
            >
              {{ t('taifa.nani.cancel') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Contestant Video Modal -->
      <div
        v-if="showVideoModal && videoContestant"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        @click.self="showVideoModal = false"
      >
        <div
          class="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 sm:p-5 relative"
        >
          <button
            type="button"
            class="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-10"
            @click="showVideoModal = false"
          >
            <span class="material-icons text-lg">close</span>
          </button>
          <h3 class="font-black text-gray-900 dark:text-white text-sm mb-3 pr-6">
            {{ videoContestant.name }}
            <span class="text-[#183153] dark:text-amber-400 text-xs font-bold"
              >• {{ videoContestant.universityCode }}</span
            >
          </h3>
          <div class="w-full aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              v-if="embedUrl(videoContestant.videoUrl)"
              :src="embedUrl(videoContestant.videoUrl)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <a
              v-else
              :href="videoContestant.videoUrl"
              target="_blank"
              rel="noopener"
              class="w-full h-full flex items-center justify-center text-white font-black text-sm gap-2"
            >
              <span class="material-icons">open_in_new</span>
              {{ t('taifa.nani.watchClip') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Vote Success Toast -->
      <div
        v-if="voteSuccessMessage"
        class="fixed bottom-24 z-50 px-5 py-3 rounded-2xl bg-gray-950 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 border border-amber-400 animate-bounce-subtle"
      >
        <span class="text-base text-red-500">❤️</span>
        <span>{{ voteSuccessMessage }}</span>
      </div>
    </template>

    <!-- Error / empty state: loading done but no battle found -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <span class="material-icons text-5xl text-gray-400">error_outline</span>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-4">
        {{ naniStore.error || t('taifa.nani.loading') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNaniNiNaniStore, type Contestant, type BattleRound } from '../../stores/nani-ni-nani'
import { useUniversitiesStore } from '../../stores/universities'
import ContestantCard from '../../components/nani/ContestantCard.vue'
import PaymentWaitingPanel from '../../components/PaymentWaitingPanel.vue'
import { resolveMediaUrl } from '../../services/api/config'

const { t } = useI18n()
const naniStore = useNaniNiNaniStore()
const uniStore = useUniversitiesStore()

onMounted(() => {
  naniStore.fetchActiveBattle()
  naniStore.fetchBattles()
  uniStore.fetchUniversities()
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
  stopVotePoll()
})

// ── Carousel: translateX track, one full battle per frame ─────
let autoScrollTimer: number | undefined
const slideIndex = ref(0)
const animate = ref(true)

const stopAutoScroll = () => {
  if (autoScrollTimer !== undefined) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = undefined
  }
}

const next = () => {
  const count = displayBattles.value.length
  if (count <= 1) return
  animate.value = true
  slideIndex.value = Math.min(slideIndex.value + 1, count)
}

const prev = () => {
  const count = displayBattles.value.length
  if (count <= 1) return
  if (slideIndex.value <= 0) {
    // Jump invisibly to the clone of the first battle, then slide back one
    animate.value = false
    slideIndex.value = count
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        animate.value = true
        slideIndex.value = count - 1
      }),
    )
    return
  }
  animate.value = true
  slideIndex.value -= 1
}

const manualPrev = () => {
  prev()
  startAutoScroll()
}

const manualNext = () => {
  next()
  startAutoScroll()
}

const goTo = (i: number) => {
  animate.value = true
  slideIndex.value = i
  startAutoScroll()
}

/** After sliding onto the cloned first battle, snap back to the real one invisibly. */
const onTransitionEnd = (e: TransitionEvent) => {
  if (e.target !== e.currentTarget) return
  if (slideIndex.value >= displayBattles.value.length) {
    animate.value = false
    slideIndex.value = 0
  }
}

const activeDot = computed(() => slideIndex.value % Math.max(1, displayBattles.value.length))

// ── Manual scrolling: drag/swipe (track follows the pointer) + trackpad/wheel ──
const dragX = ref(0)
let pointerStartX: number | null = null
let dragging = false

const onPointerDown = (e: PointerEvent) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  pointerStartX = e.clientX
  dragging = false
}

const onPointerMove = (e: PointerEvent) => {
  if (pointerStartX === null) return
  const dx = e.clientX - pointerStartX
  if (!dragging && Math.abs(dx) > 8) {
    // Only capture once it's clearly a drag, so taps on buttons still click
    dragging = true
    animate.value = false
    stopAutoScroll()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  if (dragging) dragX.value = dx
}

const endDrag = (e: PointerEvent) => {
  if (pointerStartX === null) return
  const width = (e.currentTarget as HTMLElement).offsetWidth || 1
  const dx = dragX.value
  pointerStartX = null
  dragX.value = 0
  if (!dragging) return
  dragging = false
  animate.value = true
  if (Math.abs(dx) > Math.min(80, width * 0.15)) {
    if (dx < 0) next()
    else prev()
  }
  startAutoScroll()
}

/** Suppress the click that follows a drag so it doesn't hit a button. */
const onClickCapture = (e: MouseEvent) => {
  if (wasDragClick) {
    e.stopPropagation()
    e.preventDefault()
    wasDragClick = false
  }
}
let wasDragClick = false
const onPointerUp = (e: PointerEvent) => {
  wasDragClick = dragging
  endDrag(e)
}

let wheelLock = false
const onWheel = (e: WheelEvent) => {
  const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
  if (!horizontal) return
  e.preventDefault()
  if (wheelLock || Math.abs(horizontal) < 15) return
  wheelLock = true
  if (horizontal > 0) next()
  else prev()
  setTimeout(() => (wheelLock = false), 800)
}

const trackTransform = computed(() => `translateX(calc(${-slideIndex.value * 100}% + ${dragX.value}px))`)

const startAutoScroll = () => {
  stopAutoScroll()
  autoScrollTimer = window.setInterval(next, 6000)
}

const battle = computed<BattleRound | null>(() => naniStore.activeBattle)

const visibleBattles = computed(() => naniStore.battles.filter((b) => b.status !== 'draft'))

const displayBattles = computed<BattleRound[]>(() =>
  visibleBattles.value.length > 0 ? visibleBattles.value : battle.value ? [battle.value] : [],
)

/** Real battles plus a clone of the first, so the loop always moves forward. */
const loopBattles = computed<BattleRound[]>(() =>
  displayBattles.value.length > 1 ? [...displayBattles.value, displayBattles.value[0]] : displayBattles.value,
)

const pctOf = (b: BattleRound, votes: number) => {
  const total = b.contestantA.votes + b.contestantB.votes
  return total === 0 ? 50 : Math.round((votes / total) * 100)
}

/** Readable text color on top of the battle's theme color. */
const contrastText = (hex: string): string => {
  const c = (hex || '').replace('#', '')
  if (c.length < 6) return '#111827'
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const bl = parseInt(c.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * bl > 150 ? '#111827' : '#ffffff'
}

/** Mix a hex color toward black (amount > 0) or white (amount < 0). */
const shade = (hex: string, amount: number): string => {
  const c = (hex || '').replace('#', '')
  if (c.length < 6) return hex
  const target = amount > 0 ? 0 : 255
  const a = Math.abs(amount)
  const mix = (i: number) =>
    Math.round(parseInt(c.slice(i, i + 2), 16) * (1 - a) + target * a)
      .toString(16)
      .padStart(2, '0')
  return `#${mix(0)}${mix(2)}${mix(4)}`
}

/** Contestant A = the battle color; contestant B = a contrasting shade of it,
 * so every battle's graph is drawn in its own color family. */
const colorA = (b: BattleRound) => b.themeColor
const colorB = (b: BattleRound) =>
  contrastText(b.themeColor) === '#ffffff' ? shade(b.themeColor, -0.55) : shade(b.themeColor, 0.6)

/** Badge comes from the universities directory; battle's own badge field is the fallback. */
const badgeFor = (c: Contestant): string => {
  const u = uniStore.universities.find(
    (u) => u.code.toLowerCase() === c.universityCode.toLowerCase() || u.name === c.university,
  )
  return resolveMediaUrl(u?.badge) || c.badgeImage || '/image/Kicheko.png'
}

const showVideoModal = ref(false)
const videoContestant = ref<Contestant | null>(null)

const openVideoModal = (c: Contestant) => {
  videoContestant.value = c
  showVideoModal.value = true
}

/** Convert a YouTube watch/shorts URL to an embed URL; pass other URLs through. */
const embedUrl = (url: string): string => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/)
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : ''
}

// ── Paid voting (Pay-IT) — fixed TSh 1,000 per vote ───────────
const VOTE_FEE = 1000

const showVoteModal = ref(false)
const selectedContestant = ref<Contestant | null>(null)
const votingBattle = ref<BattleRound | null>(null)
const voteStep = ref<'form' | 'waiting' | 'done' | 'failed' | 'pending'>('form')
const voterPhone = ref('')
const voteError = ref('')
const isVoting = ref(false)
const checkingVote = ref(false)
const votePaymentId = ref('')
const voteSuccessMessage = ref('')
const voteDoneText = ref('')

// Payer picks how many votes — backend charges votesCount x VOTE_FEE (max 1000).
const VOTE_COUNT_CHOICES = [1, 5, 10, 25, 50, 100]
const votesCount = ref(1)
const voteTotal = computed(() => votesCount.value * VOTE_FEE)
const canPayVote = computed(() => voterPhone.value.replace(/\D/g, '').length >= 9)

let votePollTimer: ReturnType<typeof setTimeout> | undefined
const stopVotePoll = () => {
  if (votePollTimer) clearTimeout(votePollTimer)
  votePollTimer = undefined
}

const openVoteModal = (contestant: Contestant, b: BattleRound) => {
  selectedContestant.value = contestant
  votingBattle.value = b
  voteStep.value = 'form'
  votesCount.value = 1
  voteError.value = ''
  voteDoneText.value = ''
  votePaymentId.value = ''
  showVoteModal.value = true
}

const closeVoteModal = () => {
  stopVotePoll()
  showVoteModal.value = false
  // Surface the "vote counted" toast once the voter dismisses the done step.
  if (voteStep.value === 'done' && voteDoneText.value) {
    voteSuccessMessage.value = voteDoneText.value
    setTimeout(() => (voteSuccessMessage.value = ''), 5000)
  }
}

const buildVoteSuccessMessage = () => {
  const c = selectedContestant.value
  const b = naniStore.battles.find((x) => x.id === votingBattle.value?.id) || votingBattle.value
  if (!c || !b) return ''
  const votes = b.contestantA.id === c.id ? b.contestantA.votes : b.contestantB.votes
  return t('taifa.nani.votedSuccess', {
    name: c.name,
    pct: pctOf(b, votes),
    fee: voteTotal.value.toLocaleString(),
  })
}

/** Applies a status response to the vote modal. Returns true when the
 * payment reached a terminal state (confirmed or failed). */
const applyVoteStatus = (s: { confirmed?: boolean; payment_status?: string } | null): boolean => {
  if (s?.confirmed) {
    voteDoneText.value = buildVoteSuccessMessage()
    voteStep.value = 'done'
    return true
  }
  if (s && ['failed', 'underpaid'].includes(s.payment_status ?? '')) {
    voteStep.value = 'failed'
    return true
  }
  return false
}

const pollVote = (paymentId: string, deadline: number) => {
  votePollTimer = setTimeout(async () => {
    const s = await naniStore.fetchVoteStatus(paymentId)
    if (!applyVoteStatus(s)) {
      if (Date.now() > deadline) voteStep.value = 'pending'
      else pollVote(paymentId, deadline)
    }
  }, 3000)
}

const checkVoteNow = async () => {
  if (!votePaymentId.value || checkingVote.value) return
  checkingVote.value = true
  try {
    applyVoteStatus(await naniStore.fetchVoteStatus(votePaymentId.value))
  } finally {
    checkingVote.value = false
  }
}

const backToVoteForm = () => {
  stopVotePoll()
  voteStep.value = 'form'
}

const submitVote = async () => {
  if (!selectedContestant.value || !votingBattle.value || !canPayVote.value) return
  isVoting.value = true
  voteError.value = ''
  try {
    const res = await naniStore.buyVotes({
      battleId: votingBattle.value.id,
      contestantId: selectedContestant.value.id,
      votesCount: votesCount.value,
      mobileNumber: voterPhone.value,
      amount: voteTotal.value,
    })
    votePaymentId.value = res.payment_id
    voteStep.value = 'waiting'
    pollVote(res.payment_id, Date.now() + 120_000)
  } catch (e: any) {
    voteError.value = e?.response?.data?.detail || e?.message || t('taifa.nani.voteFailed')
  } finally {
    isVoting.value = false
  }
}
</script>

<style scoped>
@keyframes bounceSubtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.animate-bounce-subtle {
  animation: bounceSubtle 2.5s infinite ease-in-out;
}
</style>
