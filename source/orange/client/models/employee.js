/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.orange.initEmployeeModels = function () {

    /**
      @class

      @extends XM.Model
    */
    OHRM.Employee = OHRM.Model.extend(/** @lends OHRM.Employee.prototype */ {

      recordType: 'OHRM.Employee',

      requiredAttributes: [
        "firstName",
        "middleName",
        "lastName",
        "employeeId"
      ]

    });

    /**
      @class

      @extends XM.Model
    */
    OHRM.EmployeeRelation = OHRM.Info.extend(/** @lends OHRM.EmployeeRelation.prototype */ {

      recordType: 'OHRM.EmployeeRelation',

      editableModel: 'OHRM.Employee',

      fullName: function () {
        return this.get("firstName") + " " + this.get("lastName");
      }
    });
    
    /**
      @class

      @extends XM.Model
    */
    OHRM.EmergencyContact = OHRM.Model.extend(/** @lends OHRM.EmergencyContact.prototype */ {

      recordType: 'OHRM.EmergencyContact',

      requiredAttributes: [
        "employee"
      ]

    });

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    OHRM.EmployeeCollection = XM.Collection.extend(/** @lends XM.EmployeeCollection.prototype */{

      model: OHRM.Employee

    });

    /**
      @class

      @extends XM.Collection
    */
    OHRM.EmployeeRelationCollection = XM.Collection.extend(/** @lends XM.EmployeeRelationCollection.prototype */{

      model: OHRM.EmployeeRelation

    });
    
    /**
      @class

      @extends XM.Collection
    */
    OHRM.EmergencyContactCollection = XM.Collection.extend(/** @lends XM.EmergencyContactCollection.prototype */{

      model: OHRM.EmergencyContact

    });
    
  };

}());

