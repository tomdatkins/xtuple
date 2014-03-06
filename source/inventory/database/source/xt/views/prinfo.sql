select xt.create_view('xt.prinfo', $$

select pr.*,
  pr_number::text || '-' || pr_subnumber::text as pr_name, -- Avoid function here for performance
  prparent_uuid,
  itemsite_item_id as item_id,
  itemsite_warehous_id as warehous_id,
  itemsite_plancode_id as plancode_id
from pr
  join itemsite on pr_itemsite_id = itemsite_id
  left join xt.prparent on pr_order_id = prparent_id and prparent_type = pr_order_type;

$$, false);

create or replace rule "_INSERT" as on insert to xt.prinfo do instead

insert into pr (
  pr_id,
  pr_number,
  pr_subnumber,
  pr_status,
  pr_order_type,
  pr_order_id,
  pr_poitem_id,
  pr_duedate,
  pr_itemsite_id,
  pr_qtyreq,
  pr_prj_id,
  pr_releasenote,
  pr_createdate,
  obj_uuid
) values (
  new.pr_id,
  new.pr_number,
  new.pr_subnumber,
  'O',
  new.pr_order_type,
  (select prparent_id from xt.prparent where prparent_uuid=new.prparent_uuid),
  new.pr_poitem_id,
  new.pr_duedate,
  (select itemsite_id
   from itemsite
   where itemsite_item_id=new.item_id
    and itemsite_warehous_id=new.warehous_id),
  new.pr_qtyreq,
  new.pr_prj_id,
  new.pr_releasenote,
  coalesce(new.pr_createdate, now()),
  coalesce(new.obj_uuid, xt.uuid_generate_v4())
)

returning pr.*,
  null::text,
  null::uuid,
  null::integer,
  null::integer,
  null::integer;

create or replace rule "_UPDATE" as on update to xt.prinfo do instead

update pr set
  pr_status=new.pr_status,
  pr_poitem_id=new.pr_poitem_id,
  pr_duedate=new.pr_duedate,
  pr_qtyreq=new.pr_qtyreq,
  pr_prj_id=new.pr_prj_id,
  pr_releasenote=new.pr_releasenote
where pr_id = old.pr_id;

create or replace rule "_DELETE" as on delete to xt.prinfo do instead

delete from pr where pr_id=old.pr_id;
