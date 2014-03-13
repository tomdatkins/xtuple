select xt.install_js('XM','WorkOrder','manufacturing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.WorkOrder) { XM.WorkOrder = {}; }
  
  XM.WorkOrder.isDispatchable = true;

  /**
    Close a work order .

    @param {String} Work Order uuid
    @param {Object} Options
    @param {Boolean} [options.postVariances] Post variances. Default true.
    @param {Date} [options.transactiondate] Transaction date. Default current date.
    returns Boolean
  */
  XM.WorkOrder.close = function (workOrderId, options) {
    options = options || {};
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder");
      id = data.getId(orm, workOrderId),
      transactionDate = options.transactionDate || new Date(),
      postVariances = options.postVariances !== false,
      params = [id, postVariances, transactionDate],
      casts = ["integer", "boolean", "date"];
      
    return XT.executeFunction("closewo", params, casts) === 1;
  };

  /**
    Delete a work order and its children. Makes sure none of the children have locks first.
    Returns an object with properties "deleted" boolen and "ids" of deleted work orders 
    if the delete succeeded and "lock" of any lock held by another user if it failed due
    to a lock conflict. The "ids" property is an array of UUIDs.
    
    @param {String} Work Order uuid
    @returns {Object}.
  */
  XM.WorkOrder.delete = function (workOrderId) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrderRelation"),
      row,
      ids = [],
      params = [],
      counter = 1,
      workOrders,
      root,
      ret = {
        deleted: true,
        ids: []
      },

      /* Define recursive function to append child work orders to array */
      fetchChildren = function(parentId) {
        var children;
        
        sql = "select wo_id, obj_uuid from wo where wo_ordid=$1 and wo_ordtype = 'W'";
        children = plv8.execute(sql, [parentId]);

        children.forEach(function (child) {
          /* Append the child */
          ids.push(child.wo_id);
          ret.ids.push(child.obj_uuid);
            
          /* Do this recursively */
          fetchChildren(child.wo_id);
        });
      };

    /* Make sure this is allowed */
    if (!data.checkPrivilege("MaintainWorkOrders")) {
      plv8.elog(ERROR, "Access Denied");
    }

    /* Gather up work order ids along with children */
    sql = "select wo_id, obj_uuid from wo where wo.obj_uuid=$1";
    row = plv8.execute(sql, [workOrderId])[0];
    ids.push(row.wo_id);
    ret.ids.push(row.obj_uuid);
    fetchChildren(row.wo_id);

    /* First make sure we can obtain locks on all the associated work orders */
    ids.forEach(function (id) {
      var lock;

      if (!ret.lock) {
        lock = data.tryLock("wo", id);

        /* If we couldn't obtain a lock this delete has failed */
        if (!lock.key) {
          ret = {
            deleted: false,
            lock: lock
          }
        }
      }
    });

    /* If no lock conflicts, proceed to perform deletions */
    if (!ret.lock) {
      ids.forEach(function (id) {
        XT.executeFunction("deletewo", [id, false]);
      });
    }

    return ret;
  };

  /**
    Implode a work order.

    @param {String} Work Order uuid
    @param {Boolean} Include children
    returns Boolean
  */
  XM.WorkOrder.explode = function (workOrderId, includeChildren) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder");
      id = data.getId(orm, workOrderId);
      
    return XT.executeFunction("explodewo", [id, includeChildren]) > 0;
  };

  
  /**
    Fetches an array of work orders including the root work order for the id
    called for and all it's children.
    
    @param {String} Work Order uuid
    @returns {Array}
  */
  XM.WorkOrder.get = function (workOrderId, options) {
    options = options || {};
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder"),
      id,
      ids = [],
      uuids = [],
      params = [],
      counter = 1,
      workOrders,
      root,
      row,
      ret = [],

      /* Define recursive function to append child work orders to array */
      fetchChildren = function(parentId) {
        var children;
        
        sql = "select wo_id, obj_uuid from wo where wo_ordid=$1 and wo_ordtype = 'W'";
        children = plv8.execute(sql, [parentId]);

        children.forEach(function (child) {
          /* Append the child */
          ids.push(child.wo_id);
          uuids.push(child.obj_uuid);
            
          /* Do this recursively */
          fetchChildren(child.wo_id);
        });

      };

    /* Doing all this manually to wring out as much performance as possible */
    sql = "select wo_id, obj_uuid from wo where wo.obj_uuid=$1";
    row = plv8.execute(sql, [workOrderId])[0];
    ids.push(row.wo_id);
    uuids.push(row.obj_uuid);
    fetchChildren(row.wo_id);

    if (options.idsOnly) {
      return uuids;
    }

    ids.forEach(function () {
      params.push("$" + counter);
      counter++;
    });
    
    sql = 'select * from xm.work_order where id in ({params})';
    sql = sql.replace("{params}", params.join(","));
    workOrders = plv8.execute(sql, ids);

    workOrders.sort(function (a, b) {
      return a.subNumber - b.subNumber;
    });

    workOrders.forEach(function (workOrder) {
      var id = workOrder.id;
      
      data.sanitize("XM", "WorkOrder", workOrder, {superUser: true});
      ret.push({
        nameSpace: "XM",
        type: "WorkOrder",
        id: workOrder.uuid,
        etag: data.getVersion(orm, id),
        data: workOrder
      });
    });
    
    return ret;
  };

  /**
    Returns a list of UUIDs of any lines in this return that have itemsites under 
    inventory control

    @param {String} Return number
  */
  XM.WorkOrder.getControlledLines = function (workOrderId, quantity) {
    /* similar to XM.Location.requiresDetail on the client, but accessing that
      would have been torturous */
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder"),
      id = data.getId(orm, workOrderId),
      /** 
        Sql to return all Pull and Mixed materials, if inv controlled and qty to backflush. 
        "to_backflush" column math taken from postproduction(integer, numeric, boolean, integer, timestamp with time zone).
        */
      sql = "SELECT query.* " + 
        "FROM ( " + 
        "  SELECT womatl.obj_uuid as uuid, " + 
        "    CASE WHEN itemsite_loccntrl = true OR itemsite_controlmethod IN ('S', 'L') " +  
        "      THEN true ELSE false " + 
        "    END AS invctrl, " + 
        "    womatl_qtyiss +  " +
        "    (CASE " + 
        "       WHEN (womatl_qtywipscrap >  ((womatl_qtyfxd + ($2 + wo_qtyrcv) * womatl_qtyper) * womatl_scrap)) " + 
        "       THEN (womatl_qtyfxd + ($2 + wo_qtyrcv) * womatl_qtyper) * womatl_scrap " +
        "       ELSE womatl_qtywipscrap " + 
        "      END " +
        "    ) AS consumed, " +
        "    (womatl_qtyfxd + (($2 + wo_qtyrcv) * womatl_qtyper)) * (1 + womatl_scrap) AS to_backflush " +
        "  FROM womatl, wo, itemsite, item " + 
        "  WHERE ((womatl_issuemethod IN ('L', 'M')) " + 
        "    AND (womatl_wo_id=$1) " + 
        "    AND (womatl_wo_id=wo_id) " + 
        "    AND (womatl_itemsite_id=itemsite_id) " + 
        "    AND (itemsite_item_id=item_id)) " + 
        ") query " +
        "WHERE to_backflush > consumed;"

;

    return plv8.execute(sql, [id, quantity]).map(function (row) {
      return {uuid: row.uuid, quantity: row.to_backflush, invControl: row.invctrl};
    });
  };

  /**
    Implode a work order.

    @param {String} Work Order uuid
    @param {Boolean} Include children
    returns Boolean
  */
  XM.WorkOrder.implode = function (workOrderId, includeChildren) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder");
      id = data.getId(orm, workOrderId);
      
    return XT.executeFunction("implodewo", [id, includeChildren]) === 0;
  };

  /**
    Recall a work order .

    @param {String} Work Order uuid
    @param {Boolean} Include children
    returns Boolean
  */
  XM.WorkOrder.recall = function (workOrderId, includeChildren) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder");
      id = data.getId(orm, workOrderId);
      
    return XT.executeFunction("recallwo", [id, includeChildren]) === 0;
  };

  /**
    Release a work order .

    @param {String} Work Order uuid
    @param {Boolean} Include children
    returns Boolean
  */
  XM.WorkOrder.release = function (workOrderId, includeChildren) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder");
      id = data.getId(orm, workOrderId);
      
    return XT.executeFunction("releasewo", [id, includeChildren]) === 0;
  };

}());

$$ );
