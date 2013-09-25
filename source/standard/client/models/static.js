/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.standard.initStaticModels = function () {

    var callback = function () {
      // Only add trace options if they are turned on
      if (XT.session.settings.get("LotSerialControl")) {
        XM.controlMethods.add({ id: XM.ItemSite.LOT_CONTROL, name: "_lot".loc() })
                         .add({ id: XM.ItemSite.SERIAL_CONTROL, name: "_serial".loc() });
      }
    };

    // It's likely settings haven't been loaded so we'll have to wait until they are
    // To add trace options if applicable
    if (XT.session.settings) {
      callback();
    } else {
      XT.getStartupManager().registerCallback(callback);
    }

    // Planning System
    var K = XM.ItemSite,
      planningSystemJson = [
	    { id: K.NO_PLANNING, name: "_none".loc() },
	    { id: K.MRP_PLANNING, name: "_mrp".loc() }
	  ],
	  i;

    XM.PlanningSystem = Backbone.Model.extend({});
    XM.PlanningSystemCollection = Backbone.Collection.extend({
      model: XM.PlanningSystem
    });
    XM.planningSystems = new XM.PlanningSystemCollection();
    for (i = 0; i < planningSystemJson.length; i++) {
      var planningSystem = new XM.PlanningSystem(planningSystemJson[i]);
      XM.planningSystems.add(planningSystem);
    }
  };

}());
