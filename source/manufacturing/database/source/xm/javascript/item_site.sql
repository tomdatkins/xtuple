select xt.install_js('XM','ItemSite','manufacturing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.ItemSite) { XM.ItemSite = {}; }
  
  XM.Item.isDispatchable = true;
  
  /**
    Returns an object with routings and materials that represents a
    "what-if" exploded work order structure for a given Item Site.
    
    @param {String} Item Site uuid
    @param {Number} Quantity
    @param {Date} Due date
    @param {Object} Options
    @param {Number} [options.leadTime] Lead Time,
    @param {Date}   [options.startDate] Start Date,
    @param {String} [options.workOrderParentId] Work Order Parent uuid,
    @param {String} [options.billOfMaterialRevisionId] Bill of Material Revision uuid,
    @param {String} [options.routingRevisionId] Routing Revision uuid,
    @returns {Object}
  */
  XM.ItemSite.explode = function(itemSiteId, quantity, dueDate, options) {
    /* What we're going to do here is create a temporory work order,
       explode it, cache the results, and delete it. There's vast logic
       behind the pre-existing explode function that we can't touch from
       here, nor would be wise to duplicate. Possibly one day this can be
       refactored to be less awkward */

    options = options || {};
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "ItemSiteRelation"),
      workOrderNumber = XT.executeFunction("fetchwonumber") - 0,
      autoExplodeWo = XT.executeFunction("fetchmetricbool", ['AutoExplodeWO']),
      woExplosionLevel = XT.executeFunction("fetchmetrictext", ['WOExplosionLevel']),
      explodeChildren = woExplosionLevel === 'M',
      leadTime = options.leadTime || 0,
      priority = 1,
      projectId = null,
      notes = "",
      appendChildren,
      billOfMaterialRevisionId,
      RoutingRevisionId,
      workOrderId,
      workOrder,
      startDate,
      workOrderParent,
      parentType,
      parentId,
      itemId,
      params,
      casts,
      sql;

    /* Define recursive function to append child work orders to parent */
    appendChildren = function(parent) {
      var children;

      sql = 'select id, uuid, parent, "workOrderMaterial", status, ' +
            'item, site, mode, "startDate", "dueDate", quantity, ' +
            '"costRecognition", priority, materials, routings ' +
            "from xm.work_order " +
            "where id in (" +
            "  select wo_id " +
            "  from wo " +
            "  where wo_ordid=$1 " +
            "   and wo_ordtype='W');";
      children = plv8.execute(sql, [parent.id]);
      
      if (!parent.children) { parent.children = []; }
      
      children.forEach(function (child) {
        /* Do this recursively */
        appendChildren(child);
        
        /* Remove irrelevant data */
        delete child.id;

        /* Append the child */
        workOrder.children.push(child);
      })
    };

    /* Convert variables to types native function can understand */
    itemSiteId = data.getId(orm, itemSiteId);
    startDate = options.startDate ? new Date(startDate) : false;
    dueDate = new Date(dueDate);

    /* Determine active revisions */
    if (options.billOfMaterialsRevisionId) {
      /* Convert to internal id */
      orm = data.fetchOrm("XM", "BillOfMaterialRevision");
      billOfMaterialRevisionId = data.getId(orm, billOfMaterialRevisionId);
    } else {
      sql = "select getactiverevid('BOM', itemsite_item_id) as revid " +
            "from itemsite " +
            "where itemsite_id=$1;";
      billOfMaterialRevisionId = plv8.execute(sql, [itemSiteId])[0].revid;
    }

    if (options.routingRevisionId) {
      /* Convert to internal id */
      orm = data.fetchOrm("XM", "RoutingRevision");
      routingRevisionId = data.getId(orm, billOfMaterialsRevisionId);
    } else {
      sql = "select getactiverevid('BOO', itemsite_item_id) as revid " +
            "from itemsite " +
            "where itemsite_id=$1;";
      routingRevisionId = plv8.execute(sql, [itemSiteId])[0].revid;
    }

    /* Resolve parent info if applicable */
    if (options.workOrderParentId) {
      workOrderParent = data.retrieveRecord({
        nameSpace: "XM",
        type: "WorkOrderParent",
        id: options.workOrderParentId,
        isSuperUser: true,
        includeKeys: true
      });
      parentType = workOrderParent.type,
      parentId = workOrderParent.id
    }

    /* Create the temporary work order */
    params = [
      workOrderNumber,
      itemSiteId,
      priority,
      quantity,
      startDate || leadTime,
      dueDate,
      notes,
      parentType,
      parentId,
      projectId,
      billOfMaterialRevisionId,
      routingRevisionId
    ];
    casts = [
      "integer",
      "integer",
      "integer",
      "numeric",
      startDate ? "date" : "integer",
      "date",
      "text",
      "text",
      "integer",
      "integer",
      "integer",
      "integer" 
    ];
    workOrderId = XT.executeFunction("createwo", params, casts) - 0;

    /* Explode if the system wasn't set to do so automatically */
    if (!autoExplodeWo) {
      XT.executeFunction("explodewo", [workOrderId, explodeChildren]);
    }

    /* Retrieve the work order and append children */
    sql = "select id, materials, routings from xm.work_order where id=$1";
    workOrder = plv8.execute(sql, [workOrderId]);
    appendChildren(workOrder);

    /* Clean up our temporary work order */
    XT.executeFunction("deletewo", [workOrderId, true, true]);
    XT.executeFunction("releaseNumber", ['WoNumber', workOrderNumber]);

    return {
      routings: workOrder.routings,
      materials: workOrder.materials,
      children: workOrder.children
    };
  }

}());

$$ );
