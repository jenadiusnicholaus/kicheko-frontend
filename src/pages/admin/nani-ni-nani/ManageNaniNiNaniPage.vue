<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0"
        >
          <span class="material-icons text-2xl">sports_kabaddi</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Usimamizi wa "Nani ni Nani?"
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold border border-emerald-200"
            >
              Live Mtandaoni
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Panga mapambano ya wachekeshaji wa vyuo, fuatilia kura na ada ya TSh 1,000 kwa kila kura.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <RouterLink
          to="/nani-ni-nani"
          target="_blank"
          class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons text-base">visibility</span>
          <span>Tazama Jukwaani</span>
          <span class="material-icons text-xs">open_in_new</span>
        </RouterLink>

        <button
          type="button"
          class="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5 transition-colors"
          @click="naniStore.resetToDefault()"
        >
          <span class="material-icons text-base">refresh</span>
          <span>Weka Upya</span>
        </button>
      </div>
    </div>

    <!-- Battle Metrics Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Jumla ya Kura Zilizopigwa</div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">
          {{ naniStore.totalVotes.toLocaleString() }}
        </div>
        <span class="text-[11px] text-gray-500">Kura zote kwenye pambano hai</span>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          Mapato ya Kura (TSh 1,000 / Kura)
        </div>
        <div class="text-3xl font-black text-amber-500">TSh {{ naniStore.voteRevenue.toLocaleString() }}</div>
        <span class="text-[11px] text-gray-500">Mapato ya wapiga kura Tanzania</span>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Mchekeshaji Anayeongoza</div>
        <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {{ naniStore.leadingContestant?.name || 'Sare' }}
        </div>
        <span class="text-[11px] text-gray-500"
          >{{ naniStore.leadingContestant?.universityCode }} •
          {{ naniStore.leadingContestant?.votes.toLocaleString() }} votes</span
        >
      </div>
    </div>

    <!-- Active Battle Management Form & Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Contestant A Edit -->
      <div
        class="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
      >
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#183153]"></span>
            <h3 class="font-black text-gray-900 dark:text-white text-base">Mshiriki A (Upande wa Kushoto)</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            {{ battle.contestantA.votes.toLocaleString() }} Kura ({{ naniStore.contestantAPercentage }}%)
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Jina Kamili</label>
            <input
              v-model="editA.name"
              type="text"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Chuo Kikuu</label>
              <input
                v-model="editA.university"
                type="text"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kifupi cha Chuo</label>
              <input
                v-model="editA.universityCode"
                type="text"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Idadi ya Kura za Awali</label>
            <input
              v-model.number="editA.votes"
              type="number"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>

      <!-- Contestant B Edit -->
      <div
        class="p-6 rounded-3xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
      >
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#FEBF01]"></span>
            <h3 class="font-black text-gray-900 dark:text-white text-base">Mshiriki B (Upande wa Kulia)</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
            {{ battle.contestantB.votes.toLocaleString() }} Kura ({{ naniStore.contestantBPercentage }}%)
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Jina Kamili</label>
            <input
              v-model="editB.name"
              type="text"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Chuo Kikuu</label>
              <input
                v-model="editB.university"
                type="text"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kifupi cha Chuo</label>
              <input
                v-model="editB.universityCode"
                type="text"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Idadi ya Kura za Awali</label>
            <input
              v-model.number="editB.votes"
              type="number"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Changes & Reset Controls -->
    <div
      class="flex items-center justify-between p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#FEBF01] hover:bg-[#E5AC00] text-gray-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          @click="saveContestants"
        >
          <span class="material-icons text-base">save</span>
          <span>Hifadhi Mabadiliko ya Washiriki</span>
        </button>
        <span v-if="saveSuccessMsg" class="text-xs font-bold text-emerald-600 flex items-center gap-1">
          <span class="material-icons text-sm">check</span>
          <span>{{ saveSuccessMsg }}</span>
        </span>
      </div>

      <button
        type="button"
        class="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
        @click="resetVotes"
      >
        Weka Kura Zote Kuwa 0
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useNaniNiNaniStore } from '../../../stores/nani-ni-nani'

const naniStore = useNaniNiNaniStore()
const battle = computed(() => naniStore.activeBattle)

const editA = reactive({
  name: '',
  university: '',
  universityCode: '',
  votes: 0,
})

const editB = reactive({
  name: '',
  university: '',
  universityCode: '',
  votes: 0,
})

const syncFromBattle = () => {
  editA.name = battle.value.contestantA.name
  editA.university = battle.value.contestantA.university
  editA.universityCode = battle.value.contestantA.universityCode
  editA.votes = battle.value.contestantA.votes

  editB.name = battle.value.contestantB.name
  editB.university = battle.value.contestantB.university
  editB.universityCode = battle.value.contestantB.universityCode
  editB.votes = battle.value.contestantB.votes
}

onMounted(async () => {
  await naniStore.fetchActiveBattle()
  syncFromBattle()
})

watch(
  battle,
  () => {
    syncFromBattle()
  },
  { deep: true },
)

const saveSuccessMsg = ref('')

const saveContestants = async () => {
  await naniStore.updateContestants({
    contestantA: { ...editA },
    contestantB: { ...editB },
  })
  saveSuccessMsg.value = 'Mabadiliko yamehifadhiwa!'
  setTimeout(() => {
    saveSuccessMsg.value = ''
  }, 3000)
}

const resetVotes = () => {
  if (confirm('Una uhakika unataka kuweka kura zote kuwa sifuri (0)?')) {
    naniStore.resetVotes()
    editA.votes = 0
    editB.votes = 0
  }
}
</script>
