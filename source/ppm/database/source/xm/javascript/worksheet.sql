select xt.install_js('XM','Worksheet','xtte', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  /** @private */
  var _changeStatus = function (id, priv, reqStatus, newStatus) {
      var data = Object.create(XT.Data),
      hasAccess = data.checkPrivilege(priv),
      res;

    if (!hasAccess) { return false };
    
    res = data.retrieveRecord({
       nameSpace: "XM",
       type: "Worksheet",
       id: id,
       superUser: true,
       includeKeys: true
    });

    if (!res || !res.data.worksheetStatus === 'reqStatus') {
      return false;
    }

    plv8.execute("update te.tehead set tehead_status = $1 where tehead_id = $2", [newStatus, res.data.id]);
    return true;
  }
  
  if (!XM.Worksheet) { XM.Worksheet = {}; }
  
  XM.Worksheet.isDispatchable = true;

  /**
    Approve a Worksheet 

    @param {String} Id
    @returns Boolean
  */
  XM.Worksheet.approve = function(id) {  
    return _changeStatus(id, 'CanApprove', 'O', 'A');
  };

  /**
    Close a Worksheet 

    @param {String} Id
    @returns Boolean
  */
  XM.Worksheet.close = function(id) {  
    return _changeStatus(id, 'MaintainTimeExpense', 'A', 'C');
  };

  /**
    Fetch the next number for a Worksheet 

    @param {String} record type
    @returns Number
  */
  XM.Worksheet.fetchNumber = function() {
    var sql = "select lpad(nextval('te.timesheet_seq')::text, 5, '0') as result;";
    return JSON.stringify(plv8.execute(sql)[0].result);
  };

   /**
    Return a billing rate based on passed criteria. Checks for existing billing rates in this order:

      * Project Task
      * Project
      * Employee
      * Customer
      * Item

    @param {Object} Options
    @param {Boolean} [options.isTime=true] If false, only checks item
    @param {String} [options.taskId] Task UUID
    @param {String} [options.projectId] Project Number
    @param {String} [options.employeeId] Employee Code
    @param {String} [options.customerId] Customer Number
    @param {String} [options.itemId] Item Number
    @returns Number
  */
  XM.Worksheet.getBillingRate = function(options) {
    var data = Object.create(XT.Data),
      privs = 'MaintainTimeExpense MaintainTimeExpenseSelf MaintainTimeExpenseOthers',
      res;

   if (!data.checkPrivilege(privs)) {
     plv8.elog(ERROR, "Access Denied.");
   }
      
    if (options.isTime !== false) {
   
      /* Check Task */
      if (options.taskId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Task",
          id: options.taskId,
          superUser: true
        });
        if (res && res.data.billingCurrency) {
          if (DEBUG) { plv8.elog(NOTICE, "Found projecttask rate."); }
          return {
            rate: res.data.billingRate,
            currency: res.data.billingCurrency
          };
        }
      }

      /* Check Project */
      if (options.projectId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Project",
          id: options.projectId,
          superUser: true
        });
        if (res && res.data.billingCurrency) {
          if (DEBUG) { plv8.elog(NOTICE, "Found project rate."); }
          return {
            rate: res.data.billingRate,
            currency: res.data.billingCurrency
          };
        }
      }

      /* Check Employee */
      if (options.employeeId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Employee",
          id: options.employeeId,
          superUser: true
        });
        if (res && res.data.billingRate) {
          if (DEBUG) { plv8.elog(NOTICE, "Found employee rate."); }
          return { rate: res.data.billingRate };
        }
      }

      /* Check Customer */
      if (options.customerId ) {
        res = data.retrieveRecord({
          nameSpace: "XM",
          type: "Customer", 
          id: options.customerId,
          superUser: true
        });
        if (res && res.data.billingCurrency) {
          if (DEBUG) { plv8.elog(NOTICE, "Found customer rate."); }
          return {
            rate: res.data.billingRate,
            currency: res.data.billingCurrency
          };
        }
      }
    }

    /* Check Item */
    if (options.itemId) {
      res = data.retrieveRecord({
        nameSpace: "XM",
        type: "Item",
        id: options.itemId,
        superUser: true
      });
      if (res) {
        if (DEBUG) { plv8.elog(NOTICE, "Found item rate."); }
        return { rate: res.data.listPrice };
      }
    }

    if (DEBUG) { plv8.elog(NOTICE, "No rate found."); }
    return 0;
  };

    /**
    Invoice one or many Worksheets

    @param {String|Array} Id or Ids
    @returns Boolean
  */
  XM.Worksheet.invoice = function(ids) {  
    var data = Object.create(XT.Data),
      sql = "select te.invoicesheets(array(select tehead_id from te.tehead where tehead_id in ({tokens})));",
      hasAccess = data.checkPrivilege('allowInvoicing'),
      ids = XT.typeOf(ids) === "array" ? ids : [ids],
      orm = XT.Orm.fetch('XM', 'Worksheet'),
      params = [],
      tokens = [],
      clause
      res,
      i;

    if (!hasAccess) { return false };

    /* get internal id for each natural key */
    for (i = 0; i < ids.length; i++) {
      params.push(data.getId(orm, ids[i]));
      tokens.push("$" + (i + 1));
    }
    sql = sql.replace("{tokens}", tokens.join(","));
    
    plv8.execute(sql, params);
    return true;
  };

    /**
    Unapprove a Worksheet 

    @param {String} Id
    @returns Boolean
  */
  XM.Worksheet.unapprove = function(id) {  
    return _changeStatus(id, 'CanApprove', 'A', 'O');
  };

}());

$$);

