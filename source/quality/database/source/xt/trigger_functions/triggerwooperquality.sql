CREATE OR REPLACE FUNCTION xt.triggerwooperquality()
  RETURNS trigger AS
$$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
 See www.xtuple.com/EULA for the full text of the software license.
*/
return (function () {

  var validTransactions = [],
    selectWOSql,
    wo,
    selectSql,
    relevantPlan,
    testsToCreate,
    successorsSql,
    updateSuccessorsSql,
    qualityTestId,
    results;
    
  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  if (NEW.wooper_opntype_id !== 1) {
    /* Not an Inspection Operation Type: do nothing */
    return NEW;
  }

/* Get the Work Order Item and Site information  */
  selectWOSql = "SELECT wo_number, wo_subnumber, itemsite_id, itemsite_item_id AS item_id, itemsite_warehous_id AS site_id " +
    "FROM wo, itemsite WHERE wo_itemsite_id=itemsite_id AND wo_id = $1;";
  wo = plv8.execute(selectWOSql, [NEW.wooper_wo_id])[0];

/* Check whether there are any quality plans that meet the transaction criteria - e.g. require testing */
  selectSql = "SELECT qpheadass.* " +
    "FROM xt.qphead, xt.qpheadass " +
    "WHERE qphead.qphead_id = qpheadass.qpheadass_qphead_id " +
    "AND qpheadass_item_id= $1 " +
    "AND qpheadass_warehous_id= $2 " +
    "AND qpheadass_oper " +
    "AND qphead_rev_status = 'A';";
  relevantPlan = plv8.execute(selectSql, [wo.item_id, wo.site_id]);
  relevantPlan.map(function (plan) {
    var i, options = [];
    
    options.frequency = plan.qpheadass_testfreq;
    options.orderType = 'OP';
    options.orderNumber = wo.wo_number;
    options.orderItem   = wo.wo_subnumber;
    options.lotSerial = null;
    
    testsToCreate = XM.Quality.itemQualityTestsRequired(wo.itemsite_id, plan.qpheadass_qphead_id, plan.qpheadass_freqtype, options);
    for (i = 0; i < testsToCreate; i++){
      qualityTestId = XM.Quality.createQualityTest(wo.itemsite_id, plan.qpheadass_qphead_id, options);
    }

  });

  return NEW;
  
}());

$$
  LANGUAGE plv8 VOLATILE;
