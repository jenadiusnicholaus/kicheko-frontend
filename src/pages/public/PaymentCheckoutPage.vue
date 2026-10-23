<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
    <!-- Brand Logo -->
    <div class="mb-5 text-center">
      <img src="/taifa/kicheko_pro_logo.png" alt="Kicheko Pro" class="w-40 sm:w-48 mx-auto object-contain" />
    </div>

    <PayItCheckout
      embedded
      :application-id="applicationId"
      :applicant-name="applicantName"
      :applicant-phone="applicantPhone"
      :applicant-university="applicantUniversity"
      :amount="amount"
      @close="router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PayItCheckout from '../../components/PayItCheckout.vue'

const route = useRoute()
const router = useRouter()

const applicationId = computed(() => {
  const fromQuery = String(route.query.app || '')
  if (fromQuery) return fromQuery
  try {
    return sessionStorage.getItem('pending_application_id') || ''
  } catch {
    return ''
  }
})
const applicantName = computed(() => String(route.query.name || ''))
const applicantPhone = computed(() => String(route.query.phone || ''))
const applicantUniversity = computed(() => String(route.query.uni || ''))
const amount = computed(() => String(route.query.amount || '10,000'))

onMounted(() => {
  if (!applicationId.value) router.replace({ name: 'register-comedian' })
})
</script>
