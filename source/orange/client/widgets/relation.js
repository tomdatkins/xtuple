/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

(function () {
  
  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.OrangeCountryWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.CountryCollection",
    keyAttribute: "code",
    nameAttribute: "name",
    list: "XV.OrangeCountryList"
  });
  
  // ..........................................................
  // COUNTRY
  //

  enyo.kind({
    name: "XV.OrangeProvinceWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.ProvinceCollection",
    keyAttribute: "code",
    nameAttribute: "name",
    list: "XV.OrangeProvinceList"
  });

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.OrangeEmployeeWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.EmployeeRelationCollection",
    keyAttribute: "employeeId",
    nameAttribute: "fullName",
    list: "XV.OrangeEmployeeList"
  });

  // ..........................................................
  // LEAVE REQUEST
  //

  enyo.kind({
    name: "XV.LeaveRequestWidget",
    kind: "XV.RelationWidget",
    collection: "OHRM.LeaveRequestRelationCollection",
    keyAttribute: "dateApplied",
    list: "XV.LeaveRequestList"
  });
}());
