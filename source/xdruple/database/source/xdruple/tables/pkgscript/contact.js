/* This file is part of the xDruple for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

//debugger;

include("xdruple");
xDruple.XdUserContactAccountList = {};

var _contact = mywindow.findChild("_contact");
var tablist  = mywindow.findChild("_tabWidget");
var _cntctId = false;

// load a predefined screen by name from the database
var page = toolbox.loadUi("xdrupleUserCntctCrmacctList", mywindow);

//insert the new tab
toolbox.tabInsertTab(tablist, 7, page, "xDruple Users");

var _xdUserContactAccountList            = mywindow.findChild("_xdUserContactAccountList");
var _newXdUserContactAccount             = mywindow.findChild("_newXdUserContactAccount");
var _editXdUserContactAccount            = mywindow.findChild("_editXdUserContactAccount");
var _deleteXdUserContactAccount          = mywindow.findChild("_deleteXdUserContactAccount");

_xdUserContactAccountList.addColumn(qsTr("xDruple Site"),     100, Qt.AlignLeft,   true,  "xd_site_name"  );
_xdUserContactAccountList.addColumn(qsTr("xDruple Site URL"), 100, Qt.AlignLeft,   true,  "xd_site_url"  );
_xdUserContactAccountList.addColumn(qsTr("Drupal User UUID"), 100, Qt.AlignLeft,   true,  "xd_user_contact_drupal_user_uuid"  );
_xdUserContactAccountList.addColumn(qsTr("CRM Account"),      100, Qt.AlignLeft,   true,  "crmacct_number"  );
_xdUserContactAccountList.addColumn(qsTr("Is Customer"),      50,  Qt.AlignLeft,   true,  "is_customer"  );
_xdUserContactAccountList.addColumn(qsTr("Is Prospect"),      50,  Qt.AlignLeft,   true,  "is_prospect"  );
_xdUserContactAccountList.addColumn(qsTr("Is Vendor"),        50,  Qt.AlignLeft,   false, "is_vendor"  );
_xdUserContactAccountList.addColumn(qsTr("Is Employee"),      50,  Qt.AlignLeft,   false, "is_employee"  );
_xdUserContactAccountList.addColumn(qsTr("Is Sales Rep"),     50,  Qt.AlignLeft,   false, "is_salesrep"  );
_xdUserContactAccountList.addColumn(qsTr("Is Partner"),       50,  Qt.AlignLeft,   false, "is_partner"  );
_xdUserContactAccountList.addColumn(qsTr("Is Competitor"),    50,  Qt.AlignLeft,   false, "is_competitor"  );
_xdUserContactAccountList.addColumn(qsTr("Is PG User"),       50,  Qt.AlignLeft,   true,  "is_pguser"  );
_xdUserContactAccountList.addColumn(qsTr("PG Username"),      100, Qt.AlignLeft,   true,  "crmacct_usr_username"  );

xDruple.XdUserContactAccountList.populate = function () {
  try {
    _cntctId = _contact.id();
    var params = {
      "ViewMode": true,
      "cntct_id": _cntctId
    };

    var qry = toolbox.executeDbQuery("xdUserContactAccounts", "table", params);
    _xdUserContactAccountList.populate(qry);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  } catch (e) {
    print("xDruple.XdUserContactAccountList.populate() exception: " + e);
  }
};

xDruple.XdUserContactAccountList.sNew = function () {
  try {
    var params = {
      "mode": "new",
      "cntct_id": _contact.id()
    };

    var newdlg = toolbox.openWindow("xdrupleUserCntctCrmacct", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    // TODO - this is not working
    if (newdlg.exec() > 0) {
      xDruple.XdUserContactAccountList.populate();
    }
  } catch (e) {
    print("xDruple.XdUserContactAccountList.sNew() exception: " + e);
  }
};

xDruple.XdUserContactAccountList.sEdit = function () {
  try {
    var params = {
      "mode": "edit",
      "cntct_id": _contact.id(),
      "xd_user_contact_id": _xdUserContactAccountList.id()
    };

    var newdlg = toolbox.openWindow("xdrupleUserCntctCrmacct", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    // TODO - this is not working
    if (newdlg.exec() > 0) {
      xDruple.XdUserContactAccountList.populate();
    }
  } catch (e) {
    print("xDruple.XdUserContactAccountList.sEdit() exception: " + e);
  }
};

xDruple.XdUserContactAccountList.sDelete = function () {
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete xDruple Site User Association?"),
                             qsTr("<p>Are you sure you want to delete this xDruple Site User Association?"),
                             QMessageBox.Yes, QMessageBox.No) == QMessageBox.No)
      return;

    var params = {
      "DeleteMode": true,
      "xd_user_contact_id": _xdUserContactAccountList.id()
    };
    var qry = toolbox.executeDbQuery("xdUserContactAccounts", "table", params);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }

    xDruple.XdUserContactAccountList.populate();
  } catch (e) {
    print("xDruple.XdUserContactAccountList.sDelete() exception: " + e);
  }
};

_contact['newId(int)'].connect(xDruple.XdUserContactAccountList.populate);
_newXdUserContactAccount.clicked.connect(xDruple.XdUserContactAccountList.sNew);
_editXdUserContactAccount.clicked.connect(xDruple.XdUserContactAccountList.sEdit);
_deleteXdUserContactAccount.clicked.connect(xDruple.XdUserContactAccountList.sDelete);
