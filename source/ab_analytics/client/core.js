/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true,
  enyo:true, window:true */

(function () {

  var dirtiestEverHash = function (s) {
    return _.reduce(s.split(""), function (memo, c) {
      return memo + c.charCodeAt(0);
    }, 0);
  };

  XT.extensions.ab_analytics = {
    report: function (method, type, payload) {
      var endpoint = "https://www.xtuple.com/welcome",
        params,
        r;

      if (!XT.app || XT.app.state < 6) {
        // don't start yet
        return;
      }

      if (!XT.extensions.ab_analytics.group) {
        // XXX more of a proof of concept than anything else
        XT.extensions.ab_analytics.group =
          dirtiestEverHash(XT.session.details.organization) % 2 === 0 ? "A" : "B";
      }

      try {
        params = "?source=ab_analytics&username=" + XT.session.details.id +
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
        r.go();

      } catch (error) {}

    }
  };

}());
