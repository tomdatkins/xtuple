/* This file is part of the xtcore Package for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

var DEBUG = false;

include("xtCore");

xtCore.initMenu = new Object;

function sWorkflow()
{
  try {
    toolbox.newDisplay("WorkflowActivities", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sWorkflow() exception @ " + e.lineNumber + ": " + e);
  }
}
  var menuIM = mainwindow.findChild("menu.im");
  var tmpaction = menuIM.addAction(qsTranslate("menuIM", "Workflow Activities..."));
  tmpaction.triggered.connect(sWorkflow);
  tmpaction.setData("MaintainWorkflow");
  tmpaction.enabled = true;