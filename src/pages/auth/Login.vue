<template>
  <VaForm ref="loginForm" @submit.prevent="submit">
    <h1 class="font-bold text-2xl mb-1 text-slate-900 dark:text-white">{{ t('auth.loginPage.title') }}</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-5">
      {{ t('auth.loginPage.noAccount') }}
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary hover:underline">{{
        t('auth.loginPage.signUpLink')
      }}</RouterLink>
    </p>

    <VaAlert v-if="errorMessage" color="danger" class="mb-4 text-sm" outline>
      {{ errorMessage }}
    </VaAlert>

    <VaInput
      v-model="form.username"
      :rules="[validators.required]"
      :error-messages="fieldErrors.username"
      class="mb-4"
      :label="t('auth.loginPage.usernameLabel')"
      :placeholder="t('auth.loginPage.usernamePlaceholder')"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="form.password"
        :rules="[validators.required]"
        :error-messages="fieldErrors.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        :label="t('auth.loginPage.passwordLabel')"
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

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm">
      <VaCheckbox v-model="form.keepLoggedIn" class="mb-2 sm:mb-0" :label="t('auth.loginPage.rememberDevice')" />
      <RouterLink
        :to="{ name: 'recover-password' }"
        class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary hover:underline"
      >
        {{ t('auth.loginPage.forgotPassword') }}
      </RouterLink>
    </div>

    <div class="flex justify-center mt-6">
      <VaButton :loading="isSubmitting" size="large" class="w-full font-semibold" @click="submit">
        {{ t('auth.loginPage.submit') }}
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
import { useLogin } from './composables/useLogin'
import { useGoogleAuth } from '../../composables/useGoogleAuth'

const { t } = useI18n()
const { form, fieldErrors, errorMessage, isSubmitting, submit } = useLogin()
const { googleEnabled, isGoogleLoading, renderGoogleButton } = useGoogleAuth()
const googleButtonEl = ref<HTMLElement | null>(null)

onMounted(() => renderGoogleButton(googleButtonEl.value))
</script>
