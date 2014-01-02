select xt.create_view('xt.woinfo', $$

select wo.*,
  wo_number::text || '-' || wo_subnumber::text as wo_name, -- Avoid function here for performance
  itemsite_item_id as wo_item_id,
  itemsite_warehous_id as wo_warehous_id,
  case when (wo_qtyrcv > wo_qtyord) then 0 else (wo_qtyord - wo_qtyrcv) end AS balance,
  null::numeric AS qty_to_post
from wo
  join itemsite on wo_itemsite_id = itemsite_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.woinfo do instead

insert into wo (
  wo_id,
  wo_number,
  wo_subnumber,
  wo_status,
  wo_itemsite_id,
  wo_startdate,
  wo_duedate,
  wo_ordtype,
  wo_ordid,
  wo_qtyord,
  wo_qtyrcv,
  wo_adhoc,
  wo_imported,
  wo_wipvalue,
  wo_postedvalue,
  wo_prodnotes,
  wo_prj_id,
  wo_priority,
  wo_brdvalue,
  wo_bom_rev_id,
  wo_boo_rev_id,
  wo_cosmethod,
  wo_womatl_id,
  wo_username,
  obj_uuid
) values (
  new.wo_id ,
  substring(new.wo_name from 1 for position('-' in new.wo_name) - 1)::integer,
  substring(new.wo_name from position('-' in new.wo_name) + 1 for length(new.wo_name))::integer,
  new.wo_status,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.wo_item_id
    and itemsite_warehous_id=new.wo_warehous_id),
  new.wo_startdate,
  new.wo_duedate,
  new.wo_ordtype,
  new.wo_ordid,
  new.wo_qtyord,
  0,
  new.wo_adhoc,
  false,
  0,
  0,
  new.wo_prodnotes,
  new.wo_prj_id,
  new.wo_priority,
  new.wo_brdvalue,
  new.wo_bom_rev_id,
  new.wo_boo_rev_id,
  new.wo_cosmethod,
  new.wo_womatl_id,
  new.wo_username,
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
);

create or replace rule "_UPDATE" as on update to xt.woinfo do instead

update wo set
  wo_status = new.wo_status,
  wo_startdate = new.wo_startdate,
  wo_duedate = new.wo_duedate,
  wo_ordtype = new.wo_ordtype,
  wo_ordid = new.wo_ordid,
  wo_qtyord = new.wo_qtyord,
  wo_adhoc = new.wo_adhoc,
  wo_prodnotes = new.wo_prodnotes,
  wo_prj_id = new.wo_prj_id,
  wo_priority = new.wo_priority,
  wo_bom_rev_id = new.wo_bom_rev_id,
  wo_boo_rev_id = new.wo_boo_rev_id,
  wo_cosmethod = new.wo_cosmethod,
  wo_womatl_id = new.wo_womatl_id,
  wo_username = new.wo_username
where wo_id = old.wo_id;

create or replace rule "_DELETE" as on delete to xt.woinfo do instead

select deletewo(old.wo_id, true);
