select xt.create_table('doctype', 'public');

select xt.add_column('doctype','doctype_id',           'SERIAL', 'PRIMARY KEY', 'public');
select xt.add_column('doctype','doctype_type',         'TEXT',   'UNIQUE NOT NULL', 'public');
select xt.add_column('doctype','doctype_type_full',    'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_table',        'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_key_field',    'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_number_field', 'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_name_field',   'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_desc_field',   'TEXT',   'NOT NULL', 'public');
select xt.add_column('doctype','doctype_widget',       'TEXT',   $$NOT NULL DEFAULT ''$$, 'public');
select xt.add_column('doctype','doctype_joins',        'TEXT',   $$NOT NULL DEFAULT ''$$, 'public');
select xt.add_column('doctype','doctype_key_param',    'TEXT',   $$NOT NULL DEFAULT ''$$, 'public');
select xt.add_column('doctype','doctype_uiform_name',  'TEXT',   $$NOT NULL DEFAULT ''$$, 'public');
select xt.add_column('doctype','doctype_create_priv',  'TEXT',   $$NOT NULL DEFAULT ''$$, 'public');
select xt.add_column('doctype','doctype_created',      'TIMESTAMP WITH TIME ZONE', 'NOT NULL DEFAULT CURRENT_TIMESTAMP', 'public');
select xt.add_column('doctype','doctype_last_modified','TIMESTAMP WITH TIME ZONE', 'NOT NULL DEFAULT CURRENT_TIMESTAMP', 'public');
