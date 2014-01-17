select xt.create_view('xt.toiteminfo', $$

select *
from toitem

$$, false);

create or replace rule "_INSERT" as on insert to xt.toiteminfo do instead

insert into toitem (
  toitem_id,
  toitem_tohead_id,
  toitem_linenumber,
  toitem_item_id,
  toitem_status,
  toitem_duedate,
  toitem_schedshipdate,
  toitem_schedrecvdate,
  toitem_qty_ordered,
  toitem_qty_shipped,
  toitem_qty_received,
  toitem_uom,
  toitem_stdcost,
  toitem_prj_id,
  toitem_freight,
  toitem_freight_curr_id,
  toitem_notes,
  toitem_closedate,
  toitem_close_username,
  toitem_lastupdated,
  toitem_created,
  toitem_creator,
  toitem_freight_received,
  obj_uuid
) values (
  new.toitem_id,
  new.toitem_tohead_id,
  new.toitem_linenumber,
  new.toitem_item_id,
  new.toitem_status,
  new.toitem_schedshipdate, -- not a bug
  new.toitem_schedshipdate,
  new.toitem_schedrecvdate,
  new.toitem_qty_ordered,
  0,
  0,
  new.toitem_uom,
  new.toitem_stdcost,
  new.toitem_prj_id,
  coalesce(new.toitem_freight, 0),
  coalesce(new.toitem_freight_curr_id, basecurrid()),
  new.toitem_notes,
  new.toitem_closedate,
  new.toitem_close_username,
  now(),
  now(),
  geteffectivextuser(),
  0,
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
);

create or replace rule "_UPDATE" as on update to xt.toiteminfo do instead

update toitem set
  toitem_linenumber=new.toitem_linenumber,
  toitem_item_id=new.toitem_item_id,
  toitem_status=new.toitem_status,
  toitem_duedate=new.toitem_schedshipdate,
  toitem_schedshipdate=new.toitem_schedshipdate,
  toitem_schedrecvdate=new.toitem_schedrecvdate,
  toitem_qty_ordered=new.toitem_qty_ordered,
  toitem_uom=new.toitem_uom,
  toitem_stdcost=new.toitem_stdcost,
  toitem_prj_id=new.toitem_prj_id,
  toitem_freight=new.toitem_freight,
  toitem_freight_curr_id=new.toitem_freight_curr_id
where toitem_id = old.toitem_id;

create or replace rule "_DELETE" as on delete to xt.toiteminfo do instead

delete from toitem where toitem_id = old.toitem_id;
