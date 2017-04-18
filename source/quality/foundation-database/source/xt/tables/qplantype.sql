select xt.create_table('qplantype', 'xt');

SELECT xt.add_column('qplantype', 'qplantype_id', 'SERIAL', 'NOT NULL', 'xt');
SELECT xt.add_column('qplantype', 'qplantype_code', 'text', 'NOT NULL', 'xt');
SELECT xt.add_column('qplantype', 'qplantype_descr', 'text', '', 'xt');
SELECT xt.add_column('qplantype', 'qplantype_active', 'BOOLEAN', 'NOT NULL DEFAULT true', 'xt');
SELECT xt.add_column('qplantype', 'qplantype_default', 'BOOLEAN', 'NOT NULL DEFAULT false', 'xt');
SELECT xt.add_column('qplantype', 'qplantype_emlprofile_id', 'integer', null, 'xt');

select xt.add_primary_key('qplantype', 'qplantype_id', 'xt');
select xt.add_constraint('qplantype', 'qplantype_code_unq', 'UNIQUE (qplantype_code)', 'xt');

comment on table xt.qplantype is 'Quality Plan Type';
COMMENT ON COLUMN xt.qplantype.qplantype_id IS 'Sequence identifier for quality plan type.';
COMMENT ON COLUMN xt.qplantype.qplantype_code IS 'User defined identifier for quality plan type.';
COMMENT ON COLUMN xt.qplantype.qplantype_descr IS 'Description for quality plan type.';
COMMENT ON COLUMN xt.qplantype.qplantype_active IS 'Boolean to deactivate a quality plan type.';
COMMENT ON COLUMN xt.qplantype.qplantype_default IS 'Boolean to mark a quality plan type as the default type.';

-- Insert Default Value so we can migrate
INSERT INTO xt.qplantype (qplantype_code, qplantype_descr, qplantype_default)
SELECT 'DEFAULT', 'Default Quality Workflow', true
WHERE NOT EXISTS (SELECT 1 FROM  xt.qplantype WHERE qplantype_code = 'DEFAULT');
