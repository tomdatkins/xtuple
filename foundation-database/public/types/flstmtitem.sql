SELECT dropIfExists('FUNCTION', 'financialreport(integer,integer,boolean,boolean)');
SELECT dropIfExists('FUNCTION', 'financialreport(integer,integer,boolean,boolean,integer)');
SELECT dropIfExists('TYPE', 'flstmtitem');

CREATE TYPE flstmtitem AS (
  flstmtitem_flhead_id           INTEGER,
  flstmtitem_period_id           INTEGER,
  flstmtitem_username            TEXT,
  flstmtitem_order               INTEGER,
  flstmtitem_level               INTEGER,
  flstmtitem_subgrp              INTEGER,
  flstmtitem_type                TEXT,
  flstmtitem_type_id             INTEGER,
  flstmtitem_parent_id           INTEGER,
  flstmtitem_accnt_id            INTEGER,
  flstmtitem_name                TEXT,
  flstmtitem_month               NUMERIC,
  flstmtitem_monthdb             NUMERIC,
  flstmtitem_monthcr             NUMERIC,
  flstmtitem_monthprcnt          NUMERIC,
  flstmtitem_monthbudget         NUMERIC,
  flstmtitem_monthbudgetprcnt    NUMERIC,
  flstmtitem_monthbudgetdiff     NUMERIC,
  flstmtitem_monthbudgetdiffprcnt NUMERIC,
  flstmtitem_qtr                 NUMERIC,
  flstmtitem_qtrdb               NUMERIC,
  flstmtitem_qtrcr               NUMERIC,
  flstmtitem_qtrprcnt            NUMERIC,
  flstmtitem_qtrbudget           NUMERIC,
  flstmtitem_qtrbudgetprcnt      NUMERIC,
  flstmtitem_qtrbudgetdiff       NUMERIC,
  flstmtitem_qtrbudgetdiffprcnt  NUMERIC,
  flstmtitem_year                NUMERIC,
  flstmtitem_yeardb              NUMERIC,
  flstmtitem_yearcr              NUMERIC,
  flstmtitem_yearprcnt           NUMERIC,
  flstmtitem_yearbudget          NUMERIC,
  flstmtitem_yearbudgetprcnt     NUMERIC,
  flstmtitem_yearbudgetdiff      NUMERIC,
  flstmtitem_yearbudgetdiffprcnt NUMERIC,
  flstmtitem_prmonth             NUMERIC,
  flstmtitem_prmonthprcnt        NUMERIC,
  flstmtitem_prmonthdiff         NUMERIC,
  flstmtitem_prmonthdiffprcnt    NUMERIC,
  flstmtitem_prqtr               NUMERIC,
  flstmtitem_prqtrprcnt          NUMERIC,
  flstmtitem_prqtrdiff           NUMERIC,
  flstmtitem_prqtrdiffprcnt      NUMERIC,
  flstmtitem_pryear              NUMERIC,
  flstmtitem_pryearprcnt         NUMERIC,
  flstmtitem_pryeardiff          NUMERIC,
  flstmtitem_pryeardiffprcnt     NUMERIC
);
