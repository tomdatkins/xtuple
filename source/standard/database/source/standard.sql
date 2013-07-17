select xt.install_js('XM','Standard','standard', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  var salesSettings = [
      "MultiWhs"
    ];

  /* addresses a crash if this extension alone is being installed. In normal
  life is not necessary because js_init() will call these other objects first */
  if(!XM.Sales) {
    XM.Sales = {
      options: []
    };
  }
  salesSettings.map(function (setting) {
    if(!XM.Sales.options.contains(setting)) {
      XM.Sales.options.push(setting);
    }
  }); 
}());
$$, true );

