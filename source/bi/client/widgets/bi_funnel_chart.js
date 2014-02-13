/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, RGraph:true console:true */

(function () {

  /**
    Funnel Chart using rgraph.  Responsible for:
    -  processing multiple xmla4js results into rgraph format
    -  plotting with rgraph
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
      toolTips: []
    },
    
    /**
      Any initialization 
    */
    create: function () {
      this.inherited(arguments);
      this.updatedLabels = [];           //we modify labels with data so we make a this object
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
      var formattedData = [];
      this.updatedLabels = this.labels.slice();
      
      var colls = this.collections;
      
      _.each(this.collections, function (collection, i) {
        if (collection.models.length > 0) {
          var theSum = collection.models[0].attributes["[Measures].[THESUM]"];
          formattedData[i] = (theSum ? Number(theSum) : 0.1);
          this.updatedLabels[i] = this.labels[i] + (theSum ? theSum : "0");
          for (var j = i + 1; j < this.collections.length; j++) {
            formattedData[j] = 0.1;
            this.updatedLabels[j] = this.labels[j] + "0";
          }
        }
      }, this);
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
        
        var pd = this.getProcessedData();
        
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
  });

}());
