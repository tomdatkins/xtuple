create or replace function xt.teitem_did_change() returns trigger as $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

   /* Populate employee cost if it wasn't already included */
   if (NEW.teitem_type === 'T' && NEW.teitem_empcost === null) {
     var sql = "update te.teitem set teitem_empcost = (" +
               "  select te.calcrate(emp_wage, emp_wage_period) as cost " +
               "  from te.tehead " +
               "    join emp on tehead_emp_id = emp_id " +
               "  where tehead_id = teitem_tehead_id)" +
               "where teitem_id = $1;"
     plv8.execute(sql, [NEW.teitem_id]);
   }
   return NEW;

$$ language plv8;
