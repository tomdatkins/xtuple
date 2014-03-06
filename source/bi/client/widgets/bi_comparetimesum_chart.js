/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Compare multiple measures using sum of trailing 12 periods and previous
    12 periods.  Responsible for:
    -  update of query templates based on ending period.
    -  processing time series data to dimple format
    -  plotting with dimple
  */
  
  enyo.kind(
    /** @lends XV.TimeSeriesChart # */{
    name: "XV.BiCompareTimeSumChart",
    kind: "XV.BiChartNoPicker",
    published: {
      dateField: "",
      chartTag: "svg",
      plotHeight: 0,
      nextPeriods: 0, // number of periods to add to end date for forecasts
      plotWidth: 0,
      nextPeriods: 0, // number of periods to add to end date for forecasts
    },
    
    /**
      Process the data from xmla4js format to dimplejs format
      
      Input format:
      [
        {
          "[Measures].[measure-1]": "202500",
          "[Measures].[measure-prev-1]": "102500",
          "[Measures].[measure-2]": "2025",
          "[Measures].[measure-prev-2]": "1025",                 
        }
      ]
      Output format:
      [
        {
          "values": [
          {
            "Label": "Start to Assigned",
            "Measure": "202500",
            "Legend": "2014"
          },
          {
            "Label": "Start to Assigned, Previous Year",
            "Measure": "102500",
            "Legend": "2013"
          },
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
    
    /**
      Update Queries cube name using cube meta data. Use current year & month 
      or next periods if nextPeriods set.
     */
    updateQueries: function (pickers) {
      var cubeMeta = this.getCubeMetaOverride() ? this.getCubeMetaOverride() : this.getCubeMeta(),
        date = new Date();
      date.setMonth(date.getMonth() + this.getNextPeriods());
      _.each(this.queryTemplates, function (template, i) {
        var cube = cubeMeta[template.cube].name;
        this.queryStrings[i] = template.query.replace("$cube", cube);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$year/g, date.getFullYear());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$month/g, date.getMonth() + 1);
      }, this
      );
    },

    processData: function () {
      var formattedData = [],
        collection = this.collections[0],
        date = new Date();
      date.setMonth(date.getMonth() + this.getNextPeriods());
      if (collection.models.length > 0) {
      
        // Construct the values using the 
        // *  concatenation of dimensions for the Period
        // *  measure value as Measure
        // *  measure name as MeasureYear
        var values = [],
          entry = {};
        for (var i = 0; i < this.measures.length; i++) {
          var teststr = "[Measures].[measure-" + (i * 2 + 1) + "]";
          entry = { "Label" : this.measures[i],
                        "Measure" : collection.models[0].attributes["[Measures].[measure-" + (i * 2 + 1) + "]"],
                        "Legend" : date.getFullYear() + "-" + (date.getMonth() + 1)};
          values.push(entry);
          entry = { "Label" : this.measures[i] + ", Previous Year",
                        "Measure" : collection.models[0].attributes["[Measures].[measure-" + (i * 2 + 2) + "]"],
                        "Legend" : (Number(date.getFullYear()) - 1) + "-" + (date.getMonth() + 1)};
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
        var divId = this.$.chart.$.svg.hasNode().id,
          svg = dimple.newSvg("#" + divId, 590, 400),
          myChart = new dimple.chart(svg, this.getProcessedData()[0].values);
        myChart.setBounds(180, 30, this.getPlotWidth(), this.getPlotHeight());
        //
        // Define chart axis
        //
        var y = myChart.addCategoryAxis("y", "Label"),
          x = myChart.addMeasureAxis("x", "Measure");
        y.addOrderRule("Label");
        //
        // Create dimple series with legend based on type
        //
        var chartFunc = this.getChart(),
          chart = chartFunc("barChart"),
          series = myChart.addSeries("Legend", chart),
          legend = myChart.addLegend(65, 10, 400, 20, "center", series);
        //
        // draw chart
        //
        myChart.draw();
        //
        // after chart is drawn, use d3 to change axis and legend text and colors
        //
        x.shapes.selectAll("text").attr("fill", "#FFFFFF");
        x.titleShape.text("Days");
        x.titleShape.attr("fill", "#FFFFFF");
        y.shapes.selectAll("text").attr("fill", "#FFFFFF");
        y.titleShape.text("Measure");
        y.titleShape.attr("fill", "#FFFFFF");
        legend.shapes.selectAll("text").attr("fill", "#FFFFFF");
      }
    },
    /**
      Set chart plot size using max sizes from dashboard.
     */
    setPlotSize: function (maxHeight, maxWidth) {
      this.setPlotWidth(Number(maxWidth) - 180);
      this.setPlotHeight(Number(maxHeight) - 130);
    },
    
    /**
      Make title
     */
    makeTitle: function () {
      var date = new Date(),
        title = "";
      date.setMonth(date.getMonth() + this.getNextPeriods());
      title = this.getChartTitle() + "_ending".loc() + date.getFullYear() + "-" + (date.getMonth() + 1);
      return title;
    },
    
  });

}());
