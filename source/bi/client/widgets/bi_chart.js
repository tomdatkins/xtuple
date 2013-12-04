/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Generic implementation of customizable analytic chart.
    Uses nvd3 for SVG rendering.
  */
  enyo.kind(
    /** @lends XV.BiChart# */{
    name: "XV.BiChart",
    published: {
      // these published fields should not be overridden
      processedData: null,
      // this groupByAttr is set to undefined so as to distinguish
      // it from "", which could mean to groupBy all values
      groupByAttr: undefined,
      chartType: "barChart",
      value: null, // the backing collection for chart generation
      model: null, // the backing chart model
      removeIconShowing: false, // show "x" icon to remove chart
      order: null, // order number of the chart

      // these ones can/should be overridden (although some have sensible defaults)
      chartTitle: "_chartTitle".loc(),
      collection: "", // {String} e.g. "XM.IncidentListItemCollection"
      drillDownRecordType: "",
      drillDownAttr: "",
      chartOptions: [],
      groupByOptions: [],
      query: { parameters: [] },
      queryString: "",
      queryTemplate: "",
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
          measureNames: ["Amount, Order Gross", "Count, Orders", "Amount, Order Discount", "Average, Order Gross",]
        }
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
      Get the grouped data in the JSON format the chart wants. Up to the implementation.
     */
    aggregateData: function (groupedData) {
      return groupedData;
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
      this.getValue().fetch({
        data : {mdx : this.getQueryString()},
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
      // Make and fetch the collection
      //
      if (!Klass) {
        return;
      }
      this.setValue(new Klass());

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
      Update query with selected parameters
     */
    updateQuery: function () {
      //
      // Use cube metadata to replace cube name and measure name in query 
      //
      var cube = this.getCubeMeta()[this.getCube()].name;
      this.setQueryString(this.getQueryTemplate().replace("$cube", cube));
      var index = this.getMeasures().indexOf(this.getMeasure());
      var measure = this.getCubeMeta()[this.getCube()].measureNames[index];
      this.setQueryString(this.getQueryString().replace(/\$measure/g, measure));
      var date = new Date();
      this.setQueryString(this.getQueryString().replace(/\$year/g, date.getFullYear()));
      this.setQueryString(this.getQueryString().replace(/\$month/g, date.getMonth() + 1));
    },
    
    /**
      Make the chart using v3 and nv.d3, working off our this.processedData.
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

  enyo.kind(
    /** @lends XV.TimeSeriesChart # */{
    name: "XV.BiTimeSeriesChart",
    kind: "XV.BiChart",
    published: {
      dateField: ""
    },

    /**
      Process the data from xmla4js format to nvd3 format
 
    processData: function () {
      
      var formattedData = [];
      var collection = this.getValue();
      
      if (collection.models.length > 0) {
      
        var measureNumber = 0;
        for (var propt in collection.models[0].attributes) {

          if (propt.indexOf("[Measures]") !== -1) {
            var values = [];

            for (var i = 0; i < collection.models.length; i++) {
              values.push({ x: collection.models[i].attributes[this.getPlotDimension1()] +
                               '-' +
                               collection.models[i].attributes[this.getPlotDimension2()],
                y: collection.models[i].attributes[propt]});
              //values.push({ x: collection.models[i].attributes[this.getPlotDimension2()],
              //  y: collection.models[i].attributes[propt]});
            }

            formattedData.push({ values: values,
              key: this.getMeasureCaptions()[measureNumber],
              color: this.getMeasureColors()[measureNumber]});
            measureNumber++;
          }
        }
        //
        //  This will drive processDataChanged which will call plot
        //
        this.setProcessedData(formattedData);
      }
    },
    */
    
    /**
      Process the data from xmla4js format to dimplejs format
      
      Input format:
      [
        {
          "[Delivery Date.Calendar Months].[Year].[MEMBER_CAPTION]": "2012",
          "[Delivery Date.Calendar Months].[Month].[MEMBER_CAPTION]": "12",
          "[Measures].[KPI]": "0",
          "[Measures].[prevYearKPI]": "202500"
        }
      ]
      Output format:
      [
        {
          "values": [
          {
            "Period": "2012-12",
            "Measure": "0",
            "MeasureYear": "Amount, Shipment"
          },
          {
            "Period": "2012-12",
            "Measure": "202500",
            "MeasureYear": "Previous Year"
          }
         ]
        }
      ]

    */
    processData: function () {
      
      var formattedData = [];
      var collection = this.getValue();
      
      if (collection.models.length > 0) {
      
        // Construct the values using the 
        // *  concatenation of dimensions for the Period
        // *  measure value as Measure
        // *  measure name as MeasureYear
        var values = [];
        for (var i = 0; i < collection.models.length; i++) {
          var entry = { "Period" : collection.models[i].attributes[this.getPlotDimension1()] +
                          '-' +
                          collection.models[i].attributes[this.getPlotDimension2()],
                          "Measure" : collection.models[i].attributes["[Measures].[KPI]"],
                          "MeasureYear" : this.getMeasure()};
          values.push(entry);
          entry = { "Period" : collection.models[i].attributes[this.getPlotDimension1()] +
                          '-' +
                          collection.models[i].attributes[this.getPlotDimension2()],
                          "Measure" : collection.models[i].attributes["[Measures].[prevYearKPI]"],
                          "MeasureYear" : "Previous Year"};
          values.push(entry);
        }
        formattedData.push({ values: values, measures: this.getMeasureCaptions()});
      }
      //
      //  This will drive processDataChanged which will call plot
      //
      this.setProcessedData(formattedData);
    },

    plot: function (type) {
      var navigatorChildren = XT.app.$.postbooks.$.navigator.$.contentPanels.children,
        activePanel = navigatorChildren[navigatorChildren.length - 1],
        thisPanel = this.parent.parent;

      if (thisPanel.name !== activePanel.name) {
        // do not bother rendering if the user has already moved off this panel
        return;
      }

      /*  nvd3 plot
      
      var that = this,
        div = this.$.chart.$.svg.hasNode();

      var chartFunc = this.getChart();
      var chart = chartFunc(type);

      chart.xAxis
        .tickFormat(d3.format(', .0f'));

      chart.yAxis
        .tickFormat(d3.format(', .0f'));

      chart.margin({left: 80});

      d3.select(div)
        .datum(this.getProcessedData())
        .transition().duration(500)
        .call(chart);

      // helpful reading: https://github.com/mbostock/d3/wiki/Selections
      d3.selectAll("text").style("fill", "white");
      */
      
      /* Dimple Plot
       */
      if (this.getProcessedData().length > 0) {
        var divId = this.$.chart.$.svg.hasNode().id;
        var svg = dimple.newSvg("#" + divId, 590, 400);
        var myChart = new dimple.chart(svg, this.getProcessedData()[0].values);
        myChart.setBounds(60, 30, 400, 75);
        var x = myChart.addCategoryAxis("x", ["Period", "MeasureYear"]);
        myChart.addMeasureAxis("y", "Measure");
        var chartFunc = this.getChart();
        var chart = chartFunc(type);
        myChart.addSeries("MeasureYear", chart);
        myChart.addLegend(65, 10, 400, 20, "center");
        myChart.draw();
      }
    },
  });

}());
