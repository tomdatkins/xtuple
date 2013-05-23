-- [ START ] initdb

select xt.js_init();

-- create schema
\i te/schema/create_te_schema.sql

-- [ END ] initdb

-- [ START ] te
-- This is the "time and expense" schema as implemented in the Desktop client

-- te functions
\i te/functions/calcrate.sql
\i te/functions/copyitem.sql
\i te/functions/invoicesheets.sql
\i te/functions/postsheet.sql
\i te/functions/sheetstate.sql
\i te/functions/unnest.sql
\i te/functions/vouchersheet.sql

-- te trigger functions
\i te/trigger_functions/tehead.sql
\i te/trigger_functions/teitem.sql
\i te/trigger_functions/teprj.sql

-- te tables
\i te/tables/tecustrate.sql
\i te/tables/teemp.sql
\i te/tables/teexp.sql
\i te/tables/tehead.sql
\i te/tables/teitem.sql
\i te/tables/teprj.sql
\i te/tables/teprjtask.sql

-- xt views
\i xt/views/prjtaskinfo.sql
\i xt/views/tecustrateinfo.sql
\i xt/views/teprjinfo.sql
\i xt/views/teprjtaskinfo.sql
\i xt/views/teexpinfo.sql
\i xt/views/teheadinfo.sql

-- xm javascript
\i xm/javascript/worksheet.sql

-- [ END ] te

\i priv.sql
\i register.sql

