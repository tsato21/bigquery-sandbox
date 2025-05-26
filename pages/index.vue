<template>
  <section class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold">
      契約者一覧
    </h1>
    
    <!-- 確定ボタン(Button使用) -->
    <Button
      label="確定ボタン1"
      :data-gtm="'property_confirmation'"
      :data-p-id="'1'"
      :data-dest-id="'1'"
      :data-action-type="ACTION_TYPE.CONFIRM_BUTTON"
    />

    <!-- 確定ボタン(span使用) -->
    <Button>
      <span
        :data-gtm="'property_confirmation'"
        :data-p-id="'1'"
        :data-dest-id="'1'"
        :data-action-type="ACTION_TYPE.CONFIRM_BUTTON"
      >
        確定ボタン2
      </span>
    </Button>
    
    <p v-if="pending">読み込み中…</p>
    <p v-else-if="error" class="text-red-600">
      エラー: {{ error.message }}
    </p>
    
    <TabView v-else>
      <TabPanel
        v-for="[name, rows] in groups"
        :key="name"
      >
        <template #header>
          <span
          :data-gtm="'property_selection'"
          :data-p-id="rows[0].p_id"
          :data-dest-id="rows[0].dest_id"
          :data-action-type="ACTION_TYPE.SUBLEASE_SELECTION"
          >
            {{ name }}
          </span>
        </template>

        <DataTable
          :value="rows"
          dataKey="contract_id"
          stripedRows
          scrollable
          tableStyle="min-width: 60rem"
        >
          <Column field="contract_id" header="契約ID"   style="width:7rem" />
          <Column field="name"        header="契約者名" />
          <Column field="plan"        header="プラン"    style="width:8rem" />
          <Column field="status"      header="ステータス" style="width:8rem" />
          <Column field="start_date"  header="開始日"    style="width:8rem" />
          <Column field="end_date"    header="終了日"    style="width:8rem" />
        </DataTable>
      </TabPanel>
    </TabView>
  </section>
</template>

<script setup lang="ts">
import TabView   from 'primevue/tabview'
import TabPanel  from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'
import Button    from 'primevue/button'

// Action type constants
const ACTION_TYPE = {
  SUBLEASE_SELECTION: 1,
  CONFIRM_BUTTON: 2,
  ADDITIONAL_ACTION: 3
} as const

const { data, pending, error, refresh } = useFetch('/api/contractors', {
  server: false
})

const groups = computed(() => {
  if (!data.value) return []
  const map = new Map<string, any[]>()

  for (const lot of data.value) {
    const tabKey = `${lot.p_name}（報告先ID:${lot.dest_id}）`
    if (!map.has(tabKey)) map.set(tabKey, [])

    lot.contractors.forEach(ct => {
      map.get(tabKey)!.push({
        contract_id: ct.contract_id,
        name       : ct.name,
        plan       : ct.plan,
        status     : ct.status,
        start_date : ct.start_date?.value ?? ct.start_date ?? '',
        end_date   : ct.end_date?.value   ?? ct.end_date   ?? '',
        p_id       : lot.p_id,
        dest_id    : lot.dest_id,
        page_uuid  : lot.page_uuid
      })
    })
  }

  return [...map.entries()] 
})

// Added definitions for pId and destId to resolve the TypeScript errors and enable pushGtm to work
const pId = 1;
const destId = 1;

const pushGtm = (eventName: string, params: Record<string, any>) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...params })
}
</script>

