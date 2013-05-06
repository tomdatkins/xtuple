/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.ppm.initTimeExpenseModels = function () {

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

      requiredAttributes: [
        "number",
        "worksheetStatus",
        "employee",
        "owner",
        "weekOf",
        "site"
      ],

      readOnlyAttributes: [
        "number"
      ],

      fetchNumber: function () {
        var that = this,
          options = {};
        options.success = function (resp) {
          that._number = resp.toString();
          that.set('number', that._number);
        };
        this.dispatch('XM.Worksheet', 'fetchNumber', null, options);
        return this;
      }

    });

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

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('change:worksheet', this.worksheetDidChange);
        this.on('change:' + this.valueKey, this.detailDidChange);
        this.on('change:' + this.ratioKey, this.detailDidChange);
        this.on('change:item', this.itemDidChange);
        this.on('change:customer', this.customerDidChange);
        this.on('statusChange', this.statusDidChange);
      },
      
      customerDidChange: function () {
        var hasNoCustomer = _.isEmpty(this.get('customer')),
          billable = this.get("billable");
        if (hasNoCustomer && billable) {
          this.set("billable", false);
          this.set(this.valueKey, 0);
          this.set("billingTotal", 0);
        }
        this.setReadOnly('billable', hasNoCustomer);
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

      lineNumberKey: 'time',

      valueKey: 'hours',

      ratioKey: 'billingRate',

      billableDidChange: function () {
        var billable = this.get("billable"),
          worksheet = this.getParent(),
          projectTask =  this.get("projectTask"),
          project = projectTask ? projectTask.get("project") : undefined,
          employee = worksheet ? worksheet.get("employee") : undefined,
          customer = this.get("customer"),
          item = this.get("item"),
          that = this,
          options = {},
          params;
        this.setReadOnly("billingRate", !billable);
        if (billable) {
          params = {
            isTime: true,
            projectTaskId: projectTask ? projectTask.id : undefined,
            projectId: project ? project.id : undefined,
            employeeId: employee ? employee.id : undefined,
            customerId: customer ? customer.id : undefined,
            itemId: item ? item.id : undefined
          };
          options.success = function (rate) {
            that.set("billingRate", rate);
          };
          this.dispatch("XM.Worksheet", "getBillingRate", params, options);
        } else {
          this.set("billingRate", 0);
        }
      },

      bindEvents: function () {
        XM.WorksheetDetail.prototype.bindEvents.apply(this, arguments);
        var events = "change:billable change:customer change:project" +
          "change:item change:projectTask";
        this.on(events, this.billableDidChange);
      },

      statusDidChange: function () {
        XM.WorksheetDetail.prototype.statusDidChange.apply(this, arguments);
        if (this.isReady()) {
          this.setReadOnly("billingRate", !this.get("billable"));
        }
      }

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

      editableModel: 'XM.Worksheet'

    });

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
