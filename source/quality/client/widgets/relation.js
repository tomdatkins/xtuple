/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XM:true, enyo:true */

(function () {

  XT.extensions.quality.initRelations = function () {

    // ..........................................................
    // QUALITY PLAN
    //

    enyo.kind({
      name: "XV.QualityPlanWidget",
      kind: "XV.RelationWidget",
      keyAttribute: "number",
      label: "_qualityPlan".loc(),
      collection: "XM.QualityPlansRelationCollection",
      list: "XV.QualityPlansList"
    });
    
    // ..........................................................
    // QUALITY SPECIFICATION
    //

    enyo.kind({
      name: "XV.QualitySpecWidget",
      kind: "XV.RelationWidget",
      keyAttribute: "number",
      label: "_qualitySpecification".loc(),
      collection: "XM.QualitySpecsRelationCollection",
      list: "XV.QualitySpecsList"
    });

  };

}());
