/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

var _recordPpvOnReceipt = mywindow.findChild("_recordPpvOnReceipt");
var layout = toolbox.widgetGetLayout(_recordPpvOnReceipt);

var _xwdUpdateActCost = toolbox.createWidget("QCheckBox", mywindow, "_xwdUpdateActCost");
_xwdUpdateActCost.text = qsTr("Update Item's Actual Cost on Receipt");
layout.addWidget(_xwdUpdateActCost, 7, 1);

var _xwdAddPackBatch = toolbox.createWidget("QCheckBox", mywindow, "_xwdAddPackBatch");
_xwdAddPackBatch.text = qsTr("Add eligible S/O's to Packing List Batch on Receipt");
layout.addWidget(_xwdAddPackBatch, 7, 2);

function sSave()
{
  metrics.set("xwdUpdateActCost", _xwdUpdateActCost.checked);
  metrics.set("xwdAddPackBatch", _xwdAddPackBatch.checked);
}

mywindow.saving.connect(sSave);

try {
if(metrics.value("xwdUpdateActCost") == "t")
  _xwdUpdateActCost.checked = true;
if(metrics.value("xwdAddPackBatch") == "t")
  _xwdAddPackBatch.checked = true;
} catch (e) {
  print(e.lineNumber + ": " + e);
}
