/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Trailing 12 periods time series chart using Dimple.js.  Responsible for:
    -  processing time series data to dimple format
    -  plotting with dimple
  */
  
  enyo.kind(
    /** @lends XV.TimeSeriesChart # */{
    name: "XV.BiTimeSeriesChart",
    kind: "XV.BiChartTypeMeasure",
    published: {
      dateField: "",
      chartTag: "svg",
      plotHeight: 0,
      plotWidth: 0
    },
    
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
    
    /**
      Any initialization 
    */
    create: function () {
      this.inherited(arguments);
    },

    processData: function () {
      var formattedData = [];
      var collection = this.collections[0];
      
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
      
      /* Dimple Plot
       */
      if (this.getProcessedData().length > 0) {
        //
        // Make dimple chart in svg area
        //
        var divId = this.$.chart.$.svg.hasNode().id;
        var svg = dimple.newSvg("#" + divId, 590, 400);
        var myChart = new dimple.chart(svg, this.getProcessedData()[0].values);
        myChart.setBounds(60, 30, this.getPlotWidth(), this.getPlotHeight());
        //
        // Define chart axis
        //
        var x = myChart.addCategoryAxis("x", ["Period", "MeasureYear"]);
        var y = myChart.addMeasureAxis("y", "Measure");
        //
        // Create dimple series based on type
        //
        var chartFunc = this.getChart();
        var chart = chartFunc(type);
        myChart.addSeries("MeasureYear", chart);
        myChart.addLegend(65, 10, 400, 20, "center");
        //
        // draw chart
        //
        myChart.draw();
        //
        // after chart is drawn, use d3 to change axis text colors
        //
        x.shapes.selectAll("text").attr("fill", "#FFFFFF");
        y.shapes.selectAll("text").attr("fill", "#FFFFFF");
      }
    },
    /**
      Set chart plot size using max sizes from dashboard.
     */
    setPlotSize: function (maxHeight, maxWidth) {
      this.setPlotWidth(Number(maxWidth) - 100);
      this.setPlotHeight(Number(maxHeight) - 180);
    },
    
  });

}());
