/*
  This file is part of the xtmfg Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

var _issueMethodLit = mywindow.findChild("_issueMethodLit");

var layout = toolbox.widgetGetLayout(_issueMethodLit);

var _usedAtLit = toolbox.createWidget("QLabel", mywindow, "_usedAtLit");
_usedAtLit.text = qsTr("Used At:");
_usedAtLit.alignment = Qt.AlignRight + Qt.AlignVCenter;
layout.addWidget( _usedAtLit, 10, 0);

var _woMaterialItemAddend = toolbox.loadUi("woMaterialItemAddend", mywindow);
layout.addWidget( _woMaterialItemAddend, 10, 2);

var _scheduleAtWooper = toolbox.createWidget("QCheckBox", mywindow, "_scheduleAtWooper");
_scheduleAtWooper.text = qsTr("Schedule at W/O Operation");
_scheduleAtWooper.alignment = Qt.AlignLeft + Qt.AlignVCenter;
layout.addWidget( _scheduleAtWooper, 11, 2);

var _wo = mywindow.findChild("_wo");
var _booitemList = mywindow.findChild("_booitemList");
var _usedAt = mywindow.findChild("_usedAt");
var _scheduleAtWooper = mywindow.findChild("_scheduleAtWooper");

_booitemList.clicked.connect(sBooitemList);
mywindow.findChild("_save").clicked.connect(sSave);

var _womatlid = -1;
var _wooperseqid = -1;
var _wooperid = -1;

var _mode = "new";

toolbox.coreDisconnect(mywindow.findChild("_save"), "clicked()", mywindow, "sSave()");



function set(params)
{
  try {

    if("womatl_id" in params)
    {
      _womatlid = params.womatl_id;
    }

    if("mode" in params)
    {
      if(params.mode == "view")
      {
        _booitemList.enabled = false;
        _scheduleAtWooper.enabled = false;
        _mode = "view";
        populate();
      }
      if(params.mode == "new")
      {
        _mode = "new";
      }
      if(params.mode == "edit")
      {
        _mode = "edit";
        populate();
      }
    }

  } catch(e) {
    QMessageBox.critical(mywindow, qsTr("Database Error"), e.lineNumber + ": " + e);
    print(e.lineNumber + ": " + e);
  }

  return mainwindow.NoError;
}


function populate()
{
   var qryWomatl = toolbox.executeQuery("SELECT womatl_wo_id,womatl_wooper_id,womatl_schedatwooper FROM womatl WHERE womatl_id = " + _womatlid);
   if(qryWomatl.first())   
   {
      _wooperid = qryWomatl.value("womatl_wooper_id");
      _scheduleAtWooper.checked = qryWomatl.value("womatl_schedatwooper")
      var qryWooper = toolbox.executeQuery("SELECT (TEXT(wooper_seqnumber) || '-' || wooper_descrip1 || ' ' || wooper_descrip2) AS description, wooper_seqnumber "
                                    +"  FROM xtmfg.wooper"
                                    +" WHERE (wooper_id = " + _wooperid + ")");
      if(qryWooper.first())
      {
        _wooperseqid = qryWooper.value("wooper_seqnumber");    
        _usedAt.text = qryWooper.value("description");
      }
   }
}

function sBooitemList()
{

  try {

    var params = new Object;
    params.wo_id = _wo.id();
    params.wooper_seq_id = _wooperseqid;
  
    var wnd = toolbox.openWindow("wooItemList", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = wnd.exec();
    if(result != 0) // QDialog::Rejected
      _wooperseqid = result;

    if(_wooperseqid != -1)
    {
     
      var qry = toolbox.executeQuery("SELECT (TEXT(wooper_seqnumber) || '-' || wooper_descrip1 || ' ' || wooper_descrip2) AS description "
                                    +"  FROM xtmfg.wooper"
                                    +" WHERE (wooper_wo_id = " + _wo.id() + " and wooper_seqnumber=" + _wooperseqid + ")");
      if(qry.first())
      {
        _usedAt.text = qry.value("description");
        _scheduleAtWooper.enabled = true;
      }
      else
      {
        _scheduleAtWooper.enabled = false;
        _scheduleAtWooper.checked = false;
      }
    }
    else
    {
      _usedAt.clear();
      _scheduleAtWooper.enabled = false;
      _scheduleAtWooper.checked = false;
    }


  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sSave()
{

   mywindow.sSave();

   if (_mode == "new")
   {
      var qryWomatlId = toolbox.executeQuery("SELECT CURRVAL('womatl_womatl_id_seq') as womatl_id");
      qryWomatlId.first();
      _womatlid = qryWomatlId.value("womatl_id");
   }

   var _wooperid = -1;

   var qry = toolbox.executeQuery("SELECT wooper_id FROM xtmfg.wooper WHERE wooper_wo_id = " + _wo.id() + " and wooper_seqnumber = " + _wooperseqid);
   if(qry.first())
       _wooperid = qry.value("wooper_id")

   toolbox.executeQuery("UPDATE womatl SET womatl_wooper_id=" + _wooperid + ",womatl_schedatwooper=" + _scheduleAtWooper.checked + " where womatl_id=" + _womatlid);

}
