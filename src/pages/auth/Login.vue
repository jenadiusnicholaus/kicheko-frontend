<template>
  <VaForm ref="loginForm" @submit.prevent="submit">
    <h1 class="font-bold text-2xl mb-1 text-slate-900 dark:text-white">Ingia Kicheko</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-5">
      Huna akaunti bado?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary hover:underline">Jisajili hapa</RouterLink>
    </p>

    <VaAlert v-if="errorMessage" color="danger" class="mb-4 text-sm" outline>
      {{ errorMessage }}
    </VaAlert>

    <VaInput
      v-model="form.username"
      :rules="[validators.required]"
      :error-messages="fieldErrors.username"
      class="mb-4"
      label="Barua pepe au Namba ya simu"
      placeholder="email@example.com au +255..."
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="form.password"
        :rules="[validators.required]"
        :error-messages="fieldErrors.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Nenosiri (Password)"
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
      <VaCheckbox v-model="form.keepLoggedIn" class="mb-2 sm:mb-0" label="Nikumbuke kifaa hiki" />
      <RouterLink
        :to="{ name: 'recover-password' }"
        class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary hover:underline"
      >
        Umesahau nenosiri?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-6">
      <VaButton :loading="isSubmitting" size="large" class="w-full font-semibold" @click="submit">
        Ingia (Login)
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { validators } from '../../services/utils'
import { useLogin } from './composables/useLogin'

const { form, fieldErrors, errorMessage, isSubmitting, submit } = useLogin()
</script>
