debugger;

include("sharedwf");

var _module         = mywindow.findChild("_module");
var _type           = mywindow.findChild("_type");
var _name           = mywindow.findChild("_name");
var _desc           = mywindow.findChild("_desc");
var _wftype         = mywindow.findChild("_wftype");
var _priority       = mywindow.findChild("_priority");
var _sequence       = mywindow.findChild("_sequence");
var _owner          = mywindow.findChild("_owner");
var _assigned       = mywindow.findChild("_assigned");
var _status         = mywindow.findChild("_status");
var _calcStart      = mywindow.findChild("_calcStartOffset");
var _startOffset    = mywindow.findChild("_startOffsetDays");
var _calcEnd        = mywindow.findChild("_calcEndOffset");
var _endOffset      = mywindow.findChild("_endOffsetDays");
var _notes          = mywindow.findChild("_notes");
var _printerLit     = mywindow.findChild("_printerLit");
var _printer        = mywindow.findChild("_printer");
var _reportLit      = mywindow.findChild("_reportLit");
var _report         = mywindow.findChild("_report");
var _compNextStatusLit = mywindow.findChild("_compNextStatusLit");
var _defNextStatusLit  = mywindow.findChild("_defNextStatusLit");
var _compNextStatus = mywindow.findChild("_compNextStatus");
var _defNextStatus  = mywindow.findChild("_defNextStatus");
var _cancel         = mywindow.findChild("_cancel");
var _save           = mywindow.findChild("_save");
var _tabs           = mywindow.findChild("_tabs");
var _compTab        = mywindow.findChild("_compTab");
var _defTab         = mywindow.findChild("_defTab");
var _compAvailableSuccessors = mywindow.findChild("_compAvailableSuccessors");
var _compSuccessors          = mywindow.findChild("_compSuccessors");
var _defAvailableSuccessors  = mywindow.findChild("_defAvailableSuccessors");
var _defSuccessors           = mywindow.findChild("_defSuccessors");
var _compAddSuccessor        = mywindow.findChild("_compAddSuccessor");
var _compRemoveSuccessor     = mywindow.findChild("_compRemoveSuccessor");
var _defAddSuccessor         = mywindow.findChild("_defAddSuccessor");
var _defRemoveSuccessor      = mywindow.findChild("_defRemoveSuccessor");
var _wfid                    = -1;

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
   _printerLit.visible = false;
   _printer.visible = false;
   _reportLit.visible = false;
   _report.visible = false;
   
   
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
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
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
      
   } catch(e) {
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
   } catch(e) {
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
      _wftype.populate(wftypeqry);
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
  }
}

function populate_printers()
{
  if (_wftype.text == 'PRINT')
  { 
    _printerLit.visible = true;
    _printer.visible = true;
    try
    {
      var printqry = toolbox.executeQuery("SELECT printer_id, printer_name FROM xt.printer");
      _printer.populate(printqry);
      if(printqry.lastError().type != QSqlError.NoError)
        throw printqry.lastError().text;
    } catch(e) {
      QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred: " + e);
    }
  } else if (_printer.visible || _printerLit.visible) {
    _printer.visible = false;
    _printerLit.visible = false;
  }
}

function populate_reports()
{
  if (_wftype.text == 'PRINT') 
  {
    _reportLit.visible = true;
    _report.visible = true;
    try
    {
      var reportqry = toolbox.executeQuery("select report_id, report_name from report");
      _report.populate(reportqry);
      if(reportqry.lastError().type != QSqlError.NoError)
        throw reportqry.lastError().text;
    } catch(e) {
      QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred: " + e);
    }
  } else if (_report.visible || _reportLit.visible) {
    _reportLit.visible = false;
    _report.visible = false;
  }
}

function populate_successors()
{
    try 
    {
      var params = new Object();
      if(_tabs.currentIndex == _tabs.indexOf(_compTab)) 
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
      if (qryStA.first()) 
      {
         if (qryStA.value("list") != '') 
         {   
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
   } catch(e) {
      QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function pop_avail_successors()
{
   try
   {
      var params = new Object();

      if(_tabs.currentIndex == _tabs.indexOf(_compTab)) 
      {
         params.compsuc = "wfsrc_completed_successors"  
      }

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
               QMessageBox.critical(mywindow, "error", "Populate Available Successors Error: " + avlSuc.lastError().text);
      if(params.compsuc == "wfsrc_completed_successors")
         _compAvailableSuccessors.populate(avlSuc);
      else
         _defAvailableSuccessors.populate(avlSuc);             
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function add_successor()
{
   // TODO: prevent adding successor to itself
   try
   {
      var params = new Object();
      
      if(_tabs.currentIndex == _tabs.indexOf(_compTab)) {
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
           QMessageBox.critical(mywindow, "error", "Add Successor Error: " + objqry.lastError().text);
       else
           QMessageBox.critical(mywindow, "error", "Add Successor Error: No Result Found");

      var updqry = toolbox.executeQuery("update xt.wfsrc SET <? literal('field') ?> = "
              + " CASE WHEN <? literal('field') ?> = '' THEN <? value('uuid') ?> "
              + "      WHEN <? literal('field') ?> IS NULL THEN <? value ('uuid') ?> "
              + "      ELSE <? literal('field') ?> || ',' || <? value('uuid') ?> "
              + " END WHERE wfsrc_id = <? value('wfid') ?> ", params);
              
      populate_successors();
      pop_avail_successors();
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function remove_successor()
{
   try
   {
      var params = new Object();
      if(_tabs.currentIndex == 0) {
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
           QMessageBox.critical(mywindow, "error", "Remove Successor Error: " + objqry.lastError().text);
       else
           QMessageBox.critical(mywindow, "error", "Remove Successor Error: No Result Found");
       
       var listqry = toolbox.executeQuery("SELECT <? literal('field') ?> AS list FROM xt.wfsrc "
                            + " WHERE wfsrc_id = <? value('wfid') ?> ", params);
      if(listqry.first()) {

         var list = [];
         list = listqry.value("list").split(',')
         var idx = list.indexOf(params.uuid);
         list.splice(idx,1);
         params.list = list.join(",");
         var rmvqry = toolbox.executeQuery("UPDATE xt.wfsrc "
                  + " SET <? literal('field') ?> = <? value('list') ?> "
                  + " WHERE wfsrc_id = <? value('wfid') ?> ", params);
                  
         if(rmvqry.lastError().type != QSqlError.NoError)
              QMessageBox.critical(mywindow, "error", "Add Successors Error: " + rmvqry.lastError().text);
      
      }
       else if(listqry.lastError().type != QSqlError.NoError)
           QMessageBox.critical(mywindow, "error", "Add Successors Error: " + list.lastError().text);
       else
           QMessageBox.critical(mywindow, "error", "Add Successor Error: No Result Found");
      
      populate_successors();
      pop_avail_successors();

   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function set(input)
{   
   populate_status();
   populate_next_status();

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
          _compNextStatus.text  = qry.value("comp_next_status");
          _defNextStatus.text   = qry.value("def_next_status");
          _report.text          = qry.value("report_name");
          _printer.text         = qry.value("printer_name");
          _notes.setText(qry.value("wfsrc_notes"));
          _calcStart.setChecked(qry.value("wfsrc_start_set"));
          _calcEnd.setChecked(qry.value("wfsrc_due_set"));
      }
      else if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
        }
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
      // completed next status
      var tempcompstat = next_status.options.filter(function (elem) { return elem.text===_compNextStatus.text; });
      if(tempcompstat.length)
         params.comp_next_status= tempcompstat[0].code; 
      else {
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
      params.report       = _report.id();
      params.printer      = _printer.id();

      if (_wfid > 0) 
      {
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
           + ", wfsrc_printer_id     = <? value('printer') ?> "
           + ", wfsrc_report_id      = <? value('report') ?> "
           + ", wfsrc_completed_parent_status    = <? value('comp_next_status') ?> "   
           + ", wfsrc_deferred_parent_status    = <? value('def_next_status') ?> "                
           + " WHERE wfsrc_id = <? value('workflow_id') ?>", params);  
        if (qry.lastError().type != QSqlError.NoError) {
          throw qry.lastError().text;
        }
      } else {
        var qry = toolbox.executeQuery("INSERT INTO <? literal('module') ?> ("
           + " wfsrc_name, wfsrc_description, wfsrc_type, "
           + " wfsrc_priority_id, wfsrc_sequence, wfsrc_owner_username, "
           + " wfsrc_assigned_username, wfsrc_status, wfsrc_parent_id, wfsrc_start_set, "
           + " wfsrc_start_offset, wfsrc_due_set, wfsrc_due_offset, wfsrc_notes, "
           + " wfsrc_printer_id, wfsrc_report_id, "
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
           + ", <? value('printer') ?> "
           + ", <? value('report') ?> "
           + ", <? value('comp_next_status') ?> "
           + ", <? value('def_next_status') ?> "
           + " )", params);  
        if (qry.lastError().type != QSqlError.NoError) {
          throw qry.lastError().text;
        }
      }  
      mywindow.close();
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_module['currentIndexChanged(int)'].connect(populate_type);
_module['currentIndexChanged(int)'].connect(populate_wftype);
_wftype['currentIndexChanged(int)'].connect(populate_printers);
_wftype['currentIndexChanged(int)'].connect(populate_reports);
_compAddSuccessor.clicked.connect(add_successor);
_compRemoveSuccessor.clicked.connect(remove_successor);
_defAddSuccessor.clicked.connect(add_successor);
_defRemoveSuccessor.clicked.connect(remove_successor);
_tabs['currentChanged(int)'].connect(populate_successors);
_tabs['currentChanged(int)'].connect(pop_avail_successors);