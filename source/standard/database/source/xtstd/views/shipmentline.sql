select xt.create_view('xtstd.shipmentline', $$

  select 
    shipitem_shiphead_id as shiphead_id,
    coitem.obj_uuid as obj_uuid,
    coalesce(sum(shipitem_qty)) as quantity
  from coitem
    left join (
      select shipitem_orderitem_id,
        shipitem_shiphead_id,
        shipitem_qty
      from shipitem
        join shiphead on shipitem_shiphead_id=shiphead_id
      where shiphead_order_type='SO')
      shipitem on shipitem_orderitem_id=coitem_id
  group by shipitem_shiphead_id,
    coitem.obj_uuid
  union all
  select 
    shipitem_shiphead_id as shiphead_id,
    toitem.obj_uuid as obj_uuid,
    coalesce(sum(shipitem_qty)) as quantity
  from toitem
    left join (
      select shipitem_orderitem_id,
        shipitem_shiphead_id,
        shipitem_qty
      from shipitem
        join shiphead on shipitem_shiphead_id=shiphead_id
      where shiphead_order_type='TO')
      shipitem on shipitem_orderitem_id=toitem_id
  group by shipitem_shiphead_id,
    toitem.obj_uuid; 

$$, true);
