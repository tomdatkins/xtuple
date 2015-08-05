select xt.add_column('ipsass', 'ipsass_shipzone_id', 'integer', 'DEFAULT -1', 'public', null);
select xt.add_column('ipsass', 'ipsass_saletype_id', 'integer', 'DEFAULT -1', 'public', null);

ALTER TABLE ipsass DROP CONSTRAINT IF EXISTS ipsass_ipsass_ipshead_id_key;

select  xt.add_constraint('ipsass', 'ipsass_ipsass_ipshead_id_key', 'UNIQUE (ipsass_ipshead_id, ipsass_cust_id, ipsass_custtype_id, ipsass_custtype_pattern, ipsass_shipto_id, ipsass_shipto_pattern, ipsass_shipzone_id, ipsass_saletype_id)', 'public')
