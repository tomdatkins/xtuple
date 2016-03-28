select xt.install_js('XM','TransferOrder','inventory', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  XM.TransferOrder = XM.TransferOrder || {};

  XT.documentAssociations.TO = "TransferOrderListItem";

  XM.TransferOrder.isDispatchable = true;

  /**
    Find an Unreleased Transfer Order number by Item.

    @param {String} Source site code.
    @param {String} Destination site code.
    @returns {String}
  */
  XM.TransferOrder.findUnreleased = function(sourceId, destinationId) {
    var sql = "select tohead_number " +
              "from tohead " +
              " join whsinfo src on tohead_src_warehous_id=src.warehous_id " +
              " join whsinfo dest on tohead_dest_warehous_id=dest.warehous_id " +
              "where tohead_status='U'" +
              " and src.warehous_code=$1" +
              " and dest.warehous_code=$2" +
              "order by tohead_number " +
              "limit 1;";
      rows = plv8.execute(sql, [sourceId, destinationId]);

    return rows.length ? rows[0].tohead_number : false;
  };

  /**
    Returns a list of items that have item site records at each of the passed source, destination
    and transit sites.

    @param {String} Record Type
    @param {String} Source Site
    @param {String} Destination Site
    @param {String} Transit Site
  */
  XM.TransferOrder.items = function(recordType, sourceId, destinationId, transitId, query) {
    var orm = XT.Data.fetchOrm('XM', 'SiteRelation');
    var data = Object.create(XT.Data);
    var nameSpace = recordType.beforeDot();
    var type = recordType.afterDot();
    var payload = {
      username: XT.username,
      nameSpace: nameSpace,
      type: type,
      query: query
    };

    sourceId = XT.Data.getId(orm, sourceId);
    destinationId = XT.Data.getId(orm, destinationId);
    transitId = XT.Data.getId(orm, transitId);

    data.addJoinClauseDynamicExtension(nameSpace, type, function (originPayload) {
      var sourIdSql = 'JOIN (\n' +
                      '  SELECT\n' +
                      '    itemsite_item_id AS id\n' +
                      '  FROM itemsite\n' +
                      '  WHERE true\n' +
                      '    AND itemsite_active\n' +
                      '    AND itemsite_warehous_id = $' + data.whereLiteralValues.push(sourceId) + '\n' +
                      ') AS source_item_id USING (id)\n';
      var destIdSql = 'JOIN (\n' +
                      '  SELECT\n' +
                      '    itemsite_item_id AS id\n' +
                      '  FROM itemsite\n' +
                      '  WHERE true\n' +
                      '    AND itemsite_active\n' +
                      '    AND itemsite_warehous_id = $' + data.whereLiteralValues.push(destinationId) + '\n' +
                      ') AS destination_item_id USING (id)\n';
      var tranIdSql = 'JOIN (\n' +
                      '  SELECT\n' +
                      '    itemsite_item_id AS id\n' +
                      '  FROM itemsite\n' +
                      '  WHERE true\n' +
                      '    AND itemsite_active\n' +
                      '    AND itemsite_warehous_id = $' + data.whereLiteralValues.push(transitId) + '\n' +
                      ') AS transit_item_id USING (id)\n';

      return sourIdSql + destIdSql + tranIdSql;
    });

    // TODO: Enyo client expects only `data`. It should handle a normal response.
    var result = data.fetch(payload);
    return result.data;
  };

}());

$$ );

