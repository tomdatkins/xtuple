select xt.install_js('XM','Return','inventory', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /**
    Returns a list of UUIDs of any lines in this return that have itemsites under 
    inventory control

    @param {String} Return number
  */
  XM.Return.getControlledLines = function(returnNumber) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var sql = "select cmitem.obj_uuid as uuid " +
      "from cmhead " +
      "inner join cmitem on cmhead_id = cmitem_cmhead_id " +
      "inner join itemsite on cmitem_itemsite_id = itemsite_id " +
      "where (itemsite_loccntrl = true or itemsite_controlmethod in ('S', 'L')) " +
      "and cmhead_number = $1";

    return plv8.execute(sql, [returnNumber]).map(function (row) {
      return row.uuid;
    });
  };

  /**
    

    
  */
  XM.Return.postWithReceipt = function(orderLines) {
    /* TODO */
    return true;
  };
}());
  
$$ );


