<script setup lang="ts">
import TabView   from 'primevue/tabview'
import TabPanel  from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'
import Button    from 'primevue/button'

const { data, pending, error, refresh } = useFetch('/api/contractors', {
  server: false
})

const groups = computed(() => {
  if (!data.value) return []
  const map = new Map<string, any[]>()

  for (const lot of data.value) {
    const tabKey = `${lot.p_name}（ID:${lot.p_id}）`
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
        page_uuid  : lot.page_uuid
      })
    })
  }

  return [...map.entries()] 
})
</script>

<template>
  <section class="max-w-6xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold">
      契約者一覧
    </h1>
    <Button
      label="PrimeVueボタン"
      :data-gtm="'primevue_btn_test'"
      :data-test_attribute="'テスト'"
    />
    <p v-if="pending">読み込み中…</p>
    <p v-else-if="error" class="text-red-600">
      エラー: {{ error.message }}
    </p>
    
    <TabView v-else>
      <TabPanel
        v-for="[name, rows] in groups"
        :key="name"
        :data-gtm="'sublease_selection'"
        :data-p_id="rows[0].p_id"
        :data-p_name="name"
      >
        <template #header>
          <span
            data-gtm="sublease_selection"
            :data-p-name="name"
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
