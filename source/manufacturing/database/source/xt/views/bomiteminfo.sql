select xt.create_view('xt.bomiteminfo', $$

select bomhead_id, bomitem.*, data.booitem_id
from bomitem
  left join bomhead on bomitem_parent_item_id=bomhead_item_id
                   and bomitem_rev_id=bomhead_rev_id
  left join (
    -- Effectively look for the active routings revision
    select booitem_item_id, booitem_id, booitem_seq_id
    from xtmfg.booitem
      join rev on booitem_rev_id=rev_id
    where rev_status = 'A'
    -- If no revision control, -1 is the active
    union all
    select booitem_item_id, booitem_id, booitem_seq_id
    from xtmfg.booitem
    where booitem_rev_id=-1
  ) data on bomitem_booitem_seq_id=booitem_seq_id
        and bomitem_parent_item_id=booitem_item_id

$$, false);

create or replace rule "_INSERT" as on insert to xt.bomiteminfo do instead

insert into bomitem (
  bomitem_id,
  bomitem_parent_item_id,
  bomitem_seqnumber,
  bomitem_item_id,
  bomitem_qtyper,
  bomitem_scrap,
  bomitem_effective,
  bomitem_expires,
  bomitem_createwo,
  bomitem_issuemethod,
  bomitem_schedatwooper,
  bomitem_ecn,
  bomitem_moddate,
  bomitem_subtype,
  bomitem_uom_id,
  bomitem_rev_id,
  bomitem_booitem_seq_id,
  bomitem_char_id,
  bomitem_value,
  bomitem_notes,
  bomitem_ref,
  bomitem_qtyfxd,
  bomitem_issuewo,
  obj_uuid
) values (
  new.bomitem_id,
  (select bomhead_item_id
   from bomhead
   where bomhead_id=new.bomhead_id),
  new.bomitem_seqnumber,
  new.bomitem_item_id,
  new.bomitem_qtyper,
  new.bomitem_scrap,
  new.bomitem_effective,
  new.bomitem_expires,
  new.bomitem_createwo,
  new.bomitem_issuemethod,
  new.bomitem_schedatwooper,
  new.bomitem_ecn,
  current_date,
  new.bomitem_subtype,
  new.bomitem_uom_id,
  (select bomhead_rev_id
   from bomhead
   where bomhead_id=new.bomhead_id),
  (select booitem_seq_id
   from xtmfg.booitem
   where booitem_id=new.booitem_id),
  new.bomitem_char_id,
  new.bomitem_value,
  new.bomitem_notes,
  new.bomitem_ref,
  coalesce(new.bomitem_qtyfxd, 0), 
  coalesce(new.bomitem_issuewo, false),
  new.obj_uuid
);

create or replace rule "_UPDATE" as on update to xt.bomiteminfo do instead

update bomitem set
  bomitem_seqnumber=new.bomitem_seqnumber,
  bomitem_item_id=new.bomitem_item_id,
  bomitem_qtyper=new.bomitem_qtyper,
  bomitem_scrap=new.bomitem_scrap,
  bomitem_effective=new.bomitem_effective,
  bomitem_expires=new.bomitem_expires,
  bomitem_createwo=new.bomitem_createwo,
  bomitem_issuemethod=new.bomitem_issuemethod,
  bomitem_schedatwooper=new.bomitem_schedatwooper,
  bomitem_ecn=new.bomitem_ecn,
  bomitem_moddate=current_date,
  bomitem_subtype=new.bomitem_subtype,
  bomitem_uom_id=new.bomitem_uom_id,
  bomitem_booitem_seq_id=(
   select booitem_seq_id
   from xtmfg.booitem
   where booitem_id=new.booitem_id),
  bomitem_char_id=new.bomitem_char_id,
  bomitem_value=new.bomitem_value,
  bomitem_notes=new.bomitem_notes,
  bomitem_ref=new.bomitem_ref,
  bomitem_qtyfxd=new.bomitem_qtyfxd, 
  bomitem_issuewo=new.bomitem_issuewo
where bomitem_id = old.bomitem_id;

create or replace rule "_DELETE" as on delete to xt.bomiteminfo do instead

delete from bomitem where bomitem_id=old.bomitem_id;
