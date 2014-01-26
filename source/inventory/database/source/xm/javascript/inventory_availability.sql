select xt.install_js('XM','InventoryAvailability','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.InventoryAvailability) { XM.InventoryAvailability = {}; }

  XM.InventoryAvailability.isDispatchable = true;

  /**
    Returns inventory availability records using usual query means with additional special support
    to calculate availability based on an attribute "lookAhead" that may be one of the folling:
      * byLeadTime: (default) Calculate inside the Item Site lead time.
      * byDays: Calculate inside the number of days specified. Requires a 'days' parameter.
      * byDate: Calculate between the current date and the date passed. Requires 'endDate' parameter.
      * byDates: Calculate between two dates. Must also include 'startDate' and 'endDate' parameters.

    @param {Object} Query filter including at least one of the above options
    @returns {Array}
  */
  XM.InventoryAvailability.fetch = function (query) {
    query = query || {};
    var limit = query.rowLimit ? 'limit ' + Number(query.rowLimit) : '',
      offset = query.rowOffset ? 'offset ' + Number(query.rowOffset) : '',
      days,
      clause,
      params = [],
      vendorId = null,
      vendorTypeId = null,
      vendorTypePattern = null,
      rows,
      i = 1,
      ids = [],
      sql = 'select id ' +
            '   from xm.inventory_availability ' +
            '   where {conditions} ',
      sql2 = 'select *, noneg("onHand" - allocated) as unallocated, ' +
             ' ("onHand" - allocated + ordered) AS available ' +
             'from ( ' +
             '  select uuid, item, site, "itemType", description1, description2, ' +
             '    "classCode", "inventoryUnit", "leadTime", "useParameters", ' +
             '    "reorderLevel", "orderTo", "onHand",' +
             '    qtyallocated(id, {days}) AS allocated, ' +
             '    qtyordered(id, {days}) AS ordered, '  +
             '    qtypr(id, {days}) AS requests ' +
             '  from xm.inventory_availability where id in ({ids})' +
             ') data {orderBy}';

    /* Make sure we can do this */
    if (!XT.Data.checkPrivilege("ViewInventoryAvailability")) {
      throw new handleError("Access Denied", 401);
    }

    /* Handle special parameters */
    if (query.parameters) {
      query.parameters = query.parameters.filter(function (param) {
        var obj;

        switch (param.attribute)
        {
        case "lookAhead":
          switch (param.value)
          {
          case "byLeadTime":
            days = '"leadTime"';
            break;
          case "byDays":
            days = "${p1}::integer";
            obj = query.parameters.findProperty("attribute", "days");
            params.push(obj.value);
            pcount = 1;
            break;
          case "byDate":
            days = "${p1}::date - current_date";
            obj = query.parameters.findProperty("attribute", "endDate");
            params.push(obj.value);
            break;
          case "byDates":
            days = "${p1}::date, ${p2}::date";
            obj = query.parameters.findProperty("attribute", "startDate");
            params.push(obj.value);
            obj = query.parameters.findProperty("attribute", "endDate");
            params.push(obj.value);
            break;
          }
          return false;
        case "vendor":
          vendorId = XT.Data.getId(XT.Orm.fetch('XM', 'VendorRelation'), param.value);
          return false;
        case "vendorType":
          vendorTypeId = XT.Data.getId(XT.Orm.fetch('XM', 'VendorType'), param.value);
          return false;
        case "vendorType.code":
          vendorTypePattern = param.value;
        case "startDate":
        case "endDate":
        case "days":
        case "showShortages":
          return false;
        }
        
        return true;
      })
    }

    if (!days) {days = '"leadTime"';}

    clause = XT.Data.buildClause(
      "XM", "InventoryAvailability",
      query.parameters,
      query.orderBy
    );

    /* If vendor info passed, then restrict results */
    if (vendorId) {
      sql +=  ' and (item).id in (' +
              '  select itemsrc_item_id ' +
              '  from itemsrc ' +
              '  where itemsrc_active ' +
              '    and itemsrc_vend_id=' + vendorId + ')';
    }

    if (vendorTypeId) {
      sql +=  ' and (item).id in (' +
              '  select itemsrc_item_id ' +
              '  from itemsrc ' +
              '    join vendinfo on vend_id=itemsrc_vend_id ' +
              '  where itemsrc_active ' +
              '    and vend_vendtype_id=' + vendorTypeId + ')';
    }

    if (vendorTypePattern) {
      sql +=  ' and (item).id in (' +
              '  select itemsrc_item_id ' +
              '  from itemsrc ' +
              '    join vendinfo on vend_id=itemsrc_vend_id ' +
              '    join vendtype on vend_vendtype_id=vendtype_id ' +
              '  where itemsrc_active ' +
              '    and vendtype_code ~* ${p1})';
      clause.parameters.push(vendorTypePattern);
    }  

    sql = XT.format(sql + ' {orderBy} %1$s %2$s;', [limit, offset]);
      
    /* Query the model */
    sql = sql.replace('{conditions}', clause.conditions)
             .replace('{orderBy}', clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace("{p1}", clause.parameters.length);

    /* First find qualifying ids. */
    rows = plv8.execute(sql, clause.parameters);
    ids = rows.map(function (row) { return "$" + i++ });
    params = rows.map(function (row) { return row.id; }).concat(params);

    /* Now return the actual results */
    sql2 = sql2.replace(/{days}/g, days)
               .replace('{orderBy}', clause.orderBy)
               .replace('{ids}', ids.join())
               .replace(/{p1}/g, ids.length + 1)
               .replace(/{p2}/g, ids.length + 2); 

    return plv8.execute(sql2, params);
  };

}());
  
$$ );
