-- Work Centres
INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 3 , 'INSP' , 'QA Inspection' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 2 , 'REMAN' , 'Remanufacture' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

INSERT INTO xtmfg.wrkcnt ( wrkcnt_id, wrkcnt_code, wrkcnt_descrip,  wrkcnt_dept_id, wrkcnt_warehous_id,  wrkcnt_nummachs, wrkcnt_numpeople,  wrkcnt_setup_lbrrate_id, wrkcnt_setuprate,  wrkcnt_run_lbrrate_id, wrkcnt_runrate,  wrkcnt_brd_prcntlbr, wrkcnt_brd_rateperlbrhr,  wrkcnt_brd_ratepermachhr, wrkcnt_brd_rateperunitprod,  wrkcnt_avgqueuedays, wrkcnt_avgsutime,  wrkcnt_dailycap, wrkcnt_caploaduom, wrkcnt_efficfactor,  wrkcnt_comments, wrkcnt_wip_location_id) VALUES ( 1 , 'ASS' , 'Assembly' ,  NULL , 35 ,  1 , 1 ,  -1 , 0 ,  -1 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 0 ,  0 , 'L' , 0 ,  '' , -1  );

-- Standard Operation
INSERT INTO xtmfg.stdopn ( stdopn_id, stdopn_number,  stdopn_descrip1, stdopn_descrip2,  stdopn_wrkcnt_id, stdopn_toolref, stdopn_stdtimes,  stdopn_produom, stdopn_invproduomratio,  stdopn_sutime, stdopn_sucosttype, stdopn_reportsetup,  stdopn_rntime, stdopn_rncosttype, stdopn_reportrun,  stdopn_rnqtyper, stdopn_instructions, stdopn_opntype_id ) VALUES ( 1 ,  'INSPECT' ,  'Inspection' ,  '' ,  1 ,  'Calipers' ,  FALSE ,  'EA' ,  1 ,  0 ,  'D' ,  FALSE ,  0 ,  'D' ,  FALSE ,  0 ,  'Quality Test and Inspection' ,  1  );
INSERT INTO xtmfg.stdopn ( stdopn_id, stdopn_number,  stdopn_descrip1, stdopn_descrip2,  stdopn_wrkcnt_id, stdopn_toolref, stdopn_stdtimes,  stdopn_produom, stdopn_invproduomratio,  stdopn_sutime, stdopn_sucosttype, stdopn_reportsetup,  stdopn_rntime, stdopn_rncosttype, stdopn_reportrun,  stdopn_rnqtyper, stdopn_instructions, stdopn_opntype_id ) VALUES ( 2 ,  'REWORK' ,  'Manufacturing Rework' ,  '' ,  2 ,  '' ,  FALSE ,  'EA' ,  1 ,  0 ,  'D' ,  FALSE ,  0 ,  'D' ,  FALSE ,  0 ,  '' ,  2  );
SELECT setval('xtmfg.stdopn_stdopn_id_seq', 3);


do $$ 
/*  var demoSql = "select metric_value from public.metric where metric_name = 'DemoData'",
    demoCheck,
    idempotentSql = "select metric_value from public.metric where metric_name = 'XtMfgDemoPopulated'",
    idempotentCheck;

  demoCheck = plv8.execute(demoSql);
  if (demoCheck.length == 0 || demoCheck[0].metric_value !== 't') {
    return;
  }

  idempotentCheck = plv8.execute(idempotentSql);
  if(idempotentCheck.length) {
    return;
  }
*/
  plv8.execute("select xt.js_init()");
  XT.disableLocks = true;

 // UOM setup 
  var uomdata1 = "INSERT INTO public.uom (uom_name, uom_descrip, uom_item_weight) VALUES ('MM', 'Millimetre', false)",
    uomdata2 = "INSERT INTO public.uom (uom_name, uom_descrip, uom_item_weight) VALUES ('C', 'Degrees Centigrade', false)";
    
  plv8.execute(uomdata1);
  plv8.execute(uomdata2);  

// Sequence Setup
// Lot Serial Sequence Setup
  plv8.execute("INSERT INTO lsseq ( lsseq_id, lsseq_number) VALUES ( 3, 'LOT1');");
  plv8.execute("UPDATE lsseq SET lsseq_number='LOT1', lsseq_descrip='Lot Sequence',    lsseq_prefix='XT-',lsseq_seqlen=5,     lsseq_suffix='' WHERE (lsseq_id=3);");
  plv8.execute("SELECT setval('lsseq_number_seq_3', '50000' - 1);");

  plv8.execute("INSERT INTO lsseq ( lsseq_id, lsseq_number) VALUES ( 4, 'SERIAL1');");
  plv8.execute("UPDATE lsseq SET lsseq_number='SERIAL1', lsseq_descrip='Serial Sequence',    lsseq_prefix='XT-',lsseq_seqlen=5,     lsseq_suffix='-QA' WHERE (lsseq_id=4);");
  plv8.execute("SELECT setval('lsseq_number_seq_4', '80000' - 1);");


// First Add known Item Site (need a uuid)
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"ItemSite","id":"24b258f9-84e5-4d19-ef33-4d924c4b65d6","data":{"isActive":true,"soldRanking":1,"isPurchased":false,"abcClass":"A","isAutomaticAbcClassUpdates":false,"isDropShip":false,"costMethod":"S","cycleCountFrequency":0,"isStocked":false,"safetyStock":0,"useParameters":false,"useParametersManual":false,"reorderLevel":0,"orderToQuantity":0,"minimumOrderQuantity":0,"multipleOrderQuantity":0,"maximumOrderQuantity":0,"isLocationControl":false,"isReceiveLocationAuto":false,"isIssueLocationAuto":false,"isCreatePurchaseOrdersForSalesOrders":false,"isCreatePurchaseRequestsForSalesOrders":false,"isManufactured":false,"isCreatePurchaseRequestsForWorkOrders":false,"isCreateWorkOrdersForSalesOrders":false,"item":"BPAINT1","site":"WH2","plannerCode":"NONE","costCategory":"FINISHED","comments":[],"receiveLocation":null,"stockLocation":null,"issueLocation":null,"traceSequence":null,"supplySite":null,"restrictedLocationsAllowed":[],"uuid":"24b258f9-84e5-4d19ef33-4d924c4b65d6","controlMethod":"R","isSold":true,"notes":"Test Item Site"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');

//  Set Quality Test numbering
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"Quality","dispatch":{"functionName":"commitSettings","parameters":[[{"op":"replace","path":"/NextQualityTestNumber","value":55000},{"op":"replace","path":"/QTNumberGeneration","value":"A"}]]},"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

// Email profiles
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualityPlanEmailProfile","id":"TESTER1","data":{"name":"TESTER1","description":"Tester User","from":"quality@xtuple.com","replyTo":"","to":"tester@xtuple.com","cc":"","bcc":"","subject":"A Quality Test has been generated","body":"A Quality Test has been generated"},"binaryField":null,"requery":false,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualityPlanEmailProfile","id":"SUPERV","data":{"name":"SUPERV","description":"Test Supervisor","from":"quality@xtuple.com","replyTo":"","to":"SUPERV@xtuple.com","cc":"","bcc":"","subject":"Quality Test initiated ","body":"A new Quality Test has been initiated."},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualityPlanEmailProfile","id":"TESTER2","data":{"name":"TESTER2","description":"Tester2","from":"quality@xtuple.com","replyTo":"","to":"tester@xtuple.com","cc":"","bcc":"","subject":"Quality Test Initiated ","body":"A new Quality Test has been initiated."},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');

// Quality Specifications
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualitySpecification","id":"QS300-1","uuid":"34029ea7-d09f-41d9-c32a-f41643b7beb1","data":{"code":"QS300-1","description":"Colour Match","testType":"B","target":null,"upper":null,"lower":null,"testUnit":null,"instructions":"Visual comparison with colour swatch XX-567-AB"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualitySpecification","id":"QS300-2","uuid":"34029ea7-d09f-41d9-c32a-f41643b7beb2", "data":{"code":"QS300-2","description":"Temperature 75","testType":"N","target":75,"upper":76.5,"lower":74.5,"testUnit":"C","instructions":"Measure temperature for 15 seconds."},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualitySpecification","id":"QS300-3","uuid":"35029ea7-d09f-41d9-c32a-f41643b7beb2", "data":{"code":"QS300-3","description":"Width 50.5mm","testType":"N","target":50.5,"upper":52.5,"lower":49.5,"testUnit":"MM","instructions":"Measure width from point A to B"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualitySpecification","id":"QS300-4","uuid":"36029ea7-d09f-41d9-c32a-f41643b7beb2", "data":{"code":"QS300-4","description":"Height 1025mm","testType":"N","target":1025,"upper":1030,"lower":1020,"testUnit":"MM","instructions":"Measure height of unit from point C to D"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualitySpecification","id":"QS500-1","data":{"code":"QS500-1","description":"Visual Inspection","testType":"B","instructions":"Visual check for defects"},"binaryField":null,"requery":false,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

// Quality Plans
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualityPlan","id":"QP-300-1","data":{"revisionStatus":"A","emailProfile":"SUPERV","items":[{"specification":"QS300-1","uuid":"34029ea7-d09f-41d9-c32a-f41643b7beb1"}, {"specification":"QS300-2","uuid":"34029ea7-d09f-41d9-c32a-f41643b7beb2"}],"itemSiteAssignment":[{"frequency_type":"A","item":"BTRUCK1","site":"WH2","uuid":"24b258f9-84e5-4d19ef33-4d924c4b65d6","production":true}],"workflow":[{"status":"P","startSet":false,"startOffset":0,"dueSet":false,"dueOffset":0,"priority":"Normal","sequence":0,"owner":null,"assignedTo":null,"uuid":"b29d6602-2486-47f5-b681-3b7bd2b187d2","name":"Scrap","description":"Scrap Item","workflowType":"S","completedParentStatus":"S","deferredParentStatus":"S"},{"status":"I","startSet":true,"startOffset":0,"dueSet":true,"dueOffset":1,"priority":"Normal","sequence":0,"owner":null,"assignedTo":null,"uuid":"d6734789-0495-45c1-9cd3-f9db134573e0","name":"Test","description":"Temperature Test","workflowType":"I","completedParentStatus":"OK","deferredParentStatus":"S","deferredSuccessors":"b29d6602-2486-47f5-b681-3b7bd2b187d2"}],"comments":[],"code":"QP-300-1","description":"Pasteurisation Temperature","revisionNumber":"1","revisionDate":"2014-05-15T00:00:00.000Z","notes":"Sample Quality Plan #2"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');

// Quality Test
  plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"QualityTest","id":"4b5d05bc-f3a0-44d4-c611-e01db888442d","data":{"testStatus":"O","testDisposition":"I","qualityPlan":"QP-300-1","item":"BTRUCK1","site":"WH1","orderType":"WO","orderNumber":"10083","trace":null,"qualityTestItems":[{"qualityPlanItem":"34029ea7-d09f-41d9-c32a-f41643b7beb2","description":"Temperature 72","instructions":"Measure temperature for 15 seconds.","target":72,"upper":75,"lower":72,"testUnit":"C","testType":"N","result":"O","lineNumber":1,"uuid":"4e10719a-cbea-4e02-da8b-5d3c90e7fb98"}],"workflow":[{"owner":"admin","assignedTo":"admin","status":"P","priority":"Normal","sequence":0,"uuid":"e4ca1a3a-8ea1-479d-e7b5-4806251f2695","name":"Rework","description":"Rework this Item","workflowType":"R","notes":null,"completedParentStatus":"R","deferredParentStatus":"R","completedSuccessors":null,"deferredSuccessors":null},{"owner":"admin","assignedTo":"admin","status":"I","priority":"Normal","sequence":0,"uuid":"c27229fa-6ce6-424a-870f-a5ab06ec0862","name":"Test","description":"Temperature Test","workflowType":"I","startDate":"2014-05-26T12:00:00.000Z","dueDate":"2014-05-27T12:00:00.000Z","notes":null,"completedParentStatus":"OK","deferredParentStatus":"S","completedSuccessors":null,"deferredSuccessors":"e4ca1a3a-8ea1-479d-e7b5-4806251f2695"}],"comments":[],"uuid":"4b5d05bc-f3a0-44d4-c611-e01db888442d","number":"10003","revisionNumber":"1","startDate":"2014-05-26T12:00:00.000Z","completedDate":null,"testNotes":"Initial test"},"binaryField":null,"requery":false,"encoding":"rjson","username":"admin","encryptionKey":"putanythinghere"}\');');

// Create Lot/Serial Test Items
 plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"Item","id":"SERIAL1","data":{"description1":"Serial Enabled Item","description2":"","isActive":true,"isFractional":false,"isSold":true,"itemType":"P","listPrice":50,"isExclusive":false,"isPicklist":false,"classCode":"TOYS-CARS","inventoryUnit":"EA","productCategory":"CLASSIC-METAL","freightClass":null,"priceUnit":"EA","aliases":[],"comments":[],"characteristics":[],"accounts":[],"contacts":[],"items":[],"files":[],"urls":[],"itemSites":[],"customers":[],"number":"SERIAL1","wholesalePrice":50},"binaryField":null,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

 plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"ItemSite","id":"22614f35-9755-4c68-eb71-2746685fb0c7","data":{"isActive":true,"soldRanking":1,"isPurchased":true,"abcClass":"A","isAutomaticAbcClassUpdates":false,"isDropShip":false,"costMethod":"S","cycleCountFrequency":0,"isStocked":false,"safetyStock":0,"useParameters":false,"useParametersManual":false,"reorderLevel":0,"orderToQuantity":0,"minimumOrderQuantity":0,"multipleOrderQuantity":0,"maximumOrderQuantity":0,"isLocationControl":false,"isReceiveLocationAuto":false,"isIssueLocationAuto":false,"isCreatePurchaseOrdersForSalesOrders":false,"isCreatePurchaseRequestsForSalesOrders":false,"isManufactured":false,"isCreatePurchaseRequestsForWorkOrders":false,"isCreateWorkOrdersForSalesOrders":false,"item":"SERIAL1","site":"WH1","plannerCode":"MRP","costCategory":"FINISHED","comments":[],"receiveLocation":null,"stockLocation":null,"issueLocation":null,"traceSequence": "SERIAL","restrictedLocationsAllowed":[],"uuid":"22614f35-9755-4c68-eb71-2746685fb0c7","planningSystem":"N","isPlannedTransferOrders":false,"supplySite":null,"controlMethod":"S","isSold":true},"binaryField":null,"requery":false,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

 plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"Item","id":"LOT1","data":{"description1":"Lot Enabled Item","description2":"Purple Truck","isActive":true,"isFractional":false,"isSold":true,"itemType":"P","listPrice":50,"isExclusive":false,"isPicklist":false,"classCode":"TOYS-CARS","inventoryUnit":"EA","productCategory":"CLASSIC-METAL","freightClass":null,"priceUnit":"EA","aliases":[],"comments":[],"characteristics":[],"accounts":[],"contacts":[],"items":[],"files":[],"urls":[],"itemSites":[],"customers":[],"number":"LOT1","wholesalePrice":50},"binaryField":null,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

 plv8.execute('select xt.post(\'{"nameSpace":"XM","type":"ItemSite","id":"23614f35-9755-4c68-eb71-2746685fc0c7","data":{"isActive":true,"soldRanking":1,"isPurchased":true,"abcClass":"A","isAutomaticAbcClassUpdates":false,"isDropShip":false,"costMethod":"S","cycleCountFrequency":0,"isStocked":false,"safetyStock":0,"useParameters":false,"useParametersManual":false,"reorderLevel":0,"orderToQuantity":0,"minimumOrderQuantity":0,"multipleOrderQuantity":0,"maximumOrderQuantity":0,"isLocationControl":false,"isReceiveLocationAuto":false,"isIssueLocationAuto":false,"isCreatePurchaseOrdersForSalesOrders":false,"isCreatePurchaseRequestsForSalesOrders":false,"isManufactured":false,"isCreatePurchaseRequestsForWorkOrders":false,"isCreateWorkOrdersForSalesOrders":false,"item":"LOT1","site":"WH1","plannerCode":"MRP","costCategory":"FINISHED","comments":[],"receiveLocation":null,"stockLocation":null,"issueLocation":null,"traceSequence": "LOT","restrictedLocationsAllowed":[],"uuid":"23614f35-9755-4c68-eb71-2746685fc0c7","planningSystem":"N","isPlannedTransferOrders":false,"supplySite":null,"controlMethod":"L","isSold":true},"binaryField":null,"requery":false,"encoding":"rjson","username":"anderson","encryptionKey":"putanythinghere"}\');');

  XT.disableLocks = undefined;
  
/*  plv8.execute("INSERT INTO public.metric (metric_name, metric_value) values ('XtMfgDemoPopulated', 't');");
*/

 plv8.execute("UPDATE metric SET metric_value = 'f' WHERE metric_name = 'DisallowMismatchClientVersion'");

$$ language plv8;



