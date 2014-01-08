select xt.create_view('xt.woinfo', $$

select wo.*,
  wo_number::text || '-' || wo_subnumber::text as wo_name, -- Avoid function here for performance
  woparent_uuid,
  abs(wo_qtyord) as qty,
  itemsite_item_id as item_id,
  itemsite_warehous_id as warehous_id,
  itemsite_leadtime as leadtime,
  case when wo_qtyord > 0 then 'A' else 'D' end as mode,
  wo_postedvalue - wo_wipvalue as received_value,
  case when (wo_qtyrcv > wo_qtyord) then 0 else (wo_qtyord - wo_qtyrcv) end as balance,
  null::numeric AS qty_to_post
from wo
  join itemsite on wo_itemsite_id = itemsite_id
  left join xt.woparent on wo_ordid = woparent_id and woparent_type = wo_ordtype;

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
  new.wo_number,
  new.wo_subnumber,
  new.wo_status,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.warehous_id),
  new.wo_startdate,
  new.wo_duedate,
  (select woparent_type from xt.woparent where woparent_uuid=new.woparent_uuid),
  coalesce((select woparent_id from xt.woparent where woparent_uuid=new.woparent_uuid),-1),
  case when new.mode = 'A' then new.qty else new.qty * -1 end,
  0,
  coalesce(new.wo_adhoc, false),
  0,
  0,
  new.wo_prodnotes,
  coalesce(new.wo_prj_id, -1),
  coalesce(new.wo_priority, 1),
  0,
  coalesce(new.wo_bom_rev_id, -1),
  coalesce(new.wo_boo_rev_id, -1),
  new.wo_cosmethod,
  new.wo_womatl_id,
  coalesce(new.wo_username, geteffectivextuser()),
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
)

returning wo.*,
  null::text,
  null::uuid,
  null::numeric,
  null::integer,
  null::integer,
  null::integer,
  null::text,
  null::numeric,
  null::numeric,
  null::numeric;

create or replace rule "_UPDATE" as on update to xt.woinfo do instead

update wo set
  wo_status = new.wo_status,
  wo_startdate = new.wo_startdate,
  wo_duedate = new.wo_duedate,
  wo_ordtype = (select woparent_type from xt.woparent where woparent_uuid=new.woparent_uuid),
  wo_ordid = (select woparent_id from xt.woparent where woparent_uuid=new.woparent_uuid),
  wo_qtyord = case when old.mode = 'A' then new.qty else new.qty * -1 end,
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
