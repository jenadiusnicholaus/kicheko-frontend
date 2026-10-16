<template>
  <VaModal
    max-width="530px"
    :mobile-fullscreen="false"
    hide-default-actions
    model-value
    close-button
    @update:modelValue="emits('cancel')"
  >
    <h1 class="va-h5 mb-4">{{ t('auth.reset_password') }}</h1>
    <VaForm ref="form" class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VaInput
          v-model="oldPassowrd"
          :rules="oldPasswordRules"
          :label="t('taifa.misc.preferences.oldPassword')"
          :placeholder="t('taifa.misc.preferences.oldPassword')"
          required-mark
          type="password"
        />
        <div class="hidden md:block" />
        <VaInput
          v-model="newPassword"
          :rules="newPasswordRules"
          :label="t('taifa.misc.preferences.newPassword')"
          :placeholder="t('taifa.misc.preferences.newPassword')"
          required-mark
          type="password"
        />
        <VaInput
          v-model="repeatNewPassword"
          :rules="repeatNewPasswordRules"
          :label="t('taifa.misc.preferences.repeatNewPassword')"
          :placeholder="t('taifa.misc.preferences.repeatNewPassword')"
          required-mark
          type="password"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <div class="flex space-x-2 items-center">
          <div>
            <VaIcon :name="newPassword?.length! >= 8 ? 'mso-check' : 'mso-close'" color="secondary" size="20px" />
          </div>
          <p>{{ t('taifa.misc.preferences.min8Chars') }}</p>
        </div>
        <div class="flex space-x-2 items-center">
          <div>
            <VaIcon :name="new Set(newPassword).size >= 6 ? 'mso-check' : 'mso-close'" color="secondary" size="20px" />
          </div>
          <p>{{ t('taifa.misc.preferences.unique6Chars') }}</p>
        </div>
      </div>
      <div class="flex flex-col-reverse md:justify-end md:flex-row md:space-x-4">
        <VaButton :style="buttonStyles" preset="secondary" color="secondary" @click="emits('cancel')">
          {{ t('vuestic.cancel') }}
        </VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit">
          {{ t('taifa.misc.preferences.updatePassword') }}
        </VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useToast } from 'vuestic-ui'

import { buttonStyles } from '../styles'

const oldPassowrd = ref<string>()
const newPassword = ref<string>()
const repeatNewPassword = ref<string>()

const { t } = useI18n()

const { validate } = useForm('form')
const { init } = useToast()

const emits = defineEmits(['cancel'])

const submit = () => {
  if (validate()) {
    init({ message: t('taifa.misc.preferences.passwordChanged'), color: 'success' })
    emits('cancel')
  }
}

const oldPasswordRules = [(v: string) => !!v || t('taifa.misc.preferences.oldPasswordRequired')]

const newPasswordRules = [
  (v: string) => !!v || t('taifa.misc.preferences.newPasswordRequired'),
  (v: string) => v?.length >= 8 || t('taifa.misc.preferences.min8Chars'),
  (v: string) => new Set(v).size >= 6 || t('taifa.misc.preferences.unique6Chars'),
  (v: string) => v !== oldPassowrd.value || t('taifa.misc.preferences.passwordSame'),
]

const repeatNewPasswordRules = [
  (v: string) => !!v || t('taifa.misc.preferences.repeatPasswordRequired'),
  (v: string) => v === newPassword.value || t('taifa.misc.preferences.passwordMismatch'),
]
</script>

<style lang="scss">
// TODO temporary before https://github.com/epicmaxco/vuestic-ui/issues/4020 fix
.va-modal__inner {
  min-width: 326px;
}
</style>
