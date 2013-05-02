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
          status: 'O',
          owner: XM.currentUser
        };
      },
      
      requiredAttributes: [
        "number",
        "status",
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
      },
      
      fetchPreferredSite: function () {
        var that = this,
          options = {};
        options.success = function (resp) {
          that.set('site', resp);
        };
        this.dispatch('XM.Worksheet', 'fetchPreferredSite', null, options);
        XT.log("XM.Worksheet.fetchNumber");
        return this;
      },
      
      initialize: function (attributes, options) {
        XM.Document.prototype.initialize.apply(this, arguments);
        this.fetchPreferredSite();
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
        "lineNumber",
        "total"
      ],
      
      requiredAttributes: [
        "lineNumber",
        "workDate",
        "projectTask",
        "item"
      ],
      
      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('change:worksheet', this.worksheetDidChange);
        this.on('change:' + this.valueKey, this.detailDidChange);
        this.on('change:' + this.ratioKey, this.detailDidChange);
        this.on('statusChange', this.statusDidChange);
      },
      
      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.requiredAttributes.push(this.valueKey);
        this.requiredAttributes.push(this.ratioKey);
        this.statusDidChange();
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
          }
        }
      },
      
      detailDidChange: function () {
        var value,
          ratio;
        if (this.isDirty()) {
          value = this.get(this.valueKey) || 0;
          ratio = this.get(this.ratioKey) || 0;
          this.set('total', value * ratio);
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
      
      defaults: {
        billable: false,
        rate: 0,
        total: 0
      },
      
      lineNumberKey: 'time',
      
      valueKey: 'hours',
      
      ratioKey: 'rate'

    });

    /**
      @class

      @extends XM.WorksheetDetail
    */
    XM.WorksheetExpense = XM.WorksheetDetail.extend(
      /** @scope XM.WorksheetExpense.prototype */ {

      recordType: 'XM.WorksheetExpense',
      
      defaults: {
        billable: false,
        prepaid: false,
        unitCost: 0,
        total: 0
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
