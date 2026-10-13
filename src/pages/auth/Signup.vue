<template>
  <VaForm ref="signupForm" @submit.prevent="submit">
    <h1 class="font-bold text-2xl mb-1 text-slate-900 dark:text-white">Jisajili Kicheko</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-5">
      Tayari una akaunti?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary hover:underline">Ingia hapa</RouterLink>
    </p>

    <VaAlert v-if="errorMessage" color="danger" class="mb-4 text-sm" outline>
      {{ errorMessage }}
    </VaAlert>

    <VaInput
      v-model="form.display_name"
      :rules="[validators.required]"
      :error-messages="fieldErrors.display_name"
      class="mb-4"
      label="Jina lako kamili au la Sanaa"
      placeholder="e.g. Joti Mchekeshaji"
    />
    <VaInput
      v-model="form.email"
      :rules="[validators.required, validators.email]"
      :error-messages="fieldErrors.email"
      class="mb-4"
      label="Barua pepe (Email)"
      type="email"
      placeholder="wewe@example.com"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="form.password"
        :rules="passwordRules"
        :error-messages="fieldErrors.password"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Nenosiri (Password)"
        messages="Inatakiwa herufi 8+, namba, na alama maalum."
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
        :rules="[(v) => !!v || 'Tafadhali thibitisha nenosiri', (v) => v === form.password || 'Nenosiri halilingani']"
        :error-messages="fieldErrors.password_confirm"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Thibitisha Nenosiri"
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
      :rules="[(v) => v === true || 'Lazima ukubali vigezo na masharti']"
      :error-messages="fieldErrors.accept_terms"
      class="mb-4 text-sm"
      label="Ninakubali Vigezo vya Huduma na Sera ya Faragha"
    />

    <div class="flex justify-center mt-6">
      <VaButton :loading="isSubmitting" size="large" class="w-full font-semibold" @click="submit">
        Tengeneza Akaunti (Sign Up)
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { validators } from '../../services/utils'
import { useSignup } from './composables/useSignup'

const { form, fieldErrors, errorMessage, isSubmitting, submit, passwordRules } = useSignup()
</script>
