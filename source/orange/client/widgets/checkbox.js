/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true, XV:true */

(function () {

  /** 
  This CheckboxWidget is for integer fields expecting
    zero and one instead of boolean values.
  */
  enyo.kind({
    name: "XV.NumberCheckboxWidget",
    kind: "XV.CheckboxWidget",
    
    /**
    Override so that inputChanged may consider numbers
    in place of boolean values.
    */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      if (input) {
        this.setValue(1);
      } else {
        this.setValue(0);
      }
    }
  });
  
}());
