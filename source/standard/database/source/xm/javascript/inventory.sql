select xt.install_js('XM','Inventory','standard', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Inventory) { XM.Inventory = {options: []}; }
  
  XM.Inventory.isDispatchable = true;

  XM.Inventory.options = XM.Inventory.options.concat([
    "LotSerialControl",
    "MultiWhs"
  ]);

  /**
    Returns an object indicating whether trace is set on any item sites.
    
    @returns Boolean
  */
  XM.Inventory.usedTrace = function() {
    var sql = "select count(*) > 0 as used from itemsite where itemsite_controlmethod in ('S','L');",
      data = Object.create(XT.Data);
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureIM')) throw new Error('Access Denied');

    return plv8.execute(sql)[0].used;
  }

}());
  
$$ );
