/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.ppm.initStartup = function () {
    XT.cacheCollection("XM.departments", "XM.DepartmentCollection", "number");
    XT.cacheCollection("XM.expenseCategories", "XM.ExpenseCategoryCollection", "code");
    XT.cacheCollection("XM.shifts", "XM.ShiftCollection", "number");
  };

}());
