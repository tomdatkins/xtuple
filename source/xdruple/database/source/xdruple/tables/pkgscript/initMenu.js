
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
    print("initMenu::sEvent() exception @ " + e.lineNumber + ": " + e);
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
    print("initMenu::sEvent() exception @ " + e.lineNumber + ": " + e);
  }
}

try {
  var menuCRM = mainwindow.findChild("menu.crm");
  menuCRM.addSeparator();

  var menuxDruple = new QMenu(qsTranslate("menuCRM", "xDruple User Association"), mainwindow);
  menuxDruple.objectName = "menu.crm.xdruple";
  menuCRM.addMenu(menuxDruple);

  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "Edit xDruple user Contact 1..."));
  tmpaction.objectName = "crm.xdrupleusercontactedit";
  tmpaction.triggered.connect(sEditxDrupleUserContact);


  var tmpaction = menuxDruple.addAction(qsTranslate("menuxDruple", "New xDruple user Contact..."));
  tmpaction.objectName = "crm.xdrupleusercontactedit";
  tmpaction.triggered.connect(sNewxDrupleUserContact);

} catch (e) {
  print("initMenu::xwd exception @ " + e.lineNumber + ": " + e);
}
