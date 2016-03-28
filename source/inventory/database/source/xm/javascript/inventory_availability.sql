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
    var data = Object.create(XT.Data);
    var nameSpace = "XM";
    var type = "InventoryAvailability";
    var includeNumberBarcodeParam = false;
    var days = '"leadTime"';
    var obj;
    var lookAheadValues = [];
    var vendorId = null;
    var vendorTypeId = null;
    var vendorTypePattern = null;
    var payload = {
      username: XT.username,
      nameSpace: nameSpace,
      type: type,
      query: query
    };

    if (query.parameters) {
      payload.query.parameters = query.parameters.filter(function (param) {
        var obj;

        switch (param.attribute)
        {
        case "lookAhead":
          switch (param.value)
          {
          case "byLeadTime":
            break;
          case "byDays":
            obj = query.parameters.findProperty("attribute", "days");
            lookAheadValues.push({
              value: obj.value,
              type: '::integer'
            });
            break;
          case "byDate":
            obj = query.parameters.findProperty("attribute", "endDate");
            lookAheadValues.push({
              value: obj.value,
              type: '::date'
            });
            break;
          case "byDates":
            obj = query.parameters.findProperty("attribute", "startDate");
            lookAheadValues.push({
              value: obj.value,
              type: '::date'
            });
            obj = query.parameters.findProperty("attribute", "endDate");
            lookAheadValues.push({
              value: obj.value,
              type: '::date'
            });
            break;
          }
          return false;
        case "vendor":
          vendorId = XT.Data.getId(XT.Data.fetchOrm('XM', 'VendorRelation'), param.value);
          return false;
        case "vendorType":
          vendorTypeId = XT.Data.getId(XT.Data.fetchOrm('XM', 'VendorType'), param.value);
          return false;
        case "vendorType.code":
          vendorTypePattern = param.value;
          return false;
        case "startDate":
        case "endDate":
        case "days":
        case "showShortages":
          return false;
        }

        return true;
      });

      if (!query.count) {
        /* Add `SELECT` columns. */
        data.addColumnsDynamicExtension(nameSpace, type, function (originPayload, originColumns) {
          /*
           * Switch `days` to `$1` or `$1, $2` depending on `lookAheadValues` and push values into
           * the `whereLiteralValues` array.
           */
          if (lookAheadValues.length === 1) {
            days = '$' + data.whereLiteralValues.push(lookAheadValues[0].value) + lookAheadValues[0].type;
          } else if (lookAheadValues.length === 2) {
            days = '$' + data.whereLiteralValues.push(lookAheadValues[0].value) + lookAheadValues[0].type;
            days += ', $' + data.whereLiteralValues.push(lookAheadValues[1].value) + lookAheadValues[0].type;
          }

          var extnColumns = '  -- Added by addColumnsDynamicExtension\n' +
                            '  uuid,\n' +
                            '  item,\n' +
                            '  "itemType",\n' +
                            '  site,\n' +
                            '  description1,\n' +
                            '  description2,\n' +
                            '  "inventoryUnit",\n' +
                            '  "classCode",\n' +
                            '  "leadTime",\n' +
                            '  "onHand",\n' +
                            '  qtyallocated(id, ' + days + ') AS allocated,\n' +
                            '  noneg("onHand" - qtyallocated(id, ' + days + ')) as unallocated,\n' +
                            '  qtyordered(id, ' + days + ') AS ordered,\n' +
                            '  qtypr(id, ' + days + ') AS requests,\n' +
                            '  ("onHand" - qtyallocated(id, ' + days + ') + qtyordered(id, ' + days + ')) AS available,\n' +
                            '  "useParameters",\n' +
                            '  "reorderLevel",\n' +
                            '  "orderTo",\n' +
                            '  "isPurchased",\n' +
                            '  "isManufactured"\n';

          return extnColumns;
        });
      }

      /* If vendor info passed, then restrict results. */
      if (vendorId || vendorTypeId || vendorTypePattern) {
        data.addWhereClauseDynamicExtension(nameSpace, type, function (originPayload) {
          var extSql =  '  -- Added by addWhereClauseDynamicExtension\n' +
                        '  AND id IN (\n' +
                        '    SELECT\n' +
                        '      itemsite_id AS id\n' +
                        '    FROM itemsite\n' +
                        '    WHERE true\n' +
                        '      AND itemsite_item_id IN (\n' +
                        '        SELECT\n' +
                        '          itemsrc_item_id\n' +
                        '        FROM itemsrc\n' +
                        '        WHERE true\n' +
                        '          AND itemsrc_active\n';
                        if (vendorId) {
                        '          AND itemsrc_vend_id = $' + data.whereLiteralValues.push(vendorId) + '\n';
                        }
                        if (vendorTypeId) {
                        '          AND vend_vendtype_id = $' + data.whereLiteralValues.push(vendorTypeId) + '\n';
                        }
                        if (vendorTypePattern) {
                        '          AND itemsrc_vend_id ~* $' + data.whereLiteralValues.push(vendorTypePattern) + '\n';
                        }
          extSql =      '      )\n' +
                        '  )\n';

          return extSql;
        });
      }
    }

    // TODO: Enyo client expects only `data`. It should handle a normal response.
    var result = data.fetch(payload);
    return result.data;
  };

}());

$$ );
