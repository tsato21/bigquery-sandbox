import { BigQuery }  from '@google-cloud/bigquery'
import { util }      from '@google-cloud/common'
import type { BigQueryOptions } from '@google-cloud/bigquery'

export default defineEventHandler(async () => {

  const isDev       = process.env.NODE_ENV === 'development'
  // BigQuery クライアントのオプションを組み立て
  const options: BigQueryOptions = {
    projectId: process.env.BQ_PROJECT_ID
  }

  if (isDev) {
    options.apiEndpoint    = process.env.BQ_EMULATOR_HOST
    options.baseUrl        = process.env.BQ_EMULATOR_HOST
    options.customEndpoint = true
  }

  const bq = new BigQuery(options)

  // エミュレータ起動時は認証をスキップ
  if (isDev) {
    // @ts-ignore: internal で makeAuthenticatedRequest を差し替え
    bq.makeAuthenticatedRequest = util.makeAuthenticatedRequestFactory({})
  }

  // データ取得クエリ
  const [rows] = await bq.query(`
    SELECT
      page_uuid,
      p_id,
      p_name,
      dest_id,
      contractors
    FROM
      app_dataset.contractor_list
    ORDER BY
      p_id
  `)

  return rows
})
