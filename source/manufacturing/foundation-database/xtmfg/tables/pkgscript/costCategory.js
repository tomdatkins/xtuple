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

var _asset = mywindow.findChild("_asset");
var layout = toolbox.widgetGetLayout(_asset);

var _laborAndOverheadClearingLit = toolbox.createWidget("QLabel", mywindow, "_laborAndOverheadClearingLit");
_laborAndOverheadClearingLit.text = qsTr("Labor and Overhead Costs:");
_laborAndOverheadClearingLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
layout.addWidget(_laborAndOverheadClearingLit, 13, 0);

var _laborAndOverhead = toolbox.createWidget("GLCluster", mywindow, "_laborAndOverhead");
layout.addWidget(_laborAndOverhead, 13, 1);
_laborAndOverhead.setType(0x02);  // Liability
 
function set(params)
{
  if("mode" in params)
  {
    if(params.mode == "view")
    {
      _laborAndOverhead.setReadOnly(true);
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if(metrics.boolean("InterfaceToGL") && metrics.boolean("Routings") && _laborAndOverhead.id() < 0)
  {
    QMessageBox.critical( mywindow, qsTr("Cannot Save Cost Category"),
                          qsTr("<p>You must select a Labor and Overhead Costs Account before saving."));
    _laborAndOverhead.setFocus();
    return;
  }
  mywindow.sSave();
}

function saved(costcatid)
{
  var params = new Object;
  params.costcat_id = costcatid;
  params.laboroverheadaccntid = _laborAndOverhead.id();

  var qry = toolbox.executeQuery("UPDATE costcat"
                                +"   SET costcat_laboroverhead_accnt_id=<? value('laboroverheadaccntid') ?>"
                                +" WHERE(costcat_id=<? value('costcat_id') ?>);", params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function populated(costcatid)
{
  var params = new Object;
  params.costcat_id=costcatid;

  var qry = toolbox.executeQuery("SELECT costcat_laboroverhead_accnt_id"
                                +"  FROM costcat"
                                +" WHERE(costcat_id=<? value('costcat_id') ?>);", params);
  if(qry.first())
  {
    _laborAndOverhead.setId(qry.value("costcat_laboroverhead_accnt_id"));
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return false;
  }
}

toolbox.coreDisconnect(mywindow.findChild("_buttonBox"), "accepted()", mywindow, "sSave()");
mywindow.findChild("_buttonBox").accepted.connect(sSave);
mywindow.populated.connect(populated);
mywindow.saved.connect(saved);

QWidget.setTabOrder(mywindow.findChild("_toLiabilityClearing"), _laborAndOverhead);
QWidget.setTabOrder(_laborAndOverhead, mywindow.findChild("_buttonBox"));

if(!metrics.boolean("Routings"))
{
  _laborAndOverheadClearingLit.visible = false;
  _laborAndOverhead.visible = false;
}

