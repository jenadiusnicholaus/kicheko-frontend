<template>
  <VaCard class="mb-5 pr-4 flex justify-between">
    <div>
      <VaCardContent>
        <h2 class="va-h5">{{ t('taifa.misc.faq.gotQuestions') }}</h2>
        <p class="text-base leading-5">{{ t('taifa.misc.faq.demoPitch') }}</p>
      </VaCardContent>
      <VaCardActions align="left">
        <VaButton @click="showModal = !showModal">{{ t('taifa.misc.faq.requestDemo') }}</VaButton>
      </VaCardActions>
    </div>
    <img :alt="t('taifa.misc.faq.sendMessageAlt')" src="../request-demo.svg" />
  </VaCard>
  <VaModal v-model="showModal" :before-ok="submit" close-button :ok-text="t('taifa.misc.faq.requestDemo')" size="small">
    <VaForm ref="form" @submit.prevent="submit">
      <h3 class="va-h3">{{ t('taifa.misc.faq.requestFreeDemo') }}</h3>
      <p class="text-base mb-4 leading-5">
        {{ t('taifa.misc.faq.demoModalPitch') }}
      </p>
      <VaInput
        v-model="email"
        :rules="[
          (v) => !!v || t('taifa.misc.faq.emailRequired'),
          (v) => /.+@.+\..+/.test(v) || t('taifa.misc.faq.emailInvalid'),
        ]"
        class="mb-4"
        :label="t('auth.email')"
        type="email"
      />
    </VaForm>
  </VaModal>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useForm, useToast } from 'vuestic-ui'

const { t } = useI18n()

const showModal = ref(false)
const email = ref('')
const { validate } = useForm('form')
const { init } = useToast()

const submit = async () => {
  if (!validate()) {
    return
  }
  init({
    title: t('taifa.misc.faq.demoSubmittedTitle'),
    message: t('taifa.misc.faq.demoSubmittedMsg'),
    color: 'success',
  })
  showModal.value = false
}
</script>
