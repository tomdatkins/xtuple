/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart with chart type picker and measure picker.  Responsible for:
      - enyo components
      - picker management
      - updating query templates based on pickers
      - creating chart area    
  */
  enyo.kind(
    /** @lends XV.BiChartTypeMeasure# */{
    name: "XV.BiChartTypeMeasure",
    kind: "XV.BiChart",
    published: {
      // these ones can/should be overridden (although some have sensible defaults)
      chartType: "barChart",
      chartTag: "svg",
      measureCaptions: [],
      measureColors: [],
      measure: "",
      measures: [],
      plotDimension1 : "",
      plotDimension2 : "",
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

    /**
      Create chart area, populate the pickers and kickoff fetch of collections.
    */
    create: function () {
      this.inherited(arguments);
      
      var that = this;
                  
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
      this.$.chartTitle.setContent(this.getChartTitle());

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
      Set chart component widths and heights using max sizes from dashboard - up to chart implementor.
     */
    setComponentSizes: function (maxHeight, maxWidth) {
      var height = Number(maxHeight) - 20,
        width = Number(maxWidth) - 20;
      this.setStyle("width:" + width + "px;height:" + height + "px;");               // class selectable-chart
      this.$.chartWrapper.setStyle("width:" + width + "px;height:" + (height - 32) + "px;");
      this.$.chartTitleBar.setStyle("width:" + width + "px;height:32px;");
      this.$.chart.setStyle("width:" + width + "px;height:" +
          (height - 77) + "px;");
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
      this.createChartComponent();
      this.plot(this.getChartType());
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

     /**
      Update queryTemplates[] with selected parameters and place in queryStrings[]
     */
    updateQuery: function () {
      //
      // Use cube metadata to replace cube name and measure name in query 
      //
      _.each(this.queryTemplates, function (template, i) {
        var cube = this.getCubeMeta()[this.getCube()].name;
        this.queryStrings[i] = template.replace("$cube", cube);
        var index = this.getMeasures().indexOf(this.getMeasure());
        var measure = this.getCubeMeta()[this.getCube()].measureNames[index];
        this.queryStrings[i] = this.queryStrings[i].replace(/\$measure/g, measure);
        var date = new Date();
        this.queryStrings[i] = this.queryStrings[i].replace(/\$year/g, date.getFullYear());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$month/g, date.getMonth() + 1);
      }, this
      );
    },
    /*
     * Destroy and re-plot the chart area when the data changes.
     */
    processedDataChanged: function () {
      this.createChartComponent();
      this.plot(this.getChartType());
    },

    
  });

}());
