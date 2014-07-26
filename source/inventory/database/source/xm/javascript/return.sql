select xt.install_js('XM','Return','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /**
    Returns a list of UUIDs of any lines in this return that have itemsites under 
    inventory control

    @param {String} Return number
  */
  XM.Return.getControlledLines = function (returnNumber) {
    return XM.Billing.getControlledLines(returnNumber, 'CM');
  };

  /**
    

  */
  XM.Return.postWithInventory = function (returnNumber, lineItems) {
    return XM.Billing.postWithInventory(returnNumber, lineItems, 'CM');
  };
  
}());
  
$$ );
