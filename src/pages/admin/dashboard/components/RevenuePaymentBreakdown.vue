<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-amber-500 text-lg">account_balance_wallet</span>
            <span>Malipo ya Simu (Mobile Money)</span>
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mgawanyo wa mapato kwa watoa huduma Tanzania</p>
        </div>
        <span
          class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold"
        >
          98.4% Yamefanikiwa
        </span>
      </div>

      <!-- Doughnut Chart Container -->
      <div class="relative w-full h-44 my-4 flex items-center justify-center">
        <canvas ref="canvasRef"></canvas>
      </div>

      <!-- Custom Mobile Money Breakdown List -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 text-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full bg-red-600 shrink-0"></div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">M-Pesa (Vodacom)</p>
              <p class="text-[10px] text-gray-400">5,820 miamala</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-black text-gray-900 dark:text-white">Tsh 8,613,000</p>
            <p class="text-[10px] text-gray-500 font-bold">58% ya mapato</p>
          </div>
        </div>

        <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 text-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full bg-sky-500 shrink-0"></div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">Tigo Pesa (Mixx by Yas)</p>
              <p class="text-[10px] text-gray-400">2,610 miamala</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-black text-gray-900 dark:text-white">Tsh 3,861,000</p>
            <p class="text-[10px] text-gray-500 font-bold">26% ya mapato</p>
          </div>
        </div>

        <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 text-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full bg-amber-400 shrink-0"></div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">Airtel Money</p>
              <p class="text-[10px] text-gray-400">1,412 miamala</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-black text-gray-900 dark:text-white">Tsh 2,376,000</p>
            <p class="text-[10px] text-gray-500 font-bold">16% ya mapato</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Payment Settlement Note -->
    <div
      class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex items-center justify-between"
    >
      <span>Malipo huwekwa moja kwa moja:</span>
      <span class="font-bold text-gray-800 dark:text-gray-200">Kila Ijumaa (Weekly)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['M-Pesa', 'Tigo Pesa', 'Airtel Money'],
      datasets: [
        {
          data: [58, 26, 16],
          backgroundColor: ['#DC2626', '#0284C7', '#FEBF01'],
          borderWidth: 2,
          borderColor: '#18181b',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#18181b',
          padding: 8,
          callbacks: {
            label: (item) => ` ${item.label}: ${item.raw}% ya mapato`,
          },
        },
      },
    },
  })
}

onMounted(() => {
  nextTick(() => {
    createChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
