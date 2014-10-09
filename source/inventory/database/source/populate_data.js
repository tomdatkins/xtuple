module.exports = [

  {"nameSpace":"XM","type":"SaleType","id":"CUST","patches":[{"op":"add","path":"/workflow/0","value":{"status":"I","startSet":false,"startOffset":0,"dueSet":false,"dueOffset":0,"priority":"Normal","sequence":0,"workflowType":"P","owner":"admin","assignedTo":"admin","uuid":"1a6fc6b6-263d-464a-f468-eb02cb19a9f4","name":"Issue to Shipping","description":"Packing the shipment in the warehouse","completedSuccessors":"bf03993f-2d92-467e-c873-903fc107bd3d"}},{"op":"add","path":"/workflow/1","value":{"status":"P","startSet":false,"startOffset":0,"dueSet":false,"dueOffset":0,"priority":"Normal","sequence":0,"workflowType":"S","owner":null,"assignedTo":null,"uuid":"bf03993f-2d92-467e-c873-903fc107bd3d","name":"Ship","description":"Ship the shipment from the freight dock"}}],"binaryField":null,"requery":false},

  {"nameSpace":"XM","type":"Site","id":"WH2","data":{"siteType":"MFG","contact":null,"address":null,"taxZone":null,"comments":[],"costCategory":null,"shipVia":null,"zones":[],"code":"WH2","isActive":true,"description":"Warehouse 2","isTransitSite":false},"binaryField":null,"requery":false}


];
