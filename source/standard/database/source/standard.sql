select xt.install_js('XM','Standard','standard', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  /*if (!XM.Standard) { XM.Standard = {}; }*/

  /*XM.Standard.isDispatchable = true;*/

  var i, option,
    salesOptions = [
      "MultiWhs"
    ];

  if(XM.Sales) {
    for(i = 0; i < salesOptions.length; i++) {
      option = salesOptions[i];
      if(!XM.Sales.options.contains(option)) {
        XM.Sales.options.push(option);
      }
    }
  } else {
    XM.Sales = {};
    XM.Sales.options = salesOptions;
  }

}());
$$, true );

