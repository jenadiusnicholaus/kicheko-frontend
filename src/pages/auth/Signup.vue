<template>
  <VaForm ref="signupForm" @submit.prevent="submit">
    <h1 class="font-bold text-2xl mb-1 text-slate-900 dark:text-white">{{ t('auth.signupPage.title') }}</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-5">
      {{ t('auth.signupPage.haveAccount') }}
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary hover:underline">{{
        t('auth.signupPage.loginLink')
      }}</RouterLink>
    </p>

    <VaAlert v-if="errorMessage" color="danger" class="mb-4 text-sm" outline>
      {{ errorMessage }}
    </VaAlert>

    <VaInput
      v-model="form.display_name"
      :rules="[validators.required]"
      :error-messages="fieldErrors.display_name"
      class="mb-4"
      :label="t('auth.signupPage.nameLabel')"
      :placeholder="t('auth.signupPage.namePlaceholder')"
    />
    <VaInput
      v-model="form.email"
      :rules="[validators.required, validators.email]"
      :error-messages="fieldErrors.email"
      class="mb-4"
      :label="t('auth.signupPage.emailLabel')"
      type="email"
      :placeholder="t('auth.signupPage.emailPlaceholder')"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="form.password"
        :rules="passwordRules"
        :error-messages="fieldErrors.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.signupPage.passwordLabel')"
        :messages="t('auth.signupPage.passwordHint')"
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
        v-model="form.password_confirm"
        :rules="[
          (v) => !!v || t('auth.signupPage.confirmRequired'),
          (v) => v === form.password || t('auth.signupPage.passwordsMismatch'),
        ]"
        :error-messages="fieldErrors.password_confirm"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.signupPage.confirmLabel')"
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

    <VaCheckbox
      v-model="form.accept_terms"
      :rules="[(v) => v === true || t('auth.signupPage.acceptTermsRequired')]"
      :error-messages="fieldErrors.accept_terms"
      class="mb-4 text-sm"
      :label="t('auth.signupPage.acceptTerms')"
    />

    <div class="flex justify-center mt-6">
      <VaButton :loading="isSubmitting" size="large" class="w-full font-semibold" @click="submit">
        {{ t('auth.signupPage.submit') }}
      </VaButton>
    </div>

    <div v-if="googleEnabled" class="mt-5">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ t('auth.orContinueWith') }}</span>
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div ref="googleButtonEl" class="flex justify-center" :class="{ 'opacity-60': isGoogleLoading }"></div>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { validators } from '../../services/utils'
import { useSignup } from './composables/useSignup'
import { useGoogleAuth } from '../../composables/useGoogleAuth'

const { t } = useI18n()
const { form, fieldErrors, errorMessage, isSubmitting, submit, passwordRules } = useSignup()
const { googleEnabled, isGoogleLoading, renderGoogleButton } = useGoogleAuth()
const googleButtonEl = ref<HTMLElement | null>(null)

onMounted(() => renderGoogleButton(googleButtonEl.value))
</script>
