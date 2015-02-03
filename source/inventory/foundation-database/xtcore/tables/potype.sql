-- PO Type table definition

select xt.create_table('potype', 'xtcore');

select xt.add_column('potype','potype_id', 'serial', null, 'xtcore');
select xt.add_column('potype','potype_code', 'text', null, 'xtcore');
select xt.add_column('potype','potype_descr', 'text', null, 'xtcore');
select xt.add_column('potype','potype_active', 'boolean', 'DEFAULT TRUE', 'xtcore');
select xt.add_column('potype','potype_emlprofile_id', 'integer', null, 'xtcore');

select xt.add_primary_key('potype', 'potype_id', 'xtcore');
select xt.add_constraint('potype', 'potype_code_unq', 'unique (potype_code)', 'xtcore');

comment on table xtcore.potype is 'Purchase Order Type';

-- Fix sequence permission issue
GRANT ALL ON TABLE xtcore.potype_potype_id_seq TO xtrole;

-- Add priv if necessary
select xt.add_priv('MaintainPurchaseTypes', 'Can Maintain Purchase Types', 'Purchase', 'Purchase');

-- Amend existing tables

select xt.add_column('vendinfo','vend_potype_id', 'integer', null, 'public');
select xt.add_column('pohead','pohead_potype_id', 'integer', null, 'public');
