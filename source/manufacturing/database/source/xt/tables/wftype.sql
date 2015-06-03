DELETE FROM xt.wftype WHERE wftype_tblname = 'wowf';

INSERT INTO xt.wftype (wftype_tblname, wftype_code, wftype_src_tblname) 
VALUES ('wowf', 'WO', 'plancodewf');
