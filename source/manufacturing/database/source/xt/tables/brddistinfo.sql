select xt.create_view('xt.brddistinfo', $$

select brddist.*,
  itemsite_item_id as item_id,
  itemsite_warehous_id as warehous_id
from xtmfg.brddist
  join itemsite on brddist_itemsite_id = itemsite_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.brddistinfo do instead

insert into xtmfg.brddist (
  brddist_id,
  brddist_wo_id,
  brddist_wo_qty,
  brddist_itemsite_id,
  brddist_stdqtyper,
  brddist_qty,
  brddist_posted,
  obj_uuid
) values (
  new.brddist_id,
  new.brddist_wo_id,
  0,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.warehous_id),
  new.brddist_stdqtyper,
  0,
  false,
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
)

returning brddist.*,
  null::integer,
  null::integer;

create or replace rule "_UPDATE" as on update to xt.brddistinfo do instead

update xtmfg.brddist set
  brddist_wo_qty=new.brddist_wo_qty,
  brddist_stdqtyper=new.brddist_stdqtyper,
  brddist_qty=new.brddist_qty,
  brddist_posted=new.brddist_posted
where brddist_id = old.brddist_id;

create or replace rule "_DELETE" as on delete to xt.brddistinfo do instead

delete from xtmfg.brddist where brddist_id=old.brddist_id;
