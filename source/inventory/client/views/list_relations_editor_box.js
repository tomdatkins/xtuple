/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true*/

(function () {

  XT.extensions.inventory.initListRelationsEditorBox = function () {

    var extensions = [
      {kind: "XV.MoneyWidget", addBefore: "taxTotal", container: "summaryColumnTwo",
        attr: {localValue: "freight", currency: "currency"},
        label: "_freight".loc(), currencyShowing: false}
    ];

    XV.appendExtension("XV.SalesSummaryPanel", extensions);


  };

}());
