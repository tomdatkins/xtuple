DELETE FROM xt.wftype WHERE wftype_tblname = 'towf';

INSERT INTO xt.wftype (wftype_tblname, wftype_code, wftype_src_tblname) 
VALUES ('towf', 'TO', 'sitetypewf');
