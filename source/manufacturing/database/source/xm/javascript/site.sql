select xt.install_js('XM','Site','manufacturing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Site) { XM.Site = {}; }
  
  XM.Site.isDispatchable = true;
  
  /**
    Returns the next schedule working date based on the Site calendar
    
    @param {String} Site uuid
    @param {Date} Start date
    @param {Number} Days
    @returns {Date}
  */
  XM.Site.calculateNextWorkingDate = function(siteId, startDate, days) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "Site"),
      params = [data.getId(orm, siteId), startDate, days],
      casts = ["integer", "date", "integer"];

    return XT.executeFunction("calculatenextworkingdate", params, casts);
  };

  /**
    Returns the number of working days between two dates by taking into account
    the site calendar and exceptions.
    
    @param {String} Site uuid
    @param {Date} Start date
    @param {Number} Due date
    @returns {Number}
  */
  XM.Site.calculateWorkDays = function(siteId, startDate, dueDate) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "Site"),
      params = [data.getId(orm, siteId), startDate, dueDate];

    return plv8.execute("select calculateworkdays($1, $2::date, $3::date) as days", params)[0].days;
  }

}());

$$ );
