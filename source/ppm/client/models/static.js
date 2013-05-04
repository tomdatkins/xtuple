/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  var i;

  // Expense Options
  var itemExpenseOptionJson = [
    { id: "E", name: "_byCategory".loc() },
    { id: "L", name: "_byAccount".loc() }
  ];
  XM.ItemExpenseOption = Backbone.Model.extend({
  });
  XM.ItemExpenseOptionCollection = Backbone.Collection.extend({
    model: XM.ItemExpenseOption
  });
  XM.itemExpenseOptions = new XM.ItemExpenseOptionCollection();
  for (i = 0; i < itemExpenseOptionJson.length; i++) {
    var itemExpenseOption = new XM.ItemExpenseOption(itemExpenseOptionJson[i]);
    XM.itemExpenseOptions.add(itemExpenseOption);
  }
  
}());
