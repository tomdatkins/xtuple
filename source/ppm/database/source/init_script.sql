-- [ START ] initdb

select xt.js_init();

-- create schema
\i schema/create_te_schema.sql

-- [ END ] initdb

-- [ START ] te
-- This is the "time and expense" schema as implemented in the Desktop client

-- te trigger functions
\i trigger_functions/tehead.sql
\i trigger_functions/teitem.sql
\i trigger_functions/teprj.sql

-- te tables
\i tables/tecustrate.sql
\i tables/teemp.sql
\i tables/teexp.sql
\i tables/tehead.sql
\i tables/teitem.sql
\i tables/teprj.sql
\i tables/teprjtask.sql

-- te javascript
\i javascript/worksheet.sql

-- [ END ] te

\i priv.sql

