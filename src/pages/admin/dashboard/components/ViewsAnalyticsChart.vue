<template>
  <div
    class="p-5 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col justify-between"
  >
    <!-- Header with controls -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="material-icons text-amber-500 text-xl">insights</span>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">{{ t('taifa.misc.analytics.title') }}</h2>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {{ t('taifa.misc.analytics.subtitle') }}
        </p>
      </div>

      <!-- Chart View Mode Tabs -->
      <div
        class="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl text-xs self-start sm:self-auto"
      >
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg font-bold transition-all"
          :class="[
            activeMetric === 'views'
              ? 'bg-amber-400 text-gray-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="changeMetric('views')"
        >
          {{ t('taifa.misc.analytics.viewsTab') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg font-bold transition-all"
          :class="[
            activeMetric === 'revenue'
              ? 'bg-amber-400 text-gray-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="changeMetric('revenue')"
        >
          {{ t('taifa.misc.analytics.revenueTab') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg font-bold transition-all"
          :class="[
            activeMetric === 'likes'
              ? 'bg-amber-400 text-gray-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="changeMetric('likes')"
        >
          {{ t('taifa.misc.analytics.likesTab') }}
        </button>
      </div>
    </div>

    <!-- Key Metrics Highlight Strip -->
    <div class="grid grid-cols-3 gap-2 sm:gap-4 py-3 border-b border-gray-100 dark:border-gray-800 text-center">
      <div class="p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-xl">
        <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ t('taifa.misc.analytics.watchTime') }}</p>
        <p class="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white mt-0.5">148,200 hrs</p>
      </div>
      <div class="p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-xl">
        <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ t('taifa.misc.analytics.avgPerVideo') }}</p>
        <p class="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white mt-0.5">5m 48s</p>
      </div>
      <div class="p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-xl">
        <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ t('taifa.misc.analytics.returnRate') }}</p>
        <p class="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">76.4%</p>
      </div>
    </div>

    <!-- Chart Canvas Container -->
    <div class="relative w-full h-64 sm:h-72 mt-4">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const activeMetric = ref<'views' | 'revenue' | 'likes'>('views')

const months = computed(() => t('taifa.misc.analytics.months').split(','))

const datasetViews = [140, 185, 220, 290, 340, 410, 480, 560, 620, 710, 830, 940] // thousands
const datasetRevenue = [1.2, 1.5, 1.8, 2.4, 2.9, 3.5, 4.1, 4.8, 5.2, 6.1, 7.4, 8.5] // Millions TZS
const datasetLikes = [12, 15, 19, 24, 28, 35, 42, 49, 55, 64, 76, 88] // thousands

const createChart = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  let label = t('taifa.misc.analytics.viewsLabel')
  let data = datasetViews
  let borderColor = '#FEBF01' // Amber
  let bgColor = 'rgba(254, 191, 1, 0.15)'

  if (activeMetric.value === 'revenue') {
    label = t('taifa.misc.analytics.revenueLabel')
    data = datasetRevenue
    borderColor = '#10B981' // Emerald
    bgColor = 'rgba(16, 185, 129, 0.15)'
  } else if (activeMetric.value === 'likes') {
    label = t('taifa.misc.analytics.likesLabel')
    data = datasetLikes
    borderColor = '#F43F5E' // Rose
    bgColor = 'rgba(244, 63, 94, 0.15)'
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months.value,
      datasets: [
        {
          label,
          data,
          borderColor,
          backgroundColor: bgColor,
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: 'bold',
            },
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#18181b',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: 'rgba(150, 150, 150, 0.1)',
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
          },
        },
      },
    },
  })
}

const changeMetric = (metric: 'views' | 'revenue' | 'likes') => {
  activeMetric.value = metric
  nextTick(() => {
    createChart()
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
