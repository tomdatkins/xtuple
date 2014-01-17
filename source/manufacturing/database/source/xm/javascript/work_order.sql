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
      workOrders = [],
      root,

      /* Define recursive function to append child work orders to array */
      fetchChildren = function(parent) {
        var children = data.fetch({
            nameSpace: "XM",
            type: "WorkOrderRelation",
            query: {parameters: [{attribute: "parent.uuid", value: parent.id}]}
          });

        if (!children.data) { return; }
        children.data.forEach(function (child) {
          /* Need to fetch separately to get an etag */
          var workOrder = data.retrieveRecord({
            nameSpace: "XM",
            type: "WorkOrder",
            id: child.uuid
          });
      
          /* Append the child */
          workOrders.push(workOrder);
            
          /* Do this recursively */
          fetchChildren(workOrder);
        });

      };

    root = data.retrieveRecord({
      nameSpace: "XM",
      type: "WorkOrder",
      id: workOrderId
    });
    workOrders.push(root);
    fetchChildren(root);

    return workOrders;
  }

}());

$$ );
