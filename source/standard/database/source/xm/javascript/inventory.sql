select xt.install_js('XM','Inventory','standard', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Inventory) { XM.Inventory = {}; }
  /**
    Re-implementation of issue to shipping that takes multiple order types into account.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"issueToShipping",
          "parameters":[
            "95c30aba-883a-41da-e780-1d844a1dc112",
            1,
            {
              "asOf": "2013-07-03T13:52:55.964Z",
              "detail": [
                {
                  "location": "84cf43d5-8a44-4a2b-f709-4f415ca51a52",
                  "quantity": 8
                },
                {
                  "location": "d756682c-eda3-445d-eaef-4dce793b0dcf",
                  "quantity": 2
                }
              ]
            }
          ]
        }
      }');
  
    @param {String|Array} Order line uuid or array of objects
    @param {Number|Object} Quantity or options
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {Array} [options.detail] Distribution detail
  */
  XM.Inventory.issueToShippingMulti = function (orderLine, quantity, options) {
    var sql = "select ordtype_code " +
              "from xt.obj o " +
              "  join pg_class c on o.tableoid = c.oid " +
              "  join xtstd.ordtype on c.relname=ordtype_tblname " +
              "where obj_uuid= $1;",
      ary,
      item,
      qry,
      orderType;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Determine the type */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      orderType = plv8.execute(sql, [item.orderLine])[0].ordtype_code;
      if (!item.options) { item.options = {}; }
      item.options.orderType = orderType;
    }

    /* Forward the transaction */
    XM.Inventory.issueToShipping(ary);

    return;
  };
  XM.Inventory.issueToShippingMulti.description = "Issue to Shipping.";
  XM.Inventory.issueToShippingMulti.params = {
    orderLine: { type: "String", description: "Order line UUID" },
    quantity: {type: "Number", description: "Quantity" },
    options: {type: "Object", description: "Other attributes", attributes: {
      asOf: {type: "Date", description: "Transaction Timestamp. Default to now()."},
      detail: {type: "Array", description: "Distribution detail" }
    }}
  };

}());
  
$$ );
