DROP TRIGGER IF EXISTS woqualityupdatetrigger ON public.wo;
DROP FUNCTION IF EXISTS xt.woqualitytrigger();

CREATE OR REPLACE FUNCTION xt.woqualitytrigger()
  RETURNS trigger AS $$
  /* Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
    See www.xtuple.com/EULA for the full text of the software license.
  */ 
return (function () {

   var relevantPlan,
       testsToCreate,
       qualityTestId,
       orderNumber,
       orderNumberSql = "SELECT formatwonumber($1) AS wonumber;",
       updateSql = "UPDATE xt.qthead SET qthead_status = 'C' " +
                   "WHERE qthead_ordtype = 'WO' " +
                   "AND qthead_ordnumber = formatwonumber($1) ",
       selectSQL = "SELECT qpheadass.* FROM xt.qphead " +
	           "JOIN xt.qpheadass ON (qphead_id=qpheadass_qphead_id) " +
	           "JOIN itemsite ON (qpheadass_item_id=itemsite_item_id AND qpheadass_warehous_id=itemsite_warehous_id) " +
	           "WHERE itemsite_id = $1 " +
	           "AND qphead_rev_status = 'A' " +
	           "AND qpheadass_prod;";
                   
   /*  If a WO is closed/recalled also cancel related quality tests  */
   if (TG_OP === 'DELETE' || (OLD.wo_status === 'R' && NEW.wo_status === 'E')) {
     plv8.execute(updateSql, [OLD.wo_id]);
   }

   if (TG_OP === 'UPDATE' && (OLD.wo_status !== 'C' && NEW.wo_status === 'C')) {
     relevantPlan = plv8.execute(selectSQL, [NEW.wo_itemsite_id]);
     relevantPlan.map(function (plan) {
       var i, options = [];

       orderNumber = plv8.execute(orderNumberSql, [NEW.wo_id])[0].wonumber;
        
       options.frequency = plan.qpheadass_testfreq;
       options.orderType = 'WO';
       options.orderNumber = orderNumber;
       options.orderItem   = NEW.wo_number;

       testsToCreate = XM.Quality.itemQualityTestsRequired(NEW.wo_itemsite_id, plan.qpheadass_qphead_id, plan.qpheadass_freqtype, options);
       for (i = 0; i < testsToCreate; i++){
         qualityTestId = XM.Quality.createQualityTest(NEW.wo_itemsite_id, plan.qpheadass_qphead_id,options);
       }
     })
   }

   return TG_OP === 'DELETE' ? OLD : NEW;
   
}());
$$
  LANGUAGE plv8;

ALTER FUNCTION xt.woqualitytrigger() OWNER TO admin;
GRANT EXECUTE ON FUNCTION xt.woqualitytrigger() TO xtrole;

CREATE TRIGGER woqualityupdatetrigger
  AFTER UPDATE OR DELETE
  ON public.wo
  FOR EACH ROW
  EXECUTE PROCEDURE xt.woqualitytrigger();

