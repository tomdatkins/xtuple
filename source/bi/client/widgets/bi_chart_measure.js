/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart with chart measure picker.  Responsible for:
      - enyo components
      - picker management
      - filter management
      - requesting update of query templates based on pickers and filters
      - creating chart area
  */
  enyo.kind(
    /** @lends XV.BiChartMeasure# */{
    name: "XV.BiChartMeasure",
    kind: "XV.BiChart",
    published: {
      chartType: "barChart",
      chartTag: "svg",
      maxHeight: 0,
      maxWidth: 0,
      measures: [],
      // queryParms:
      measure: "",
      time: "",
      where: "",
      year: "current",
      month: "current",
      // May want to override these in the implementation 
      parameterWidget: "XV.SalesChartParameters",
      initialWhere: "",
      initialChartTitle: "_chooseMeasure".loc()
    },
    handlers: {
      onParameterChange: "parameterDidChange"
    },
    components: [
      {kind: "onyx.Popup",  classes: "onyx-popup", name: "spinnerPopup",
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
              {kind: "FittableRows", components: [
                {name: "chartTitle", style: "float:left;", classes: "chart-title"},
                {name: "chartSubTitle", classes: "chart-sub-title"}
              ]
              },
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
              {name: "filterDrawer", classes: "chart-filterDrawer xv-pullout", kind: "onyx.Drawer", open: false,
                components: [{classes: "xv-header", content: "_chartFilters".loc()}]
              },
            ]},

            {name: "chartWrapper", classes: "chart-bottom", components: [
              {name: "chart"},
              {kind: "enyo.FittableColumns", components: [
                {content: "_measure".loc() + ": ", classes: "xv-picker-label"},
                {kind: "onyx.PickerDecorator", onSelect: "measureSelected",
                  components: [
                  {kind: "XV.PickerButton", content: "_chooseOne".loc()},
                  {name: "measurePicker", kind: "onyx.Picker"}
                ]}
              ]}
            ]}
          
          ]},
        ],
    
        /**
          Create chart area, populate the pickers and kickoff fetch of collections.
        */
        create: function () {
          var that = this,
            model = this.getModel();
          this.inherited(arguments);

          // Show/Hide remove icon
          this.$.removeIcon.setShowing(this.removeIconShowing);
    
          // Set the chart title
          this.$.chartTitle.setContent(this.getInitialChartTitle());

          // Set the parameterWidget for filters with last filter used
          this.$.filterDrawer.createComponent({name: "parms", kind: this.getParameterWidget()});
          this.$.filterDrawer.$.parms.setLastFilterUuid(model.get("uuidFilter"));
          
          // Set the initial Where clause
          if (this.initialWhere) {
            this.setWhere(" WHERE ( " + this.getInitialWhere() + ")");
          }
    
          // Populate the Measure picker from cubeMetaOverride or cubeMeta
          this.setMeasures(this.schema.getMeasures(this.getCube()));
          _.each(this.getMeasures(), function (item) {
            var pickItem = {name: item, content: ("_" + item).loc()};
            that.$.measurePicker.createComponent(pickItem);
          });
          
          // Set the measure and chart type from model    
          if (model.get("measure")) {
            this.setMeasure(model.get("measure"));
          }
          this.setChartType(model.get("chartType") || "barChart");

          //  If the measure is defined, fill in the queryTemplate
          //  and ask the Collection to get data.
          if (this.getMeasure()) {
            this.updateQueries();
            this.fetchCollection();
          }
        },
        /*
         *   Because we have a drawer in a scrollable we have to change the size
         *   on open and close.
         */
        filterTapped: function () {
          var drawerHeight = this.getMaxHeight() - 40; //adjust for title size +
          this.$.filterDrawer.applyStyle("width", this.getMaxWidth() + "px");
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
         * Set End Year and Month based on filter settings.
         * Save the uuid of the current filter chosen.  
         * Update the query and fetch.
         */
        parameterDidChange: function (inSender, inEvent) {
          var parameterWidget = this.$.filterDrawer.$.parms,
            lastFilter = parameterWidget.getCurrentFilter() ? parameterWidget.getCurrentFilter().attributes.uuid : null,
            parameters = parameterWidget ? parameterWidget.getParameters() : [],
            dimensionCode = "",
            that = this,
            whereClause = " WHERE ( " + this.getInitialWhere(),
            comma = "";
            
          //  If the event is just to select a filter (and no parameters are received) we ignore as we
          //  will get another event with the parameters 
          if (!(lastFilter && (parameters.length === 0))) {
            this.setChartSubTitle("");
            this.getModel().set("uuidFilter", lastFilter);
            this.save(this.getModel());
            
            // the endyearpicker & endmonthpicker do not get reset to current when the filter is set to default!
            if (parameters.length === 0) {
              this.setYear("current");
              this.setMonth("current");
            }
            _.each(parameters, function (parm) {
                if (parm.attribute === "year") {
                  that.setYear(parm.value);
                }
                if (parm.attribute === "month") {
                  that.setMonth(parm.value.replace("0", ""));  // get rid of leading 0
                }
                dimensionCode = that.schema.getDimensionHier(that.getCube(), parm.attribute);
                if (dimensionCode) {
                  comma = whereClause.length > 9 ? ", ": "";
                  that.chartSubTitle += comma + ("_" + parm.attribute).loc() + ":" + parm.value.id;
                  whereClause += comma + dimensionCode + ".[" + parm.value.id + "] ";
                }
              });
            whereClause = whereClause.length > 9 ? whereClause + ")": "";
            this.setWhere(whereClause);
            this.updateQueries();
            this.fetchCollection();
          }
          return true;
        },
        /**
          Set chart component widths and heights using max sizes from dashboard - up to chart implementor.
         */
        setComponentSizes: function (maxHeight, maxWidth) {
          var height = Number(maxHeight) - 20,
            width = Number(maxWidth) - 20;
          this.setMaxHeight(maxHeight);  // for filterTapped to use later
          this.setMaxWidth(maxWidth);    // for filterTapped to use later
          this.setStyle("width:" + width + "px;height:" + height + "px;");  // class selectable-chart
          this.$.chartWrapper.setStyle("width:" + width + "px;height:" + (height - 32) + "px;");
          this.$.chartTitle.setStyle("width:" + width + "px;height:28px;");
          this.$.chart.setStyle("width:" + width + "px;height:" + (height - 96) + "px;");
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
          When the measure value changes, set the selected value
          in the picker widget, fetch the data and re-process the data.
        */
        measureChanged: function () {
          var that = this,
            selected = _.find(this.$.measurePicker.controls, function (option) {
              return option.name === that.getMeasure();
            });
          this.$.measurePicker.setSelected(selected);
          this.updateQueries();
          this.fetchCollection();
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

         /*
         * Destroy and re-plot the chart area when the data changes.
         */
        processedDataChanged: function () {
          this.createChartComponent();
          this.plot(this.getChartType());
        },
        /*
         * Make end date based on settings of year and month and nextPeriods
         */
        getEndDate: function () {
          var date = new Date();
          if (this.getYear() !== "current") {
            date.setYear(this.getYear());
            date.setMonth(11);
          }
          if (this.getMonth() !== "current") {
            date.setMonth(Number(this.getMonth()) + Number(this.getNextPeriods()) - 1);
          }
          else {
            date.setMonth(Number(date.getMonth()) + Number(this.getNextPeriods()) - 1);
          }
          return date;
        }
    
      });

}());
