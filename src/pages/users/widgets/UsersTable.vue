<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { PropType, computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'
import { Project } from '../../projects/types'

const { t } = useI18n()

const columns = computed(() =>
  defineVaDataTableColumns([
    { label: t('taifa.misc.users.fullName'), key: 'fullname', sortable: true },
    { label: t('auth.email'), key: 'email', sortable: true },
    { label: t('taifa.register.username'), key: 'username', sortable: true },
    { label: t('taifa.misc.users.role'), key: 'role', sortable: true },
    { label: t('menu.projects'), key: 'projects', sortable: true },
    { label: ' ', key: 'actions', align: 'right' },
  ]),
)

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  projects: {
    type: Array as PropType<Project[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
})

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const roleColors: Record<UserRole, string> = {
  admin: 'danger',
  user: 'background-element',
  owner: 'warning',
}

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (user: User) => {
  const agreed = await confirm({
    title: t('taifa.misc.users.deleteUser'),
    message: t('taifa.misc.users.deleteConfirm', { name: user.fullname }),
    okText: t('taifa.misc.common.delete'),
    cancelText: t('vuestic.cancel'),
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-user', user)
  }
}

const formatProjectNames = (projects: Project['id'][]) => {
  const names = projects.reduce((acc, p) => {
    const project = props.projects?.find(({ id }) => p === id)

    if (project) {
      acc.push(project.project_name)
    }

    return acc
  }, [] as string[])
  if (names.length === 0) return t('taifa.misc.common.noProjects')
  if (names.length <= 2) {
    return names.map((name) => name).join(', ')
  }

  return t('taifa.misc.users.moreProjects', {
    names: names
      .slice(0, 2)
      .map((name) => name)
      .join(', '),
    count: names.length - 2,
  })
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(fullname)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        <UserAvatar :user="rowData as User" size="small" />
        {{ rowData.fullname }}
      </div>
    </template>

    <template #cell(username)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.username }}
      </div>
    </template>

    <template #cell(email)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.email }}
      </div>
    </template>

    <template #cell(role)="{ rowData }">
      <VaBadge :text="rowData.role" :color="roleColors[rowData.role as UserRole]" />
    </template>

    <template #cell(projects)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{ formatProjectNames(rowData.projects) }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          :aria-label="t('taifa.misc.users.editUser')"
          @click="$emit('edit-user', rowData as User)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          :aria-label="t('taifa.misc.users.deleteUser')"
          @click="onUserDelete(rowData as User)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ t('taifa.misc.users.results', { n: $props.pagination.total }) }}</b>
      {{ t('taifa.misc.users.resultsPerPage') }}
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        :aria-label="t('taifa.misc.users.prevPage')"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        :aria-label="t('taifa.misc.users.nextPage')"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
