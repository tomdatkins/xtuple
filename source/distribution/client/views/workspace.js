/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true, SignaturePad:true, console:true */

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



    var signaturePad;
    var enableSignaturePad = function () {
      var canvas = window.document.getElementById("signature-canvas");

      // Adjust canvas coordinate space taking into account pixel ratio,
      // to make it look crisp on mobile devices.
      // This also causes canvas to be cleared.
      function resizeCanvas() {
        var ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
      }

      window.onresize = resizeCanvas;
      //resizeCanvas(); incompatible with rendered() usage

      signaturePad = new SignaturePad(canvas);
    };
    var extensions = [
      {kind: "onyx.Button", name: "openSignaturePadButton", content: "_openSignaturePad".loc(), container: "settingsGroup", ontap: "popupSignature"},
    ];
    var thePad = {
      components: [
        {classes: "m-signature-pad--body", components: [
          {tag: "canvas", id: "signature-canvas"}
        ]}
      ],
      rendered: function () {
        enableSignaturePad();
      },
      getValue: function () {
        return signaturePad.isEmpty() ? null : signaturePad.toDataURL();
      }
    };
    XV.appendExtension("XV.SalesOrderWorkspace", extensions);

    var createFile = function (data, callback) {
      console.log("data is", data);
      var file = new XM.File(),
        setData = function () {
          console.log("checking", file.getStatus(), XM.Model.READY_NEW);
          file.set({
            data: data,
            name: "Test Captured Signature",
            description: "capture.png"
          });
          file.once("status:READY_CLEAN", callback);
          console.log("uuid is", file.get("uuid"));
          console.log("saving", file.save());
        };

      file.on("all", function () {console.log(arguments); });
      file.on("invalid", function () {console.log("invalid", arguments); });
      console.log("start with", file.get("uuid"), file.getStatusString());
      file.initialize(null, {isNew: true});
      setData();
    };

    salesOrder.popupSignature = function () {
      this.doNotify({
        message: "_signHere".loc(),
        type: XM.Model.YES_NO_CANCEL, // TODO: OK_CANCEL
        component: thePad,
        callback: function (response) {
          if (!response.answer) {
            signaturePad.clear();
            return;
          }
          console.log("process image", response.componentValue);
          createFile(response.componentValue, function () {
            console.log("here", arguments);
          });

        }
      });
    };

  };
}());
