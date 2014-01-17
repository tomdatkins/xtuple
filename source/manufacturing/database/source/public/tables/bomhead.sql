-- add uuid column here because there are views that need this
select xt.add_column('bomhead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('bomhead', 'xt.obj');
select xt.add_constraint('bomhead', 'bomhead_obj_uuid','unique(obj_uuid)', 'public');

-- We're going to require a bom header from now on
insert into bomhead (
  bomhead_item_id, 
  bomhead_docnum, 
  bomhead_revision, 
  bomhead_batchsize, 
  bomhead_rev_id)
select 
  item_id,
  '',
  '',
  1,
  -1
from item
where item_id in (select bomitem_parent_item_id from bomitem)
  and item_id not in (select bomhead_item_id from bomhead);

-- This constraint along with a bomitem foreign key will absolutely enforce it

alter table bomhead add unique (bomhead_item_id, bomhead_rev_id);
