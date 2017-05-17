DELETE FROM xt.wftype WHERE wftype_code = 'QU';

INSERT INTO xt.wftype (wftype_table, wftype_tblname, wftype_code, wftype_src_tblname, wftype_uuid_col, wftype_parentid_col, wftype_id_col ) 
VALUES ('qthead', 'qualitytestwf', 'QU', 'qualityplanwf', 'obj_uuid', 'qthead_qphead_id', 'qthead_id'); 
