create or replace function xt.transfer_order_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var toheadId = NEW.tohead_id;
  
  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  /* Default SiteType workflow */
  var sqlQuery = "insert into xt.wf (wf_name, wf_description, wf_type, wf_status, wf_start_date, " +
  	"wf_due_date, wf_assigned_date, wf_completed_date, wf_notes, wf_priority_id, " +
  	"wf_owner_username, wf_assigned_username, wf_parent_uuid, wf_completed_parent_status, " + 
  	"wf_deferred_parent_status, wf_sequence, wf_completed_successors, wf_deferred_successors) " + 
	"(select wfsrc_name, wfsrc_description, wfsrc_type, wfsrc_status, current_date, current_date, " + 
	"current_date, current_date, wfsrc_notes, wfsrc_priority_id, wfsrc_owner_username, wfsrc_assigned_username, " + 
	"tohead.obj_uuid, wfsrc_completed_parent_status, wfsrc_deferred_parent_status, wfsrc_sequence, " + 
	"wfsrc_completed_successors, wfsrc_deferred_successors " +
	"from tohead, xt.sitetypewf " + 
	"where tohead_id = $1);";
  plv8.execute(sqlQuery, [toheadId]);

  return NEW;

}());

$$ language plv8;