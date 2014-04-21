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

var _transforms = mywindow.findChild("_transforms");
var layout = toolbox.widgetGetLayout(_transforms);

var _configurePDAddend = toolbox.loadUi("configurePDAddend", mywindow);
layout.addWidget(_configurePDAddend);

var _routings = _configurePDAddend.findChild("_routings");
var _machineOverhead = _configurePDAddend.findChild("_machineOverhead");
var _generalOverhead = _configurePDAddend.findChild("_generalOverhead");

var _bbom = toolbox.createWidget("QCheckBox", mywindow, "_bbom");
_bbom.text = qsTr("Enable Breeder Bills of Materials");
layout.addWidget(_bbom);

var _boosub = toolbox.createWidget("QCheckBox", mywindow, "_boosub");
_boosub.text = qsTr("Change BOM/Routing Active Revision to Substitute when activating a Pending Revision");
layout.addWidget(_boosub);

function sSave()
{
  var morgOverhead = "M";
  if(_machineOverhead.checked)
    morgOverhead = "M";
  else
    morgOverhead = "G";
  metrics.set("TrackMachineOverhead", morgOverhead);
  metrics.set("Routings", _routings.checked || !_routings.checkable)
  metrics.set("BBOM", _bbom.checked);
  metrics.set("BOOSubstitute", _boosub.checked);
}

mywindow.saving.connect(sSave);

try {
if(metrics.value("TrackMachineOverhead") == "M")
  _machineOverhead.checked = true;
else
  _generalOverhead.checked = true;
} catch (e) {
  print(e.lineNumber + ": " + e);
}

var qry = toolbox.executeQuery("SELECT item_id FROM item WHERE (item_type IN ('B','C','Y')) LIMIT 1;");
if(qry.first())
{
  _bbom.checked = true;
  _bbom.enabled = false;
}
else
{
  _bbom.checked = metrics.boolean("BBOM");
}
_boosub.checked = metrics.boolean("BOOSubstitute");

qry = toolbox.executeQuery("SELECT booitem_id FROM xtmfg.booitem"
                          +" UNION "
                          +"SELECT wooper_id FROM xtmfg.wooper, wo "
                          +" WHERE((wo_id=wooper_wo_id) "
                          +"   AND (wo_status <> 'C')) "
                          +"LIMIT 1;");
if(qry.first())
{
  _routings.checkable = false;
  _routings.title = qsTr("Work Center Routings");
}
else
{
  _routings.checked = metrics.boolean("Routings");
}

