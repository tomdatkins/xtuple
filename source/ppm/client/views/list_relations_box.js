/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {
 
  XT.extensions.ppm.initListRelationsBox = function () {
    
    // ..........................................................
    // ACCOUNT
    //
  
    enyo.kind({
      name: "XV.WorksheetTimeBox",
      kind: "XV.ListRelationsBox",
      title: "_time".loc(),
      parentKey: "worksheet",
      listRelations: "XV.WorksheetTimeListRelations"
    });

  };

}());
