select xt.add_column('tax','tax_dist_accnt_id', 'INTEGER', NULL, 'public');

select xt.add_column('tax','tax_sales', 'BOOLEAN', NULL, 'public');
select xt.add_column('tax','tax_purch', 'BOOLEAN', NULL, 'public');
