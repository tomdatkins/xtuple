include("sharedwf");

var _module         = mywindow.findChild("_module");
var _type           = mywindow.findChild("_type");
var _name           = mywindow.findChild("_name");
var _parentOrder    = mywindow.findChild("_parentOrder");
var _desc           = mywindow.findChild("_desc");
var _wftype         = mywindow.findChild("_wftype");
var _priority       = mywindow.findChild("_priority");
var _sequence       = mywindow.findChild("_sequence");
var _owner          = mywindow.findChild("_owner");
var _assigned       = mywindow.findChild("_assigned");
var _status         = mywindow.findChild("_status");
var _startDate      = mywindow.findChild("_startDate");
var _dueDate        = mywindow.findChild("_dueDate");
var _assDate        = mywindow.findChild("_assDate");
var _compDate       = mywindow.findChild("_compDate");
var _notes          = mywindow.findChild("_notes");
var _compNextStatusLit = mywindow.findChild("_compNextStatusLit");
var _defNextStatusLit  = mywindow.findChild("_defNextStatusLit");
var _compNextStatus = mywindow.findChild("_compNextStatus");
var _defNextStatus  = mywindow.findChild("_defNextStatus");
var _cancel         = mywindow.findChild("_cancel");
var _save           = mywindow.findChild("_save");
var _tabs           = mywindow.findChild("_tabs");
var _compTab        = mywindow.findChild("_compTab");
var _defTab         = mywindow.findChild("_defTab");
var _compSuccessors          = mywindow.findChild("_compSuccessors");
var _defSuccessors           = mywindow.findChild("_defSuccessors");

var _wfid = -1;
var _mode;
var _oldStatus = -1;
var _oldAssigned;

   _compSuccessors.addColumn(qsTr("Name"),        100,  Qt.AlignLeft,   true,  "name"   );
   _compSuccessors.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,   true,  "desc"   );
   _compSuccessors.addColumn(qsTr("Type"),        100,  Qt.AlignLeft,   true,  "type"   );
   
   _defSuccessors.addColumn(qsTr("Name"),        100,   Qt.AlignLeft,   true,  "name"   );
   _defSuccessors.addColumn(qsTr("Description"),  -1,   Qt.AlignLeft,   true,  "desc"   );
   _defSuccessors.addColumn(qsTr("Type"),        100,   Qt.AlignLeft,   true,  "type"   );   
   
// hide next status boxes. Not sure these are used yet....
   _compNextStatusLit.visible = false;
   _defNextStatusLit.visible = false;
   _compNextStatus.visible = false;
   _defNextStatus.visible = false;
   
// set module options
   _module.append(-1, "Select a module" );
   _module.append( 1, "Sales"       );
   _module.append( 2, "Purchase"    );
   _module.append( 3, "Project"     );  
   if(isdist)
     _module.append( 4, "Inventory"   );
   if(ismfg)
     _module.append( 5, "Manufacture" );
   if(hasqual)
     _module.append( 6, "Quality" );

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
   try {
      var typeqry = wftype[_module.text].typeqry;   
      _type.populate(typeqry);
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
   }
}

function populate_wftype()
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

function populate_successors()
{
    try 
    {
      var params = new Object();
      if(_tabs.currentIndex == _tabs.indexOf(_compTab)) 
      {
         params.compsuc = "wf_completed_successors"  
      }
      params.wfid = _wfid;
      
      _compSuccessors.clear();
      _defSuccessors.clear();
      
      var qryStA = toolbox.executeQuery("SELECT <? if exists('compsuc') ?> "
               + " wf_completed_successors <? else ?> "
               + " wf_deferred_successors <? endif ?> AS list "
               + "FROM xt.wf WHERE wf_id = <? value('wfid') ?>", params);
      var i = 0;
      if (qryStA.first()) 
      {
         if (qryStA.value("list") != '') 
         {   
            for(var listAry = qryStA.value("list").split(","); i < listAry.length; i++) 
            {
               if(i==0)
                  params.uuid_list =  "'" + listAry[i] + "'";
               else
                  params.uuid_list += ",'" + listAry[i] + "'";
            }
            var successorqry = "SELECT wf_id AS id, wf_name AS name, wf_description AS desc, "
                              + "wf_type AS type, obj_uuid FROM xt.wf "
                              + "WHERE obj_uuid IN (<? literal('uuid_list') ?>)"
            var finalqry = toolbox.executeQuery(successorqry, params)
            if(finalqry.lastError().type != QSqlError.NoError)
              QMessageBox.critical(mywindow, "error", "Populate Successors Error: " + finalqry.lastError().text);
             
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

function set(input)
{   
   populate_status();
   populate_next_status();

   var params = {};
   if(hasqual)
      params.hasqual = true;
   if("mode" in input)
   {
     params.mode = input.mode;
     _mode = input.mode;
   }
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
      }
      if("order" in input)
         _parentOrder.text = input.order;
            
      var qry = toolbox.executeDbQuery("WorkflowActivities", "detail", params);
      if (qry.first()) {
          
          _name.text           = qry.value("name");
          _desc.text           = qry.value("description");
          _wftype.text         = qry.value("wftype");
          _priority.text       = qry.value("priority");
          _sequence.value      = qry.value("wfsequence");
          _owner.text          = qry.value("owner");
          _assigned.text       = qry.value("assigned_to");
          _oldAssigneed        = _assigned.text;
          _status.text         = qry.value("status");
          _oldStatus           = _status.code;
          _compNextStatus.text = qry.value("comp_next_status");
          _defNextStatus.text  = qry.value("def_next_status");
          
          _notes.setText(qry.value("wf_notes"));
          _startDate.setDate(qry.value("wf_start_date"));
          _dueDate.setDate(qry.value("wf_due_date"));
          _assDate.setDate(qry.value("wf_assigned_date"));
          _compDate.setDate(qry.value("wf_completed_date"));
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
      params.module = wftype[_module.text].wfmodule;
      
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
      params.start_date   = _startDate.date;
      params.due_date     = _dueDate.date;
      params.ass_date     = _assDate.date;
      params.comp_date    = _compDate.date;
      params.notes        = _notes.plainText;

      if (_wfid > 0) 
      {
         toolbox.executeQuery("UPDATE xt.wf SET "
           + "  wf_name              = <? value('name') ?> "
           + ", wf_description       = <? value('desc') ?> "
           + ", wf_type              = <? value('wftype') ?> "
           + ", wf_priority_id       = <? value('priority') ?> "
           + ", wf_sequence          = <? value('sequence') ?> "
           + ", wf_owner_username    = <? value('owner') ?> "
           + ", wf_assigned_username = <? value('assigned') ?> "
           + ", wf_status            = <? value('status') ?> "
           + ", wf_start_date        = <? value('start_date') ?> "
           + ", wf_due_date          = <? value('due_date') ?> "
           + ", wf_assigned_date     = <? value('ass_date') ?> "
           + ", wf_completed_date    = <? value('comp_date') ?> "
           + ", wf_notes             = <? value('notes') ?> "   
           + ", wf_completed_parent_status    = <? value('comp_next_status') ?> "   
           + ", wf_deferred_parent_status    = <? value('def_next_status') ?> "                
           + " WHERE wf_id = <? value('workflow_id') ?>", params);  
      } else {
        toolbox.executeQuery("INSERT INTO <? literal('module') ?> ("
           + " wf_name, wf_description, wf_type, "
           + " wf_priority_id, wf_sequence, wf_owner_username, "
           + " wf_assigned_username, wf_status, wf_start_date, "
           + " wf_due_date, wf_assigned_date, wf_completed_date, wf_notes, "
           + " wf_completed_parent_status, wf_deferred_parent_status) "
           + " VALUES (<? value('name') ?> "
           + ", <? value('desc') ?> "
           + ", <? value('wftype') ?> "
           + ", <? value('priority') ?> "
           + ", <? value('sequence') ?> "
           + ", <? value('owner') ?> "
           + ", <? value('assigned') ?> "
           + ", <? value('status') ?> "
           + ", <? value('start_date') ?> "
           + ", <? value('due_date') ?> "
           + ", <? value('ass_date') ?> "
           + ", <? value('comp_date') ?> "
           + ", <? value('notes') ?> "
           + ", <? value('comp_next_status') ?> "
           + ", <? value('def_next_status') ?> "
           + " )", params);  
      }  
         
      mywindow.close();
   } catch(e) {
       QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " 
       + e.lineNumber + ": " + e);
   }
}

function statusUpdate()
{
  if (_status.code == "C" && (_oldStatus !== _status.code) && !_compDate.isValid())
    _compDate.setDate(new Date);
}

function assignedUpdate()
{
  if (_oldAssigned != _assigned.text && !_assDate.isValid())
    _assDate.setDate(new Date);
}

_cancel.clicked.connect(mywindow, "close");
_save.clicked.connect(save);
_module["currentIndexChanged(int)"].connect(populate_type);
_module["currentIndexChanged(int)"].connect(populate_wftype);
_tabs["currentChanged(int)"].connect(populate_successors);
_status["newID(int)"].connect(statusUpdate);
_assigned["newID(int)"].connect(assignedUpdate);