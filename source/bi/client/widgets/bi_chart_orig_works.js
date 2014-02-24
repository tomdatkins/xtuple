/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Generic implementation of customizable analytic chart with chart type picker
    and measure picker.  Need a superclass for common functions leaving only picker
    stuff in here.
  */
  enyo.kind(
    /** @lends XV.BiChart# */{
    name: "XV.BiChart",
    published: {
      // these published fields should not be overridden
      processedData: null,
      chartType: "barChart",
      value: null, // the backing collection for chart generation
      model: null, // the backing chart model
      removeIconShowing: false, // show "x" icon to remove chart
      order: null, // order number of the chart
      collections: [], // set of collection objects for each queryString
      queryStrings: [], // set of queryTemplates with values substituted

      // these ones can/should be overridden (although some have sensible defaults)
      chartTitle: "_chartTitle".loc(),
      collection: "",   // class name for collection
      drillDownRecordType: "",
      drillDownAttr: "",
      chartOptions: [],
      queryTemplates: [],
      measureCaptions: [],
      measureColors: [],
      measure: "",
      measures: [],
      cube: "",
      plotDimension1 : "",
      plotDimension2 : "",
      chart : function () {
        return nv.models.multiBarChart();
      },
      totalField: "", // what are we summing up in the bar chart (empty means just count)
      cubeMeta: { // temporary structure until we have a cube discovery route
        Backlog: {name: "SOByPeriod",
          measures: ["Balance, Backlog", "Days, Booking to Shipment", "Interest, B2S Impact",
                    "Amount, Shipment", "Amount, Booking", "Amount, Cost", "Count, Bookings"],
          measureNames: ["Balance, Orders Unfulfilled", "O2D Days", "Interest, O2D Impact",
                    "Amount, Delivery Gross", "Amount, Order Gross", "Amount, Cost Gross", "Count, Orders"]
        },
        Shipment: {name: "SODelivery",
          measures: ["Amount, Shipment", "Amount, Booking", "Amount, Cost", "Count, Bookings",
                     "Count, Shipments", "Amount, Profit", "Amount, Shipment Discount", "Percentage, Margin"],
          measureNames: ["Amount, Delivery Gross", "Amount, Order Gross", "Amount, Cost Gross", "Count, Orders",
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
      }
    },
    classes: "selectable-chart",
    components: [
      {kind: "onyx.Popup", name: "spinnerPopup",
        style: "margin-top:40px;margin-left:200px;",
        components: [
        {kind: "onyx.Spinner"},
        {name: "spinnerMessage", content: "_loading".loc() + "..."}
      ]},
      {name: "chartTitleBar", classes: "chart-title-bar", components: [
        {name: "chartTitle", classes: "chart-title"},
        {kind: "onyx.IconButton", name: "removeIcon",
          src: "/assets/remove-icon.png", ontap: "chartRemoved",
          classes: "remove-icon", showing: false}
      ]},

      {name: "chartWrapper", classes: "chart-bottom", components: [
        {name: "chart"},
        {kind: "enyo.FittableColumns", components: [
          {content: "_chartType".loc() + ": ", classes: "xv-picker-label", name: "chartTypeLabel"},
          {kind: "onyx.PickerDecorator", name: "chartPickerDecorator", onSelect: "chartSelected",
            components: [
            {kind: "XV.PickerButton", content: "_chooseOne".loc()},
            {name: "chartPicker", kind: "onyx.Picker"}
          ]},
          {content: "_measure".loc() + ": ", classes: "xv-picker-label"},
          {kind: "onyx.PickerDecorator", onSelect: "measureSelected",
            components: [
            {kind: "XV.PickerButton", content: "_chooseOne".loc()},
            {name: "measurePicker", kind: "onyx.Picker"}
          ]}
        ]}
      ]}
    ],
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
     * Perform collection's fetch.  This will drive the collection's synch method.
     * On complete, processData will drive processDataChanged which calls plot.
    */
    fetchCollection: function () {
      var that = this;
      _.each(this.collections, function (collection, i) {
        collection.fetch({
          data : {mdx : this.getQueryStrings()[i]},
          success: function (collection, results) {
            // Hide the scrim
            that.$.spinnerPopup.hide();
            // Set the values in the pickers, initialize model
            that.modelChanged();
            // Set the order of the chart
            that.orderChanged();
            // Save the data results
            that.processData();
          }
        });
      }, this);
    },

    /**
      Kick off the fetch on the collection as soon as we start.
     */
    create: function () {
      this.inherited(arguments);

      var that = this,
        collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      //
      // Show/Hide remove icon
      //
      this.$.removeIcon.setShowing(this.removeIconShowing);

      //
      // Set the chart title
      //
      this.$.chartTitle.setContent(this.getChartTitle());

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
      
      //
      // Populate the chart picker
      //
      _.each(this.getChartOptions(), function (item) {
        item.content = item.content || ("_" + item.name).loc(); // default content
        if (that.getChartOptions().length === 1) {
          // if there's only one option, no need to show the picker
          that.$.chartTypeLabel.setShowing(false);
          that.$.chartPickerDecorator.setShowing(false);
          that.setChartType(item.name);
        }
        that.$.chartPicker.createComponent(item);
      });

      //
      // Populate the Measure picker
      //
      this.setMeasures(this.getCubeMeta()[this.getCube()].measures);
      _.each(this.getMeasures(), function (item) {
        var pickItem = {name: item, content: item};
        that.$.measurePicker.createComponent(pickItem);
      });
      
      //
      // Create the chart plot area.  We dynamically create and destroy it
      // and reference with this.$.chart.$.svg
      //
      this.$.chart.createComponent({name: "svg", tag: "svg"});
      this.$.chart.render();
      
      var model = this.getModel();
      if (model.get("measure")) {
        this.setMeasure(model.get("measure"));
      }
      this.setChartType(model.get("chartType") || "barChart");
      
      //
      //  If the measure is defined, fill in the queryTemplate
      //  and ask the Collection to get data.
      //
      if (this.getMeasure()) {
        console.log("create chart, measure set so fetch & render");
        this.updateQuery();
        this.fetchCollection();
      }
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
    /**
      When the value changes, set the selected value
      in the picker widget and re-process the data.
    */
    chartTypeChanged: function () {
      console.log("type changed, destroy and plot");
      var that = this,
        selected = _.find(this.$.chartPicker.controls, function (option) {
          return option.name === that.getChartType();
        });
      if (selected) {
        this.$.chartPicker.setSelected(selected);
      }
      this.$.chart.$.svg.destroy();
      this.$.chart.createComponent({name: "svg", tag: "svg"});
      this.$.chart.render();
      this.plot(this.getChartType());
      //this.processData();
    },
    /**
      A new  value was selected in the picker. Set
      the published  attribute and the model.
    */
    chartSelected: function (inSender, inEvent) {
      this.setChartType(inEvent.originator.name);
      this.getModel().set("chartType", inEvent.originator.name);
      this.save(this.getModel());
    },
    /**
      When the measure value changes, set the selected value
      in the picker widget, fetch the data and re-process the data.
    */
    measureChanged: function () {
      console.log("measure changed, fetch and process");
      var that = this,
        selected = _.find(this.$.measurePicker.controls, function (option) {
          return option.name === that.getMeasure();
        });
      this.$.measurePicker.setSelected(selected);
      this.setMeasureCaptions([this.getMeasure(), "Previous Year"]);
      this.updateQuery();
      this.fetchCollection();
      this.processData();
    },
    /**
      A new measure was selected in the picker. Set
      the published measure attribute.
    */
    measureSelected: function (inSender, inEvent) {
      this.setMeasure(inEvent.originator.name);
      this.getModel().set("measure", inEvent.originator.name);
      this.save(this.getModel());
    },
    
    /**
      Set the  values from the model. Set binding
      on the new model.
    */
    modelChanged: function () {
      var model = this.getModel(), K = XM.Model;
      this.setMeasure(model.get("measure"));
      this.setChartType(model.get("chartType") || "barChart");
      this.setBindings('on');
    },
    
    orderChanged: function () {
      this.getModel().set("order", this.getOrder());
    },
    
    /**
      Update queryTemplates[] with selected parameters and place in queryStrings[]
     */
    updateQuery: function () {
      //
      // Use cube metadata to replace cube name and measure name in query 
      //
      _.each(this.queryTemplates, function (template, i) {
        var cube = this.getCubeMeta()[this.getCube()].name;
        this.queryStrings[i] = template.replace("$cube", cube);
        var index = this.getMeasures().indexOf(this.getMeasure());
        var measure = this.getCubeMeta()[this.getCube()].measureNames[index];
        this.queryStrings[i] = this.queryStrings[i].replace(/\$measure/g, measure);
        var date = new Date();
        this.queryStrings[i] = this.queryStrings[i].replace(/\$year/g, date.getFullYear());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$month/g, date.getMonth() + 1);
      }, this
      );
    },
    
    /**
      Make the chart.
     */
    plot: function (type) {
      // up to the implementation
    },
    
    processedDataChanged: function () {
      this.$.chart.$.svg.destroy();
      this.$.chart.createComponent({name: "svg", tag: "svg"});
      this.$.chart.render();
      this.plot(this.getChartType());
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
