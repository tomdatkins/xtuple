/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT: true */

(function () {

  XT.extensions.inventory.initListBox = function () {

    // ..........................................................
    // INVENTORY WORKBENCH HISTORY
    //

    enyo.kind({
      name: "XV.ItemWorkbenchHistoryBox",
      classes: "small-panel",
      kind: "XV.ListBox",
      title: "_history".loc(),
      parentKey: "item",
      canOpen: false,
      list: "XV.ItemWorkbenchHistoryList",
      setValue: function (value) {
        var list = this.$.list,
          collection = list.getValue();

        // Kind of odd here. Not really setting the value,
        // we're setting a query paramter.
        if (value) {
          list.setQuery({
            parameters: [
              {attribute: "itemSite.item.number", value: value}
            ],
            orderBy: [
              {attribute: "transactionDate", descending: true},
              {attribute: "created", descending: true},
              {attribute: "uuid"},
            ]
          });
          list.fetch();
        } else {
          collection.reset();
          collection.fetchCount += 1;  // Ignore previous requests
          list.setCount(0);
          list.reset();
        }
      }
    });

  };

}());
