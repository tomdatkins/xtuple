select xt.add_column('vendinfo', 'vend_created',      'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('vendinfo', 'vend_lastupdated',  'TIMESTAMP WITH TIME ZONE', NULL, 'public');
select xt.add_column('vendinfo','vend_potype_id', 'integer', null, 'public', 'Vendor default PO type');

select xt.add_constraint('vendinfo', 'vendinfo_potype_id_fkey', 'foreign key (vend_potype_id) references potype (potype_id)', 'public');

