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

var _materialVariances = mywindow.findChild("_materialVariances");
var layout = toolbox.widgetGetLayout(_materialVariances);

var _laborVariances = toolbox.createWidget("QCheckBox", mywindow, "_laborVariances");
_laborVariances.text = qsTr("Post Labor Variances");
layout.insertWidget( 1, _laborVariances);

var _autoExplode = mywindow.findChild("_autoExplode");
layout = toolbox.widgetGetLayout(_autoExplode);

var _postopFillQty = toolbox.createWidget("QCheckBox", mywindow, "_postopFillQty");
_postopFillQty.text = qsTr("Auto Fill Post Operation Qty. to Balance");
layout.addWidget( _postopFillQty, 1, 0);

var _defaultGroup = mywindow.findChild("_defaultGroup");
layout = toolbox.widgetGetLayout(_defaultGroup);

var _configureWOAddend = toolbox.loadUi("configureWOAddend", mywindow);
layout.addWidget( _configureWOAddend, 4, 0);

var _production = _configureWOAddend.findChild("_production");
var _operations = _configureWOAddend.findChild("_operations");

function sSave()
{
  if(_production.checked)
    metrics.set("WOTCPostStyle", "Production");
  else if(_operations.checked)
    metrics.set("WOTCPostStyle", "Operations");

  metrics.set("AutoFillPostOperationQty", _postopFillQty.checked);
  metrics.set("PostLaborVariances", _laborVariances.checked);
}

mywindow.saving.connect(sSave);

if(!metrics.boolean("Routings"))
{
  _laborVariances.checked = false;
  _laborVariances.visible = false;
  _wotcPostStyle.visible = false;
  _postopFillQty.visible = false;
}
else
  _laborVariances.checked = metrics.boolean("PostLaborVariances");

if(metrics.value("WOTCPostStyle") == "Production")
  _production.checked = true;
else
  _operations.checked = true;

_postopFillQty.checked = metrics.boolean("AutoFillPostOperationQty");
