<template>
  <div class="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">
    <!-- User Card -->
    <div
      class="rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl p-5 sm:p-7 mb-6"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-gray-950 font-black text-2xl flex items-center justify-center overflow-hidden ring-4 ring-amber-200 dark:ring-amber-500/30 shrink-0"
        >
          <img
            v-if="avatarUrl && !avatarFailed"
            :src="avatarUrl"
            :alt="displayName"
            referrerpolicy="no-referrer"
            class="w-full h-full object-cover"
            @error="avatarFailed = true"
          />
          <span v-else>{{ userInitial }}</span>
        </div>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {{ displayName }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 truncate">@{{ authStore.user?.username }}</p>
          <p v-if="authStore.user?.email" class="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {{ authStore.user.email }}
          </p>
        </div>
      </div>
    </div>

    <!-- Application Progress -->
    <div
      class="rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl p-5 sm:p-7"
    >
      <h2 class="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <span class="material-icons text-amber-500">assignment</span>
        {{ t('taifa.profile.applicationTitle') }}
      </h2>

      <!-- Loading -->
      <div v-if="!store.myApplicationLoaded" class="py-10 text-center text-slate-400">
        <span class="material-icons text-3xl animate-spin">progress_activity</span>
      </div>

      <!-- No application -->
      <div v-else-if="!app" class="py-8 text-center">
        <span class="material-icons text-5xl text-slate-300 dark:text-slate-600 mb-3">description</span>
        <p class="font-bold text-slate-700 dark:text-slate-200 mb-1">{{ t('taifa.profile.noAppTitle') }}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">{{ t('taifa.profile.noAppDesc') }}</p>
        <RouterLink
          :to="{ name: 'register-comedian' }"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm shadow-lg transition-all"
        >
          <span class="material-icons text-base">how_to_reg</span>
          {{ t('taifa.profile.applyNow') }}
        </RouterLink>
      </div>

      <!-- Application found -->
      <template v-else>
        <!-- Progress steps -->
        <ol class="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-6 mb-6">
          <li v-for="step in steps" :key="step.key" class="ml-6">
            <span
              class="absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white dark:ring-slate-900"
              :class="step.circleClass"
            >
              <span class="material-icons text-xs text-white">{{ step.icon }}</span>
            </span>
            <p class="font-bold text-sm" :class="step.titleClass">{{ step.title }}</p>
            <p v-if="step.detail" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ step.detail }}</p>
          </li>
        </ol>

        <!-- Rejected reason -->
        <div
          v-if="app.status === 'rejected'"
          class="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 mb-4"
        >
          <p class="text-sm font-bold text-red-700 dark:text-red-300 mb-1">{{ t('taifa.profile.rejectedTitle') }}</p>
          <p class="text-sm text-red-600 dark:text-red-400">
            {{ app.rejectedReason || t('taifa.profile.rejectedDefault') }}
          </p>
        </div>

        <!-- Audition details -->
        <div
          v-if="app.status === 'approved'"
          class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-4"
        >
          <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
            <span class="material-icons text-base">event</span>
            {{ t('taifa.profile.auditionTitle') }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold uppercase">
                {{ t('taifa.profile.auditionLevel') }}
              </p>
              <p class="font-bold text-emerald-800 dark:text-emerald-200">{{ app.auditionLevel }}</p>
            </div>
            <div>
              <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold uppercase">
                {{ t('taifa.profile.auditionVenue') }}
              </p>
              <p class="font-bold text-emerald-800 dark:text-emerald-200">
                {{ app.auditionVenue || t('taifa.profile.tba') }}
              </p>
            </div>
            <div>
              <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold uppercase">
                {{ t('taifa.profile.auditionDate') }}
              </p>
              <p class="font-bold text-emerald-800 dark:text-emerald-200">
                {{ app.auditionDate || t('taifa.profile.tba') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Unpaid: continue payment CTA -->
        <div
          v-if="app.paymentStatus !== 'paid'"
          class="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4"
        >
          <p class="text-sm text-amber-800 dark:text-amber-300 mb-3">{{ t('taifa.profile.paymentPending') }}</p>
          <RouterLink
            :to="{ name: 'payment-checkout' }"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs shadow transition-all"
          >
            <span class="material-icons text-sm">payments</span>
            {{ t('taifa.profile.payNow') }}
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth-store'
import { useComedianApplicationsStore } from '../../stores/comedian-applications'
import { resolveMediaUrl } from '../../services/api/config'

const { t } = useI18n()
const authStore = useAuthStore()
const store = useComedianApplicationsStore()

const app = computed(() => store.myApplication)

const avatarUrl = computed(() => resolveMediaUrl(authStore.user?.avatar))
const avatarFailed = ref(false)
watch(avatarUrl, () => (avatarFailed.value = false))

const displayName = computed(() => authStore.user?.display_name || authStore.user?.username || '')
const userInitial = computed(() => (displayName.value.trim().charAt(0) || '?').toUpperCase())

onMounted(() => {
  store.fetchMyApplication()
})

const steps = computed(() => {
  const a = app.value
  if (!a) return []

  const paid = a.paymentStatus === 'paid'
  const rejected = a.status === 'rejected'
  const approved = a.status === 'approved'
  const reviewing = paid && !approved && !rejected

  const done = 'bg-emerald-500'
  const current = 'bg-amber-400'
  const off = 'bg-slate-300 dark:bg-slate-600'
  const bad = 'bg-red-500'

  return [
    {
      key: 'submitted',
      icon: 'check',
      circleClass: done,
      titleClass: 'text-slate-900 dark:text-white',
      title: t('taifa.profile.stepSubmitted'),
      detail: a.appliedAt,
    },
    {
      key: 'payment',
      icon: paid ? 'check' : 'payments',
      circleClass: paid ? done : current,
      titleClass: 'text-slate-900 dark:text-white',
      title: t('taifa.profile.stepPayment'),
      detail: paid ? t('taifa.profile.paidAmount', { n: a.amountPaid.toLocaleString() }) : '',
    },
    {
      key: 'review',
      icon: approved || rejected ? 'check' : 'hourglass_top',
      circleClass: approved || rejected ? done : reviewing ? current : off,
      titleClass: approved || reviewing ? 'text-slate-900 dark:text-white' : 'text-slate-400',
      title: t('taifa.profile.stepReview'),
      detail: reviewing ? t('taifa.profile.reviewingNow') : '',
    },
    {
      key: 'decision',
      icon: approved ? 'verified' : rejected ? 'close' : 'flag',
      circleClass: approved ? done : rejected ? bad : off,
      titleClass: approved || rejected ? 'text-slate-900 dark:text-white' : 'text-slate-400',
      title: approved
        ? t('taifa.profile.statusApproved')
        : rejected
          ? t('taifa.profile.statusRejected')
          : t('taifa.profile.stepDecision'),
      detail: a.approvedAt || '',
    },
  ]
})
</script>
