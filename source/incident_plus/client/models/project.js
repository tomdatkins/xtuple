/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.incidentPlus.initProjectModels = function () {
  
    var init = XM.Project.prototype.bindEvents;
    XM.Project = XM.Project.extend({

      bindEvents: function () {
        init.apply(this, arguments);
        this.on('add:versions remove:versions', this.versionsDidChange);
      },
      
      versionsDidChange: function () {
        this.trigger("change", this);
      }

    });
  
    /**
      @class

      @extends XM.Model
    */
    XM.ProjectVersion = XM.Model.extend(
      /** @scope XM.ProjectVersion.prototype */ {

      recordType: 'XM.ProjectVersion',
      
      requiredAttributes: [
        "version"
      ]

    });

    /**
      @class

      @extends XM.Info
    */
    XM.VersionProjectRelation = XM.Info.extend(
      /** @scope XM.VersionProjectRelation.prototype */ {

      recordType: 'VersionProjectRelation'

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ProjectVersionRelation = XM.Info.extend(
      /** @scope XM.ProjectVersionRelation.prototype */ {

      recordType: 'XM.ProjectVersionRelation'

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ProjectVersionCollection = XM.Collection.extend({
      /** @scope XM.ProjectVersionCollection.prototype */

      model: XM.ProjectVersion

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ProjectVersionRelationCollection = XM.Collection.extend({
      /** @scope XM.ProjectVersionRelationCollection.prototype */

      model: XM.ProjectVersionRelation

    });
  };

}());
