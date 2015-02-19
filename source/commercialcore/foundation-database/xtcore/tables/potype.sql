select xt.create_table('potype');

select xt.add_column('potype','potype_id', 'serial', 'primary key');
select xt.add_column('potype','potype_code', 'text');
select xt.add_column('potype','potype_descr', 'text');
select xt.add_column('potype','potype_active', 'boolean');
select xt.add_column('potype','potype_emlprofile_id', 'integer');

comment on table xt.potype is 'Purchase Order type extension table';

-- Fix sequence permission issue
--GRANT ALL ON TABLE xt.potype_potype_id_seq TO xtrole;

-- this priv does not exist in postbooks so create it here
select createPriv('Purchase', 'MaintainPurchaseTypes', 'Can Maintain Purchase Types');
