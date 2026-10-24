<template>
  <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('taifa.misc.common.name') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.userName }}
      </div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" @click="emits('openNameModal')">
      {{ t('taifa.misc.common.edit') }}
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('auth.email') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.email }}
      </div>
    </div>
  </div>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('auth.password') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">•••••••••••••</div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" :to="{ name: 'recover-password' }">
      {{ t('auth.reset_password') }}
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('taifa.misc.preferences.twoFA') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ twoFA.content }}
      </div>
    </div>
    <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" :color="twoFA.color" @click="toggle2FA">
      {{ twoFA.button }}
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-[200px]">{{ t('taifa.misc.preferences.emailSubscriptions') }}</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        <p>{{ t('taifa.misc.preferences.manageEmails') }}</p>
        <div class="flex space-x-1 w-fit">
          <RouterLink :to="{ name: 'settings' }" class="font-semibold text-primary">{{
            t('kicheko.settings.notifications.label')
          }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useToast } from 'vuestic-ui'

import { useUserStore } from '../../../stores/user-store'

import { buttonStyles } from '../styles'

const { t } = useI18n()

const store = useUserStore()

const { init } = useToast()

const toastMessage = computed(() =>
  store.is2FAEnabled ? t('taifa.misc.preferences.twoFAEnabled') : t('taifa.misc.preferences.twoFADisabled'),
)

const twoFA = computed(() => {
  if (store.is2FAEnabled) {
    return {
      color: 'danger',
      button: t('taifa.misc.preferences.twoFADisable'),
      content: t('taifa.misc.preferences.twoFAEnabledDesc'),
    }
  } else {
    return {
      color: 'primary',
      button: t('taifa.misc.preferences.twoFASetup'),
      content: t('taifa.misc.preferences.twoFADisabledDesc'),
    }
  }
})

const toggle2FA = () => {
  store.toggle2FA()
  init({ message: toastMessage.value, color: 'success' })
}

const emits = defineEmits(['openNameModal'])
</script>
