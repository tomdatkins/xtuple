-- add uuid column here because there are views that need this
select xt.add_column('boohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xtmfg');
select xt.add_inheritance('xtmfg.boohead', 'xt.obj');
select xt.add_constraint('boohead', 'boohead_obj_uuid_id','unique(obj_uuid)', 'xtmfg');

-- We're going to require a boo header from now on
insert into xtmfg.boohead (
  boohead_item_id, 
  boohead_docnum, 
  boohead_revision, 
  boohead_leadtime,
  boohead_final_location_id, 
  boohead_closewo,
  boohead_rev_id)
select 
  item_id,
  '',
  '',
  1,
  -1,
  false,
  -1
from item
where item_id in (select booitem_item_id from xtmfg.booitem)
  and item_id not in (select boohead_item_id from xtmfg.boohead);

-- This constraint along with a bomitem foreign key will absolutely enforce it

alter table xtmfg.boohead add unique (boohead_item_id, boohead_rev_id);
