/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.TimeWidget
    @class An input control consisting of fittable columns:
      label, decorator, and timepicker.<br />
    @extends XV.Input
    
    This widget is assuming that the value coming from the model
    is a Javascript Date.
    
    NOTE: This widget should be moved to the xtuple repository**
   */
  enyo.kind(/** @lends XV.TimeWidget# */{
    name: "XV.TimeWidget",
    kind: "XV.Input",
    classes: "xv-inputwidget",
    published: {
      label: ""
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-picker-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
            {name: "input", kind: "onyx.TimePicker", is24HrMode: true}
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
     Clears the values in the TimeWidget
     */
    clear: function (options) {
      this.setValue(null, options);
    },
    /**
    Sets the label in the TimeWidget
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    
    /**
     When a TimePicker value is selected, the new value is set for the widget.
     */
    itemSelected: function (inSender, inEvent) {
      // returns a Date object
      var value = this.$.input.getValue();
      this.setValue(value);
      return true;
    },
    
    /** Pass through function to make Input happy */
    placeholderChanged: function () {},
    /** Pass through function to make Input happy */
    typeChanged: function () {}
  });

}());
