select xt.install_js('XM','Invoice','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /**
    Returns a list of UUIDs of any lines in this return that have itemsites under 
    inventory control

    @param {String} Return number
  */
  XM.Invoice.getControlledLines = function (invoiceNumber) {
    return XM.PrivateBilling.getControlledLines(invoiceNumber, 'IN');
  };

  /**
    

  */
  XM.Invoice.postWithInventory = function (invoiceNumber, lineItems) {
    return XM.PrivateBilling.postWithInventory(invoiceNumber, lineItems, 'IN');
  };

}());
  
$$ );
