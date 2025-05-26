CREATE TABLE IF NOT EXISTS app_dataset.contractor_list (
  page_uuid          STRING NOT NULL,
  p_id               INT64,
  p_name   STRING,
  dest_id               INT64,
  target_date           DATE,
  contractors ARRAY<
    STRUCT<
      contract_id STRING,
      name        STRING,
      plan        STRING,
      start_date  DATE,
      end_date    DATE,
      status      STRING
    >
  >
)
PARTITION BY target_date
CLUSTER BY page_uuid, p_id;
