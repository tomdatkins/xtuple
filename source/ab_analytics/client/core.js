/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true,
  enyo:true, window:true */

(function () {
  "use strict";

  XT.extensions.ab_analytics = {
    group: Math.random() > 0.5 ? "A" : "B",
    report: function (method, type, payload) {
      var endpoint = "https://www.xtuple.com/welcome",
        params,
        r;

      try {
        params = "?username=" + XT.session.details.id +
          "&hostname=" + window.location.hostname +
          "&organization=" + XT.session.details.organization +
          "&version=" + XT.session.config.version +
          "&group=" + XT.extensions.ab_analytics.group +
          "&method=" + method +
          "&type=" + type +
          "&payload=" + JSON.stringify(payload);

        r = new enyo.Ajax({
          url: endpoint + params,
          timeout: 1
        });

        console.log("report to", endpoint, params);
        r.go();
      } catch (error) {}

    }
  };

}());
