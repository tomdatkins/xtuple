/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
    Work Order Email profile is a template used to format the presentation of outgoing email messages of work orders
    @class
    @alias WorkOrderEmailProfile
    @property {String} name [is the document key, idAttributed, required] (Enter a name that should be unique from the other work order email profiles )
    @property {String} description
    @property {String} from
    @property {String} replyTo
    @property {String} to
    @property {String} cc
    @property {String} bcc
    @property {String} subject
    @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Work Order Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  **/
  var spec = {
      recordType: "XM.WorkOrderEmailProfile",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: false,
    /**
      @member Other
      @memberof WorkOrderEmailProfile
      @description The Work Order Email Profile collection is not cached.
    */
      collectionType: "XM.WorkOrderEmailProfileCollection",
      listKind: "XV.WorkOrderEmailProfileList",
      instanceOf: "XM.Model",
      cacheName: null,
    /**
      @member Settings
      @memberof WorkOrderEmailProfile
      @description Work Order Email Profile is not lockable.
    */
      isLockable: false,
    /**
      @member Settings
      @memberof WorkOrderEmailProfile
      @description The ID attribute is "name"
    */
      attributes: ["id", "name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
      requiredAttributes: ["name"],
      idAttribute: "name",
    /**
      @member Setup
      @memberof WorkOrderEmailProfile
      @description Used in manufacturing module
    */
      extensions: ["manufacturing"],
       /**
      @member Privileges
      @memberof WorkOrderEmailProfile
      @description Users can create, update, and delete Work Order Email Profiles if they have the
        MaintainWorkOrderEmailProfiles privilege.
    */
      privileges: {
        createUpdateDelete: "MaintainWorkOrderEmailProfiles",
        read: true
      },
      createHash: {
        name: "WOProfile1" + Math.random(),
        description: "Work Order Email Profile1",
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

