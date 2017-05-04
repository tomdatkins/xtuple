DELETE FROM xt.wftype WHERE wftype_tblname = 'wowf';

INSERT INTO xt.wftype (wftype_table, wftype_tblname, wftype_code, wftype_src_tblname, wftype_uuid_col, wftype_parentid_sql, wftype_parentid_col, wftype_id_col )
VALUES ('wo', 'wowf', 'WO', 'plancodewf', 'obj_uuid', 'SELECT itemsite_plancode_id FROM itemsite WHERE itemsite_id = $1', 'wo_itemsite_id', 'wo_id');

