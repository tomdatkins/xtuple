/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Site Email profile is a template used to format the presentation of outgoing email messages of site reports.
  @class
  @alias SiteEmailProfile
  @property {String} name [is the document key, idAttributed, required] (Enter a name that should be unique from the other site email profiles )
  @property {String} description (This field brief description about the email profile)
  @property {String} from (This field is email-id from which the email should be sent)
  @property {String} replyTo (List of email-ids to be entered to which the receiptant can reply directly )
  @property {String} to (List of email-ids to be populated in the email template TO field)
  @property {String} cc	(List of email-ids to be populated in the email template CC field)
  @property {String} bcc (List of email-ids to be populated in the email template BCC field)
  @property {String} subject (This is a text field with subject of the email template)
  @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Site Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  */
 

  var spec = {
      recordType: "XM.SiteEmailProfile",
      enforceUpperKey: true,
      collectionType: "XM.SiteEmailProfileCollection",
      listKind: "XV.SiteEmailProfileList",
      instanceOf: "XM.Document",
      attributes: ["name", "description"],
      /**
        @member Setting
        @memberof SiteEmailProfile
        @description The ID attribute is "name", which will be automatically uppercased.
      */
      idAttribute: "name",
      /**
        @member Setup
        @memberof SiteEmailProfile
        @description Used in the inventory module
      */
      extensions: ["inventory"],
      /**
        @member Setting
        @memberof SiteEmailProfile
        @description Site Email Profiles are lockable.
      */
      isLockable: true,
      cacheName: null,
      /**
        @member -
        @memberof SiteEmailProfile
        @description Site Email Profiles can be read, created, updated,
          or deleted by users with the "MaintainSiteEmailProfiles" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainSiteEmailProfiles",
        read: true
      },
     updatableField: "description"
    };

  var additionalTests =  function () {
    
      /**
      @member Navigation
      @memberof SiteEmailProfile
      @description An Action gear exists in the 'Site Email' work space  with following options: 'Delete' option where there is no Site Type linked to it and the user has MaintainSiteEmailProfiles privilege
     */
      it.skip("Action gear should exist in the Site Email work space with 'Delete' option if" +
      "there is no Site type linked to it and if the user has" +
      "'MaintainSiteEmailProfiles privilege'", function () {
      });
      /**
      @member Navigation
      @memberof SiteEmailProfile
      @description An Action gear exists in the 'Site Email' work space with no 'Delete' option if the selected Email Profile has Site Type linked to it
     */
      it.skip("Action gear should exist in the Site Email work space without 'Delete' option if" +
      "there is a Site Type linked to the selected EmailProfile", function () {
      });
     
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());

