/**
 * This file is part of the xDruple for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

 /**
  * This is just a test menu that is useful for debugging. It is not installed
  * by default in production.
  */

function sEditxDrupleUserContact() {
  try {
    var params = new Object;

    params.mode = "edit";
    params.cntct_id = 1;
    params.xd_user_contact_id = 1;

    var event = toolbox.openWindow("xdrupleUserCntctCrmacct", 0, Qt.Modal, Qt.Window);
    var tmpdlg = toolbox.lastWindow();

    tmpdlg.set(params);

    event.exec();
  } catch (e) {
    print("initMenu::sEditxDrupleUserContact() exception @ " + e.lineNumber + ": " + e);
  }
}

function sNewxDrupleUserContact() {
  try {
    var params = new Object;

    params.mode = "new";
    params.cntct_id = 1;

    var event = toolbox.openWindow("xdrupleUserCntctCrmacct", 0, Qt.Modal, Qt.Window);
    var tmpdlg = toolbox.lastWindow();

    tmpdlg.set(params);

    event.exec();
  } catch (e) {
    print("initMenu::sNewxDrupleUserContact() exception @ " + e.lineNumber + ": " + e);
  }
}

function sNewxDrupleSite() {
  try {
    var params = new Object;

    params.mode = "new";

    var event = toolbox.openWindow("xdrupleSite", 0, Qt.Modal, Qt.Window);
    var tmpdlg = toolbox.lastWindow();

    tmpdlg.set(params);

    event.exec();
  } catch (e) {
    print("initMenu::sNewxDrupleSite() exception @ " + e.lineNumber + ": " + e);
  }
}

function sListxDrupleSites() {
  try {
    var event = toolbox.openWindow("xdrupleSiteList", 0, Qt.Modal, Qt.Window);

    event.exec();
  } catch (e) {
    print("initMenu::sListxDrupleSites() exception @ " + e.lineNumber + ": " + e);
  }
}

try {
  var menuCRM = mainwindow.findChild("menu.crm");
  menuCRM.addSeparator();

  var menuxDruple = new QMenu(qsTranslate("menuCRM", "xDruple Integration"), mainwindow);
  menuxDruple.objectName = "menu.crm.xdruple";
  menuCRM.addMenu(menuxDruple);

  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "Edit xDruple user Contact 1..."));
  tmpaction.objectName = "crm.xdrupleusercontactedit";
  tmpaction.triggered.connect(sEditxDrupleUserContact);

  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "New xDruple user Contact..."));
  tmpaction.objectName = "crm.xdrupleusercontactnew";
  tmpaction.triggered.connect(sNewxDrupleUserContact);

  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "New xDruple Sites..."));
  tmpaction.objectName = "crm.xdruplesitenew";
  tmpaction.triggered.connect(sNewxDrupleSite);

  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "List xDruple Sites..."));
  tmpaction.objectName = "crm.xdruplesitelist";
  tmpaction.triggered.connect(sListxDrupleSites);
} catch (e) {
  print("initMenu::xwd exception @ " + e.lineNumber + ": " + e);
}
