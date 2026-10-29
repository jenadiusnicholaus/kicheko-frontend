<template>
  <VaForm ref="resetForm" @submit.prevent>
    <template v-if="step === 'email'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">Forgot your password?</h1>
      <p class="text-base mb-4 leading-5">
        Enter your email address and we'll send you a 6-digit code to reset your password.
      </p>
      <VaInput
        v-model="form.email"
        :rules="[validators.required, validators.email]"
        :error-messages="fieldErrors.email"
        class="mb-4"
        label="Enter your email"
        type="email"
      />
      <VaButton :loading="isSubmitting" class="w-full mb-2" @click="sendCode">Send code</VaButton>
      <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary">Go back</VaButton>
    </template>

    <template v-else-if="step === 'otp'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">Check your email</h1>
      <p class="text-base mb-4 leading-5">
        If an account exists for <strong>{{ form.email }}</strong
        >, we've sent a 6-digit code. It expires in 10 minutes.
      </p>
      <VaInput
        v-model="form.otp"
        :rules="[(v) => /^\d{6}$/.test(v) || 'Enter the 6-digit code']"
        :error-messages="fieldErrors.otp"
        class="mb-4"
        label="6-digit code"
        maxlength="6"
        inputmode="numeric"
      />
      <VaButton :loading="isSubmitting" class="w-full mb-2" @click="verifyCode">Verify code</VaButton>
      <VaButton class="w-full" preset="secondary" @click="step = 'email'">Use a different email</VaButton>
    </template>

    <template v-else-if="step === 'password'">
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">Set a new password</h1>
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          v-model="form.new_password"
          :rules="[validators.required]"
          :error-messages="fieldErrors.new_password"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="New password"
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
            (v) => !!v || 'Repeat Password field is required',
            (v) => v === form.new_password || 'Passwords don\'t match',
          ]"
          :error-messages="fieldErrors.new_password_confirm"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="Repeat new password"
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
      <VaButton :loading="isSubmitting" class="w-full" @click="submitNewPassword">Reset password</VaButton>
    </template>

    <div v-else>
      <h1 class="font-semibold text-2xl sm:text-4xl mb-4">Password updated</h1>
      <p class="text-base mb-4 leading-5">Your password has been reset. You can now log in with your new password.</p>
      <div class="flex justify-center mt-4">
        <VaButton :to="{ name: 'login' }" class="w-full">Back to login</VaButton>
      </div>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { validators } from '../../services/utils'
import { usePasswordReset } from './composables/usePasswordReset'

const { step, form, fieldErrors, isSubmitting, sendCode, verifyCode, submitNewPassword } = usePasswordReset()
</script>
