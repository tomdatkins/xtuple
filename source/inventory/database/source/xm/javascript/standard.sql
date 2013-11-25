select xt.install_js('XM','Standard','inventory', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  var salesSettings = [
      "MultiWhs"
    ],
    userPreferences = [
      "PreferredWarehouse"
    ];

  salesSettings.map(function (setting) {
    if(XM.Sales && !XM.Sales.options.contains(setting)) {
      XM.Sales.options.push(setting);
    }
  });

  userPreferences.map(function (pref) {
    if(!XM.UserPreference.options.contains(pref)) {
      XM.UserPreference.options.push(pref);
    }
  });

}());
$$, true );

