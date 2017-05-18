select xt.add_column('vendinfo', 'vend_created',      'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('vendinfo', 'vend_lastupdated',  'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('vendinfo','vend_potype_id', 'integer', null, 'public', 'Vendor default PO type');

select xt.add_constraint('vendinfo', 'vendinfo_potype_id_fkey', 'foreign key (vend_potype_id) references potype (potype_id)', 'public');

DO $$
BEGIN
  IF EXISTS(SELECT 1
              FROM information_schema.tables
             WHERE table_schema = 'xt'
               AND table_name = 'vendinfoext') THEN
    UPDATE vendinfo
       SET vend_potype_id = vendinfoext_potype_id
      FROM xt.vendinfoext
     WHERE vend_id = vendinfoext_id;

    DROP TABLE xt.vendinfoext;
  END IF;
END
$$ LANGUAGE plpgsql;
