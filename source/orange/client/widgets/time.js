/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.TimeWidget
    @class An input control consisting of fittable columns:
      label, decorator, and timepicker.<br />
    @extends XV.Input
    
    NOTE: This widget should be moved to the xtuple repository**
   */
  enyo.kind(/** @lends XV.TimeWidget# */{
    name: "XV.TimeWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget xv-checkboxwidget",
    published: {
      label: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: "input", kind:"onyx.TimePicker", is24HrMode:true, onchange: "inputChanged"}
        ]}
      ]}
    ],
    /**
    Inherited create function with a call to labelChanged
    */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
    },
    /**
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    
    /** Pass through function to make Input happy */
    placeholderChanged: function () {},
    /** Pass through function to make Input happy */
    typeChanged: function () {}
  });

}());
