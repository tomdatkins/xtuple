-- Putting strings directly in sql unions is likely to cause performance problems.
-- Sure would like to use xt.ordtype here, but there's already an entry for
-- coitem with type 'SO'. TODO: Make _another_ ordtype table???
select xt.create_view('xt.woparent', $$

  -- SALES ORDER
  select
    coitem_id as woparent_id,
    'S' as woparent_type,
    coitem.obj_uuid as woparent_uuid,
    cohead_number as woparent_number
  from coitem
    join cohead on coitem_cohead_id=cohead_id

  union all

  -- WORK ORDER
  select
    wo_id,
    'W',
    obj_uuid as ord_uuid,
    formatwonumber(wo_id)
  from wo

$$);
