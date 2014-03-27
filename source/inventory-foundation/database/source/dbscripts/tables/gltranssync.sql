SELECT backupanddroptable('gltranssync'); -- 3.7 postbooks dbs have this but shouldn't

create table gltranssync (
  gltranssync_period_id integer not null references period (period_id),
  gltranssync_company_id integer not null references company (company_id),
  gltranssync_curr_amount numeric (20,2) not null,
  gltranssync_curr_id integer not null references curr_symbol (curr_id),
  gltranssync_curr_rate numeric not null
) inherits (gltrans);

ALTER TABLE gltranssync ADD PRIMARY KEY (gltrans_id);

COMMENT ON COLUMN gltranssync.gltranssync_period_id IS 'Period table reference';
COMMENT ON COLUMN gltranssync.gltranssync_company_id IS 'Company table reference';
COMMENT ON COLUMN gltranssync.gltranssync_curr_amount IS 'Amount in source transaction currency';
COMMENT ON COLUMN gltranssync.gltranssync_curr_id IS 'Currency table reference';
COMMENT ON COLUMN gltranssync.gltranssync_curr_rate IS 'Currency conversion rate applied';
COMMENT ON TABLE gltranssync IS 'Trial balance synchronization table used to import G/L transaction data summarized by day for assets and liabilities.';

grant all on gltranssync to xtrole;
