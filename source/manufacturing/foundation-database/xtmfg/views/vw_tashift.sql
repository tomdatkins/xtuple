
SELECT dropIfExists('VIEW', 'vw_tashift', 'xtmfg');
CREATE VIEW xtmfg.vw_tashift AS
 SELECT sorder, tashift_shift_id, stime, type, openclose, paid
   FROM (SELECT 1 AS sorder, tashift_shift_id, tashift_starttime AS stime,
                'S' AS type, 'O' AS openclose, true AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 2 AS sorder, tashift_shift_id, tashift_firstbreakstart AS stime,
                'B' AS type, 'O' AS openclose, tashift_firstbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 3 AS sorder, tashift_shift_id, tashift_firstbreakend AS stime,
                'B' AS type, 'C' AS openclose, tashift_firstbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 4 AS sorder, tashift_shift_id, tashift_lnchbreakstart AS stime,
                'B' AS type, 'O' AS openclose, tashift_lnchbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 5 AS sorder, tashift_shift_id, tashift_lnchbreakend AS stime,
                'B' AS type, 'C' AS openclose, tashift_lnchbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 6 AS sorder, tashift_shift_id, tashift_scndbreakstart AS stime,
                'B' AS type, 'O' AS openclose, tashift_scndbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 7 AS sorder, tashift_shift_id, tashift_scndbreakend AS stime,
                'B' AS type, 'C' AS openclose, tashift_scndbreakpaid AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 8 AS sorder, tashift_shift_id, tashift_endtime AS stime,
                'E' AS type, 'C' AS openclose, true AS paid
         FROM xtmfg.tashift
         UNION 
         SELECT 9 AS sorder, tashift_shift_id, tashift_default_clockout AS stime,
                'D' AS type, 'C' AS openclose, true AS paid
         FROM xtmfg.tashift) foo
  ORDER BY tashift_shift_id, sorder;

REVOKE ALL ON TABLE xtmfg.vw_tashift FROM PUBLIC;
GRANT  ALL ON TABLE xtmfg.vw_tashift TO GROUP xtrole;

