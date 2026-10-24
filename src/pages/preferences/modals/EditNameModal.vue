<template>
  <VaModal
    :mobile-fullscreen="false"
    size="small"
    hide-default-actions
    max-width="380px"
    model-value
    close-button
    @update:modelValue="emits('cancel')"
  >
    <h1 class="va-h5 mb-4">{{ t('taifa.misc.common.edit') }} {{ t('taifa.misc.common.name') }}</h1>
    <VaForm ref="form" @submit.prevent="submit">
      <VaInput
        v-model="Name"
        class="mb-4"
        :label="t('taifa.misc.common.name')"
        :placeholder="t('taifa.misc.common.name')"
      />
      <div class="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4">
        <VaButton :style="buttonStyles" preset="secondary" color="secondary" @click="emits('cancel')">
          {{ t('vuestic.cancel') }}
        </VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" :loading="isSaving" @click="submit">
          {{ t('taifa.misc.common.save') }}
        </VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/user-store'

import { buttonStyles } from '../styles'
import { useToast } from 'vuestic-ui'

const { t } = useI18n()

const store = useUserStore()

const { init } = useToast()

const emits = defineEmits(['cancel'])

const Name = ref<string>(store.userName)
const isSaving = ref(false)

const submit = async () => {
  if (!Name.value || Name.value === store.userName) {
    return emits('cancel')
  }

  isSaving.value = true
  try {
    await store.changeUserName(Name.value.trim())
    init({ message: t('taifa.misc.preferences.nameChanged'), color: 'success' })
    emits('cancel')
  } catch {
    init({ message: t('taifa.misc.preferences.nameChangeFailed'), color: 'danger' })
  } finally {
    isSaving.value = false
  }
}
</script>

<style lang="scss">
// TODO temporary before https://github.com/epicmaxco/vuestic-ui/issues/4020 fix
.va-modal__inner {
  min-width: 326px;
}
</style>
