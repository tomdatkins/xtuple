CREATE OR REPLACE FUNCTION xt.inv_detail_did_change()
  RETURNS trigger AS
$BODY$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var validTransactions = [], 
    invhistSQL,
    invhist,
    selectSQL,
    relevantPlan,
    testsToCreate,
    successorsSql,
    qualityTestId;

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  validTransactions = ['RP', 'SH', 'RM'];
  
/* Get Inventory History Data */
  invhistSQL = "SELECT invhist_itemsite_id, invhist_transtype, invhist_ordtype, invhist_ordnumber FROM invhist WHERE invhist_id = $1";
  invhist = plv8.execute(invhistSQL, [NEW.invdetail_invhist_id])[0];  

/* Check for valid inventory transaction types */
  if (validTransactions.indexOf(invhist.invhist_transtype) == -1) {
/* no valid inventory transactions: do nothing */
    return NEW;
  }

/* Check whether there are any quality plans that meet the transaction criteria - e.g. require testing */
  selectSQL = "SELECT qpheadass.* FROM xt.qphead " +
	"JOIN xt.qpheadass ON (qphead_id=qpheadass_qphead_id) " +
	"JOIN itemsite ON (qpheadass_item_id=itemsite_item_id AND qpheadass_warehous_id=itemsite_warehous_id) " +
	"WHERE itemsite_id = $1 " +
	"AND qphead_rev_status = 'A' " +
	"AND CASE WHEN ($2 = 'RM') THEN qpheadass_prod " +
	"WHEN ($2 = 'RP') THEN qpheadass_recv " +
	"WHEN ($2 = 'SH') THEN qpheadass_ship " +
	"END;";      
  relevantPlan = plv8.execute(selectSQL, [invhist.invhist_itemsite_id, invhist.invhist_transtype]);	
  relevantPlan.map(function (plan) {
    var i, options = [];
    
    options.frequency = plan.qpheadass_testfreq;
    options.orderType = invhist.invhist_ordtype;
    options.orderNumber = invhist.invhist_ordnumber;
    options.orderItem   = invhist.invhist_ordnumber.split("-")[1];
    
/*  Check for ItemSite Control method.  If ItemSite is *NOT* Lot or Serial controlled
    then we use the trigger function on invhist instead. That is because of the sequence
    that xTuple processes the data.  Insert into invhist, post GL *THEN* update invhist_hasdetail
    and insert into invdetail.  This trigger fires in the middle of that process ahead of the invdetail
    records being inserted  
*/ 
    options.lotSerial = NEW.invdetail_ls_id || null;
    
    if (options.lotSerial) {
      testsToCreate = XM.Quality.itemQualityTestsRequired(invhist.invhist_itemsite_id, plan.qpheadass_qphead_id, plan.qpheadass_freqtype, options);    
      for (i = 0; i < testsToCreate; i++){
        qualityTestId = XM.Quality.createQualityTest(invhist.invhist_itemsite_id, plan.qpheadass_qphead_id,options);
      }  
    } else {
/*    Do Nothing - Let invhist trigger create the tests for non-lotSerial items */    
    }

  });

  return NEW;

}());

$BODY$
  LANGUAGE plv8 VOLATILE;
