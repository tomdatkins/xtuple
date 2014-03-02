select xt.create_view('xt.planordinfo', $$

select planord.*,
  itemsite.itemsite_item_id as item_id,
  itemsite.itemsite_warehous_id as warehous_id,
  itemsite.itemsite_plancode_id as plancode_id,
  planord_duedate - planord_startdate as leadtime,
  supply.itemsite_warehous_id as supply_warehous_id
from planord
  join itemsite on planord_itemsite_id = itemsite_id
  left join itemsite supply on planord_supply_itemsite_id=supply.itemsite_id

$$, false);

create or replace rule "_INSERT" as on insert to xt.planordinfo do instead

insert into planord (
  planord_id,
  planord_type,
  planord_itemsite_id,
  planord_duedate,
  planord_qty,
  planord_firm,
  planord_comments,
  planord_number,
  planord_subnumber,
  planord_startdate,
  planord_planord_id,
  planord_mps,
  planord_pschitem_id,
  planord_supply_itemsite_id,
  obj_uuid
) values (
  new.planord_id,
  new.planord_type,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.warehous_id),
  new.planord_duedate,
  new.planord_qty,
  new.planord_firm,
  new.planord_comments,
  new.planord_number,
  new.planord_subnumber,
  new.planord_startdate,
  coalesce(new.planord_planord_id, -1),
  false,
  new.planord_pschitem_id,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.supply_warehous_id),
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
);

create or replace rule "_UPDATE" as on update to xt.planordinfo do instead

update planord set
  planord_type=new.planord_type,
  planord_itemsite_id=
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.warehous_id),
  planord_duedate=new.planord_duedate,
  planord_qty=new.planord_qty,
  planord_firm=new.planord_firm,
  planord_comments=new.planord_comments,
  planord_number=new.planord_number,
  planord_subnumber=new.planord_subnumber,
  planord_startdate=new.planord_startdate,
  planord_planord_id=new.planord_planord_id,
  planord_mps=new.planord_mps,
  planord_pschitem_id=new.planord_pschitem_id,
  planord_supply_itemsite_id=(
   select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.supply_warehous_id)
where planord_id = old.planord_id;

create or replace rule "_DELETE" as on delete to xt.planordinfo do instead

delete from planord where planord_id=old.planord_id;
