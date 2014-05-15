/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart Responsible for:
      - enyo components
      - filter management
      - requesting update of query templates based on pickers
      - creating chart area    
  */
  enyo.kind(
    /** @lends XV.BiChartMeasure# */{
    name: "XV.BiChartNoPicker",
    kind: "XV.BiChart",
    published: {
      chartType: "barChart",
      chartTag: "svg",
      maxHeight: 0,
      measures: [],
      // queryParms:
      time: "",
      where: "",
      // May want to override these in the implementation 
      parameterWidget: "XV.SalesChartParameters",
      initialWhere: ""
    },
    handlers: {
      onParameterChange: "parameterDidChange"
    },
    components: [
      {kind: "onyx.Popup", name: "spinnerPopup",
        style: "margin-top:40px;margin-left:200px;",
        components: [
        {kind: "onyx.Spinner"},
        {name: "spinnerMessage", content: "_loading".loc() + "..."}
      ]},

      {name: "chartGroup",
        kind: "XV.Groupbox",
        classes: "chart-title-bar",
        components: [
          {kind: "onyx.GroupboxHeader",
            classes: "chart-title-bar",
            style: "display: flex;",
            components: [
              {name: "chartTitle", classes: "chart-title"},
              {name: "filterIcon",
                 classes: "icon-filter",
                 ontap: "filterTapped"
              },
            ]
          },
            {kind: "onyx.IconButton", name: "removeIcon",
              src: "/assets/remove-icon.png", ontap: "chartRemoved",
              classes: "remove-icon", showing: false
            },
            
            {name: "scrollableDrawer", kind: "XV.ScrollableGroupbox", components: [
              {name: "filterDrawer", kind: "onyx.Drawer", open: false
                //components: [{name: "parms", kind: "XV.ChartParameters"}]
              },
            ]},

            {name: "chartWrapper", classes: "chart-bottom", components: [
              {name: "chart"},
            ]}
          ]}
       
        ],
    
        /**
          Create chart area, populate the pickers and kickoff fetch of collections.
        */
        create: function () {
          this.inherited(arguments);
          var that = this;
                      
          // Create the chart plot area. 
          this.createChartComponent();
    
          // Show/Hide remove icon
          this.$.removeIcon.setShowing(this.removeIconShowing);
    
          // Set the chart title
          this.$.chartTitle.setContent(this.getInitialChartTitle());
          
          // Set the parameterWidget for filters
          this.$.filterDrawer.createComponent({name: "parms", kind: this.getParameterWidget()});
          
          // Set the initial Where clause
          if (this.initialWhere) {
            this.setWhere(" WHERE ( " + this.getInitialWhere() + ")");
          }
                         
          //  Fill in the queryTemplate and ask the Collection to get data.
          this.updateQueries();
          this.fetchCollection();
        },
        /*
         *   Because we have a drawer in a scrollable we have to change the size
         *   on open and close.
         */
        filterTapped: function () {
          var drawerHeight = this.getMaxHeight() - 40; //adjust for title size +
          if (!this.$.filterDrawer.open) {
            this.$.scrollableDrawer.applyStyle("height", drawerHeight + "px");
          }
          else {
            this.$.scrollableDrawer.applyStyle("height", null);
          }
          this.$.filterDrawer.setOpen(!this.$.filterDrawer.open);
        },
        /*
         * Construct WHERE clause based on initialWhere and parameterWidget filter settings.
         * Update the query and fetch.
         */
        parameterDidChange: function (inSender, inEvent) {
          var parameterWidget = this.$.filterDrawer.$.parms,
            parameters = parameterWidget ? parameterWidget.getParameters() : [],
            dimensionCode = "",
            that = this,
            whereClause = " WHERE ( " + this.getInitialWhere(),
            comma = "";
          _.each(parameters, function (parm) {
              dimensionCode = that.schema.getDimensionHier(that.getCube(), parm.attribute);
              comma = whereClause.length > 9 ? ",": "";
              whereClause += comma + dimensionCode + ".[" + parm.value.id + "] ";
            });
          whereClause = whereClause.length > 9 ? whereClause + ")": "";
          this.setWhere(whereClause);
          this.updateQueries();
          this.fetchCollection();
          return true;
        },
        /**
          Set chart component widths and heights using max sizes from dashboard - up to chart implementor.
         */
        setComponentSizes: function (maxHeight, maxWidth) {
          var height = Number(maxHeight) - 20,
            width = Number(maxWidth) - 20;
          this.setMaxHeight(maxHeight);  // for filterTapped to use later
          this.setStyle("width:" + width + "px;height:" + height + "px;");               // class selectable-chart
          this.$.chartWrapper.setStyle("width:" + width + "px;height:" + (height - 32) + "px;");
          this.$.chartTitle.setStyle("width:" + width + "px;height:32px;");
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
