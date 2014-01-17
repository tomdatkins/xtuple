select xt.install_js('XM','TransferOrder','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  XM.TransferOrder = XM.TransferOrder || {};

  XM.TransferOrder.isDispatchable = true;

  /**
    Returns a list of items that have item site records at each of the passed source, destination
    and transit sites.

    @param {String} Record Type
    @param {String} Source Site
    @param {String} Destination Site
    @param {String} Transit Site
  */
  XM.TransferOrder.items = function(recordType, sourceId, destinationId, transitId, query) {
    var orm = XT.Orm.fetch('XM', 'SiteRelation');
    sourceId = XT.Data.getId(orm, sourceId);
    destinationId = XT.Data.getId(orm, destinationId);
    transitId = XT.Data.getId(orm, transitId);
    query = query || {};
    var limit = query.rowLimit ? 'limit ' + query.rowLimit : '',
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      clause = XT.Data.buildClause("XM", "TransferOrderItemListItem", query.parameters, query.orderBy),
      sql = 'select * from %1$I.%2$I where id in ' +
            '(select id ' +
            ' from %1$I.%2$I ' +
            ' where {conditions} ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p1}) ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p2}) ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p3}) ' +
            '{orderBy} %3$s %4$s) ' +
            '{orderBy}';

    /* query the model */
    sql = sql.replace('{conditions}', clause.conditions)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{p1}', clause.parameters.length + 1)
             .replace('{p2}', clause.parameters.length + 2)
             .replace('{p3}', clause.parameters.length + 3);
    sql = XT.format(sql, [
      recordType.beforeDot().decamelize(),
      recordType.afterDot().decamelize(),
      limit,
      offset
    ]);
    clause.parameters = clause.parameters.concat([sourceId, destinationId, transitId]);
    if (DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }

    return plv8.execute(sql, clause.parameters);
  };

}());
  
$$ );

