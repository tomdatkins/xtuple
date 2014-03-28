SELECT backupanddroptable('trialbalsync'); -- some 3.7 postbooks have this but shouldn't

create table trialbalsync (
  trialbalsync_curr_beginning numeric (20,2) not null default 0,
  trialbalsync_curr_ending numeric (20,2) not null default 0,
  trialbalsync_curr_credits numeric(20,2) not null default 0,
  trialbalsync_curr_debits numeric(20,2) not null default 0,
  trialbalsync_curr_yearend numeric(20,2) not null default 0,
  trialbalsync_curr_posted bool not null default false,
  trialbalsync_curr_id integer not null references curr_symbol (curr_id),
  trialbalsync_curr_rate numeric
) inherits (trialbal);

ALTER TABLE trialbalsync ADD PRIMARY KEY (trialbal_id);
alter table trialbalsync add unique (trialbal_period_id, trialbal_accnt_id);

COMMENT ON COLUMN trialbalsync.trialbalsync_curr_beginning IS 'Beginning balance in source transaction currency';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_ending IS 'Ending balance in source transaction currency';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_credits IS 'Credits in source transaction currency';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_debits IS 'Debits in source transaction currency';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_debits IS 'Year end in source transaction currency';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_id IS 'Currency table reference';
COMMENT ON COLUMN trialbalsync.trialbalsync_curr_rate IS 'Currency conversion rate applied';	
COMMENT ON TABLE trialbalsync IS 'Trial balance synchronization table.';	

grant all on trialbalsync to xtrole;
