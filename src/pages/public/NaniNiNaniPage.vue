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
          class="inline-flex items-center gap-2 px-3 py-1 mt-2.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{{
            t('taifa.nani.roundOngoing', { round: battle?.roundNumber, votes: naniStore.totalVotes.toLocaleString() })
          }}</span>
        </div>
      </div>

      <!-- Matchup Battle Arena (Two Cards + VS Star) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-11 gap-6 items-center max-w-4xl mx-auto relative mb-8">
        <!-- Left Card: Contestant A (e.g. Frank Mollel) -->
        <div
          class="md:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 relative flex flex-col"
        >
          <!-- Photo Container -->
          <div class="relative w-full aspect-[4/3] bg-gradient-to-t from-black/60 to-transparent overflow-hidden">
            <img
              :src="battle.contestantA.photo"
              :alt="battle.contestantA.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <!-- University Floating Badge -->
            <div
              class="absolute -bottom-5 left-6 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-lg p-1.5 border-2 border-white dark:border-zinc-700 flex items-center justify-center z-10"
            >
              <img
                :src="battle.contestantA.badgeImage"
                :alt="battle.contestantA.universityCode"
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
                {{ battle.contestantA.universityCode }}
              </div>

              <!-- Name -->
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ battle.contestantA.name }}
              </h3>

              <!-- Votes Counter -->
              <div class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">
                <span class="material-icons text-red-500 text-base">favorite</span>
                <span>{{ battle.contestantA.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}</span>
                <span class="text-gray-400 font-normal">({{ naniStore.contestantAPercentage }}%)</span>
              </div>
            </div>

            <!-- Vote Button matching PDF -->
            <button
              type="button"
              class="w-full mt-5 py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-98 text-gray-950 font-black text-base shadow-md hover:shadow-[#FEBF01]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              @click="openVoteModal(battle.contestantA)"
            >
              <span class="material-icons text-xl text-gray-950">favorite</span>
              <span>{{ t('taifa.nani.vote') }}</span>
            </button>
          </div>
        </div>

        <!-- Center Comic "VS" Graphic -->
        <div class="md:col-span-1 flex items-center justify-center -my-3 md:my-0 z-20">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center drop-shadow-xl animate-bounce-subtle hover:scale-110 transition-transform"
          >
            <img src="/taifa/vs_star.png" alt="VS" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Right Card: Contestant B (e.g. Neema Juma) -->
        <div
          class="md:col-span-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 relative flex flex-col"
        >
          <!-- Photo Container -->
          <div class="relative w-full aspect-[4/3] bg-gradient-to-t from-black/60 to-transparent overflow-hidden">
            <img
              :src="battle.contestantB.photo"
              :alt="battle.contestantB.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <!-- University Floating Badge -->
            <div
              class="absolute -bottom-5 left-6 w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-lg p-1.5 border-2 border-white dark:border-zinc-700 flex items-center justify-center z-10"
            >
              <img
                :src="battle.contestantB.badgeImage"
                :alt="battle.contestantB.universityCode"
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
                {{ battle.contestantB.universityCode }}
              </div>

              <!-- Name -->
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ battle.contestantB.name }}
              </h3>

              <!-- Votes Counter -->
              <div class="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">
                <span class="material-icons text-red-500 text-base">favorite</span>
                <span>{{ battle.contestantB.votes.toLocaleString() }} {{ t('taifa.nani.votes') }}</span>
                <span class="text-gray-400 font-normal">({{ naniStore.contestantBPercentage }}%)</span>
              </div>
            </div>

            <!-- Vote Button matching PDF -->
            <button
              type="button"
              class="w-full mt-5 py-3.5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-98 text-gray-950 font-black text-base shadow-md hover:shadow-[#FEBF01]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              @click="openVoteModal(battle.contestantB)"
            >
              <span class="material-icons text-xl text-gray-950">favorite</span>
              <span>{{ t('taifa.nani.vote') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Vote Comparison Bar -->
      <div
        class="w-full max-w-xl mx-auto bg-gray-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden flex shadow-inner mb-6"
      >
        <div
          class="bg-[#183153] h-full transition-all duration-500"
          :style="{ width: `${naniStore.contestantAPercentage}%` }"
          :title="`${battle.contestantA.name}: ${naniStore.contestantAPercentage}%`"
        ></div>
        <div
          class="bg-[#FEBF01] h-full transition-all duration-500"
          :style="{ width: `${naniStore.contestantBPercentage}%` }"
          :title="`${battle.contestantB.name}: ${naniStore.contestantBPercentage}%`"
        ></div>
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
            {{ t('taifa.nani.payVoteDesc', { name: selectedContestant.name, fee: battle.voteFee.toLocaleString() }) }}
          </p>

          <!-- Amount Box -->
          <div
            class="p-4 rounded-2xl bg-[#EBF4FE] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 mb-4 text-center"
          >
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">{{
              t('taifa.nani.amount')
            }}</span>
            <span class="text-2xl sm:text-3xl font-black text-[#183153] dark:text-blue-300">
              TSh {{ battle.voteFee.toLocaleString() }}
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
                  : t('taifa.nani.payVoteBtn', { fee: battle.voteFee.toLocaleString() })
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNaniNiNaniStore, type Contestant } from '../../stores/nani-ni-nani'

const { t } = useI18n()
const naniStore = useNaniNiNaniStore()

onMounted(() => {
  naniStore.fetchActiveBattle()
})

const battle = computed(() => naniStore.activeBattle)

const showVoteModal = ref(false)
const selectedContestant = ref<Contestant | null>(null)
const paymentMethod = ref('M-Pesa')
const voterPhone = ref('0712 345 678')
const isVoting = ref(false)
const voteSuccessMessage = ref('')

const openVoteModal = (contestant: Contestant) => {
  selectedContestant.value = contestant
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
    })

    showVoteModal.value = false
    voteSuccessMessage.value = t('taifa.nani.votedSuccess', {
      name: res.contestantName,
      votes: res.newVotes.toLocaleString(),
      fee: (battle.value?.voteFee || 0).toLocaleString(),
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
</style>
