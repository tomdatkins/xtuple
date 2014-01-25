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
      sql = 'select *, noneg("onHand" - allocated) as unallocated, ' +
            ' ("onHand" - allocated + ordered) AS available ' +
            'from ( ' +
            '  select uuid, item, site, "leadTime", "useParameters", "reorderLevel", ' +
            '    "orderTo", "onHand",' +
            '    qtyallocated(id, {days}) AS allocated, ' +
            '    qtyordered(id, {days}) AS ordered, '  +
            '    qtypr(id, {days}) AS requests ' +
            '  from xm.inventory_availability where id in ' +
            '  (select id ' +
            '   from xm.inventory_availability ' +
            '   where {conditions} ';

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
              '    and vendtype_code ~* ${p3})';
      params.push(vendorTypePattern);
    }  

    sql = XT.format(sql + '{orderBy} %1$s %2$s)) data {orderBy}', [limit, offset]);
      
    /* Query the model */
    sql = sql.replace(/{days}/g, days)
             .replace('{conditions}', clause.conditions)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace(/{p1}/g, clause.parameters.length + 1)
             .replace(/{p2}/g, clause.parameters.length + 2)
             .replace("{p3}", clause.parameters.length + params.length);
    clause.parameters = clause.parameters.concat(params);

    return plv8.execute(sql, clause.parameters);
  };

}());
  
$$ );
