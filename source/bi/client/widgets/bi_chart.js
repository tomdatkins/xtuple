/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Generic implementation of customizable analytic chart.  Responsible for:
     - providing MDX metadata (for now)
     - handling collections
     - saves
     
     Note support for multiple collections corresponding to multiple queryTemplates.
     Most charts just use one MDX query and the one collection (collections[0]).  But
     as Pentaho does not yet support multiple queries (or subqueries) we can join 
     multiple query results ourselves.
  */
  enyo.kind(
    /** @lends XV.BiChart# */{
    name: "XV.BiChart",
    published: {
      //****************** these published fields should not be overridden *******************
      processedData: [],
      value: null,              // the backing collection for chart generation
      model: null,              // the backing chart model
      removeIconShowing: false, // show "x" icon to remove chart
      order: null,              // order number of the chart
      collections: [],          // set of collection objects for each queryString
      queryStrings: [],         // set of queryTemplates with values substituted
      /*
       * Cube meta data is a temporary structure until we develop a 
       * cube discovery route
       */
      cubeMeta: {
        Backlog: {name: "SOByPeriod",
          measures: ["Balance, Backlog", "Days, Booking to Shipment", "Interest, B2S Impact",
                    "Amount, Shipment", "Amount, Booking", "Amount, Cost", "Count, Bookings"],
          measureNames: ["Balance, Orders Unfulfilled", "O2D Days", "Interest, O2D Impact",
                    "Amount, Delivery Gross", "Amount, Order Gross", "Amount, Cost Gross", "Count, Orders"]
        },
        Shipment: {name: "SODelivery",
          measures: ["Amount, Shipment", "Amount, Cost", "Count, Bookings",
                     "Count, Shipments", "Amount, Profit", "Amount, Shipment Discount", "Percentage, Margin"],
          measureNames: ["Amount, Delivery Gross", "Amount, Cost Gross", "Count, Orders",
                         "Count, Deliveries", "Amount, Profit Gross", "Amount, Delivery Discount", "Percentage, Gross Margin"]
        },
        Booking: {name: "SOOrder",
          measures: ["Amount, Booking", "Count, Bookings", "Amount, Booking Discount", "Average, Booking"],
          measureNames: ["Amount, Order Gross", "Count, Orders", "Amount, Order Discount", "Average, Order Gross"]
        },
        Opportunity: {name: "CROpportunity",
          measures: ["Amount, Opportunity", "Count, Opportunities", "Percent, Probability Opportunity", "Amount, Opportunity Weighted",
                     "Average, Opportunity", "Average, Opportunity Weighted", "Days, Start to Assigned", "Days, Start to Target",
                     "Days, Start to Actual"],
          measureNames: ["Amount, Opportunity Gross", "Count, Opportunities", "Percent, Probability Opportunity", "Amount, Opportunity Weighted",
                     "Average, Opportunity Gross", "Average, Opportunity Weighted", "Days, Start to Assigned", "Days, Start to Target",
                     "Days, Start to Actual"]
        },
        OpportunityBooking: {name: "CROpportunityAndOrder",
          measures: ["Amount, Booking", "Amount, Opportunity", "Count, Opportunities", "Count, Bookings", "Percent, Probability Opportunity",
                     "Amount, Opportunity Weighted", "Average, Booking", "Average, Opportunity", "Average, Opportunity Weighted",
                     "Ratio, Conversion", "Ratio, Conversion Weighted"],
          measureNames: ["Amount, Order Gross", "Amount, Opportunity Gross", "Count, Opportunities", "Count, Orders", "Percent, Probability Opportunity",
                         "Amount, Opportunity Weighted", "Average, Order Gross", "Average, Opportunity Gross", "Average, Opportunity Weighted",
                         "Ratio, Conversion", "Ratio, Conversion Weighted"]
        },
        Quote: {name: "CRQuote",
          measures: ["Amount, Quote", "Count, Quotes", "Amount, Quote Discount", "Average, Quote"],
          measureNames: ["Amount, Quote Gross", "Count, Quotes", "Amount, Quote Discount", "Average, Quote Gross"]
        },
        OpportunityForecast: {name: "CROpportunityForecast",
          measures: ["Amount, Opportunity Forecast", "Amount, Opportunity Forecast Weighted", "Percent, Forecast Probability",
                     "Count, Opportunities"],
          measureNames: ["Amount, Opportunity Forecast", "Amount, Opportunity Forecast Weighted", "Percent, Forecast Probability",
                     "Count, Opportunities"]
        },
      },

      //******* these ones can/should be overridden (although some have sensible defaults) *********
      cubeMetaOverride: null,               // some charts need specific measures
      chartTitle: "_chartTitle".loc(),
      collection: "",                     // class name for collection
      drillDown: [],
      chartOptions: [],
      queryTemplates: [],
      cube: "",
      chart : function () {
        return nv.models.multiBarChart();
      },
      chartHeight: "",                    // chart should implement setHeight(max)
      chartWidth: ""                      // chart should implement setWidth(max)

    },
    classes: "selectable-chart",
    events: {
      onChartRemove: "",
      onSearch: "",
      onWorkspace: "",
      onStatusChange: ""
    },
    /**
      Remove this chart from it's parent (if applicable)
    */
    chartRemoved: function (inSender, inEvent) {
      inEvent.model = this.getModel();
      this.doChartRemove(inEvent);
    },
    /**
     * Implementer calls this to fetch each collection. This will drive 
     * the collection's synch method.  On success of last collection, processData 
     * will drive processDataChanged which calls plot.
    */
    fetchCollection: function () {
      var that = this;
      _.each(this.collections, function (collection) {
        collection.setQueryComplete(false);
      });
      _.each(this.collections, function (collection, i) {
        collection.fetch({
          data : {mdx : this.getQueryStrings()[i]},
          success: function (collection, results) {
            //
            // Collection fetches can complete in any order.  Wait till all are
            // complete and then process data.
            //
            var allComplete = true;
            _.each(that.collections, function (coll) {
              allComplete = allComplete && coll.getQueryComplete();
            });
            if (allComplete) {
              // Hide the scrim
              that.$.spinnerPopup.hide();
              // Set the values in the pickers, initialize model
              that.modelChanged();
              // Set the order of the chart
              that.orderChanged();
              // Save the data results
              that.processData();
            }
          }
        });
      }, this);
    },

    /**
      Create collections. Implementer is responsible for updating
      the queryTemplates, fetching the collections and creating the 
      chart area.
     */
    create: function () {
      this.inherited(arguments);

      var that = this,
        collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      //
      // Make collection object for each queryTemplate.  Create this object
      // for collections so they are not shared across all charts.
      //
      this.collections = [];
      this.queryStrings = [];
      if (!Klass) {
        return;
      }
      _.each(this.queryTemplates, function () {
        this.collections.push(new Klass());
      }, this);

    },
    /**
      Save the model that has been changed.
    */
    save: function (model) {
      var options = {};
      options.success = function (model, resp, options) {
        // We have a save! Great! Now we can do something
        // else in here if we so desire.
      };
      model.save(null, options);
    },

    orderChanged: function () {
      this.getModel().set("order", this.getOrder());
    },
    /**
      Set chart component widths and heights using max sizes from dashboard - up to chart implementor.
     */
    setComponentSizes: function (maxHeight, maxWidth) {
    },
    /**
      Set chart plot size using max sizes from dashboard - up to chart implementor.
     */
    setPlotSize: function (maxHeight, maxWidth) {
    },
    /**
      Drill down to list or item - up to implementer. 
     */
    drillDown: function (field, key) {
    },
    /**
      Make the chart - up to chart implementer. 
     */
    plot: function (type) {
    },
    /**
      Update Queries based on pickers - up to chart implementer. 
     */
    updateQueries: function (pickers) {
    },
    /**
      Model changed, set pickers and initialize model - up to chart implementer.
     */
    modelChanged: function () {
    },
    
    /*
     * Destroy and re-plot the chart area when the data changes - up to chart implementer
     */
    processedDataChanged: function () {
    },
    /**
      After render, replot the charts.
    */
    rendered: function () {
      this.inherited(arguments);
      this.processData();
    },
    /**
      Set model bindings on the chart
    */
    setBindings: function (action) {
      action = action || 'on';
      this.model[action]("statusChange", this.statusChanged, this);
    },
    /**
      Bubble a status changed event to the Dashboard so that it
      can control the spinner and save buttons.
    */
    statusChanged: function (model, status, options) {
      var inEvent = {model: model, status: status};
      this.doStatusChange(inEvent);
    }
  });

}());
