/* TODO: update this script and screen to work for both wf item and wf activity 
 * and then delete the WorkflowActivity screen and script
 */

debugger;

include("sharedwf");
var _module                  = mywindow.findChild("_module");
var _type                    = mywindow.findChild("_type");
var _name                    = mywindow.findChild("_name");
var _desc                    = mywindow.findChild("_desc");
var _wftype                  = mywindow.findChild("_wftype");
var _priority                = mywindow.findChild("_priority");
var _sequence                = mywindow.findChild("_sequence");
var _owner                   = mywindow.findChild("_owner");
var _assigned                = mywindow.findChild("_assigned");
var _status                  = mywindow.findChild("_status");
var _calcStart               = mywindow.findChild("_calcStartOffset");
var _startOffset             = mywindow.findChild("_startOffsetDays");
var _calcEnd                 = mywindow.findChild("_calcEndOffset");
var _endOffset               = mywindow.findChild("_endOffsetDays");
var _notes                   = mywindow.findChild("_notes");
var _printerLit              = mywindow.findChild("_printerLit");
var _printer                 = mywindow.findChild("_printer");
var _reportLit               = mywindow.findChild("_reportLit");
var _report                  = mywindow.findChild("_report");
var _billing                 = mywindow.findChild("_billing");
var _invoice                 = mywindow.findChild("_invoice");
var _printCkBox              = mywindow.findChild("_printCkBox");
var _fromemail               = mywindow.findChild("_fromemail");
var _toemail                 = mywindow.findChild("_toemail");
var _compNextStatusLit       = mywindow.findChild("_compNextStatusLit");
var _defNextStatusLit        = mywindow.findChild("_defNextStatusLit");
var _compNextStatus          = mywindow.findChild("_compNextStatus");
var _defNextStatus           = mywindow.findChild("_defNextStatus");
var _cancel                  = mywindow.findChild("_cancel");
var _save                    = mywindow.findChild("_save");
var _tabs                    = mywindow.findChild("_tabs");
var _compTab                 = mywindow.findChild("_compTab");
var _defTab                  = mywindow.findChild("_defTab");
var _printTab                = mywindow.findChild("_printTab");
var _compAvailableSuccessors = mywindow.findChild("_compAvailableSuccessors");
var _compSuccessors          = mywindow.findChild("_compSuccessors");
var _defAvailableSuccessors  = mywindow.findChild("_defAvailableSuccessors");
var _defSuccessors           = mywindow.findChild("_defSuccessors");
var _compAddSuccessor        = mywindow.findChild("_compAddSuccessor");
var _compRemoveSuccessor     = mywindow.findChild("_compRemoveSuccessor");
var _defAddSuccessor         = mywindow.findChild("_defAddSuccessor");
var _defRemoveSuccessor      = mywindow.findChild("_defRemoveSuccessor");
var _wfid                    = -1;
var _wfsrc_uuid              = -1;

   _compAvailableSuccessors.addColumn(qsTr("Name"),        100,    Qt.AlignLeft,   true,  "name"   );
   _compAvailableSuccessors.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );
   _compAvailableSuccessors.addColumn(qsTr("Type"),        100,    Qt.AlignLeft,   true,  "type"   );
   _compSuccessors.addColumn(qsTr("Name"),        100,    Qt.AlignLeft,   true,  "name"   );
   _compSuccessors.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );
   _compSuccessors.addColumn(qsTr("Type"),        100,    Qt.AlignLeft,   true,  "type"   );
   
   _defAvailableSuccessors.addColumn(qsTr("Name"),        100,    Qt.AlignLeft,   true,  "name"   );
   _defAvailableSuccessors.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );
   _defAvailableSuccessors.addColumn(qsTr("Type"),        100,    Qt.AlignLeft,   true,  "type"   );
   _defSuccessors.addColumn(qsTr("Name"),        100,    Qt.AlignLeft,   true,  "name"   );
   _defSuccessors.addColumn(qsTr("Description"),  -1,    Qt.AlignLeft,   true,  "desc"   );
   _defSuccessors.addColumn(qsTr("Type"),        100,    Qt.AlignLeft,   true,  "type"   );   
   
// hide next status boxes. Not sure these are used yet....
   _compNextStatusLit.visible = false;
   _defNextStatusLit.visible = false;
   _compNextStatus.visible = false;
   _defNextStatus.visible = false;
   _billing.visible = false;
   _invoice.visible = false;
   handleInvoice();
   
// hide printer tab unless action is pack or ship   
   _tabs.setTabEnabled(_tabs.indexOf(_compTab), false);
   _tabs.setTabEnabled(_tabs.indexOf(_defTab), false);
   _tabs.setTabEnabled(_tabs.indexOf(_printTab), false);   
   
// set module options
   _module.append(-1, "Select a Module" );
   _module.append( 1, "Sales"      );
   _module.append( 2, "Purchase"   );
   _module.append( 3, "Inventory"  );
   _module.append( 4, "Manufacture");
   _module.append( 5, "Project"    );

// set priority options
   _priority.populate("SELECT incdtpriority_id, incdtpriority_name FROM incdtpriority "
                    + "ORDER BY incdtpriority_order");
function populate_status()
{
  try {
      var clauseAry = [];
      
      status.options.forEach(function (elem) {
           clauseAry.push("SELECT " + elem.id + " AS id, '" + elem.text + "', '" + elem.code + "'");
      });
      var optqry = clauseAry.join(" UNION ");
      _status.populate(optqry);      
   }
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function handleInvoice()
{
  if(_billing.checked)
    _invoice.checkable = true;
  else
  {
    _invoice.checked = false;
    _invoice.checkable = false;
  }
}

function populate_next_status()
{
  try {
      var clauseAry = [];
      
      next_status.options.forEach(function (elem) {
           clauseAry.push("SELECT " + elem.id + " AS id, '" + elem.text + "', '" + elem.code + "'");
      });
      var optqry = clauseAry.join(" UNION ");
      _compNextStatus.populate(optqry);
      _defNextStatus.populate(optqry);
      
   } 
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_type()
{
  if(_module.id() >= 0)
   {
   try {
     var typeqry = wftype[_module.text].typeqry;   
     _type.populate(typeqry);
   } 
   catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
  }
}

function populate_wftype()
{
  if(_module.id() >= 0)
  {
   try {
     var clauseAry = [];
      
     wftype[_module.text].types.forEach(function (elem) {
           clauseAry.push("SELECT " + elem.id + " AS id, '" + elem.text + "', '" + elem.code + "'");
     });
     var wftypeqry = clauseAry.join(" UNION ");
     wftypeqry = wftypeqry + " ORDER BY id";
     _wftype.populate(wftypeqry);
   } 
   catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
  }
}

function handleSuccessorTabs()
{
  if (_module.id() >= 0) {
    _tabs.setTabEnabled(_tabs.indexOf(_compTab), true);
    _tabs.setTabEnabled(_tabs.indexOf(_defTab), true);
  }
  else {
    _tabs.setTabEnabled(_tabs.indexOf(_compTab), false);
    _tabs.setTabEnabled(_tabs.indexOf(_defTab), false);
  }
}  
  
function handlePrintTab()
{
  if(_wftype.text == 'SHIP' || _wftype.text == "POST RECEIPT") {
    _tabs.setTabEnabled(_tabs.indexOf(_printTab), true);
    populate_printers();
    populate_report();
  }
  else {
    _tabs.setTabEnabled(_tabs.indexOf(_printTab), false);
  }
  if(_wftype.text == 'SHIP') {
    _billing.visible = true;
    _invoice.visible = true;
  }
  else {
    _billing.visible = false;
    _invoice.visible = false;
  }
}

function populate_printers()
{
   try {
      var printqry = toolbox.executeQuery("SELECT printer_id, printer_name FROM xt.printer");
      _printer.populate(printqry);
      if(printqry.lastError().type != QSqlError.NoError)
        throw new Error(printqry.lastError().text);
    } 
    catch(e) {
      QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
    }
}

function populate_report()
{
  /* currently, the report values are hardcoded, because the mql values are coded into
     the workflow_inherit_source function */
  if ( _wftype.text == 'PACK' )
    _report.text  = 'PickingListSOLocsNoClosedLines';
  if ( _wftype.text == 'SHIP' ) 
    _report.text  = 'PackingList';
  if ( _wftype.text == 'POST RECEIPT' )
    _report.text  = 'ReceivingLabel';
  _report.enabled = false;
}

function populate_successors()
{
  try {
    var params = new Object();
    if( (_tabs.currentIndex == _tabs.indexOf(_compTab) ) && (_module.id() > 0) )
    {
      params.compsuc = "wfsrc_completed_successors"  
    }
    params.wfid = _wfid;
      
    _compSuccessors.clear();
    _defSuccessors.clear();
      
    var qryStA = toolbox.executeQuery("SELECT <? if exists('compsuc') ?> "
               + " wfsrc_completed_successors <? else ?> "
               + " wfsrc_deferred_successors <? endif ?> AS list "
               + "FROM xt.wfsrc WHERE wfsrc_id = <? value('wfid') ?>", params);
    var i = 0;
    if (qryStA.first()) {
      if (qryStA.value("list") != '') {   
        params.uuid_list = "'" + qryStA.value("list").split(",").join("','") +"'";
        var successorqry = "SELECT wfsrc_id AS id, wfsrc_name AS name, wfsrc_description AS desc, "
                             + "wfsrc_type AS type, obj_uuid FROM xt.wfsrc "
                             + "WHERE obj_uuid IN (<? literal('uuid_list') ?>)"
        var finalqry = toolbox.executeQuery(successorqry, params)
        if(finalqry.lastError().type != QSqlError.NoError)
          throw finalqry.lastError().text;
             
        if(params.compsuc)
          _compSuccessors.populate(finalqry);
        else
          _defSuccessors.populate(finalqry);
      }
    } 
  } 
  catch(e) {
      QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function pop_avail_successors()
{
  try {
    var params = new Object();

    if( (_tabs.currentIndex == _tabs.indexOf(_compTab) ) && (_module.id() > 0) )
    {
      params.compsuc = "wfsrc_completed_successors"  


      params.wfid = _wfid;
      params.module = wftype[_module.text].module;
      params.type = _type.id();
   
      var avlSuc = toolbox.executeQuery("SELECT * "
          + " FROM ( SELECT wfsrc_id AS id, "
          + "       wfsrc_name AS name, "
          + "       wfsrc_description AS desc, "
          + "       wfsrc_type AS type, "
          + "       obj_uuid::text as txtid "
          + "       FROM <? literal('module') ?> "
          + "       WHERE wfsrc_id <> <? value('wfid') ?> "
          + "       AND wfsrc_parent_id = <? value('type') ?> ) as qry "
          + " WHERE txtid NOT IN ( "
          + "       SELECT unnest(string_to_array( "
          + "       <? if exists('compsuc') ?> wfsrc_completed_successors "
          + "       <? else ?> wfsrc_deferred_successors <? endif ?>, ',')) "
          + "       FROM xt.wfsrc "
          + "       WHERE wfsrc_id = <? value('wfid') ?> )", params);
          
      if(avlSuc.lastError().type != QSqlError.NoError)
        throw new Error(avlSuc.lastError().text);
      if(params.compsuc == "wfsrc_completed_successors")
        _compAvailableSuccessors.populate(avlSuc);
      else
        _defAvailableSuccessors.populate(avlSuc);     
    }           
  } 
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function add_successor()
{
   try {
      var params = new Object();
      
    if( (_tabs.currentIndex == _tabs.indexOf(_compTab) ) && (_module.id() > 0) )
      {
         params.field = "wfsrc_completed_successors"   
         params.sourceid = _compAvailableSuccessors.id();
      } else if(_tabs.currentIndex == _tabs.indexOf(_defTab)) {
         params.field = "wfsrc_deferred_successors";
         params.sourceid = _defAvailableSuccessors.id();
      }
      params.wfid = _wfid;
      var objqry = toolbox.executeQuery("SELECT obj_uuid::text AS txt_uuid FROM xt.wfsrc "
                              + " WHERE wfsrc_id = <? value('sourceid') ?>", params);
      if(objqry.first())
         params.uuid = objqry.value("txt_uuid");
       else if(objqry.lastError().type != QSqlError.NoError)
         throw new Error(ojbqry.lastError().text);
       else
           QMessageBox.critical(mywindow, "error", "Add Successor Error: No Result Found");

      var updqry = toolbox.executeQuery("update xt.wfsrc SET <? literal('field') ?> = "
              + " CASE WHEN <? literal('field') ?> = '' THEN <? value('uuid') ?> "
              + "      WHEN <? literal('field') ?> IS NULL THEN <? value ('uuid') ?> "
              + "      ELSE <? literal('field') ?> || ',' || <? value('uuid') ?> "
              + " END WHERE wfsrc_id = <? value('wfid') ?> ", params);
              
      populate_successors();
      pop_avail_successors();
   } 
   catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function remove_successor()
{
  try {
    var params = new Object();
    if( (_tabs.currentIndex == _tabs.indexOf(_compTab) ) && (_module.id() > 0) )
    {
      params.field = "wfsrc_completed_successors"   
        params.sourceid = _compSuccessors.id();
    } else if(_tabs.currentIndex == 1) {
      params.field = "wfsrc_deferred_successors";
      params.sourceid = _defSuccessors.id();
    }
    params.wfid = _wfid;
    var objqry = toolbox.executeQuery("SELECT obj_uuid::text AS txt_uuid FROM xt.wfsrc "
                              + " WHERE wfsrc_id = <? value('sourceid') ?>", params);
    if(objqry.first())
      params.uuid = objqry.value("txt_uuid");
    else if(objqry.lastError().type != QSqlError.NoError)
      throw new Error(objqry.lastError().text);
    else
      QMessageBox.critical(mywindow, "error", "Remove Successor Error: No Result Found");
       
    var listqry = toolbox.executeQuery("SELECT <? literal('field') ?> AS list FROM xt.wfsrc "
                            + " WHERE wfsrc_id = <? value('wfid') ?> ", params);
    if(listqry.first()) {
      var list = listqry.value("list").split(',');
      var idx = list.indexOf(params.uuid);
      list.splice(idx,1);
      params.list = list.join(",");
      var rmvqry = toolbox.executeQuery("UPDATE xt.wfsrc "
                  + " SET <? literal('field') ?> = <? value('list') ?> "
                  + " WHERE wfsrc_id = <? value('wfid') ?> ", params);
                  
      if(rmvqry.lastError().type != QSqlError.NoError)
        throw new Error(rmvqry.lastError().text);
       
    }
    else if(listqry.lastError().type != QSqlError.NoError)
      throw new Error(listqry.lastError().text);
    else
      QMessageBox.critical(mywindow, "error", "Add Successor Error: No Result Found");
      
    populate_successors();
    pop_avail_successors();
    
   } 
  catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function set(input)
{   
  try {
    var params = new Object();
    if("mode" in input)
      params.mode = input.mode;
    if(params.mode == "new") {
      populate_type();
      populate_wftype();
    }
    else if(params.mode == "edit") {
      if("module" in input) {
         _module.text = input.module;
             populate_type();
             populate_wftype();
      }
      if("type" in input)
            _type.text = input.type;  
      if("workflow_id" in input) {
         _wfid = input.workflow_id;
         params.workflow_id = input.workflow_id;
         populate_successors();
         pop_avail_successors();
      }
      var qry = toolbox.executeDbQuery("WorkflowList", "detail", params);
      if (qry.first()) {
        _name.text            = qry.value("name");
        _desc.text            = qry.value("description");
        _wftype.text          = qry.value("wftype");
        _priority.text        = qry.value("priority");
        _sequence.value       = qry.value("wfsequence");
        _owner.text           = qry.value("owner");
        _assigned.text        = qry.value("assigned_to");
        _status.text          = qry.value("status");
        _startOffset.value    = qry.value("wfsrc_start_offset");
        _endOffset.value      = qry.value("wfsrc_due_offset");
        _wfsrc_uuid           = qry.value("obj_uuid");
        //_compNextStatus.text  = qry.value("comp_next_status");
        //_defNextStatus.text   = qry.value("def_next_status");           
        _notes.setText(qry.value("wfsrc_notes"));
        _calcStart.setChecked(qry.value("wfsrc_start_set"));
        _calcEnd.setChecked(qry.value("wfsrc_due_set"));
      }
      else if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
      //TODO: add set up for print tab data
      var printparamqry = toolbox.executeQuery("SELECT "
        + "        billing.wfsrc_printparam_value   AS billing "
        + "       ,invoice.wfsrc_printparam_value   AS invoice "
        + "       ,report.wfsrc_printparam_value    AS report_name "
        + "       ,printer.wfsrc_printparam_value   AS report_printer "
        + "       ,fromemail.wfsrc_printparam_value AS fromemail "
        + "       ,toemail.wfsrc_printparam_value   AS toemail "
        + "  FROM  workflow.wfsrc_printparam billing "
        + "       ,workflow.wfsrc_printparam invoice "
        + "       ,workflow.wfsrc_printparam report "
        + "       ,workflow.wfsrc_printparam printer "
        + "       ,workflow.wfsrc_printparam fromemail "
        + "       ,workflow.wfsrc_printparam toemail "
        + " WHERE (  billing.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND   billing.wfsrc_printparam_name = 'billing' ) "
        + "   AND (  invoice.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND   invoice.wfsrc_printparam_name = 'invoice' ) "
        + "   AND (   report.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND    report.wfsrc_printparam_name = 'name' ) "
        + "   AND (  printer.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND   printer.wfsrc_printparam_name = 'reportPrinter' ) "
        + "   AND (fromemail.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND fromemail.wfsrc_printparam_name = 'fromemail' ) "     
        + "   AND (  toemail.wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?> "
        + "        AND   toemail.wfsrc_printparam_name = 'toemail' ) ", params);
        
      if (printparamqry.first()) {
        _billing.setChecked(printparamqry.value("billing"));
        _invoice.setChecked(printparamqry.value("invoice"));
        _printCkBox.setChecked(true);
        _report.text = printparamqry.value("report_name");
        _printer.text = printparamqry.value("report_printer");
        _fromemail.text = printparamqry.value("fromemail");
        _toemail.text = printparamqry.value("toemail");
        handleInvoice();
      }
      else if (printparamqry.lastError().type != QSqlError.NoError) 
        throw new Error(printparamqry.lastError().text);
    }
  } 
  catch(e) {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function save()
{
  try {
    var params = new Object();
      
    params.workflow_id = _wfid;
    params.module = wftype[_module.text].module;
    params.parent = _type.id();
       
    // workflow type
    var tempwftype = wftype[_module.text].types.filter(function (elem) { return elem.text===_wftype.text; });
    if(tempwftype.length)
      params.wftype= tempwftype[0].code; 
    else {
         QMessageBox.critical(mywindow, "Error", "Could not find wftype for " + _wftype.text);
         return;
    }
      
    // status
    var tempstat = status.options.filter(function (elem) { return elem.text===_status.text; });
    if(tempstat.length)
      params.status= tempstat[0].code; 
    else {
         QMessageBox.critical(mywindow, "Error", "Could not find status for " + _status.text);
         return;
    }

    /* completed next status
    var tempcompstat = next_status.options.filter(function (elem) { return elem.text===_compNextStatus.text; });
    if(tempcompstat.length)
      params.comp_next_status= tempcompstat[0].code; 
    else 
    {
         QMessageBox.critical(mywindow, "Error", "Could not find next_status for " + _compNextStatus.text);
         return;
    }
      
    // deferred next status
    var tempdefstat = next_status.options.filter(function (elem) { return elem.text===_defNextStatus.text; });
    if(tempdefstat.length)
      params.def_next_status= tempdefstat[0].code; 
    else {
         QMessageBox.critical(mywindow, "Error", "Could not find next_status for " + _defNextStatus.text);
         return;
    }
    */ 
      
    params.name         = _name.text;
    params.desc         = _desc.text;
    params.priority     = _priority.id();
    params.sequence     = _sequence.value;
    params.owner        = _owner.text;
    params.assigned     = _assigned.text;
    params.start_set    = _calcStart.checked;
    params.due_set      = _calcEnd.checked;
    params.start_offset = _startOffset.value;
    params.due_offset   = _endOffset.value;
    params.notes        = _notes.plainText;
      
    toolbox.executeBegin();
    if (_wfid > 0) {
        update = true;
        var qry = toolbox.executeQuery("UPDATE xt.wfsrc SET "
           + "  wfsrc_name          = <? value('name') ?> "
           + ", wfsrc_description       = <? value('desc') ?> "
           + ", wfsrc_type          = <? value('wftype') ?> "
           + ", wfsrc_priority_id       = <? value('priority') ?> "
           + ", wfsrc_sequence         = <? value('sequence') ?> "
           + ", wfsrc_owner_username    = <? value('owner') ?> "
           + ", wfsrc_assigned_username = <? value('assigned') ?> "
           + ", wfsrc_status          = <? value('status') ?> "
           + ", wfsrc_parent_id       = <? value('parent') ?> "
           + ", wfsrc_start_set       = <? value('start_set') ?> "
           + ", wfsrc_start_offset    = <? value('start_offset') ?> "
           + ", wfsrc_due_set          = <? value('due_set') ?> "
           + ", wfsrc_due_offset       = <? value('due_offset') ?> "
           + ", wfsrc_notes          = <? value('notes') ?> "   
           + ", wfsrc_completed_parent_status    = <? value('comp_next_status') ?> "   
           + ", wfsrc_deferred_parent_status    = <? value('def_next_status') ?> "                
           + " WHERE wfsrc_id = <? value('workflow_id') ?>", params);  
        if (qry.lastError().type != QSqlError.NoError)
        throw new Error(qry.lastError().text);
        
      } 
      else {
        var qry = toolbox.executeQuery("INSERT INTO <? literal('module') ?> ("
           + " wfsrc_name, wfsrc_description, wfsrc_type, "
           + " wfsrc_priority_id, wfsrc_sequence, wfsrc_owner_username, "
           + " wfsrc_assigned_username, wfsrc_status, wfsrc_parent_id, wfsrc_start_set, "
           + " wfsrc_start_offset, wfsrc_due_set, wfsrc_due_offset, wfsrc_notes, "
           + " wfsrc_completed_parent_status, wfsrc_deferred_parent_status) "
           + " VALUES (<? value('name') ?> "
           + ", <? value('desc') ?> "
           + ", <? value('wftype') ?> "
           + ", <? value('priority') ?> "
           + ", <? value('sequence') ?> "
           + ", <? value('owner') ?> "
           + ", <? value('assigned') ?> "
           + ", <? value('status') ?> "
           + ", <? value('parent') ?> "
           + ", <? value('start_set') ?> "
           + ", <? value('start_offset') ?> "
           + ", <? value('due_set') ?> "
           + ", <? value('due_offset') ?> "
           + ", <? value('notes') ?> "
           + ", <? value('comp_next_status') ?> "
           + ", <? value('def_next_status') ?> "
           + " ) RETURNING wfsrc_id, obj_uuid", params);  
        if (qry.first()) {
          _wfid = qry.value("wfsrc_id");
          _wfsrc_uuid = qry.value("obj_uuid");
        }  
        if (qry.lastError().type != QSqlError.NoError)
          throw new Error(qry.lastError().text);
      }
    if (_tabs.isTabEnabled(_tabs.indexOf(_printTab))) {
    
        var printparams = new Object();
        
        if(_module.text != "Sales") {
          printparams.billing = false;
          printparams.invoice = false;
        } else { 
          printparams.billing = _billing.checked; 
          printparams.invoice = _invoice.checked;
        }
        printparams.name = _report.text;
        printparams.isReport = true;
        printparams.reportPrinter  = _printer.text;
        printparams.fromemail = _fromemail.text;
        printparams.toemail = _toemail.text;
        printparams.sohead_id = -1;
        printparams.head_id = -1;
        printparams.head_type = 'SO';
        printparams.orderhead_type = "PO";
        printparams.orderhead_id = -1;
        // Clear the params
        var del = toolbox.executeQuery("DELETE FROM workflow.wfsrc_printparam "
            + "WHERE wfsrc_printparam_wfsrc_id = <? value('workflow_id') ?>", params); 
        if (del.lastError().type != QSqlError.NoError)
          throw new Error(del.lastError().text);
        
        if (_printCkBox.checked)
        {
          var i = 1;
          for (name in printparams)
          {
            var oneparam = new Object;
            oneparam.wfsrc_id = _wfid;
            oneparam.wfsrc_uuid = _wfsrc_uuid;
            oneparam.name = name;
            try { oneparam.value = XVariant.encode(printparams[name]); }
            catch (e) { oneparam.value = ''; }
            try { oneparam.type  = XVariant.typeName(printparams[name]); }
            catch (e) { oneparam.type = ''; }
            oneparam.order = i++;

            // Reinsert params
            var wfpq = toolbox.executeQuery("INSERT INTO workflow.wfsrc_printparam ("
                            + "  wfsrc_printparam_wfsrc_id, wfsrc_printparam_order,"
                            + "  wfsrc_printparam_name,     wfsrc_printparam_value,"
                            + "  wfsrc_printparam_type,     wfsrc_printparam_wfsrc_uuid"
                            + ") VALUES ("
                            + "  <? value('wfsrc_id') ?>, <? value('order') ?>,"
                            + "  <? value('name') ?>,     <? value('value') ?>,"
                            + "  <? value('type') ?>,     <? value('wfsrc_uuid') ?> )", 
                            oneparam);
            if (wfpq.lastError().type != QSqlError.NoError)
              throw new Error(wfpq.lastError().text);
          }
     
        }
    }
        
    toolbox.executeCommit(); 
    mywindow.close();
  } 
  catch(e) {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_billing.clicked.connect(handleInvoice);
_module['currentIndexChanged(int)'].connect(populate_type);
_module['currentIndexChanged(int)'].connect(populate_wftype);
_module['currentIndexChanged(int)'].connect(populate_status);
_module['currentIndexChanged(int)'].connect(handleSuccessorTabs);
_wftype['currentIndexChanged(int)'].connect(handlePrintTab);
_compAddSuccessor.clicked.connect(add_successor);
_compRemoveSuccessor.clicked.connect(remove_successor);
_defAddSuccessor.clicked.connect(add_successor);
_defRemoveSuccessor.clicked.connect(remove_successor);
_tabs['currentChanged(int)'].connect(populate_successors);
_tabs['currentChanged(int)'].connect(pop_avail_successors);
print('and we are ready to accept input');			