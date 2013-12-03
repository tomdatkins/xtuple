select xt.install_js('XM','TransferOrder','inventory', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  XM.TransferOrder = XM.TransferOrder || {};

  XM.TransferOrder.isDispatchable = true;

  /**
    Returns a list of items that have item site records at each of the passed source, destination
    and transit sites.
    
    @param {String} Source Site
    @param {String} Destination Site
    @param {String} Transit Site
  */
  XM.TransferOrder.items = function(sourceId, destinationId, transitId, query) {
    var orm = XT.Orm.fetch('XM', 'SiteRelation');
    sourceId = XT.Data.getId(orm, sourceId);
    destinationId = XT.Data.getId(orm, destinationId);
    transitId = XT.Data.getId(orm, transitId);
    query = query || {};
    var limit = query.rowLimit ? 'limit ' + query.rowLimit : '',
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      clause = XT.Data.buildClause("XM", "TransferOrderItemListItem", query.parameters, query.orderBy),
      sql = 'select * from xm.transfer_order_item_list_item where id in ' +
            '(select id ' +
            ' from xm.transfer_order_item_list_item ' +
            ' where {conditions} ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p1}) ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p2}) ' +
            '  and id in (select itemsite_item_id from itemsite where itemsite_active and itemsite_warehous_id=${p3}) ' +
            '{orderBy} {limit} {offset}) ' +
            '{orderBy}';

    /* query the model */
    sql = sql.replace('{conditions}', clause.conditions)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace('{p1}', clause.parameters.length + 1)
             .replace('{p2}', clause.parameters.length + 2)
             .replace('{p3}', clause.parameters.length + 3);
    clause.parameters = clause.parameters.concat([sourceId, destinationId, transitId]);
    if (DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }

    return plv8.execute(sql, clause.parameters);
  };

}());
  
$$ );

