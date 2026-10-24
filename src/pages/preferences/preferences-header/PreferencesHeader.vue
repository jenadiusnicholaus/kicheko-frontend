<template>
  <VaAvatar size="large" color="warning" :src="store.pfp || undefined">
    <span v-if="!store.pfp" class="text-2xl font-bold">{{ initial }}</span>
  </VaAvatar>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">{{ store.userName }}</h2>
    <div v-if="store.memberSince" class="flex space-x-1 text-[13px] leading-4">
      <p>{{ t('taifa.misc.preferences.memberSince') }}</p>
      <p>{{ store.memberSince }}</p>
    </div>
    <p v-else-if="store.email" class="text-[13px] leading-4">{{ store.email }}</p>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/user-store'

const { t } = useI18n()

const store = useUserStore()

const initial = computed(() => (store.userName || 'U').charAt(0).toUpperCase())
</script>
