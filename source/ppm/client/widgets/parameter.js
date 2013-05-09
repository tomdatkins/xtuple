/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initParameters = function () {
 
    // ..........................................................
    // WORKSHEET
    //

    enyo.kind({
      name: "XV.WorksheetListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_worksheet".loc()},
        {name: "employee", label: "_employee".loc(), attr: "employee",
          defaultKind: "XV.EmployeeWidget"},
        {name: "owner", label: "_owner".loc(), attr: "owner",
          defaultKind: "XV.UserAccountWidget"},
        {kind: "onyx.GroupboxHeader", content: "_weekOf".loc()},
        {name: "fromDate", label: "_fromDate".loc(), attr: "weekOf", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "toDate", label: "_toDate".loc(), attr: "weekOf", operator: "<=",
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_status".loc()},
        {name: "isOpen", label: "_open".loc(), defaultKind: "XV.CheckboxWidget"},
        {name: "isApproved", label: "_approved".loc(), defaultKind: "XV.CheckboxWidget"},
        {name: "isClosed", label: "_closed".loc(), defaultKind: "XV.CheckboxWidget"}
      ],
      getParameters: function () {
        var params = this.inherited(arguments),
          param = {},
          value = [];
        if (this.$.isOpen.getValue()) {
          value.push('O');
        }
        if (this.$.isApproved.getValue()) {
          value.push('A');
        }
        if (this.$.isClosed.getValue()) {
          value.push('C');
        }
        if (value.length) {
          param.attribute = "status";
          param.operator = "ANY";
          param.value = value;
          params.push(param);
        }
        return params;
      }
    });
  };

}());
