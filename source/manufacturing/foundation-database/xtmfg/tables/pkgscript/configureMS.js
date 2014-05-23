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

var _calendar = mywindow.findChild("_calendar");
var layout = toolbox.widgetGetLayout(_calendar);
var _bufferMgt = toolbox.createWidget("QCheckBox", mywindow, "_bufferMgt");
_bufferMgt.text = qsTr("Enable Constraint Management");
layout.addWidget( _bufferMgt, 2, 0);

var _siteCal = toolbox.createWidget("QCheckBox", mywindow, "_siteCal");
_siteCal.text = qsTr("Enforce Site Calendar for Planning and Orders");
layout.addWidget( _siteCal, 3, 0);

function sSave()
{
  metrics.set("BufferMgt", _bufferMgt.checked);
  metrics.set("UseSiteCalendar", _siteCal.checked);
}

toolbox.coreDisconnect(mywindow.findChild("_save"), "clicked()", mywindow, "sSave()");
mywindow.saving.connect(sSave);

_bufferMgt.checked        = metrics.boolean("BufferMgt");
_siteCal.checked          = metrics.boolean("UseSiteCalendar");
