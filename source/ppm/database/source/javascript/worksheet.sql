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
    var sql = "select nextval('te.timesheet_seq') as result;";
    return plv8.execute(sql)[0].result;
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
  
$$ );

