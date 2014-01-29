create or replace function xt.womatl_explode_phantom(womatl_id integer) returns void volatile as $$

(function () {

  /* If the item on the work order material in question is a phantom, then explode and replace it. */
  var sql = "select wo_startdate " +
            "from wo " +
            "  join womatl on wo_id=womatl_wo_id " +
            "  join itemsite on womatl_itemsite_id=itemsite_id" +
            "  join item on itemsite_item_id=item_id " +
            "where item_type='F' " +
            " and womatl_id=$1; ",
    query = plv8.execute(sql, [womatl_id]),
    effectiveDate,
    row;

  if (!query.length) { return; }

  row = query[0];
  effectiveDate = plv8.execute("select woeffectivedate($1::date) as effdate;", [row.wo_startdate])[0].effdate;

  sql = "insert into womatl " +
        "( womatl_wo_id, womatl_itemsite_id, womatl_wooper_id, " +
        "  womatl_schedatwooper, womatl_duedate, " +
        "  womatl_uom_id, womatl_qtyfxd, womatl_qtyper, womatl_scrap, " +
        "  womatl_qtyreq, " +
        "  womatl_qtyiss, womatl_qtywipscrap, " +
        "  womatl_lastissue, womatl_lastreturn, " +
        "  womatl_cost, womatl_picklist, womatl_createwo, " +
        "  womatl_issuemethod, womatl_notes, womatl_ref ) " +
        "select wo_id, cs.itemsite_id, womatl_wooper_id, " +
        "  womatl_schedatwooper, womatl_duedate, " +
        "  bomitem_uom_id, bomitem_qtyfxd, (bomitem_qtyper * womatl_qtyper), bomitem_scrap, " +
        "  roundQty(itemuomfractionalbyuom(bomitem_item_id, bomitem_uom_id), " +
        "         ((bomitem_qtyfxd + wo_qtyord * bomitem_qtyper) * womatl_qtyper * (1 + bomitem_scrap))), " +
        "  0, 0, startOfTime(), startOfTime(), " +
        "  0, ci.item_picklist, ( (ci.item_type='M') AND (bomitem_createwo) ), " +
        "  bomitem_issuemethod, bomitem_notes, bomitem_ref " +
        "from wo, womatl, bomitem, " +
        "  itemsite as cs, itemsite  ps, " +
        "  item AS ci, item AS pi " +
        "where ( (womatl_itemsite_id=ps.itemsite_id) " +
        "and (womatl_wo_id=wo_id) " +
        "and (bomitem_parent_item_id=pi.item_id) " +
        "and (bomitem_item_id=ci.item_id) " +
        "and (ps.itemsite_warehous_id=cs.itemsite_warehous_id) " +
        "and (cs.itemsite_item_id=ci.item_id) " +
        "and (ps.itemsite_item_id=pi.item_id) " +
        "and ($2 between bomitem_effective and (bomitem_expires - 1)) " +
        "and (womatl_id=$1) ); ";
  query = plv8.execute(sql, [womatl_id, effectiveDate]);
  
  sql = "delete from womatl where womatl_id=$1;"
  plv8.execute(sql, [womatl_id]);
}());

$$ language plv8;
