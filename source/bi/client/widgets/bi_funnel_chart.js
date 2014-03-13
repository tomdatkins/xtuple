/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, RGraph:true console:true */

(function () {

  /**
    Funnel Chart using RGraph.  Responsible for:
    -  update of query templates based on pickers
    -  processing multiple query results into RGraph format
    -  plotting with RGraph
  */
  
  enyo.kind(
    /** @lends XV.TimeSeriesChart # */{
    name: "XV.BiFunnelChart",
    kind: "XV.BiChartMeasure",
    published: {
      dateField: "",
      chartTag: "canvas",  //rgraph requires the html5 canvas tag
      labels: [],
      updatedLabels: [],
      nextPeriods: 0, // number of periods to add to end date for forecasts
      toolTips: [],
      plotHeight: 0,
      plotWidth: 0
    },
    
    /**
      Any initialization 
    */
    create: function () {
      this.inherited(arguments);
      this.updatedLabels = [];           //we modify labels with data so we make a this object
    },
    
    /**
      Update Queries based on pickers using cube meta data.  Replace cube name, measure
      name.  Use current year & month.
     */
    updateQueries: function (pickers) {
      var index = this.getMeasures().indexOf(pickers[0]),
        cubeMeta = this.getCubeMetaOverride() ? this.getCubeMetaOverride() : this.getCubeMeta(),
        date = new Date();
      _.each(this.queryTemplates, function (template, i) {
        var cube = cubeMeta[template.cube].name,
          measure = cubeMeta[template.cube].measureNames[index];
        this.queryStrings[i] = template.query.replace("$cube", cube);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$measure/g, measure);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$year/g, date.getFullYear());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$month/g, date.getMonth() + 1);
      }, this
      );
    },
    
    /**
      Process the data from xmla4js format to rgraph format.  If all the collections have models
      with no data, we assume queries haven't run and processedData does not change.  But if 
      some have data we fill in "no data" with 0's.  For 0, we use .1 as RGraph does not
      deal well with 0's.
      
      Input format:
      [
        {
          "[Measures].[THESUM]": "256",
        }
      ]
      Output format:
      [256]
    */
    processData: function () {
      //
      // This is kind of a hack as the funnel chart does not display an image if the
      // value is zero.  When we want to show a zero we used a small number and put 0 
      // in the label.  But if there is no data at all the funnel looks better with 
      // no data.
      //
      var formattedData = [],
        colls = this.collections,
        anyData = false,
        // Get the actual measure so we can format the number in the label
        // based on Amount, Count, etc.  Use first cubeMeta as all measures
        // must have the same types in each
        index = this.getMeasures().indexOf(this.getMeasure()),
        cubeMeta = this.getCubeMetaOverride() ? this.getCubeMetaOverride() : this.getCubeMeta(),
        measure = cubeMeta[Object.keys(cubeMeta)[0]].measureNames[index]; 
      
      this.updatedLabels = this.labels.slice();
      
      _.each(this.collections, function (collection, i) {
        formattedData[i] = 0.1;
        this.updatedLabels[i] = this.labels[i] + "0";
        if (collection.models.length > 0) {
          var theSum = Number(collection.models[0].attributes["[Measures].[THESUM]"]),
            sumFormatted = "";
          if (measure.indexOf("Amount") !== -1) {
            sumFormatted = XV.FormattingMixin.formatMoney(theSum, this);
          }
          else {
            sumFormatted = XV.FormattingMixin.formatQuantity(theSum, this);
          }
          anyData = true;
          formattedData[i] = (theSum ? Number(theSum) : 0.1);
          this.updatedLabels[i] = this.labels[i] + (theSum ? sumFormatted : "0");
        }
      }, this);
      
      if (!anyData) {
        formattedData = [];
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
           
      /* rgraph Plot */
      if (this.getProcessedData().length > 0) {
        var canvasId = this.$.chart.$.svg.hasNode().id,
          funnel = new RGraph.Funnel(canvasId, this.getProcessedData());
        
        funnel.Set('labels', this.getUpdatedLabels());
        funnel.Set('gutter.left', 350);
        funnel.Set('labels.sticks', true);
        funnel.Set('strokestyle', 'rgba(0,0,0,0)');
        funnel.Set('text.boxed', false);
        funnel.Set('text.color', "white");
        funnel.Set('labels.x', 30);
        funnel.Set('shadow', true);
        funnel.Set('shadow.offsetx', 0);
        funnel.Set('shadow.offsety', 0);
        funnel.Set('shadow.blur', 15);
        funnel.Set('shadow.color', 'gray');
        funnel.Set('tooltips', this.getToolTips());
        funnel.Draw();
      }
    },
    /**
      Set chart plot size using max sizes from dashboard.
     */
    setPlotSize: function (maxHeight, maxWidth) {
      this.setPlotWidth(Number(maxWidth) - 100);
      this.setPlotHeight(Number(maxHeight) - 180);
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
