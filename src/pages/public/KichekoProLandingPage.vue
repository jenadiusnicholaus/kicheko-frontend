<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto w-full text-center">
    <!-- Brand Logo with Sunburst Effect -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <img
        src="/taifa/kicheko_pro_logo.png"
        :alt="t('taifa.pages.pro.logoAlt')"
        class="w-48 sm:w-64 max-w-full mx-auto object-contain drop-shadow-sm hover:scale-102 transition-transform duration-300"
      />
    </div>

    <!-- Applications OPEN: hero question + register CTA -->
    <template v-if="applicationsStore.applicationsOpen">
      <h1
        class="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto mb-8 sm:mb-10"
      >
        {{ t('taifa.home.question') }}
      </h1>

      <div class="mb-10 sm:mb-12">
        <RouterLink
          to="/register-comedian"
          class="inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-[#FEBF01] hover:bg-[#E5AC00] active:scale-95 text-gray-950 font-black text-xl sm:text-2xl shadow-xl hover:shadow-[#FEBF01]/40 transition-all transform hover:-translate-y-1 cursor-pointer"
        >
          <span>{{ t('taifa.home.yes') }}</span>
          <span class="material-icons text-2xl sm:text-3xl">arrow_forward</span>
        </RouterLink>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
          {{ t('taifa.home.feeNote') }}
        </p>
      </div>
    </template>

    <!-- Applications CLOSED: public vote list -->
    <template v-else>
      <h1
        class="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-2xl mx-auto mb-2"
      >
        {{ t('taifa.home.voteTitle') }}
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
        {{ t('taifa.home.voteDesc') }}
      </p>

      <div v-if="isLoading" class="flex items-center justify-center py-16 text-gray-400">
        <span class="material-icons animate-spin text-3xl">sync</span>
      </div>

      <div v-else-if="applicationsStore.voteList.length === 0" class="py-12 text-gray-400">
        <span class="material-icons text-5xl mb-3 text-gray-300">how_to_vote</span>
        <p class="font-bold text-sm">{{ t('taifa.home.voteEmpty') }}</p>
      </div>

      <div v-else class="w-full max-w-2xl space-y-3 mb-10">
        <div
          v-for="(applicant, index) in applicationsStore.voteList"
          :key="applicant.id"
          class="flex items-center gap-3 sm:gap-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-zinc-800 rounded-2xl p-3.5 sm:p-4 shadow-sm text-left"
        >
          <!-- Rank -->
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            :class="
              index === 0
                ? 'bg-[#FEBF01] text-gray-950'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
            "
          >
            {{ index + 1 }}
          </div>

          <!-- Info + poll bar -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <div class="min-w-0">
                <div class="font-black text-gray-900 dark:text-white text-sm truncate">
                  {{ applicant.name }}
                </div>
                <div class="text-[11px] text-gray-400 truncate">
                  {{ applicant.universityCode || applicant.university }}
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="font-black text-gray-900 dark:text-white text-sm tabular-nums">
                  {{ applicant.votes.toLocaleString() }}
                </div>
                <div class="text-[10px] text-gray-400">{{ t('taifa.home.votes') }}</div>
              </div>
            </div>

            <!-- Poll bar -->
            <div class="mt-2 h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              <div
                class="h-full rounded-full bg-[#FEBF01] transition-all duration-500"
                :style="{ width: `${sharePercent(applicant.votes)}%` }"
              ></div>
            </div>
          </div>

          <!-- Vote button -->
          <button
            type="button"
            class="shrink-0 px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all"
            :class="
              hasVoted(applicant.id)
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 cursor-default'
                : 'bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 shadow-sm active:scale-95'
            "
            :disabled="hasVoted(applicant.id) || votingId === applicant.id"
            @click="castVote(applicant.id)"
          >
            <span v-if="votingId === applicant.id" class="material-icons text-sm animate-spin">sync</span>
            <span v-else-if="hasVoted(applicant.id)" class="material-icons text-sm">check_circle</span>
            <span v-else class="material-icons text-sm">how_to_vote</span>
            <span>{{ hasVoted(applicant.id) ? t('taifa.home.voted') : t('taifa.home.vote') }}</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComedianApplicationsStore, getVotedIds } from '../../stores/comedian-applications'

const { t } = useI18n()
const applicationsStore = useComedianApplicationsStore()

const isLoading = ref(true)
const votingId = ref<string | null>(null)
const votedIds = ref<string[]>(getVotedIds())

const totalVotes = computed(() => applicationsStore.voteList.reduce((sum, a) => sum + a.votes, 0))

const sharePercent = (votes: number) => {
  if (totalVotes.value <= 0) return 0
  return Math.max(2, Math.round((votes / totalVotes.value) * 100))
}

const hasVoted = (id: string) => votedIds.value.includes(id)

const castVote = async (id: string) => {
  if (hasVoted(id) || votingId.value) return
  votingId.value = id
  try {
    await applicationsStore.castVote(id)
    votedIds.value = getVotedIds()
  } catch {
    // Vote rejected (e.g. already voted server-side) — leave button state as-is.
  } finally {
    votingId.value = null
  }
}

onMounted(async () => {
  try {
    await applicationsStore.fetchVoteList()
  } finally {
    isLoading.value = false
  }
})
</script>
