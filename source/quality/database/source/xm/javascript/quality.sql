select xt.install_js('XM','Quality','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Quality) { XM.Quality = {options: []}; }
  
  XM.Quality.isDispatchable = true;
  
  XT.documentAssociations.QPLAN = "QualityPlanRelation";
  XT.documentAssociations.QTEST = "QualityTestRelation";
  
  XM.Quality.options = [
    "QTNumberGeneration",
    "NextQualityTestNumber"
  ];
  
  /** 
  Return Quality configuration settings.

  @returns {Object}
  */
  XM.Quality.settings = function() {
    var keys = XM.Quality.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        ret = {};

    ret.NextQualityTestNumber = plv8.execute(sql, ['QTNumber'])[0].value;
      
    ret = XT.extend(data.retrieveMetrics(keys), ret);

    return ret;
  };

  /** 
  Update Quality configuration settings. Only valid options as defined in the array
  XM.Quality.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Quality.commitSettings = function(patches) {
    var sql, 
      K = XM.Quality,
      settings = K.settings(),
      options = K.options.slice(0),
      data = Object.create(XT.Data), 
      metrics = {};
      
    /* check privileges */
    if(!data.checkPrivilege('MaintainQualityPlans')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }
    
    /* update numbers */
    if(settings['NextQualityTestNumber']) {
      plv8.execute("select xt.setnextqtnumber($1)", [settings['NextQualityTestNumber'] - 0]);
    }
    options.remove('NextQualityTestNumber'); 


    /* update remaining options as metrics
      first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  };
  
  XM.Quality.isLotSerial = function (itemSite) {
    var sql = "SELECT (itemsite_controlmethod IN ('L','S')) AS lotserial FROM itemsite WHERE itemsite_id = $1";

    return plv8.execute(sql, [itemSite])[0].lotserial;
  };
    
  XM.Quality.createQualityTest = function (itemSite, qualityPlan, options) {
    options = options || {};
    var i,
      itemAndSite,
      planData,
      qualityTest,
      qualityTestItem,
      wf,
      testUUID,
      orderType = options.orderType || null,
      orderNumber = options.orderNumber || null,
      orderItem = options.orderItem || null,      
      parent,
      lotSerial = options.lotSerial || null,
      planSql = "SELECT * FROM xt.qphead WHERE qphead_id = $1;",
      insertTestSql = "INSERT INTO xt.qthead (qthead_number,qthead_qphead_id,qthead_item_id,qthead_warehous_id,qthead_ls_id, " +
        "qthead_ordtype, qthead_ordnumber, qthead_parent, qthead_rev_number,qthead_start_date,qthead_status) " +
        " VALUES (fetchnextnumber('QTNumber'),$1,$2,$3,$4,$5,$6,$7,$8,current_date,'O') RETURNING qthead_id;",
      testUUIDSQL = "SELECT obj_uuid FROM xt.qthead WHERE qthead_id = $1",
      insertTestItemsSql = "INSERT INTO xt.qtitem (qtitem_qthead_id,qtitem_linenumber, qtitem_qpitem_id,qtitem_description, qtitem_instruction, " +
        "qtitem_type, qtitem_target, qtitem_upper, qtitem_lower, qtitem_uom, qtitem_status) " +
        " SELECT $1, COALESCE((SELECT max(qtitem_linenumber) FROM xt.qtitem WHERE qtitem_qthead_id=$1), 0) + 1, qpitem_id, " +
        " qspec_descrip,qspec_instructions,qspec_type,qspec_target,qspec_upper,qspec_lower,qspec_uom,'O' " +
        " FROM xt.qpitem planitem " +
        "  JOIN xt.qspec spec ON (qpitem_qspec_id=qspec_id) " +
        "  WHERE qpitem_qphead_id = $2;",
      notifySql = "select xt.workflow_notify($1);";

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("MaintainQualityTests")) { throw new handleError("Access Denied", 401); }
    
    itemAndSite = plv8.execute("SELECT itemsite_item_id AS item, itemsite_warehous_id AS site FROM itemsite WHERE itemsite_id = $1;",[itemSite])[0];
       
    planData = plv8.execute(planSql, [qualityPlan])[0];
    
    /* Create Quality Test */
    parent = XM.Quality.getOrderUuid(orderType, orderNumber);  // the originating document
    
    qualityTest = plv8.execute(insertTestSql, [qualityPlan,itemAndSite.item,itemAndSite.site,lotSerial,orderType, orderNumber, parent, planData.qphead_rev_number])[0].qthead_id;
    testUUID = plv8.execute(testUUIDSQL, [qualityTest])[0].obj_uuid;
    
    /* Insert Test Specifications/Items and Test Workflow Items */
    if (qualityTest > 0){
      qualityTestItem = plv8.execute(insertTestItemsSql,[qualityTest, qualityPlan]);
      wf = plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4);", ["XM.QualityPlan","XM.QualityTestWorkflow", testUUID, planData.qphead_id]);
    }
    
    /* And Notify of test creations */
    var notify = plv8.execute(notifySql, [testUUID]);
    
    return testUUID;
  };
  
  XM.Quality.getOrderUuid = function (orderType, orderNumber) {
    var orderSqlMap = {
        OP: "SELECT obj_uuid AS uuid FROM wo WHERE wo_number = $1 AND wo_subnumber = $2",
        PO: "SELECT obj_uuid AS uuid FROM pohead WHERE pohead_number = $1",
        SO: "SELECT obj_uuid AS uuid FROM cohead WHERE cohead_number = $1",
        WO: "SELECT obj_uuid AS uuid FROM wo WHERE wo_number = $1 AND wo_subnumber = $2"
      };
    if (orderType == "WO" || orderType == "OP") {  
      return plv8.execute(orderSqlMap[orderType], [orderNumber.split("-")[0], orderNumber.split("-")[1]])[0].uuid;
    } else {  
      return plv8.execute(orderSqlMap[orderType], [orderNumber.split("-")[0]])[0].uuid;
    }  
  };

  XM.Quality.itemQualityTestsRequired = function (itemSite, qplan, freqType, options) {
    var itemandSite,
      selectSql,
      testCount,
      itemCount,
      testFreq = options.frequency || 1,
      lotSerial = options.lotSerial || null,
      orderstatus,
      orderType = options.orderType || null,
      orderNumber = options.orderNumber || null;
  
    itemAndSite = plv8.execute("SELECT itemsite_item_id AS item, itemsite_warehous_id AS site FROM itemsite WHERE itemsite_id = $1", [itemSite])[0];
    switch (freqType) {
      case 'A':  /* Test All Items */
        return 1;
        break;
      case 'SER':  /* Test all Serial (essentially test all) */
        return 1;
        break;
      case 'F':  /* Test First Item on Order */
        selectSql = "SELECT count(*) AS testcount FROM xt.qthead " +
          " WHERE qthead_item_id = $1 " +
          " AND qthead_warehous_id = $2 " +
          " AND qthead_ordnumber = $3 " +
          " AND qthead_qphead_id = $4; ";
        testCount = plv8.execute(selectSql, [itemAndSite.item, itemAndSite.site, orderNumber, qplan])[0];
        return testCount.testcount === 0 ? 1 : 0;  
        break;
      case 'L': /* Test Last Item on an Order */
        selectSql = "SELECT count(*) AS testcount FROM xt.qthead " +
          " WHERE qthead_item_id = $1 " +
          " AND qthead_warehous_id = $2 " +
          " AND qthead_ordnumber = $3 " +
          " AND qthead_qphead_id = $4; ";          
        testCount = plv8.execute(selectSql, [itemAndSite.item, itemAndSite.site, orderNumber, qplan])[0];
        orderstatus = function(){
          var statusSqlMap = {
            PO: "SELECT (pohead_status = 'C') AS status FROM pohead WHERE pohead_number = $1",
            WO: "SELECT (wo_status = 'C') AS status FROM wo WHERE wo_number||'-'||wo_subnumber = $1",
            SO: "SELECT (cohead_status = 'C') AS status FROM cohead WHERE cohead_number = $1"
          };
          return plv8.execute(statusSqlMap[orderType], [orderNumber])[0];
        }           
        return (testCount.testcount === 0 && orderStatus()) ? 1 : 0;      
        break;  
      case 'LOT': /* Test Lot (essentially one test per Lot) */
        selectSql = "SELECT count(*) AS testcount FROM xt.qthead " +
          " WHERE qthead_item_id = $1 " +
          " AND qthead_warehous_id = $2 " +
          " AND qthead_ordnumber = $3 " +
          " AND qthead_ls_id = $4" + 
          " AND qthead_qphead_id = $5;";          
        testCount = plv8.execute(selectSql, [itemAndSite.item, itemAndSite.site, orderNumber, lotSerial, qplan])[0];
        return testCount.testcount === 0 ? 1 : 0;  
        break;
      case 'S':  /* Sample test frequency */
        /* Determine Tests already created for order */
        selectSql = "SELECT count(*) AS testcount FROM xt.qthead " +
          " WHERE qthead_item_id = $1 " +
          " AND qthead_warehous_id = $2 " +
          " AND qthead_ordnumber = $3 " +
          " AND qthead_qphead_id = $4; ";
        testCount = plv8.execute(selectSql, [itemAndSite.item, itemAndSite.site, orderNumber, qplan])[0];
        /* Determine items posted against order */
        selectSql = "SELECT SUM(invhist_invqty) AS itemCount FROM invhist " +
          " WHERE invhist_itemsite_id = (SELECT itemsite_id FROM itemsite WHERE itemsite_item_id = $1 and itemsite_warehous_id = $2) " +
          " AND invhist_ordnumber = $3 ";
        itemCount = plv8.execute(selectSql, [itemAndSite.item, itemAndSite.site, orderNumber])[0];
          
        return (itemCount.itemCount / testFreq) - testCount.testcount;
        break;
      default:  /* Invalid option supplied */    
        throw new handleError("Invalid Frequency Type option supplied: " + freqType, 401);
        return -1;
    }    
  };  

}());
  
$$ ); 


/* Initial Quality Module Setup functions */

CREATE OR REPLACE FUNCTION xt.setnextqtnumber(integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQTNumber ALIAS FOR $1;
  _orderseqid INTEGER;

BEGIN

  SELECT orderseq_id INTO _orderseqid
  FROM orderseq
  WHERE (orderseq_name='QTNumber');

  IF (NOT FOUND) THEN
    SELECT NEXTVAL('orderseq_orderseq_id_seq') INTO _orderseqid;

    INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol)
    VALUES (_orderseqid, 'QTNumber', pQTNumber, 'xt.qthead', 'qthead_number');

  ELSE
    UPDATE orderseq
    SET orderseq_number=pQTNumber
    WHERE (orderseq_name='QTNumber');
  END IF;

  RETURN _orderseqid;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE;
  
ALTER FUNCTION xt.setnextqtnumber(integer) OWNER TO admin;
GRANT ALL ON FUNCTION xt.setnextqtnumber(integer) TO xtrole;

do $$
  /* Only create the quality metrics if not been created already */
  var res, sql;

/* Quality Metrics */
  sql = "SELECT setmetric('QTNumberGeneration', 'A');"
  plv8.execute(sql);

  sql = "SELECT setmetric('NextQualityTestNumber', '');"
  plv8.execute(sql);

/* Set Up initial Quality Test Number Sequence */
  sql = "select orderseq_number from orderseq where orderseq_name = 'QTNumber'";
  res = plv8.execute(sql);
  if (!res.length) {
    sql = "SELECT xt.setnextqtnumber(10000);"
    plv8.execute(sql);
  }

$$ language plv8;	
