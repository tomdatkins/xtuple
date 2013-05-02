select xt.install_js('XM','Worksheet','xtte', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Worksheet = {};
  
  XM.Worksheet.isDispatchable = true;

  /**
    Fetch the next number for a Worksheet 

    @param {String} record type
    @returns Number
  */
  XM.Worksheet.fetchNumber = function() {
    var sql = "select lpad(nextval('te.timesheet_seq')::text, 5, '0') as result;";
    return JSON.stringify(plv8.execute(sql)[0].result);
  },

  /**
    Fetch the user's preferred site.

    @param {String} record type
    @returns Number
  */
  XM.Worksheet.fetchPreferredSite = function() {
    var sql = "select fetchprefwarehousid() as result;";
    return plv8.execute(sql)[0].result;
  }

   /**
    Return a billing rate based on passed criteria. Checks for existing billing rates in this order:

      * Project Task
      * Project
      * Employee
      * Customer
      * Item

    @param {Object} Options
    @param {Boolean} [options.isTime=true] If false, only checks item
    @param {String} [options.projectTaskId] Project Task UUID
    @param {String} [options.projectId] Project Number
    @param {String} [options.employeeId] Employee Code
    @param {String} [options.customerId] Customer Number
    @param {String} [options.itemId] Item Number
    @returns Number
  */
  XM.Worksheet.getBillingRate = function(options) {
    var data = Object.create(XT.Data),
      res;

    if (options.isTime !== false) {
   
      /* Check Project Task */
      if (options.projectTaskId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "ProjectTask",
          id: options.projectTaskId
        });
        if (res && res.data.currency) {
          return res.data.rate;
        }
      }

      /* Check Project */
      if (options.projectId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Project",
          id: options.projectId
        });
        if (res && res.data.currency) {
          return res.data.billingRate;
        }
      }

      /* Check Employee */
      if (options.EmployeeId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Employee",
          id: options.employeeId
        });
        if (res && res.data.currency) {
          return res.data.billingRate;
        }
      }

      /* Check Customer */
      if (options.customerId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Customer", 
          id: options.customerId
        });
        if (res && res.data.currency) {
          return res.data.billingRate;
        }
      }
    }
    
    /* Check Item */
    if (options.itemId) {
      res = data.retrieveRecord({
        nameSpace: "XM",
        type: "Item",
        id: options.itemId
      });
      if (res && res.data.currency) {
        return res.data.listPrice;
      }
    }

    return 0;
  }
  
$$ );

