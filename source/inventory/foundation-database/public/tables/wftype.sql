DELETE FROM xt.wftype WHERE wftype_tblname = 'towf';

INSERT INTO xt.wftype (wftype_table, wftype_tblname, wftype_code, wftype_src_tblname, wftype_uuid_col, wftype_parentid_sql, wftype_parentid_col, wftype_id_col ) 
VALUES ('tohead', 'towf', 'TO', 'sitetypewf', 'obj_uuid', 'SELECT warehous_sitetype_id FROM whsinfo WHERE warehous_id =%L','tohead_src_warehous_id', 'tohead_id');

