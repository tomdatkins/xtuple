-- Workflow Type Table definition

select xt.create_table('wftype', 'xt');
select xt.add_column('wftype','wftype_id', 'serial', 'primary key', 'xt');
select xt.add_column('wftype','wftype_table', 'text', '', 'xt');
select xt.add_column('wftype','wftype_tblname', 'text', '', 'xt');
select xt.add_column('wftype','wftype_code', 'text', '', 'xt');
select xt.add_column('wftype','wftype_src_tblname', 'text', '', 'xt');
select xt.add_column('wftype','wftype_uuid_col', 'text', '', 'xt');
select xt.add_column('wftype','wftype_parentid_sql', 'text', '', 'xt');
select xt.add_column('wftype','wftype_parentid_col', 'text', '', 'xt');
select xt.add_column('wftype','wftype_id_col', 'text', '', 'xt');
select xt.add_column('wftype','wftype_number_col', 'text', '', 'xt');

comment on table xt.wftype is 'Workflow Type Map';

COMMENT ON COLUMN xt.wftype.wftype_table IS 'The source document table';
COMMENT ON COLUMN xt.wftype.wftype_tblname IS 'The workflow table name';
COMMENT ON COLUMN xt.wftype.wftype_code IS 'Workflow Code';
COMMENT ON COLUMN xt.wftype.wftype_src_tblname IS 'The workflow source table';
COMMENT ON COLUMN xt.wftype.wftype_uuid_col IS 'The uuid column of the base table';
COMMENT ON COLUMN xt.wftype.wftype_parentid_sql IS 'Custom sql to determine parent where workflow is derived from';
COMMENT ON COLUMN xt.wftype.wftype_parentid_col IS 'The id column of parent where workflow is derived from';
COMMENT ON COLUMN xt.wftype.wftype_id_col IS 'The id column of the base table';

-- Contents
DELETE FROM xt.wftype 
WHERE (wftype_tblname = 'powf' AND wftype_table = 'pohead')
OR    (wftype_tblname = 'prjwf' AND wftype_table = 'prj')
OR    (wftype_tblname = 'coheadwf' AND wftype_table = 'cohead');

INSERT INTO xt.wftype (wftype_table, wftype_tblname, wftype_code, wftype_src_tblname, wftype_uuid_col, 
                       wftype_parentid_col, wftype_id_col, wftype_number_col )
VALUES ('pohead', 'powf', 'PO', 'potypewf', 'obj_uuid', 'pohead_potype_id', 'pohead_id', 'pohead_number'),
       ('prj', 'prjwf', 'PRJ', 'prjtypewf', 'obj_uuid', 'prj_prjtype_id', 'prj_id', 'prj_number'),
       ('cohead', 'coheadwf', 'SO', 'saletypewf', 'obj_uuid', 'cohead_saletype_id', 'cohead_id', 'cohead_number');

-- Remove Obsolete Entries
DELETE FROM xt.wftype WHERE wftype_table IS NULL;
