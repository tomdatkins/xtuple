/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart Responsible for:
      - enyo components
      - requesting update of query templates based on pickers
      - creating chart area    
  */
  enyo.kind(
    /** @lends XV.BiChartMeasure# */{
    name: "XV.BiChartNoPicker",
    kind: "XV.BiChart",
    published: {
      // these ones can/should be overridden (although some have sensible defaults)
      chartType: "barChart",
      chartTag: "svg",
      measure: "",
      measureCaptions: [],
      measures: [],
    },
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
        {name: "chart"}
      ]}
    ],

    /**
      Create chart area, populate the pickers and kickoff fetch of collections.
    */
    create: function () {
      this.inherited(arguments);
      
      var that = this;
                  
      //
      // Create the chart plot area. 
      //
      this.createChartComponent();

      //
      // Show/Hide remove icon
      //
      this.$.removeIcon.setShowing(this.removeIconShowing);

      //
      // Set the chart title
      //
      this.$.chartTitle.setContent(this.makeTitle());
            
      
      //
      //  Fill in the queryTemplate and ask the Collection to get data.
      //
      this.updateQueries([this.getMeasure()]);
      this.fetchCollection();
    },
    /**
      Set chart component widths and heights using max sizes from dashboard - up to chart implementor.
     */
    setComponentSizes: function (maxHeight, maxWidth) {
      var height = Number(maxHeight) - 20,
        width = Number(maxWidth) - 20;
      this.setStyle("width:" + width + "px;height:" + height + "px;");               // class selectable-chart
      this.$.chartWrapper.setStyle("width:" + width + "px;height:" + (height - 32) + "px;");
      this.$.chartTitleBar.setStyle("width:" + width + "px;height:32px;");
      this.$.chart.setStyle("width:" + width + "px;height:" +
          (height - 0) + "px;");
    },
    /**
      Create chart plot area.  Destroy if already created.
    */
    createChartComponent: function () {
      if (typeof this.$.chart.$.svg !== "undefined") {
        this.$.chart.$.svg.destroy();
      }
      this.$.chart.createComponent(
          {name: "svg",
            tag: this.getChartTag(),
            content: " ",
            attributes: {width: 500, height: 250}
            }
          );
      this.$.chart.render();
    },

    /**
     * Destroy and re-plot the chart area when the data changes.
     */
    processedDataChanged: function () {
      this.createChartComponent();
      this.plot(this.getChartType());
    },
    
  });

}());
