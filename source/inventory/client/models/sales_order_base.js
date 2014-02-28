/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderBaseModels = function () {

    var ext = {
      readOnlyAttributes: [
        "availability"
      ],
      handlers: {
        "change:item change:site change:scheduleDate": "fetchAvailability",
        "change:quantity change:quantityUnitRatio": "fetchAvailability",
        "status:READY_CLEAN": "statusReadyClean",
      },
      bindEvents: function () {
        this.meta = new Backbone.Model({availability: null});
      },
      fetchAvailability: function (model, changes, options) {
        var item = this.get("item"),
          site = this.get("site"),
          scheduleDate = this.get("scheduleDate"),
          availability = this.get("availability"),
          that = this,
          coll,
          afterFetch = function () {
            var availability,
              original,
              delta,
              available,
              allocated,
              unallocated,
              attrs;

            if (coll.length) {
              availability = coll.first();

              // If real demand then handle differences server doesn't
              // know about yet
              if (that.isDemand && that.isDirty()) {
                original = that.isNew() ? 0 : that.original("quantity");
                delta = XT.math.subtract(that.get("quantity") || 0, original);
                delta = delta * that.get("quantityUnitRatio");
                allocated = availability.get("allocated");
                available = availability.get("available");
                unallocated = availability.get("unallocated");

                // No "set" here because rules we don't care about
                // in this context get in the way
                attrs = availability.attributes;
                attrs.allocated = XT.math.add(allocated, delta);
                attrs.available = XT.math.subtract(available, delta);
                attrs.unallocated = XT.math.subtract(unallocated, delta);
                attrs.unallocated = Math.max(attrs.unallocated, 0); // No negative
              }
              that.setValue("availability", availability);
            }
          };

        this.setValue("availability", null);

        if (item && site && scheduleDate) {
          coll = new XM.InventoryAvailabilityCollection();
          coll.fetch({
            success: afterFetch,
            query: {
              parameters: [
                {attribute: "lookAhead", value: "byDate"},
                {attribute: "endDate", value: scheduleDate},
                {attribute: "item", value: item.id},
                {attribute: "site", value: site.id}
              ]
            }
          });
        }
      },
      statusReadyClean: function () {
        if (this.get("atShipping") || this.get("shipped") ||
          this.get("returned")) {
          this.setReadOnly(["quantityUnit", "priceUnit"]);
        }
        this.fetchAvailability();
      }
    };

    // These aren't really "base", but extend here because they share this code
    // and we can't augment the mixins that these are created from.
    XM.SalesOrderLine.prototype.augment(_.extend(ext, {isDemand: true}));
    XM.QuoteLine.prototype.augment(_.extend(ext, {isDemand: false}));

  };


}());

