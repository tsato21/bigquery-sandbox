/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { BigQuery }     from '@google-cloud/bigquery'
import { util }         from '@google-cloud/common'

const host    = 'http://localhost:9050'
const project = 'local-project'
process.env.GOOGLE_CLOUD_PROJECT = project
process.env.GCLOUD_PROJECT       = project

const bq = new BigQuery({
  projectId:      project,
  apiEndpoint:    host,
  baseUrl:        host,
  customEndpoint: true
})
// @ts-ignore
bq.makeAuthenticatedRequest = util.makeAuthenticatedRequestFactory({})

async function ensureDataset() {
  const ds = bq.dataset('app_dataset')
  try {
    await ds.get({ autoCreate: true })
  } catch {
    /* goccy 版は即時に反映されないことがあるのでポーリング */
  }
  // ここで 1 秒ずつ最大 5 秒待って存在確認
  for (let i = 0; i < 5; i++) {
    const [exists] = await ds.exists()
    if (exists) return
    await new Promise(r => setTimeout(r, 1000))
  }
  throw new Error('dataset app_dataset could not be created')
}

async function runSql(path: string) {
  await bq.query({ query: readFileSync(path, 'utf8') })
}

async function main() {
  await ensureDataset()
  await runSql('./db/dev/schema.sql')
  // await runSql('./db/dev/data.sql')
  console.log('\n✅ BigQuery emulator initialized with dataset and table created.')
}
main().catch(e => { console.error('❌', e); process.exit(1) })
