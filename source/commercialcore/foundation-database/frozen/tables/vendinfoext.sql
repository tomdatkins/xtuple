select xt.create_table('vendinfoext');

select xt.add_column('vendinfoext','vendinfoext_id', 'integer', 'primary key');
select xt.add_column('vendinfoext','vendinfoext_potype_id', 'integer');
select xt.add_constraint('vendinfoext', 'vendinfoext_potype_id_fkey', 'foreign key (vendinfoext_potype_id) references xt.potype (potype_id)');

comment on table xt.vendinfoext is 'Vendor extension table';
