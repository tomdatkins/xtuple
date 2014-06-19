/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true, async:true,
  window:true, setTimeout:true, SignaturePad:true, console:true, FileReader:true */

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

    var thePad = {
      components: [
        {classes: "m-signature-pad--body", components: [
          {tag: "canvas", id: "signature-canvas"}
        ]}
      ],
      rendered: function () {
        enableSignaturePad();
      },
      getValueAsync: function (callback) {
        return signaturePad.isEmpty() ? null : signaturePad._canvas.toBlob(callback, "png", true);
      }
    };

    var createFile = function (data, salesOrder, callback) {
      var reader = new FileReader(),
        file = new XM.File(),
        fileRelation = new XM.FileRelation(),
        readBlob = function (done) {
          reader.onload = function () {
            done();
          };
          reader.readAsBinaryString(data); // async
        },
        saveFile = function (done) {
          file.initialize(null, {isNew: true});
          file.set({
            data: reader.result,
            name: "_salesOrder".loc().replace(/ /g, "") + salesOrder.id + "_signature".loc(),
            description: "capture.png"
          });
          file.once("status:READY_CLEAN", function () {
            done();
          });
          file.save();
        },
        fetchFileRelation = function (done) {
          fileRelation.fetch({id: file.id, success: function () {
            done();
          }});
        },
        createDocumentAssociation = function (done) {
          var docAss = new XM.SalesOrderFile();
          docAss.initialize(null, {isNew: true});
          docAss.set({
            file: fileRelation,
            purpose: "S"
          });
          salesOrder.get("files").add(docAss);
          done();
        };

      async.series([
        readBlob,
        saveFile,
        fetchFileRelation,
        createDocumentAssociation
      ], callback);
    };

    salesOrder.popupSignature = function () {
      var that = this;

      this.doNotify({
        message: "_signHere".loc(),
        type: XM.Model.YES_NO_CANCEL, // TODO: OK_CANCEL
        component: thePad,
        callback: function (response) {
          if (!response.answer) {
            signaturePad.clear();
            return;
          }
          createFile(response.componentValue, that.value, function () {
            console.log("here", arguments);
          });

        }
      });
    };
    XV.SalesOrderWorkspace.prototype.actions = XV.SalesOrderWorkspace.prototype.actions || [];
    XV.SalesOrderWorkspace.prototype.actions.push(
      {name: "popupSignaturePad", method: "popupSignature", isViewMethod: true}
    );

  };
}());
