select xt.install_js('XM','WorkOrder','manufacturing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.WorkOrder) { XM.WorkOrder = {}; }
  
  XM.WorkOrder.isDispatchable = true;
  
  /**
    Fetches an array of work orders including the root work order for the id
    called for and all it's children.
    
    @param {String} Work Order uuid
    @returns {Array}
  */
  XM.WorkOrder.get = function (workOrderId) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "WorkOrder"),
      id,
      ids = [],
      params = [],
      counter = 1,
      workOrders,
      root,
      ret = [],

      /* Define recursive function to append child work orders to array */
      fetchChildren = function(parentId) {
        var children;
        
        sql = "select wo_id from wo where wo_ordid=$1 and wo_ordtype = 'W'";
        children = plv8.execute(sql, [parentId]);

        children.forEach(function (child) {
          /* Append the child */
          ids.push(child.wo_id);
            
          /* Do this recursively */
          fetchChildren(child.wo_id);
        });

      };

    /* Doing all this manually to wring out as much performance as possible */
    sql = "select wo_id from wo where wo.obj_uuid=$1";
    id = plv8.execute(sql, [workOrderId])[0].wo_id;
    ids.push(id);
    fetchChildren(id);

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
  }

}());

$$ );
