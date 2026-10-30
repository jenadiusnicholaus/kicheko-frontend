<template>
  <VaForm ref="resetForm" @submit.prevent>
    <template v-if="step === 'email'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">{{ t('auth.passwordReset.title') }}</h1>
      <p class="text-base mb-4 leading-5">
        {{ t('auth.passwordReset.intro') }}
      </p>
      <VaInput
        v-model="form.email"
        :rules="[validators.required, validators.email]"
        :error-messages="fieldErrors.email"
        class="mb-4"
        :label="t('auth.passwordReset.emailLabel')"
        type="email"
      />
      <VaButton :loading="isSubmitting" class="w-full mb-2" @click="sendCode">{{
        t('auth.passwordReset.sendCode')
      }}</VaButton>
      <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary">{{
        t('auth.passwordReset.goBack')
      }}</VaButton>
    </template>

    <template v-else-if="step === 'otp'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">{{ t('auth.passwordReset.checkEmail') }}</h1>
      <I18nT keypath="auth.passwordReset.codeSent" tag="p" class="text-base mb-4 leading-5">
        <template #email>
          <strong>{{ form.email }}</strong>
        </template>
      </I18nT>
      <VaInput
        v-model="form.otp"
        :rules="[(v) => /^\d{6}$/.test(v) || t('auth.passwordReset.otpInvalid')]"
        :error-messages="fieldErrors.otp"
        class="mb-4"
        :label="t('auth.passwordReset.otpLabel')"
        maxlength="6"
        inputmode="numeric"
      />
      <VaButton :loading="isSubmitting" class="w-full mb-2" @click="verifyCode">{{
        t('auth.passwordReset.verifyCode')
      }}</VaButton>
      <VaButton class="w-full" preset="secondary" @click="step = 'email'">{{
        t('auth.passwordReset.differentEmail')
      }}</VaButton>
    </template>

    <template v-else-if="step === 'password'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">{{ t('auth.passwordReset.newPasswordTitle') }}</h1>
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          v-model="form.new_password"
          :rules="[validators.required]"
          :error-messages="fieldErrors.new_password"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.passwordReset.newPasswordLabel')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
        <VaInput
          v-model="form.new_password_confirm"
          :rules="[
            (v) => !!v || t('auth.passwordReset.repeatRequired'),
            (v) => v === form.new_password || t('auth.passwordReset.passwordsDontMatch'),
          ]"
          :error-messages="fieldErrors.new_password_confirm"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.passwordReset.repeatLabel')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
      </VaValue>
      <VaButton :loading="isSubmitting" class="w-full" @click="submitNewPassword">{{
        t('auth.passwordReset.submit')
      }}</VaButton>
    </template>

    <div v-else>
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">{{ t('auth.passwordReset.doneTitle') }}</h1>
      <p class="text-base mb-4 leading-5">{{ t('auth.passwordReset.doneText') }}</p>
      <div class="flex justify-center mt-4">
        <VaButton :to="{ name: 'login' }" class="w-full">{{ t('auth.passwordReset.backToLogin') }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { validators } from '../../services/utils'
import { usePasswordReset } from './composables/usePasswordReset'

const { t } = useI18n()
const { step, form, fieldErrors, isSubmitting, sendCode, verifyCode, submitNewPassword } = usePasswordReset()
</script>
