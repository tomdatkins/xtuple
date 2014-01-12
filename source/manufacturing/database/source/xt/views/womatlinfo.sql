select xt.create_view('xt.womatlinfo', $$

select womatl.*,
  itemsite_item_id as womatl_item_id
from womatl
  join itemsite on womatl_itemsite_id=itemsite_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.womatlinfo do instead (

insert into womatl (
  womatl_id,
  womatl_wo_id,
  womatl_itemsite_id,
  womatl_qtyper,
  womatl_scrap,
  womatl_qtyreq,
  womatl_qtyiss,
  womatl_qtywipscrap,
  womatl_lastissue,
  womatl_lastreturn,
  womatl_cost,
  womatl_picklist,
  womatl_status,
  womatl_imported,
  womatl_createwo,
  womatl_issuemethod,
  womatl_wooper_id,
  womatl_bomitem_id,
  womatl_duedate,
  womatl_schedatwooper,
  womatl_uom_id,
  womatl_notes,
  womatl_ref,
  womatl_scrapvalue,
  womatl_qtyfxd,
  womatl_issuewo,
  womatl_price,
  obj_uuid
) values (
  new.womatl_id,
  new.womatl_wo_id,
  (select m.itemsite_id
   from wo, itemsite w, itemsite m
   where wo_id=new.womatl_wo_id
     and w.itemsite_id=wo_itemsite_id
     and m.itemsite_item_id=new.womatl_item_id
     and m.itemsite_warehous_id=w.itemsite_warehous_id),
  new.womatl_qtyper,
  0,
  new.womatl_qtyreq,
  0,
  0,
  startoftime(),
  startoftime(),
  new.womatl_cost,
  new.womatl_picklist,
  new.womatl_status,
  false,
  new.womatl_createwo,
  new.womatl_issuemethod,
  new.womatl_wooper_id,
  new.womatl_bomitem_id,
  new.womatl_duedate,
  new.womatl_schedatwooper,
  new.womatl_uom_id,
  new.womatl_notes,
  new. womatl_ref,
  0,
  coalesce(new.womatl_qtyfxd, 0),
  coalesce(new.womatl_issuewo, false),
  coalesce(new.womatl_price, 0),
  new.obj_uuid
);

-- Would have been nice for this to have been a trigger,
-- but that would cause problems for the Desktop client.;
select xt.womatl_explode_phantom(new.womatl_id);

);

create or replace rule "_UPDATE" as on update to xt.womatlinfo do instead

update womatl set
  womatl_qtyper=new.womatl_qtyper,
  womatl_scrap=new.womatl_scrap,
  womatl_qtyreq=new.womatl_qtyreq,
  womatl_cost=new.womatl_cost,
  womatl_picklist=new.womatl_picklist,
  womatl_status=new.womatl_status,
  womatl_createwo=new.womatl_createwo,
  womatl_issuemethod=new.womatl_issuemethod,
  womatl_wooper_id=new.womatl_wooper_id,
  womatl_bomitem_id=new.womatl_bomitem_id,
  womatl_duedate=new.womatl_duedate,
  womatl_schedatwooper=new.womatl_schedatwooper,
  womatl_uom_id=new.womatl_uom_id,
  womatl_notes=new.womatl_notes,
  womatl_ref=new.womatl_ref,
  womatl_scrapvalue=new.womatl_scrapvalue,
  womatl_qtyfxd=new.womatl_qtyfxd,
  womatl_issuewo=new.womatl_issuewo,
  womatl_price=new.womatl_price
where womatl_id = old.womatl_id;

create or replace rule "_DELETE" as on delete to xt.womatlinfo do instead

select deleteWoMaterial(old.womatl_id);
