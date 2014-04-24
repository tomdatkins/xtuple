/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, dimple:true console:true */

(function () {

  /**
    Implementation of BiChart with chart measure picker.  Responsible for:
      - enyo components
      - picker management
      - requesting update of query templates based on pickers
      - creating chart area
  */
  enyo.kind(
    /** @lends XV.BiChartMeasure# */{
    name: "XV.BiChartMeasure",
    kind: "XV.BiChart",
    published: {
      // these ones can/should be overridden (although some have sensible defaults)
      chartType: "barChart",
      chartTag: "svg",
      measure: "",
      measures: [],
    },
    components: [
      {kind: "onyx.Popup",  classes: "onyx-popup", name: "spinnerPopup",
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
      // Populate the Measure picker from cubeMetaOverride or cubeMeta
      //
      this.setMeasures(this.schema.getMeasures(this.getCube()));

      _.each(this.getMeasures(), function (item) {
        var pickItem = {name: item, content: ("_" + item).loc()};
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
        this.updateQueries([this.getMeasure()]);
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
      this.updateQueries([this.getMeasure()]);
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

  });

}());
