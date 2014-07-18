select xt.install_js('XM','Billing','billing', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Billing) { XM.Billing = {}; }

  /**
    Returns a list of UUIDs of any lines in this invoice/return that have itemsites under 
    inventory control
 
    @param {String} Return number
  */  
  XM.Billing.getControlledLines = function (docUuid) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var sql1 = "select t.ordtype_code as ordtype_code, " +
           "case when t.ordtype_code = 'IN' then 'invc' " + 
           "  when t.ordtype_code = 'CM' then 'cm' end as ordtype_tblname_stem " + 
           "from xt.obj_uuid as o " +
           "  join xt.ordtype as t on o.tblname = t.ordtype_tblname " +
           "where obj_uuid = $1;";

    var qtyColName,
      itemSiteJoin,
      ordType = plv8.execute(sql1, [docUuid])[0];

    if (ordType.ordtype_code === 'IN') {
      qtyColName = "invcitem_billed";
      itemSiteJoin = "invcitem_item_id = itemsite_item_id AND invcitem_warehous_id = itemsite_warehous_id ";
    } else if (ordType.ordtype_code === 'CM') {
      qtyColName = "cmitem_qtyreturned";
      itemSiteJoin = "cmitem_itemsite_id = itemsite_id ";
    }
      
    plv8.elog(NOTICE, qtyColName);  
    var sql2 = "select {tableNameStem}item.obj_uuid as uuid, {qtyColName} as quantity, " +
      "case when itemsite_loccntrl = true or itemsite_controlmethod in ('S', 'L') " + 
      "then true else false end as invctrl " + 
      "from {tableNameStem}head " + 
      "inner join {tableNameStem}item on {tableNameStem}head_id = {tableNameStem}item_{tableNameStem}head_id " + 
      "inner join itemsite on {itemSiteJoin} " +
      "where {tableNameStem}item_updateinv = true " + 
      "and {tableNameStem}head.obj_uuid = $1";

    plv8.elog(NOTICE, itemSiteJoin);
    return plv8.execute(sql2.replace(/{tableNameStem}/g, ordType.ordtype_tblname_stem).replace(/{qtyColName}/g, qtyColName).replace(/{itemSiteJoin}/g, itemSiteJoin), [docUuid]).map(function (row) {
      plv8.elog(NOTICE, row.quantity);
      return {uuid: row.uuid, quantity: row.quantity, invControl: row.invctrl};
    });
  };

}());

$$ );
