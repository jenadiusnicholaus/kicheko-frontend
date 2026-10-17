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
          <span>{{
            t('taifa.nani.roundOngoing', { round: battle.roundNumber, votes: displayTotalVotes.toLocaleString() })
          }}</span>
        </div>
        <div
          v-else
          class="inline-flex items-center gap-2 px-3 py-1 mt-2.5 rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-zinc-700"
        >
          <span>{{ t('taifa.nani.endedPill', { round: battle.roundNumber }) }}</span>
        </div>
      </div>

      <!-- Battles Arena — each matchup is a snap slide, auto-scrolls, pauses on hover -->
      <div
        ref="carouselRef"
        class="nani-carousel w-full max-w-5xl mx-auto overflow-x-auto flex mb-8"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
      >
        <div v-for="(b, i) in loopBattles" :key="`${b.id}-${i}`" class="w-full shrink-0">
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
          <div class="grid grid-cols-1 md:grid-cols-11 gap-6 items-center relative">
            <!-- Left Card: Contestant A (e.g. Frank Mollel) -->
            <div
              class="md:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 relative flex flex-col"
            >
              <!-- Photo Container -->
              <div class="relative w-full aspect-[4/3] bg-gradient-to-t from-black/60 to-transparent overflow-hidden">
                <img
                  :src="b.contestantA.photo"
                  :alt="b.contestantA.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <!-- University Floating Badge -->
                <div
                  class="absolute -bottom-5 left-6 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-lg p-1.5 border-2 border-white dark:border-zinc-700 flex items-center justify-center z-10"
                >
                  <img
                    :src="badgeFor(b.contestantA)"
                    :alt="b.contestantA.universityCode"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-6 pt-8 flex-1 flex flex-col justify-between">
                <div>
                  <!-- University Code Pill -->
                  <div
                    class="inline-block px-3 py-0.5 rounded-md bg-[#183153] text-white text-[11px] font-black tracking-wider uppercase mb-1"
                  >
                    {{ b.contestantA.universityCode }}
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {{ b.contestantA.name }}
                  </h3>

                  <!-- Votes Counter -->
                  <div
                    class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1"
                  >
                    <span class="material-icons text-red-500 text-base">favorite</span>
                    <span>{{ b.contestantA.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}</span>
                    <span class="text-gray-400 font-normal">({{ pctOf(b, b.contestantA.votes) }}%)</span>
                  </div>
                </div>

                <!-- Vote Button matching PDF -->
                <button
                  v-if="b.status === 'active'"
                  type="button"
                  class="w-full mt-5 py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-98 text-gray-950 font-black text-base shadow-md hover:shadow-[#FEBF01]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  @click="openVoteModal(b.contestantA, b)"
                >
                  <span class="material-icons text-xl text-gray-950">favorite</span>
                  <span>{{ t('taifa.nani.vote') }}</span>
                </button>
                <div
                  v-else
                  class="w-full mt-5 py-3.5 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-black text-base flex items-center justify-center gap-2"
                >
                  <span>{{ t('taifa.nani.battleEnded') }}</span>
                </div>

                <!-- Watch Clip Button -->
                <button
                  type="button"
                  class="w-full mt-2.5 py-2.5 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all"
                  :class="
                    b.contestantA.videoUrl
                      ? 'border-[#183153] dark:border-amber-400 text-[#183153] dark:text-amber-400 hover:bg-[#183153] hover:text-white dark:hover:bg-amber-400 dark:hover:text-gray-950 cursor-pointer'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  "
                  :disabled="!b.contestantA.videoUrl"
                  @click="openVideoModal(b.contestantA)"
                >
                  <span class="material-icons text-lg">play_circle</span>
                  <span>{{ t('taifa.nani.watchClip') }}</span>
                </button>
              </div>
            </div>

            <!-- Center Taifa House Logo Graphic -->
            <div class="md:col-span-1 flex items-center justify-center -my-3 md:my-0 z-20">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center drop-shadow-xl animate-bounce-subtle hover:scale-110 transition-transform"
              >
                <img src="/taifa/taifa_icon.png" alt="Taifa House" class="w-full h-full object-contain" />
              </div>
            </div>

            <!-- Right Card: Contestant B (e.g. Neema Juma) -->
            <div
              class="md:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 relative flex flex-col"
            >
              <!-- Photo Container -->
              <div class="relative w-full aspect-[4/3] bg-gradient-to-t from-black/60 to-transparent overflow-hidden">
                <img
                  :src="b.contestantB.photo"
                  :alt="b.contestantB.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <!-- University Floating Badge -->
                <div
                  class="absolute -bottom-5 left-6 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-lg p-1.5 border-2 border-white dark:border-zinc-700 flex items-center justify-center z-10"
                >
                  <img
                    :src="badgeFor(b.contestantB)"
                    :alt="b.contestantB.universityCode"
                    class="w-full h-full object-contain"
                  />
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-6 pt-8 flex-1 flex flex-col justify-between">
                <div>
                  <!-- University Code Pill -->
                  <div
                    class="inline-block px-3 py-0.5 rounded-md bg-[#FEBF01] text-gray-950 text-[11px] font-black tracking-wider uppercase mb-1"
                  >
                    {{ b.contestantB.universityCode }}
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {{ b.contestantB.name }}
                  </h3>

                  <!-- Votes Counter -->
                  <div
                    class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1"
                  >
                    <span class="material-icons text-red-500 text-base">favorite</span>
                    <span>{{ b.contestantB.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}</span>
                    <span class="text-gray-400 font-normal">({{ pctOf(b, b.contestantB.votes) }}%)</span>
                  </div>
                </div>

                <!-- Vote Button matching PDF -->
                <button
                  v-if="b.status === 'active'"
                  type="button"
                  class="w-full mt-5 py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-98 text-gray-950 font-black text-base shadow-md hover:shadow-[#FEBF01]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  @click="openVoteModal(b.contestantB, b)"
                >
                  <span class="material-icons text-xl text-gray-950">favorite</span>
                  <span>{{ t('taifa.nani.vote') }}</span>
                </button>
                <div
                  v-else
                  class="w-full mt-5 py-3.5 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-black text-base flex items-center justify-center gap-2"
                >
                  <span>{{ t('taifa.nani.battleEnded') }}</span>
                </div>

                <!-- Watch Clip Button -->
                <button
                  type="button"
                  class="w-full mt-2.5 py-2.5 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all"
                  :class="
                    b.contestantB.videoUrl
                      ? 'border-[#FEBF01] text-gray-950 dark:text-amber-400 hover:bg-[#FEBF01] hover:text-gray-950 cursor-pointer'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  "
                  :disabled="!b.contestantB.videoUrl"
                  @click="openVideoModal(b.contestantB)"
                >
                  <span class="material-icons text-lg">play_circle</span>
                  <span>{{ t('taifa.nani.watchClip') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Live Vote Comparison Bar -->
          <div
            class="w-full max-w-xl mx-auto mt-6 bg-gray-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden flex shadow-inner"
          >
            <div
              class="bg-[#183153] h-full transition-all duration-500"
              :style="{ width: `${pctOf(b, b.contestantA.votes)}%` }"
              :title="`${b.contestantA.name}: ${pctOf(b, b.contestantA.votes)}%`"
            ></div>
            <div
              class="bg-[#FEBF01] h-full transition-all duration-500"
              :style="{ width: `${pctOf(b, b.contestantB.votes)}%` }"
              :title="`${b.contestantB.name}: ${pctOf(b, b.contestantB.votes)}%`"
            ></div>
          </div>
        </div>
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
            type="button"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            @click="showVoteModal = false"
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
            {{
              t('taifa.nani.payVoteDesc', {
                name: selectedContestant.name,
                fee: votingBattle?.voteFee.toLocaleString(),
              })
            }}
          </p>

          <!-- Amount Box -->
          <div
            class="p-4 rounded-2xl bg-[#EBF4FE] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 mb-4 text-center"
          >
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">{{
              t('taifa.nani.amount')
            }}</span>
            <span class="text-2xl sm:text-3xl font-black text-[#183153] dark:text-blue-300">
              TSh {{ votingBattle?.voteFee.toLocaleString() }}
            </span>
          </div>

          <!-- Payment Method Row Selector -->
          <div class="mb-5">
            <div class="relative">
              <select
                v-model="paymentMethod"
                class="w-full py-3 pl-11 pr-10 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FEBF01] appearance-none cursor-pointer"
              >
                <option value="M-Pesa">Vodacom M-Pesa</option>
                <option value="Tigo Pesa">Tigo Pesa / Mixx</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Credit / Debit Card">{{ t('taifa.pages.nani.cardOption') }}</option>
              </select>
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <span class="material-icons text-lg">payment</span>
              </span>
              <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                <span class="material-icons text-lg">chevron_right</span>
              </span>
            </div>

            <!-- Phone Number input if Mobile Money -->
            <div class="mt-2.5">
              <input
                v-model="voterPhone"
                type="tel"
                placeholder="0712 345 678"
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEBF01]"
              />
            </div>
          </div>

          <!-- Action Buttons matching PDF -->
          <div class="space-y-2">
            <button
              type="button"
              :disabled="isVoting"
              class="w-full py-3.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
              @click="submitVote"
            >
              <span v-if="isVoting" class="material-icons animate-spin text-base">sync</span>
              <span>{{
                isVoting
                  ? t('taifa.nani.verifyingVote')
                  : t('taifa.nani.payVoteBtn', { fee: votingBattle?.voteFee.toLocaleString() })
              }}</span>
            </button>

            <button
              type="button"
              class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              @click="showVoteModal = false"
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
})

const carouselRef = ref<HTMLElement | null>(null)
let autoScrollTimer: number | undefined

const stopAutoScroll = () => {
  if (autoScrollTimer !== undefined) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = undefined
  }
}

const startAutoScroll = () => {
  stopAutoScroll()
  autoScrollTimer = window.setInterval(() => {
    const el = carouselRef.value
    if (!el || el.children.length <= 2) return
    const slideWidth = (el.children[0] as HTMLElement).offsetWidth
    if (!slideWidth) return
    const half = el.scrollWidth / 2
    if (el.scrollLeft >= half - 1) {
      // Second copy of the list is identical — snap back invisibly, keep looping
      el.scrollLeft -= half
    }
    el.scrollTo({ left: el.scrollLeft + slideWidth, behavior: 'smooth' })
  }, 5000)
}

const battle = computed<BattleRound | null>(() => naniStore.activeBattle)

const visibleBattles = computed(() => naniStore.battles.filter((b) => b.status !== 'draft'))

const displayBattles = computed<BattleRound[]>(() =>
  visibleBattles.value.length > 0 ? visibleBattles.value : battle.value ? [battle.value] : [],
)

/** Duplicated list so the carousel can loop seamlessly. */
const loopBattles = computed<BattleRound[]>(() =>
  displayBattles.value.length > 1 ? [...displayBattles.value, ...displayBattles.value] : displayBattles.value,
)

const displayTotalVotes = computed(() =>
  battle.value ? battle.value.contestantA.votes + battle.value.contestantB.votes : 0,
)

const pctOf = (b: BattleRound, votes: number) => {
  const total = b.contestantA.votes + b.contestantB.votes
  return total === 0 ? 50 : Math.round((votes / total) * 100)
}

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

const showVoteModal = ref(false)
const selectedContestant = ref<Contestant | null>(null)
const votingBattle = ref<BattleRound | null>(null)
const paymentMethod = ref('M-Pesa')
const voterPhone = ref('0712 345 678')
const isVoting = ref(false)
const voteSuccessMessage = ref('')

const openVoteModal = (contestant: Contestant, b: BattleRound) => {
  selectedContestant.value = contestant
  votingBattle.value = b
  showVoteModal.value = true
}

const submitVote = async () => {
  if (!selectedContestant.value) return
  isVoting.value = true

  try {
    const res = await naniStore.castVote({
      contestantId: selectedContestant.value.id,
      paymentMethod: paymentMethod.value,
      phone: voterPhone.value,
      battleId: votingBattle.value?.id,
    })

    showVoteModal.value = false
    voteSuccessMessage.value = t('taifa.nani.votedSuccess', {
      name: res.contestantName,
      votes: res.newVotes.toLocaleString(),
      fee: (votingBattle.value?.voteFee || 0).toLocaleString(),
    })
    setTimeout(() => {
      voteSuccessMessage.value = ''
    }, 4000)
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
.nani-carousel {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.nani-carousel::-webkit-scrollbar {
  display: none;
}
</style>
