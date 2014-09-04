CREATE OR REPLACE FUNCTION xt.inv_hist_did_change()
  RETURNS trigger AS
$BODY$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var validTransactions = [], 
    selectSql,
    detailSQL,
    relevantPlan,
    testToCreate,
    successorsSql,
    updateSuccessorsSql,
    detailLotSerial,
    qualityTestId,
    results;

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  validTransactions = ['RP', 'SH', 'RM'];

  if (validTransactions.indexOf(NEW.invhist_transtype) == -1) {
    /* no valid inventory transactions: do nothing */
    return NEW;
  }

/* Check whether there are any quality plans that meet the transaction criteria - e.g. require testing */
  selectSql = "SELECT qpheadass.* FROM xt.qphead " +
	"JOIN xt.qpheadass ON (qphead_id=qpheadass_qphead_id) " +
	"JOIN itemsite ON (qpheadass_item_id=itemsite_item_id AND qpheadass_warehous_id=itemsite_warehous_id) " +
	"WHERE itemsite_id = $1 " +
	"AND qphead_rev_status = 'A' " +
	"AND CASE WHEN ($2 = 'RM') THEN qpheadass_prod " +
	"WHEN ($2 = 'RP') THEN qpheadass_recv " +
	"WHEN ($2 = 'SH') THEN qpheadass_ship " +
	"END;";      
  relevantPlan = plv8.execute(selectSql, [NEW.invhist_itemsite_id, NEW.invhist_transtype]);	
  relevantPlan.map(function (plan) {
    var i, options = [];
    
    options.frequency = plan.qpheadass_testfreq;
    options.orderType = NEW.invhist_ordtype;
    options.orderNumber = NEW.invhist_ordnumber.split("-")[0];
    options.orderItem   = NEW.invhist_ordnumber.split("-")[1];
    options.lotSerial = null;
    
/*  Check for ItemSite Control method.  If ItemSite is Lot or Serial controlled
    then we use the trigger function on invdetail instead. That is because of the sequence
    that xTuple processes the data.  Insert into invhist, post GL *THEN* update invhist_hasdetail
    and insert into invdetail.  This trigger fires in the middle of that process ahead of the invdetail
    records being inserted  
*/ 
    if (!XM.Quality.isLotSerial(NEW.invhist_itemsite_id)){   
      testsToCreate = XM.Quality.itemQualityTestsRequired(NEW.invhist_itemsite_id, plan.qpheadass_qphead_id, plan.qpheadass_freqtype, options);    
      for (i = 0; i < testsToCreate; i++){
        qualityTestId = XM.Quality.createQualityTest(NEW.invhist_itemsite_id, plan.qpheadass_qphead_id,options);   
      }
    } else {
/*    Do Nothing - Let invdetail trigger create the tests */
    }        

  });

  return NEW;

}());

$BODY$
  LANGUAGE plv8 VOLATILE;
