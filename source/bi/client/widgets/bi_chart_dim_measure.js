/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart with chart dimension picker and measure picker.  Uses cube meta data
    to populate pickers.  Responsible for:
      - enyo components
      - picker management
      - filter management
      - requesting update of query templates based on pickers and filters
      - creating chart area
  */
  enyo.kind(
    /** @lends XV.BiChartTypeMeasure# */{
    name: "XV.BiChartDimMeasure",
    kind: "XV.BiChart",
    published: {
      // these ones can/should be overridden (although some have sensible defaults)
      chartTag: "svg",
      dimension: "",
      dimensions: [],
      maxHeight: 0,
      measure: "",
      measures: [],
      parameterWidget: "XV.ChartParameters"
    },
    components: [
      {kind: "onyx.Popup", classes: "onyx-popup", name: "spinnerPopup",
        components: [
        {kind: "onyx.Spinner"},
        {name: "spinnerMessage", content: "_loading".loc() + "..."}
      ]},
      /*
      {name: "chartTitleBar", classes: "chart-title-bar", components: [
        {name: "chartTitle", classes: "chart-title"},
        {kind: "onyx.IconButton", name: "removeIcon",
          src: "/assets/remove-icon.png", ontap: "chartRemoved",
          classes: "remove-icon", showing: false}
      ]},

      {name: "chartWrapper", classes: "chart-bottom", components: [
        {name: "chart"},
        {kind: "enyo.FittableColumns", components: [
          {content: "_dimension".loc() + ": ", classes: "xv-picker-label", name: "dimLabel"},
          {kind: "onyx.PickerDecorator", name: "chartPickerDecorator", onSelect: "dimSelected",
            components: [
            {kind: "XV.PickerButton", content: "_chooseOne".loc()},
            {name: "dimPicker", kind: "onyx.Picker"}
          ]},
          {content: "_measure".loc() + ": ", classes: "xv-picker-label"},
          {kind: "onyx.PickerDecorator", onSelect: "measureSelected",
            components: [
            {kind: "XV.PickerButton", content: "_chooseOne".loc()},
            {name: "measurePicker", kind: "onyx.Picker"}
          ]}
        ]}
      ]}
      */
      
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
              {kind: "enyo.FittableColumns", components: [
                {content: "_dimension".loc() + ": ", classes: "xv-picker-label", name: "dimLabel"},
                {kind: "onyx.PickerDecorator", name: "chartPickerDecorator", onSelect: "dimSelected",
                components: [
                  {kind: "XV.PickerButton", content: "_chooseOne".loc()},
                  {name: "dimPicker", kind: "onyx.Picker"}
                ]},
                {content: "_measure".loc() + ": ", classes: "xv-picker-label"},
                {kind: "onyx.PickerDecorator", onSelect: "measureSelected",
                  components: [
                  {kind: "XV.PickerButton", content: "_chooseOne".loc()},
                  {name: "measurePicker", kind: "onyx.Picker"}
                ]}
              ]}
            ]}
          ]}
        ],

      /**
        Create chart area, populate the pickers and kickoff fetch of collections.
      */
        create: function () {
          this.inherited(arguments);

          var that = this,
            model = this.getModel();

          //
          // Create the chart component for plot area.
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
          // Set the parameterWidget for filters
          //
          this.$.filterDrawer.createComponent({name: "parms", kind: this.getParameterWidget()});
    
          /*
           * Populate the dimension picker
           */
          this.setDimensions(this.schema.getDimensions(this.getCube()));
    
          _.each(this.getDimensions(), function (item) {
            var pickItem = {name: item, content: ("_" + item).loc()};
            that.$.dimPicker.createComponent(pickItem);
          });
      
          /*
           * Populate the measure picker
           */
          this.setMeasures(this.schema.getMeasures(this.getCube()));
    
          _.each(this.getMeasures(), function (item) {
            var pickItem = {name: item, content: ("_" + item).loc()};
            that.$.measurePicker.createComponent(pickItem);
          });
          
          /*
           * Set measure and dimension from model
           */
          if (model.get("measure")) {
            this.setMeasure(model.get("measure"));
          }
          if (model.get("dimension")) {
            this.setDimension(model.get("dimension"));
          }
          
          /*
           * If the measure and dimension are defined, fill in the queryTemplate
           * and ask the Collection to get data.
           */
          if (this.getMeasure() && this.getDimension()) {
            this.updateQueries([this.getMeasure()]);
            this.fetchCollection();
          }
        },
        /*
         *   Because we have a drawer in a scrollable we have to change the size
         *   on open and close.
         */
        filterTapped: function () {
          if (!this.$.filterDrawer.open) {
            this.$.scrollableDrawer.applyStyle("height", this.getMaxHeight() + "px");
          }
          else {
            this.$.scrollableDrawer.applyStyle("height", null);
          }
          this.$.filterDrawer.setOpen(!this.$.filterDrawer.open);
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
              (height - 77) + "px;");
        },

        /**
          When the dimension value changes, set the selected value
          in the picker widget, fetch the data and re-process the data.
        */
        dimensionChanged: function () {
          var that = this,
            selected = _.find(this.$.dimPicker.controls, function (option) {
              return option.name === that.getDimension();
            });
          this.$.dimPicker.setSelected(selected);
          if (this.getMeasure() && this.getDimension()) {
            this.updateQueries([this.getMeasure(), this.getDimension()]);
            this.fetchCollection();
          }
        },
        /**
          A new dimension was selected in the picker. Set
          the published dimension attribute.
        */
        dimSelected: function (inSender, inEvent) {
          this.setDimension(inEvent.originator.name);
          this.getModel().set("dimension", inEvent.originator.name);
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
          if (this.getMeasure() && this.getDimension()) {
            this.updateQueries([this.getMeasure(), this.getDimension()]);
            this.fetchCollection();
          }
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
          Create chart plot area.  Destroy if already created.
        */
        createChartComponent: function () {
          if (typeof this.$.chart.$.svg !== "undefined") {
            this.$.chart.$.svg.destroy();
          }
          this.$.chart.createComponent(
              {name: "svg",
                tag: this.getChartTag(),
                content: " "                //some plot areas must have content - like an html5 canvas
                }
              );
          this.$.chart.render();
        },
        /*
         * Destroy and re-plot the chart area when the data changes.
         */
        processedDataChanged: function () {
          this.createChartComponent();
          this.plot("");
        },
      });
}());
