select xt.add_column('qthead','obj_uuid', 'uuid', ' DEFAULT xt.uuid_generate_v4()', 'xt');
select xt.add_constraint('qthead', 'qthead_uuid_unq', 'UNIQUE (obj_uuid)', 'xt');
