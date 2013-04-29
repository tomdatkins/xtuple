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

    /**
      @class

      @extends XM.Model
    */
    XM.WorksheetTime = XM.Model.extend(
      /** @scope XM.WorksheetTime.prototype */ {

      recordType: 'XM.WorksheetTime',
      
      defaults: {
        billable: false,
        rate: 0,
        total: 0
      },
      
      readOnlyAttributes: [
        "lineNumber",
        "total"
      ],
      
      requiredAttributes: [
        "lineNumber",
        "workDate",
        "projectTask",
        "item",
        "hours",
        "rate"
      ],
      
      initialize: function (attributes, options) {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.on('change:worksheet', this.worksheetDidChange);
        this.on('change:hours change:rate', this.detailDidChange);
        this.on('statusChange', this.statusDidChange);
        this.statusDidChange();
      },
      
      detailDidChange: function () {
        var hours,
          rate;
        if (this.isDirty()) {
          hours = this.get('hours') || 0;
          rate = this.get('rate') || 0;
          this.set('total', hours * rate);
        }
      },
      
      statusDidChange: function () {
        var K = XM.Model,
          status = this.getStatus();
        if (status === K.READY_CLEAN) {
          this.setReadOnly('projectTask');
          this.setReadOnly('customer');
          this.setReadOnly('item');
        }
      },
      
      worksheetDidChange: function () {
        var K = XM.Model,
          status = this.getStatus(),
          worksheet = this.get('worksheet'),
          lineNumber = this.get('lineNumber');
        if (worksheet && status === K.READY_NEW && !lineNumber) {
          this.set('lineNumber', worksheet.get('time').length);
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.WorksheetExpense = XM.Model.extend(
      /** @scope XM.WorksheetExpense.prototype */ {

      recordType: 'XM.WorksheetExpense',
      
      defaults: {
        billable: false,
        prepaid: false,
        rate: 0,
        total: 0
      },
      
      readOnlyAttributes: [
        "lineNumber",
        "total"
      ],
      
      requiredAttributes: [
        "lineNumber",
        "workDate",
        "projectTask",
        "item",
        "quantity",
        "rate"
      ],
      
      initialize: function () {
        XM.Model.prototype.initialize.apply(this, arguments);
        this.on('change:worksheet', this.worksheetDidChange);
        this.on('change:quantity change:rate', this.detailDidChange);
        this.on('statusChange', this.statusDidChange);
        this.statusDidChange();
      },
      
      detailDidChange: function () {
        var quantity,
          rate;
        if (this.isDirty()) {
          quantity = this.get('quantity') || 0;
          rate = this.get('rate') || 0;
          this.set('total', quantity * rate);
        }
      },
      
      statusDidChange: function () {
        var K = XM.Model,
          status = this.getStatus();
        if (status === K.READY_CLEAN) {
          this.setReadOnly('projectTask');
          this.setReadOnly('customer');
          this.setReadOnly('item');
        }
      },
      
      worksheetDidChange: function () {
        var K = XM.Model,
          status = this.getStatus(),
          worksheet = this.get('worksheet'),
          lineNumber = this.get('lineNumber');
        if (worksheet && status === K.READY_NEW && !lineNumber) {
          this.set('lineNumber', worksheet.get('expenses').length);
        }
      }

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
    XM.WorksheetImage = XM.Model.extend({
     /** @scope XM.WorksheetImage.prototype */

      recordType: 'XM.WorksheetImage',

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
