select xt.create_table('catconfig', 'xwd');

select xt.add_column('catconfig', 'catconfig_id',               'SERIAL',       'NOT NULL', 'xwd');
select xt.add_column('catconfig', 'catconfig_provider',         'TEXT',         null, 'xwd');
select xt.add_column('catconfig', 'catconfig_provider_descrip', 'TEXT',         null, 'xwd');
select xt.add_column('catconfig', 'catconfig_warehous_id',      'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_plancode_id',      'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_terms_id',         'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_vendtype_id',      'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_costcat_id',       'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_controlmethod',    'CHAR(1)',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_taxzone_id',       'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_taxtype_id',       'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_createsopr',       'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_createsopo',       'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_dropship',         'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_costmethod',       'CHAR(1)',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_classcode_id',     'INTEGER',      'DEFAULT -1', 'xwd');
select xt.add_column('catconfig', 'catconfig_inv_uom_id',       'INTEGER',      'DEFAULT -1', 'xwd');
select xt.add_column('catconfig', 'catconfig_reorderlevel',     'NUMERIC(18,6)', 'DEFAULT 1.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_ordertoqty',       'NUMERIC(18,6)', 'DEFAULT 2.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_cyclecountfreq',   'INTEGER',      'DEFAULT 0', 'xwd');
select xt.add_column('catconfig', 'catconfig_loccntrl',         'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_safetystock',      'NUMERIC(18,6)', 'DEFAULT 0.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_minordqty',        'NUMERIC(18,6)', 'DEFAULT 0.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_multordqty',       'NUMERIC(18,6)', 'DEFAULT 0.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_leadtime',         'INTEGER',      'DEFAULT 0', 'xwd');
select xt.add_column('catconfig', 'catconfig_abcclass',         'CHAR(1)',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_eventfence',       'INTEGER',      'DEFAULT 0', 'xwd');
select xt.add_column('catconfig', 'catconfig_stocked',          'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_location_id',      'INTEGER',      null, 'xwd');
select xt.add_column('catconfig', 'catconfig_useparams',        'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_useparamsmanual',  'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_location',         'TEXT',         null, 'xwd');
select xt.add_column('catconfig', 'catconfig_autoabcclass',     'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_ordergroup',       'INTEGER',      'DEFAULT 1', 'xwd');
select xt.add_column('catconfig', 'catconfig_maxordqty',        'NUMERIC(18,6)', 'DEFAULT 0.0', 'xwd');
select xt.add_column('catconfig', 'catconfig_ordergroup_first', 'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_planning_type',    'CHAR(1)',      $$DEFAULT 'M'::bpchar$$, 'xwd');
select xt.add_column('catconfig', 'catconfig_recvlocation_id',  'INTEGER',      'DEFAULT -1', 'xwd');
select xt.add_column('catconfig', 'catconfig_issuelocation_id', 'INTEGER',      'DEFAULT -1', 'xwd');
select xt.add_column('catconfig', 'catconfig_location_dist',    'BOOLEAN',      'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_recvlocation_dist',  'BOOLEAN',    'DEFAULT FALSE', 'xwd');
select xt.add_column('catconfig', 'catconfig_issuelocation_dist', 'BOOLEAN',    'DEFAULT FALSE', 'xwd');

select xt.add_primary_key('catconfig', 'catconfig_id', 'xwd');

comment on table xwd.catconfig is 'Trade Service Catalog conversion to xTuple configuration parameters';

-- Fix sequence permission issue
grant all on sequence xwd.catconfig_catconfig_id_seq TO xtrole;
