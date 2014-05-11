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

debugger;

var _username = mywindow.findChild("_username");
var _enhancedAuth = mywindow.findChild("_enhancedAuth");
var layout = toolbox.widgetGetLayout(_enhancedAuth);

var _woTimeClockOnly = toolbox.createWidget("QCheckBox", mywindow, "_woTimeClockOnly");
_woTimeClockOnly.text = qsTr("May only use Shop Floor Workbench");
layout.insertWidget(4, _woTimeClockOnly);

function set(params)
{
try{
  if(metrics.boolean("Routings"))
  {
    if("username" in params)
    {
      var tmpparams = new Object;
      tmpparams.username = params.username;
      var qry = toolbox.executeQuery("SELECT (usrpref_value='woTimeClock') AS woTimeClock FROM usrpref WHERE usrpref_name='window' and usrpref_username=<? value('username') ?>;", tmpparams);
      if(qry.first())
        _woTimeClockOnly.checked = qry.value("woTimeClock");
      else
        _woTimeClockOnly.checked = false
    }

    _woTimeClockOnly.enabled = (params.mode == "new" || params.mode == "edit");
  }
} catch (e) {
  print(e.lineNumber + ": " + e);
}
  return mainwindow.NoError;
}

function sSave()
{
  if(metrics.boolean("Routings"))
  {
    var params = new Object;
    params.username = _username.text.toLowerCase();
    if(_woTimeClockOnly.checked)
      params.window = "woTimeClock";
    else
      params.window = "";
    toolbox.executeQuery("SELECT setUserPreference(<? value('username') ?>, 'window', <? value('window') ?>);", params);
  }
  mywindow.sSave();
}

toolbox.coreDisconnect(mywindow.findChild("_save"), "clicked()", mywindow, "sSave()");
mywindow.findChild("_save").clicked.connect(sSave);

if(!metrics.boolean("Routings"))
{
  _woTimeClockOnly.checked = false;
  _woTimeClockOnly.visible = false;
}

