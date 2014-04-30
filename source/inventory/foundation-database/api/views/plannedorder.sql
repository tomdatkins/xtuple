SELECT dropifexists('view', 'plannedorder', 'api');
CREATE VIEW api.plannedorder
AS 
  SELECT
    planord_number || '-' || planord_subnumber AS planned_order_number,
    item_number AS item_number,
    whsinfo.warehous_code AS site,
    CASE WHEN (planord_type='P') THEN 'Purchase Order'
         WHEN (planord_type='W') THEN 'Work Order'
         WHEN (planord_type='T') THEN 'Transfer Order'
         ELSE '?'
    END AS order_type,
    COALESCE(fromsite.warehous_code, '') AS from_site,
    planord_qty AS qty_ordered,
    planord_duedate AS due_date,
    planord_startdate AS start_date,
    planord_firm AS firmed,
    planord_comments AS comments

FROM planord JOIN itemsite ON (itemsite.itemsite_id=planord_itemsite_id)
             JOIN whsinfo ON (whsinfo.warehous_id=itemsite.itemsite_warehous_id)
             JOIN item ON (item_id=itemsite.itemsite_item_id)
             LEFT OUTER JOIN itemsite fromitemsite ON (fromitemsite.itemsite_id=planord_supply_itemsite_id)
             LEFT OUTER JOIN whsinfo fromsite ON (fromsite.warehous_id=fromitemsite.itemsite_warehous_id);

GRANT ALL ON TABLE api.plannedorder TO xtrole;
COMMENT ON VIEW api.plannedorder IS 'Planned Order';

 -- Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.plannedorder DO INSTEAD

SELECT 	createplannedorder (
	fetchplannumber(),
	getItemsiteId(COALESCE(NEW.site,(
 	  SELECT warehous_code
	  FROM whsinfo, usrpref
	  WHERE ((usrpref_username=getEffectiveXtUser())
	  AND (usrpref_name='PreferredWarehouse')
	  AND (usrpref_value::integer=warehous_id))
	)),NEW.item_number,'ACTIVE'),
	NEW.qty_ordered, 
	NEW.start_date,
	COALESCE(NEW.due_date, NEW.due_date-(
	SELECT itemsite_leadtime
	FROM itemsite
	WHERE (itemsite_id=getItemsiteId(COALESCE(NEW.site,(
	   SELECT warehous_code
	   FROM whsinfo, usrpref
	   WHERE ((usrpref_username=getEffectiveXtUser())
	   AND (usrpref_name='PreferredWarehouse')
	   AND (usrpref_value::integer=warehous_id))
	))
       ,NEW.item_number,'ACTIVE')))));
	

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.plannedorder 
	DO INSTEAD  SELECT updateplannedorder (getplanordid(new.planned_order_number), 
	new.qty_ordered, 
	new.due_date, 
	new.firmed, 
	new.comments) 
	AS updateplannedorder;
 
CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.plannedorder 
	DO INSTEAD SELECT deleteplannedorder (getplanordid(old.planned_order_number), true) 
	AS deleteplannedorder; 
