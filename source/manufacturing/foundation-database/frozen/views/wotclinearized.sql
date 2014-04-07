
SELECT dropIfExists('VIEW', 'wotcLinearized', 'xtmfg');
CREATE VIEW xtmfg.wotcLinearized AS
  SELECT wotc_id, wotc_wooper_id, wotc_wo_id, wotc_username,
         wotc_emp_code, wotc_timein AS wotc_time, 'I' AS wotc_dir
  FROM xtmfg.wotc
  UNION 
  SELECT wotc_id, wotc_wooper_id, wotc_wo_id, wotc_username,
         wotc_emp_code, COALESCE(wotc_timeout, now()) AS wotc_time, 'O' AS wotc_dir
  FROM xtmfg.wotc;

REVOKE ALL ON TABLE xtmfg.wotcLinearized FROM PUBLIC;
GRANT  ALL ON TABLE xtmfg.wotcLinearized TO GROUP xtrole;

