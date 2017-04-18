select xt.add_column('vendinfo','vend_potype_id', 'integer', null, 'public');
select xt.add_constraint('vendinfo', 'vendinfo_potype_id_fkey', 'foreign key (vend_potype_id) references potype (potype_id)', 'public');

comment on column vendinfo.vend_potype_id is 'Vendor default PO type';
