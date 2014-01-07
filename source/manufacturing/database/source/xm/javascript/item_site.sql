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
      sql;
plv8.elog(NOTICE, "check0");
    /* Define recursive function to append child work orders to parent */
    appendChildren = function(parent) {
      var children = data.fetch({
          nameSpace: "XM",
          type: "WorkOrder",
          query: {parameters: [{attribute: parent, value: parent.uuid}]}
        });

      if (!parent.children) { parent.children = []; }
      children.forEach(function (child) {
        /* Remove irrelevant data */
        delete child.uuid;
        delete child.number;
        delete child.received;
        delete child.postedValue;
        delete child.receivedValue;
        delete child.wipValue;
        delete child.project;
        delete child.createdBy;
        delete child.characteristics;
        delete child.workflow;
        delete child.comments;
        delete child.timeClockHistory;

        /* Actually append the child */
        workOrder.children.push(child);

        /* Do this recursively */
        appendChildren(child);
      })
    };
plv8.elog(NOTICE, "check1");
    /* Convert variables to types native function can understand */
    itemSiteId = data.getId(orm, itemSiteId);
    startDate = options.startDate ? new Date(startDate) : false;
    dueDate = new Date(dueDate);
plv8.elog(NOTICE, "check2");
    /* Determine active revisions */
    if (options.billOfMaterialsRevisionId) {
      /* Convert to internal id */
      orm = data.fetch("XM", "BillOfMaterialRevision");
      billOfMaterialRevisionId = data.getId(orm, billOfMaterialRevisionId);
    } else {
      sql = "select getactiverevid('BOM', itemsite_item_id) as revid " +
            "from itemsite " +
            "where itemsite=$1;";
      billOfMaterialRevisionId = plv8.execute(sql, [itemSiteId])[0].revid;
    }
plv8.elog(NOTICE, "check3");
    if (options.routingRevisionId) {
      /* Convert to internal id */
      orm = data.fetch("XM", "RoutingRevision");
      routingRevisionId = data.getId(orm, billOfMaterialsRevisionId);
    } else {
      sql = "select getactiverevid('BOO', itemsite_item_id) as revid " +
            "from itemsite " +
            "where itemsite=$1;";
      routingRevisionId = plv8.execute(sql, [itemSiteId])[0].revid;
    }
plv8.elog(NOTICE, "check4");
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
plv8.elog(NOTICE, "check5");
    /* Create the temporary work order */
    params = [
      workOrderNumber,
      itemSiteId,
      priority,
      startDate || leadTime,
      dueDate,
      notes,
      parentType,
      parentId,
      projectId,
      billOfMaterialRevisionId,
      routingRevisionId
    ];
    workOrderId = XT.executeFunction("createwo", params);
plv8.elog(NOTICE, "check6");
    /* Explode if the system wasn't set to do so automatically */
    if (!autoExplodeWorkOrder) {
      XT.executeFunction("explodewo", [workOrderId, explodeChildren]);
    }
plv8.elog(NOTICE, "check7");
    /* Retrieve the work order and append children */
    workOrder = data.retrieveRecord({
      nameSpace: "XM",
      type: "WorkOrder",
      id: workOrderNumber + "-" + 1,
      superUser: true,
    });
    appendChildren(workOrder);
plv8.elog(NOTICE, "check8");
    /* Clean up our temporary work order */
    XT.executeFunction("deletewo", [workOrderId]);
    XT.executeFunction("releaseNumber", ['WoNumber', WorkOrderNumber]);
plv8.elog(NOTICE, "check9");
    return JSON.stringify({
      routings: workOrder.routings,
      materials: workOrder.materials,
      children: workOrder.children
    },null,2);
  }

}());

$$ );
