/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initJobModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.JobCategory = OHRM.Model.extend(/** @lends OHRM.JobCategory.prototype */ {

      recordType: 'OHRM.JobCategory'

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.JobTitle = OHRM.Model.extend(/** @lends OHRM.JobTitle.prototype */ {

      recordType: 'OHRM.JobTitle'

    });
    
    /**
      @class

      @extends XM.Model
    */
    OHRM.JobCandidate = OHRM.Model.extend(/** @lends OHRM.JobCandidate.prototype */ {

      recordType: 'OHRM.JobCandidate',
      
      requiredAttributes: [
        "firstName",
        "lastName",
        "email",
        "contactNumber",
        "candidateStatus",
        "modeOfApplication",
        "dateOfApplication"
      ],
      
      defaults: function () {
        var result = {};
        
        result.dateOfApplication = new Date();
        result.candidateStatus = 0; // "APPLICATION INITIATED"
        result.modeOfApplication = 0; // "ONLINE"

        return result;
      },
      
      fullName: function () {
        return this.get("firstName") + " " + this.get("lastName");
      },
      
      /**
      Returns status as a localized string.

      @returns {String}
      */
      getCandidateStatusString: function () {
        var status = this.get("candidateStatus");
        return status === 0 ? "_applicationInitiated".loc() : "_none".loc();
      },
      
      // ..........................................................
       // METHODS
       //

       /**
         Initialize
       */
       // bindEvents: function () {
       //          XM.Document.prototype.bindEvents.apply(this, arguments);
       //          this.on('change:candidateStatus', this.candidateStatusDidChange);
       //        },
       
       candidateStatusDidChange: function () {
         //this.setReadOnly("candidateStatus", true);
       },

    });
    
    /**
      @class

      @extends XM.Model
    */
    OHRM.JobVacancy = OHRM.Model.extend(/** @lends OHRM.JobVacancy.prototype */ {

      recordType: 'OHRM.JobVacancy',
      
      requiredAttributes: [
        "title",
        "name",
        "vacancyStatus",
        "publishedInFeed",
        "defined",
        "updated"
      ],
      
      defaults: function () {
        var result = {};
        
        result.vacancyStatus = 1; // ACTIVE
        result.publishedInFeed = true; // TRUE
        result.defined = new Date();
        result.updated = new Date();
        
        return result;
      },
      
      /**
      Returns status as a localized string.

      @returns {String}
      */
      getVacancyStatusString: function () {
        var status = this.get("vacancyStatus");
        return status ? "_active".loc() : "_closed".loc();
      }

    });
    
    /**
       @class

       @extends XM.Model
     */
     OHRM.JobVacancy = OHRM.Model.extend(/** @lends OHRM.JobVacancy.prototype */ {

       recordType: 'OHRM.JobInterview',

       requiredAttributes: [
         "name"
       ]

     });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobCategoryCollection = XM.Collection.extend(/** @lends XM.JobCategoryCollection.prototype */{

      model: OHRM.JobCategory

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobTitleCollection = XM.Collection.extend(/** @lends XM.JobTitleCollection.prototype */{

      model: OHRM.JobTitle

    });
    
    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobCandidateCollection = XM.Collection.extend(/** @lends XM.JobCandidateCollection.prototype */{

      model: OHRM.JobCandidate

    });
    
    /**
      @class

      @extends XM.Collection
    */
    OHRM.JobVacancyCollection = XM.Collection.extend(/** @lends XM.JobVacancyCollection.prototype */{

      model: OHRM.JobVacancy

    });
    
    _.extend(OHRM.JobCandidate, /** @lends OHRM.JobCandidate# */{
      
      APPLICATION_INITIATED: 0,
      
      SHORTLISTED: 1,
      
      INTERVIEW_SCHEDULED: 2,
      
      INTERVIEW_PASSED: 3,
      
      INTERVIEW_FAILED: 4
    });
    
  };

}());

