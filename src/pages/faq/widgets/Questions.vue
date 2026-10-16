<template>
  <VaCard class="mb-4">
    <VaCardContent>
      <h2 class="va-h5">{{ t('taifa.misc.faq.popularQuestions') }}</h2>
      <VaAccordion v-model="accordionState" :style="{ '--va-collapse-padding': '1rem 0' }" class="mb-1">
        <VaCollapse :header="t('taifa.misc.faq.q1Title')">
          <article class="max-w-3xl leading-5">
            <p class="mb-2">
              {{ t('taifa.misc.faq.q1Intro') }}
            </p>
            <ul class="list-disc list-inside leading-5 ml-4">
              <li>
                {{ t('taifa.misc.faq.q1Step1') }}
              </li>
              <li>
                {{ t('taifa.misc.faq.q1Step2') }}
              </li>
              <li>{{ t('taifa.misc.faq.q1Step3') }}</li>
            </ul>
          </article>
        </VaCollapse>

        <VaCollapse :header="t('taifa.misc.faq.q2Title')">
          <article class="max-w-3xl text-sm">
            <p class="mb-4">
              {{ t('taifa.misc.faq.q2P1') }}
            </p>
            <p class="mb-4">
              {{ t('taifa.misc.faq.q2P2') }}
            </p>
            <a class="va-link font-semibold" href="#"
              >{{ t('taifa.misc.faq.q2Link') }}
              <VaIcon :size="18" name="chevron_right" />
            </a>
          </article>
        </VaCollapse>

        <VaCollapse :header="t('taifa.misc.faq.q3Title')">
          <article class="max-w-3xl text-sm">
            <p class="mb-3">
              {{ t('taifa.misc.faq.q3P1') }}
            </p>
            <ul class="list-disc list-inside leading-6 ml-4 mb-4">
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q3Li1Bold') }}</span>
                {{ t('taifa.misc.faq.q3Li1Text') }}
              </li>
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q3Li2Bold') }}</span>
                {{ t('taifa.misc.faq.q3Li2Text') }}
              </li>
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q3Li3Bold') }}</span>
                {{ t('taifa.misc.faq.q3Li3Text') }}
              </li>
            </ul>
            <p>
              {{ t('taifa.misc.faq.q3P2') }}
            </p>
          </article>
        </VaCollapse>

        <VaCollapse :style="{ '--va-background-border': 'transparent' }" :header="t('taifa.misc.faq.q4Title')">
          <article class="max-w-3xl text-sm">
            <p class="mb-3">
              {{ t('taifa.misc.faq.q4P1') }}
            </p>
            <ul class="list-disc list-inside leading-6 ml-4 mb-4">
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q4Li1Bold') }}</span>
                {{ t('taifa.misc.faq.q4Li1Text') }}
              </li>
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q4Li2Bold') }}</span>
                {{ t('taifa.misc.faq.q4Li2Text') }}
              </li>
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q4Li3Bold') }}</span>
                {{ t('taifa.misc.faq.q4Li3Text') }}
              </li>
              <li>
                <span class="font-semibold">{{ t('taifa.misc.faq.q4Li4Bold') }}</span>
                {{ t('taifa.misc.faq.q4Li4Text') }}
              </li>
            </ul>
            <p>
              {{ t('taifa.misc.faq.q4P2') }}
            </p>
          </article>
        </VaCollapse>
      </VaAccordion>
    </VaCardContent>
  </VaCard>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const accordionState = reactive([false, true, false, false])
</script>
