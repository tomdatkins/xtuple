/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true */

(function () {

  XT.extensions.distribution.initWorkspaces = function () {

    // ..........................................................
    // SALES ORDER
    //

    var salesOrder = XV.SalesOrderWorkspace.prototype;

    if (!salesOrder.actionButtons) { salesOrder.actionButtons = []; }
    salesOrder.actionButtons.push(
      {name: "expressCheckoutButton", label: "_expressCheckout".loc(),
        isViewMethod: true,
        icon: "shopping-cart",
        method: "expressCheckout",
        privilege: "IssueStockToShipping",
        prerequisite: "canCheckout"}
    );

    // Add methods
    _.extend(salesOrder, {
      expressCheckout: function () {
        var K = XM.SalesOrder,
          that = this,
          model = this.getValue(),
          holdType = model.getValue("holdType"),
          message = "_unsavedChanges".loc() + " " + "_saveYourWork?".loc(),
          ids = _.map(this.value.get("lineItems").models, function (model) {
            return model.id;
          }),
          checkout = function () {
            async.map(ids, getIssueToShippingModel, function (err, res) {
              that.parent.parent.doPrevious();
              // res should be an array of READY_CLEAN IssueToShipping models
              that.issue(res);
            });
          },
          getIssueToShippingModel = function (id, done) {
            var model = new XM.IssueToShipping();
            model.fetch({id: id, success: function () {
              done(null, model);
            }, error: function () {
              done(null);
            }
            });
          };

        if (holdType === K.CREDIT_HOLD_TYPE) {
          this.doNotify({message: "_orderCreditHold".loc(), type: XM.Model.WARNING });
        } else if (holdType === K.PACKING_HOLD_TYPE) {
          this.doNotify({message: "_orderPackingHold".loc(), type: XM.Model.WARNING });
        } else if (holdType === K.SHIPPING_HOLD_TYPE) {
          this.doNotify({message: "_orderShippingHold".loc(), type: XM.Model.WARNING });
        } else if (model.isDirty()) {
          model.save(null, {success: checkout});
        } else {
          checkout();
        }
      }
    });
  };
}());
