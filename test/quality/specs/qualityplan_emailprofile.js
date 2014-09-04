/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
    Quality Plan Email profile is a template used to format the presentation of outgoing email messages of quality plans
    @class
    @alias QualityPlanEmailProfile
    @property {String} name [is the document key, idAttributed, required] (Enter a name that should be unique from the other quality plan email profiles )
    @property {String} description
    @property {String} from
    @property {String} replyTo
    @property {String} to
    @property {String} cc
    @property {String} bcc
    @property {String} subject
    @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Quality Plan Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  **/
  var spec = {
      recordType: "XM.QualityPlanEmailProfile",
      skipSmoke: false,
      skipCrud: false,
      enforceUpperKey: false,
    /**
      @member Other
      @memberof QualityPlanEmailProfile
      @description The Quality Plan Email Profile collection is not cached.
    */
      collectionType: "XM.QualityPlanEmailProfileCollection",
      listKind: "XV.QualityPlanEmailProfileList",
      instanceOf: "XM.Document",
      cacheName: null,
    /**
      @member Settings
      @memberof QualityPlanEmailProfile
      @description Quality Plan Email Profile is not lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof QualityPlanEmailProfile
      @description The ID attribute is "name"
    */
      attributes: ["id", "name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
      requiredAttributes: ["name"],
      idAttribute: ["name"],
    /**
      @member Setup
      @memberof QualityPlanEmailProfile
      @description Used in quality module
    */
      extensions: ["quality"],
       /**
      @member Privileges
      @memberof QualityPlanEmailProfile
      @description Users can create, update, and delete Quality Plan Email Profiles if they have the
        MaintainQualityPlanEmailProfiles privilege.
    */
      relevantPrivilegeModule: "products", 
      
      privileges: {
        createUpdateDelete: "MaintainQualityPlanEmailProfiles",
        read: true
      },
      createHash: {
        name: "TESTER " + Math.random(),
        description: "Quality Plan Email Profile1",
        from: "sample1@test.com",
        to: "sample2@test.com",
        cc: "sample3@test.com",
        bcc: "sample4@test.com"
      },
      updateHash: {
        description: "Internal Testing"
      }
  };
  
  exports.spec = spec;
  
}());

