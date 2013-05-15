/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.ppm.initTimeExpenseModels = function () {

   /** @class

     Mixin for worksheet models.
   */
    XM.WorksheetMixin = {

      getWorksheetStatusString: function () {
        var value = this.get("worksheetStatus"),
          K = XM.Worksheet;
        switch (value)
        {
        case K.OPEN:
          value = '_open'.loc();
          break;
        case K.APPROVED:
          value = '_approved'.loc();
          break;
        case K.CLOSED:
          value = '_closed'.loc();
          break;
        default:
          value = '_error'.loc();
        }
        return value;
      }
    };

    /**
      @class

      @extends XM.Model
    */
    XM.Worksheet = XM.Document.extend(
      /** @scope XM.Worksheet.prototype */ {

      recordType: 'XM.Worksheet',

      numberPolicy: XM.Document.AUTO_NUMBER,

      defaults: function () {
        return {
          worksheetStatus: XM.Worksheet.OPEN,
          owner: XM.currentUser,
          site: XT.defaultSite()
        };
      },

      bindEvents: function () {
        XM.Document.prototype.bindEvents.apply(this, arguments);
        this.on('change:employee', this.employeeDidChange);
      },

      requiredAttributes: [
        "number",
        "worksheetStatus",
        "employee",
        "owner",
        "weekOf",
        "site"
      ],

      readOnlyAttributes: [
        "time",
        "expenses"
      ],

      employeeDidChange: function () {
        var employee = this.get("employee"),
          site = employee ? employee.get("site") : false;
        if (site) { this.set("site", site); }
        this.setReadOnly("time", _.isEmpty(employee));
        this.setReadOnly("expenses", _.isEmpty(employee));
      },

      fetchNumber: function () {
        var that = this,
          options = {};
        options.success = function (resp) {
          that._number = resp.toString();
          that.set('number', that._number);
        };
        this.dispatch('XM.Worksheet', 'fetchNumber', null, options);
        return this;
      },

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        var isNotOpen = this.get("worksheetStatus") !== XM.Worksheet.OPEN;
        this.setReadOnly(isNotOpen);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.setReadOnly("time", false);
          this.setReadOnly("expenses", false);
        }
      }

    });

    XM.Worksheet = XM.Worksheet.extend(XM.WorksheetMixin);

    _.extend(XM.Worksheet, {

      // ..........................................................
      // CONSTANTS
      //

      /**
        Open status for worksheet.

        @static
        @constant
        @type String
        @default O
      */
      OPEN: 'O',

      /**
        Approved status for worksheet.

        @static
        @constant
        @type String
        @default A
      */
      APPROVED: 'A',

      /**
        Closed status for worksheet.
        @static
        @constant
        @type String
        @default C
      */
      CLOSED: 'C'

    });


    /**
      @class
      Abstract model.

      @extends XM.Model
    */
    XM.WorksheetDetail = XM.Model.extend(
      /** @scope XM.WorksheetDetail.prototype */ {

      readOnlyAttributes: [
        "billable",
        "billingTotal",
        "lineNumber"
      ],

      requiredAttributes: [
        "billingCurrency",
        "item",
        "lineNumber",
        "task",
        "unit",
        "workDate"
      ],

      isTime: false,

      billableDidChange: function () {
        var billable = this.get("billable"),
          worksheet = this.getParent(),
          task =  this.get("task"),
          project = task ? task.get("project") : undefined,
          employee = worksheet ? worksheet.get("employee") : undefined,
          customer = this.get("customer"),
          item = this.get("item"),
          that = this,
          options = {isJSON: true},
          params,
          i;
        this.setReadOnly("billingRate", !billable);
        if (billable) {
          params = {
            isTime: this.isTime,
            taskId: task ? task.id : undefined,
            projectId: project ? project.id : undefined,
            employeeId: employee ? employee.id : undefined,
            customerId: customer ? customer.id : undefined,
            itemId: item ? item.id : undefined
          };

          // Keep track of requests, we'll ignore stale ones
          this._counter = _.isNumber(this._counter) ? this._counter + 1 : 0;
          i = this._counter;

          options.success = function (resp) {
            var data = {};
            if (i < that._counter) { return; }
            that.off("change:" + that.ratioKey, that.detailDidChange);
            data[that.ratioKey] = resp.rate;
            data.billingCurrency = resp.currency || XT.baseCurrency();
            that.set(data);
            that.on("change: " + that.ratioKey, that.detailDidChange);
            that.detailDidChange();
          };
          this.dispatch("XM.Worksheet", "getBillingRate", params, options);
        } else {
          this.set(this.ratioKey, 0);
        }
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        var events = "change:billable change:customer change:project " +
          "change:item change:task";
        this.on(events, this.billableDidChange);
        this.on('change:worksheet', this.worksheetDidChange);
        this.on('change:' + this.valueKey, this.detailDidChange);
        this.on('change:' + this.ratioKey, this.detailDidChange);
        this.on('change:item', this.itemDidChange);
        this.on('change:customer', this.customerDidChange);
        this.on('change:task', this.taskDidChange);
        this.on('statusChange', this.statusDidChange);
      },

      customerDidChange: function () {
        var hasCustomer = !_.isEmpty(this.get('customer')),
          billable = this.get("billable");
        if (!hasCustomer && billable) {
          this.set(this.valueKey, 0);
        }
        this.set("billable", hasCustomer);
        this.setReadOnly('billable', !hasCustomer);
      },

      detailDidChange: function () {
        var value,
          ratio;
        if (this.isDirty()) {
          value = this.get(this.valueKey) || 0;
          ratio = this.get(this.ratioKey) || 0;
          this.set('billingTotal', value * ratio);
        }
      },

      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.requiredAttributes.push(this.valueKey);
        this.requiredAttributes.push(this.ratioKey);
        this.statusDidChange();
      },

      itemDidChange: function () {
        var unit = this.getValue("item.inventoryUnit");
        this.set("unit", unit);
      },

      statusDidChange: function () {
        var K = XM.Model,
          status = this.getStatus(),
          worksheet,
          worksheetStatus;
        if (status === K.READY_CLEAN) {
          worksheet = this.getParent();
          worksheetStatus = worksheet.get("worksheetStatus");
          if (worksheet.get("worksheetStatus") !== XM.Worksheet.OPEN) {
            this.setReadOnly(true);
          } else {
            this.customerDidChange();
          }
        }
        if (this.isReady()) {
          this.setReadOnly("billingRate", !this.get("billable"));
        }
      },

      taskDidChange: function () {
        var task = this.get('task'),
          project,
          item,
          customer;
        if (task) {
          item = task.get('item');
          if (item) { this.set('item', item); }
          project = task.get('project');
          customer = task.get('customer') || project.get('customer');
          if (customer) { this.set('customer', customer); }
        }
      },

      worksheetDidChange: function () {
        var K = XM.Model,
          status = this.getStatus(),
          worksheet = this.get('worksheet'),
          lineNumber = this.get('lineNumber'),
          key = this.lineNumberKey;
        if (worksheet && status === K.READY_NEW && !lineNumber) {
          this.set('lineNumber', worksheet.get(key).length);
        }
      }

    });

    /**
      @class

      @extends XM.WorksheetDetail
    */
    XM.WorksheetTime = XM.WorksheetDetail.extend(
      /** @scope XM.WorksheetTime.prototype */ {

      recordType: 'XM.WorksheetTime',

      defaults: function () {
        return {
          billable: false,
          billingRate: 0,
          billingTotal: 0,
          billingCurrency: XT.baseCurrency()
        };
      },

      isTime: true,

      lineNumberKey: 'time',

      valueKey: 'hours',

      ratioKey: 'billingRate'

    });

    /**
      @class

      @extends XM.WorksheetDetail
    */
    XM.WorksheetExpense = XM.WorksheetDetail.extend(
      /** @scope XM.WorksheetExpense.prototype */ {

      recordType: 'XM.WorksheetExpense',

      defaults: function () {
        return {
          billable: false,
          prepaid: false,
          unitCost: 0,
          billingTotal: 0,
          billingCurrency: XT.baseCurrency()
        };
      },

      lineNumberKey: 'expenses',

      valueKey: 'quantity',

      ratioKey: 'unitCost'

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetAccount = XM.Model.extend({
     /** @scope XM.WorksheetAccount.prototype */

      recordType: 'XM.WorksheetAccount',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetContact = XM.Model.extend({
     /** @scope XM.WorksheetContact.prototype */

      recordType: 'XM.WorksheetContact',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetIncident = XM.Model.extend({
     /** @scope XM.WorksheetIncident.prototype */

      recordType: 'XM.WorksheetIncident',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetItem = XM.Model.extend({
     /** @scope XM.WorksheetItem.prototype */

      recordType: 'XM.WorksheetItem',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetFile = XM.Model.extend({
     /** @scope XM.WorksheetFile.prototype */

      recordType: 'XM.WorksheetFile',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetUrl = XM.Model.extend({
     /** @scope XM.WorksheetUrl.prototype */

      recordType: 'XM.WorksheetUrl',

      isDocumentAssignment: true

    });

    /**
     @class

     @extends XM.Model
    */
    XM.WorksheetProject = XM.Model.extend({
     /** @scope XM.WorksheetProject.prototype */

      recordType: 'XM.WorksheetProject',

      isDocumentAssignment: true

    });

    /**
      @class

      @extends XM.Info
    */
    XM.WorksheetListItem = XM.Info.extend(
      /** @scope XM.WorksheetListItem.prototype */ {

      recordType: 'XM.WorksheetListItem',

      editableModel: 'XM.Worksheet',

      canApprove: function (callback) {
        return _canDo.call(this, "CanApprove", XM.Worksheet.OPEN, callback);
      },

      canClose: function (callback) {
        return _canDo.call(this, "MaintainTimeExpense", XM.Worksheet.APPROVED, callback);
      },

      canInvoice: function (callback) {
        var priv = this.get("toInvoice") ? "allowInvoicing" : false;
        return _canDo.call(this, priv, XM.Worksheet.APPROVED, callback);
      },

      canPost: function (callback) {
        return _canDo.call(this, "PostTimeSheets", XM.Worksheet.APPROVED, callback);
      },

      canUnapprove: function (callback) {
        return _canDo.call(this, "CanApprove", XM.Worksheet.APPROVED, callback);
      },

      canVoucher: function (callback) {
        var priv = this.get("toVoucher") ? "allowVouchering" : false;
        return _canDo.call(this, priv, XM.Worksheet.APPROVED, callback);
      },

      couldDestroy: function (callback) {
        return _canDo.call(this, "MaintainTimeExpense", XM.Worksheet.OPEN, callback);
      },

      doApprove: function (callback) {
        return _doDispatch.call(this, "approve", callback);
      },

      doClose: function (callback) {
        return _doDispatch.call(this, "close", callback);
      },

      doInvoice: function (callback) {
        return _doDispatch.call(this, "invoice", callback);
      },

      doPost: function (callback) {
        return _doDispatch.call(this, "post", callback);
      },

      doUnapprove: function (callback) {
        return _doDispatch.call(this, "unapprove", callback);
      },

      doVoucher: function (callback) {
        return _doDispatch.call(this, "voucher", callback);
      }

    });

    XM.WorksheetListItem = XM.WorksheetListItem.extend(XM.WorksheetMixin);

    /** @private */
    var _canDo = function (priv, reqStatus, callback) {
      var status = this.get("worksheetStatus"),
        ret = XT.session.privileges.get(priv) && status === reqStatus;
      if (callback) {
        callback(ret);
      }
      return ret;
    };

    /** @private */
    var _doDispatch = function (method, callback) {
      var that = this,
        options = {};
      options.success = function (resp) {
        var fetchOpts = {};
        fetchOpts.success = function () {
          if (callback) { callback(resp); }
        };
        if (resp) {
          that.fetch(fetchOpts);
        }
      };
      options.error = function (resp) {
        if (callback) { callback(resp); }
      };
      this.dispatch("XM.Worksheet", method, this.id, options);
      return this;
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.WorksheetListItemCollection = XM.Collection.extend({
      /** @scope XM.WorksheetListItemCollection.prototype */

      model: XM.WorksheetListItem

    });

  };

}());
