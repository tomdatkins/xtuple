select xt.create_view('xt.activeorder', $$

/*** TRANSFER ORDERS ***/
select 
  tohead_id as id,
  tohead.obj_uuid as uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  tohead_number as number,
  tohead_status as status,
  toitem_item_id as item_id,
  tohead_dest_warehous_id as warehous_id,
  tohead_srcname as source,
  'I' as source_type,
  tohead_destname as destination,
  'I' as destination_type,
  toitem_schedrecvdate as duedate,
  toitem_stdcost * toitem_qty_ordered as value,
  toitem_qty_ordered as ordered,
  toitem_qty_received as fulfilled,
  noneg(toitem_qty_ordered - toitem_qty_received) as balance,
  tohead_ordercomments as notes
from tohead
  join toitem on tohead_id=toitem_tohead_id
  join pg_class c on tohead.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where toitem_status not in ('C', 'X')
  and tohead_status not in ('C', 'X')
  and toitem_qty_ordered > toitem_qty_received

union

select 
  tohead_id,
  tohead.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  tohead_number,
  tohead_status as status,
  toitem_item_id,
  tohead_src_warehous_id,
  tohead_destname as source,
  'I' as source_type,
  tohead_srcname as destination,
  'I' as destination_type,
  toitem_duedate,
  toitem_stdcost * toitem_qty_ordered,
  toitem_qty_ordered,
  toitem_qty_shipped,
  -1 * noneg(toitem_qty_ordered - toitem_qty_shipped - qtyatshipping('TO', toitem_id)) as balance,
   tohead_ordercomments
from tohead
  join toitem on toitem_tohead_id=tohead_id
  join pg_class c on tohead.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where toitem_status not in ('C', 'X')
  and tohead_status not in ('C', 'X')

union

/*** WORK ORDERS ***/
select
  wo_id,
  wo.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  formatwonumber(wo_id),
  wo_status as status,  
  itemsite_item_id,
  itemsite_warehous_id,
  item_number as source,
  'M' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  wo_duedate as duedate,
  itemcost(wo_itemsite_id) * wo_qtyord as amount,
  wo_qtyord,
  wo_qtyrcv,
  noneg(wo_qtyord - wo_qtyrcv) as balance,
  wo_prodnotes as notes
from wo
  join itemsite on wo_itemsite_id=itemsite_id
  join item on itemsite_item_id=item_id
  join whsinfo on itemsite_warehous_id=warehous_id
  join pg_class c on wo.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where wo_status<>'C'
  and item_type not in ('C', 'Y')

union

-- Tools on work orders to be returned
select 
  wo_id,
  wo.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  formatwonumber(wo_id),
  wo_status as status,
  itemsite_item_id,
  itemsite_warehous_id,
  item_number as source,
  'M' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  wo_duedate,
  womatl_cost * womatl_qtyreq,
  womatl_qtyreq as qtyordered,
  coalesce(sum(abs(invhist_invqty)),0) as qtyreceived,
  noneg(womatl_qtyreq - coalesce(sum(abs(invhist_invqty)),0)) as balance,
  wo_prodnotes as notes
from womatl
  join wo on wo_id=womatl_wo_id
  join itemsite on womatl_itemsite_id=itemsite_id
  join whsinfo on itemsite_warehous_id=warehous_id
  join item on itemsite_item_id=item_id
  join pg_class c on wo.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
  left outer join womatlpost on womatl_id=womatlpost_womatl_id
  left outer join invhist on womatlpost_invhist_id=invhist_id
    and invhist_invqty < 0
where wo_status<>'C'
  and  item_type = 'T'
group by wo_id, wo_duedate, item_number, womatl_qtyreq,
  womatl_cost, wo_prodnotes, itemsite_item_id, itemsite_warehous_id,
  warehous_code, ordhead_type

/* This breeder functionality will require us to eventually build a trigger generated union query
union

select 
  wo_id,
  wo.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  formatwonumber(wo_id),
  wo_status as status,
  itemsite_item_id,
  itemsite_warehous_id,
  ??,
  ??,
  wo_duedate as duedate,
  itemcost(wo_itemsite_id) * wo_qtyord * brddist_stdqtyper,
  wo_qtyord * brddist_stdqtyper,
  wo_qtyrcv * brddist_stdqtyper,
  noneg((wo_qtyord - wo_qtyrcv) * brddist_stdqtyper) as balance,
  wo_prodnotes as notes
from xtmfg.brddist
  join wo on brddist_wo_id=wo_id
  join itemsite on wo_itemsite_id=itemsite_id and brddist_itemsite_id=itemsite_id
  join item on itemsite_item_id=item_id
  join pg_class c on wo.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where wo_status<>'C'
  and brddist_itemsite_id=itemsite_id
  and item_type in ('C', 'Y')
*/
union

select
  wo_id,
  wo.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  formatwonumber(wo_id),
  wo_status as status,
  womatlis.itemsite_item_id,
  womatlis.itemsite_warehous_id,
  warehous_code as source,
  'I' as source_type,
  woi.item_number as destination,
  'M' as destination_type,
  womatl_duedate as duedate,
  itemcost(womatl_itemsite_id) * itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, womatl_qtyreq) as value,
  itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, womatl_qtyreq) as ordered,
  itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, womatl_qtyiss) as fulfilled,
  itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, (noNeg(womatl_qtyreq - womatl_qtyiss) * -1)) as balance,
  wo_prodnotes as notes
from womatl
  join wo on  womatl_wo_id=wo_id
  join itemsite wois on wo_itemsite_id=wois.itemsite_id
  join item woi on wois.itemsite_item_id=woi.item_id
  join itemsite womatlis on womatl_itemsite_id=womatlis.itemsite_id
  join whsinfo on womatlis.itemsite_warehous_id=warehous_id
  join item womatli on  womatlis.itemsite_item_id=womatli.item_id
  join pg_class c on wo.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where wo_status<>'C'
  and womatli.item_type != 'T'

union

-- Special handling for tools
select
  wo_id,
  wo.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  formatwonumber(wo_id),
  wo_status as status,
  womatlis.itemsite_item_id,
  womatlis.itemsite_warehous_id,
  woi.item_number as source,
  'M' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  womatl_duedate as duedate,
  womatl_cost * itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, womatl_qtyreq) as value,
  itemuomtouom(womatlis.itemsite_item_id, womatl_uom_id, null, womatl_qtyreq) as ordered,
  coalesce(sum(invhist_invqty),0) as fulfilled,
  itemuomtouom(
    womatlis.itemsite_item_id, womatl_uom_id, null,
    (noneg(womatl_qtyreq))) - coalesce(sum(invhist_invqty),0) * -1 as balance,
   wo_prodnotes as notes
from womatl
  join wo on  womatl_wo_id=wo_id
  join itemsite wois on wo_itemsite_id=wois.itemsite_id
  join item woi on wois.itemsite_item_id=woi.item_id
  join itemsite womatlis on womatl_itemsite_id=womatlis.itemsite_id
  join whsinfo on womatlis.itemsite_warehous_id=warehous_id
  join item womatli on  womatlis.itemsite_item_id=womatli.item_id
  join pg_class c on wo.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
  left outer join womatlpost on womatl_id=womatlpost_womatl_id
  left outer join invhist on womatlpost_invhist_id=invhist_id
    and invhist_invqty > 0
where wo_status<>'C'
  and womatli.item_type = 'T'
group by wo_id, woi.item_number, womatl_id, womatl_duedate,
  womatlis.itemsite_item_id, womatl_uom_id, womatl_qtyreq, 
  womatl_cost, wo_prodnotes, womatlis.itemsite_item_id,
  womatlis.itemsite_warehous_id, warehous_code, ordhead_type

union

/*** PURCHASE ORDERS ***/
select
  pohead_id,
  pohead.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  pohead_number,
  pohead_status as status,
  itemsite_item_id,
  itemsite_warehous_id,
  vend_number as source,
  'V' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  poitem_duedate,
  poitem_unitprice * poitem_qty_ordered as value,
  poitem_qty_ordered * poitem_invvenduomratio as ordered,
  noneg(poitem_qty_received - poitem_qty_returned) * poitem_invvenduomratio as fulfilled,
  noNeg(poitem_qty_ordered - poitem_qty_received) * poitem_invvenduomratio as balance,
  pohead_comments as notes
from pohead
  join poitem on poitem_pohead_id=pohead_id
  join vendinfo on vend_id=pohead_vend_id
  join itemsite on poitem_itemsite_id=itemsite_id
  join whsinfo on warehous_id=itemsite_warehous_id
  join pg_class c on pohead.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where poitem_status <> 'C'

union

/*** SALES ORDERS ***/
select
  cohead_id,
  cohead.obj_uuid,
  ordtype_code as ordhead_type,
  null as plan_type,
  cohead_number,
  cohead_status as status,
  itemsite_item_id,
  itemsite_warehous_id,
  warehous_code as source,
  'I' as source_type,
  cust_number as destination,
  'C' as destination_type,
  coitem_scheddate as duedate,
  coitem_price * coitem_qtyord as amount,
  coitem_qtyord * coitem_qty_invuomratio as ordered,
  coitem_qty_invuomratio * (coitem_qtyshipped - coitem_qtyreturned + qtyatshipping(coitem_id)) as fulfilled,
  coitem_qty_invuomratio *
    noneg(coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned - qtyatshipping(coitem_id)) * -1 as balance,
  cohead_ordercomments as notes
from coitem
  join cohead on cohead_id=coitem_cohead_id
  join custinfo on cust_id=cohead_cust_id
  join itemsite on itemsite_id=coitem_itemsite_id
  join whsinfo on warehous_id=itemsite_warehous_id
  join item on item_id=itemsite_item_id
  join pg_class c on cohead.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where coitem_status='O'

union

/*** PLANNED ORDERS ***/
select
  planord_id,
  planord.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  itemsite_item_id,
  itemsite_warehous_id,
  '' as source,
  'V' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  planord_duedate as duedate,
  itemcost(planord_itemsite_id) * planord_qty as amount,
  planord_qty,
  0,
  planord_qty,
  planord_comments as notes
from planord
  join itemsite on itemsite_id=planord_itemsite_id
  join whsinfo on warehous_id=itemsite_warehous_id
  join item on itemsite_item_id=item_id
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where planord_type='P'

union

select
  planord_id,
  planord.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  itemsite_item_id,
  itemsite_warehous_id,
  item_number as source,
  'M' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  planord_duedate as duedate,
  itemcost(planord_itemsite_id) * planord_qty,
  planord_qty,
  0,
  planord_qty,
  planord_comments as notes
from planord
  join itemsite on itemsite_id=planord_itemsite_id
  join item on itemsite_item_id=item_id
  join whsinfo on itemsite_warehous_id=warehous_id
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where planord_type='W'

union

-- Tools on Planned Work Orders
select 
  planord_id,
  planord.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  ris.itemsite_item_id,
  ris.itemsite_warehous_id,
  item_number as source,
  'M' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  planord_duedate as duedate,
  itemcost(planreq_itemsite_id) * planreq_qty,
  planreq_qty,
  0,
  planreq_qty,
  planord_comments
from planreq
  join itemsite ris on ris.itemsite_id=planreq_itemsite_id
  join planord on planreq_source_id=planord_id and planreq_source='P'
  join itemsite wis on wis.itemsite_id=planord_itemsite_id
  join item on item_id=wis.itemsite_item_id
  join whsinfo on wis.itemsite_warehous_id=warehous_id
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where item_type='T'

union

select
  planord_id,
  planord.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  itemsite.itemsite_item_id,
  itemsite.itemsite_warehous_id,
  whsinfo.warehous_code as source,
  'I' as source_type,
  srcwhsinfo.warehous_code as destination,
  'I' as destination_type,
  planord_duedate as duedate,
  itemcost(planord_itemsite_id) * planord_qty,
  planord_qty,
  0 qtyreceived,
  planord_qty,
  planord_comments
from planord
  join itemsite on itemsite.itemsite_id=planord_itemsite_id
  join whsinfo on whsinfo.warehous_id=itemsite.itemsite_warehous_id
  join itemsite srcitemsite on srcitemsite.itemsite_id=planord_supply_itemsite_id
  join whsinfo srcwhsinfo on srcwhsinfo.warehous_id=srcitemsite.itemsite_warehous_id
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where planord_type='T'

union

select 
  planord_id,
  planord.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  srcitemsite.itemsite_item_id,
  srcitemsite.itemsite_warehous_id,
  srcwhsinfo.warehous_code as source,
  'I' as source_type,
  whsinfo.warehous_code as destination,
  'I' as destination_type,
  planord_duedate as duedate,
  itemcost(planord_itemsite_id) * planord_qty,
  planord_qty,
  0 as qtyreceived,
  planord_qty * -1,
  planord_comments
from planord
  join itemsite on (itemsite.itemsite_id=planord_itemsite_id)
  join whsinfo on (whsinfo.warehous_id=itemsite.itemsite_warehous_id)
  join itemsite srcitemsite on (srcitemsite.itemsite_id=planord_supply_itemsite_id)
  join whsinfo srcwhsinfo on (srcwhsinfo.warehous_id=srcitemsite.itemsite_warehous_id)
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where planord_type='T'

union

select 
  planreq_id,
  planreq.obj_uuid,
  ordtype_code as ordhead_type,
  planord_type,
  planord_number::text,
  case when planord_firm then 'F' else 'P' end,
  ris.itemsite_item_id,
  ris.itemsite_warehous_id,
  warehous_code as source,
  'I' as source_type,
  wi.item_number as destination,
  'M' as destination_type,
  planord_startdate as duedate,
  itemCost(planreq_itemsite_id) * planreq_qty,
  planreq_qty,
  0,
  planreq_qty * -1,
  planreq_notes
from planreq
  join planord on planreq_source_id=planord_id
  join itemsite ris on planreq_itemsite_id=ris.itemsite_id
  join item ri on ris.itemsite_item_id=ri.item_id
  join itemsite wis on planord_itemsite_id=wis.itemsite_id
  join item wi on wis.itemsite_item_id=wi.item_id
  join whsinfo on warehous_id=ris.itemsite_warehous_id
  join pg_class c on planord.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname
where planreq_source='P'

union

/*** PURCHASE REQUESTS ***/
select pr_id,
  pr.obj_uuid,
  ordtype_code as ordhead_type,
  null,
  pr_number::text || '-' || pr_subnumber::text,
  'Q', 
  itemsite_item_id,
  itemsite_warehous_id,      
  '' as source,
  'V' as source_type,
  warehous_code as destination,
  'I' as destination_type,
  pr_duedate,
  itemcost(pr_itemsite_id) * pr_qtyreq,
  pr_qtyreq,
  0 ,
  pr_qtyreq,
  pr_releasenote
from pr
  join itemsite on pr_itemsite_id=itemsite_id
  join whsinfo on itemsite_warehous_id=warehous_id
  join item on itemsite_item_id=item_id
  join pg_class c on pr.tableoid = c.oid
  join xt.ordtype on ordtype_tblname=relname

$$);

