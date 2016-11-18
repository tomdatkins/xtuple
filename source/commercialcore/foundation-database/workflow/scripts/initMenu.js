/* This file is part of the Workflow Package for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

var DEBUG = false;

function sWorkflow()
{
  try {
    toolbox.newDisplay("WorkflowActivities", 0, Qt.NonModal, Qt.Window);
  } catch (e) {
    print("initMenu::sWorkflow() exception @ " + e.lineNumber + ": " + e);
  }
}
  var menu = mainwindow.findChild("menu.sys");

  var tmpaction = menu.addAction(qsTranslate("menu", "Workflow Activities..."));
  tmpaction.enabled = privileges.value("MaintainWorkflowsSelf");
  tmpaction.setData("MaintainWorkflowsSelf");
  tmpaction.objectName = "sys.workflow";
  tmpaction.triggered.connect(sWorkflow);
