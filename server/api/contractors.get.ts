import { BigQuery }  from '@google-cloud/bigquery'
import { util }      from '@google-cloud/common'
import type { BigQueryOptions } from '@google-cloud/bigquery'

export default defineEventHandler(async () => {
  // Nuxt の runtimeConfig から env を取得
  const { public: { BQ_PROJECT_ID, BQ_EMULATOR_HOST } } = useRuntimeConfig()

  const isDev       = process.env.NODE_ENV === 'development'
  const useEmulator = isDev && !!BQ_EMULATOR_HOST

  // BigQuery クライアントのオプションを組み立て
  const options: BigQueryOptions = {
    projectId: BQ_PROJECT_ID
  }

  if (useEmulator) {
    options.apiEndpoint    = BQ_EMULATOR_HOST
    options.baseUrl        = BQ_EMULATOR_HOST
    options.customEndpoint = true
  }

  const bq = new BigQuery(options)

  // エミュレータ起動時は認証をスキップ
  if (useEmulator) {
    // @ts-ignore: internal で makeAuthenticatedRequest を差し替え
    bq.makeAuthenticatedRequest = util.makeAuthenticatedRequestFactory({})
  }

  // データ取得クエリ
  const [rows] = await bq.query(`
    SELECT
      page_uuid,
      p_id,
      p_name,
      contractors
    FROM
      app_dataset.contractor_list
    ORDER BY
      p_id
  `)

  return rows
})
