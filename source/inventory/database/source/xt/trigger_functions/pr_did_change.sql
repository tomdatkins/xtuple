create or replace function xt.pr_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.tuple.com/CPAL for the full text of the software license. */

/* Handle updates to parent order */
return (function () {

  var sql;

  if (TG_OP === 'DELETE' && OLD.pr_order_type === 'S') {
    sql = 'update coitem set ' +
          '  coitem_order_id=-1 ' +
          '  coitem_order_type=null ' +
          'where coitem_id=$1;';
    plv8.execute(sql, [OLD.pr_order_id]);
 
    return OLD;
  }

  if (TG_OP === 'INSERT' && NEW.pr_order_type === 'S') {
    sql = 'update coitem set ' +
          '  coitem_order_id=$1 ' +
          '  coitem_order_type=R ' +
          'where coitem_id=$2;';
    plv8.execute(sql, [NEW.pr_id, NEW.pr_order_id]);
  }

  return NEW;

}());

$$ language plv8;

