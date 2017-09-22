select xt.create_table('rev', 'public');

ALTER TABLE public.rev DISABLE TRIGGER ALL;

SELECT 
  xt.add_column('rev', 'rev_id',          'SERIAL',       'NOT NULL', 'public'),
  xt.add_column('rev', 'rev_number',      'TEXT',         'NOT NULL', 'public'),
  xt.add_column('rev', 'rev_status',      'CHARACTER(1)', $$NOT NULL DEFAULT 'P'$$, 'public'),
  xt.add_column('rev', 'rev_target_type', 'TEXT',         'NOT NULL', 'public'),
  xt.add_column('rev', 'rev_target_id',   'INTEGER',      'NOT NULL', 'public'),
  xt.add_column('rev', 'rev_created',     'DATE',         'NOT NULL DEFAULT CURRENT_DATE', 'public'),
  xt.add_column('rev', 'rev_date',        'DATE',         'NOT NULL', 'public'),
  xt.add_column('rev', 'rev_effective',   'DATE',         null, 'public'),
  xt.add_column('rev', 'rev_expires',     'DATE',         null, 'public');

ALTER TABLE public.rev DROP CONSTRAINT IF EXISTS rev_check;

SELECT 
  xt.add_constraint('rev', 'rev_pkey',             'PRIMARY KEY (rev_id)', 'public'),
  xt.add_constraint('rev', 'rev_rev_number_check', $$CHECK(rev_number <> '')$$, 'public'),
  xt.add_constraint('rev', 'rev_rev_number_key',   'UNIQUE (rev_number, rev_target_type, rev_target_id)', 'public'),
  xt.add_constraint('rev', 'rev_check',            $$CHECK ((rev_status = 'P' OR rev_status = 'A' OR rev_status = 'I' OR rev_status = 'S') AND (rev_target_type = 'BOM' OR rev_target_type = 'BOO'))$$, 'public');

ALTER TABLE public.rev ENABLE TRIGGER ALL;

COMMENT ON TABLE rev IS 'Used to track document revision information';

CREATE INDEX IF NOT EXISTS rev_target ON rev USING btree (rev_target_type, rev_target_id);

