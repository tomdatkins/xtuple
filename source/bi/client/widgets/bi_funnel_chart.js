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
      dateField: ""
    },
    
    /**
      Process the data from xmla4js format to rgraph format
      
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
      
      _.each(this.collections, function (collection, i) {
        if (collection.models.length > 0) {
          formattedData.push(collection.models[0].attributes["[Measures].[THESUM]"]);
          this.labels[i] += collection.models[0].attributes["[Measures].[THESUM]"];
        }
        else {
          formattedData.push("0");
          this.labels[i] += "0";
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
        var funnel = new RGraph.Funnel('cvs', this.getProcessedData())
          .Set('labels', this.getLabels())
          .Set('gutter.left', 180)
          .Set('labels.sticks', true)
          .Set('strokestyle', 'rgba(0,0,0,0)')
          .Set('text.boxed', true)
          .Set('labels.x', 10)
          .Set('shadow', true)
          .Set('shadow.offsetx', 0)
          .Set('shadow.offsety', 0)
          .Set('shadow.blur', 15)
          .Set('shadow.color', 'gray')
          .Set('chart.tooltips', this.getToolTips())
          .Draw();
      }
    },
  });

}());
