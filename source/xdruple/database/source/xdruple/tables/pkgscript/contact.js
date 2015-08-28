/**
 * This file is part of the xDruple for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

//debugger;

include("xdruple");
xDruple.XdUserAssociationList = {};

var _cntctId    = false;
var _contact    = mywindow.findChild("_contact");
var tablist     = mywindow.findChild("_tabWidget");
var _xdrupletab = toolbox.loadUi("xdrupleUserAssociationList", mywindow);

// Insert the new tab.
toolbox.tabInsertTab(tablist, 7, _xdrupletab, "xDruple Users");

var _xdUserAssociationList   = mywindow.findChild("_xdUserAssociationList");
var _newXdUserAssociation    = mywindow.findChild("_newXdUserAssociation");
var _viewXdUserAssociation   = mywindow.findChild("_viewXdUserAssociation");
var _editXdUserAssociation   = mywindow.findChild("_editXdUserAssociation");
var _deleteXdUserAssociation = mywindow.findChild("_deleteXdUserAssociation");

_xdUserAssociationList.addColumn(qsTr("xDruple Site"),     100, Qt.AlignLeft,   true,  "xd_site_name");
_xdUserAssociationList.addColumn(qsTr("xDruple Site URL"), 100, Qt.AlignLeft,   true,  "xd_site_url");
_xdUserAssociationList.addColumn(qsTr("Drupal User UUID"), 100, Qt.AlignLeft,   true,  "xd_user_contact_drupal_user_uuid");
_xdUserAssociationList.addColumn(qsTr("CRM Account"),      100, Qt.AlignLeft,   true,  "crmacct_number");
_xdUserAssociationList.addColumn(qsTr("Is Customer"),      50,  Qt.AlignLeft,   true,  "is_customer");
_xdUserAssociationList.addColumn(qsTr("Is Prospect"),      50,  Qt.AlignLeft,   true,  "is_prospect");
_xdUserAssociationList.addColumn(qsTr("Is Ship To Only"),  50,  Qt.AlignLeft,   true,  "is_shipto_only");
_xdUserAssociationList.addColumn(qsTr("Is Vendor"),        50,  Qt.AlignLeft,   false, "is_vendor");
_xdUserAssociationList.addColumn(qsTr("Is Employee"),      50,  Qt.AlignLeft,   false, "is_employee");
_xdUserAssociationList.addColumn(qsTr("Is Sales Rep"),     50,  Qt.AlignLeft,   false, "is_salesrep");
_xdUserAssociationList.addColumn(qsTr("Is Partner"),       50,  Qt.AlignLeft,   false, "is_partner");
_xdUserAssociationList.addColumn(qsTr("Is Competitor"),    50,  Qt.AlignLeft,   false, "is_competitor");
_xdUserAssociationList.addColumn(qsTr("Is PG User"),       50,  Qt.AlignLeft,   true,  "is_pguser");
_xdUserAssociationList.addColumn(qsTr("PG Username"),      100, Qt.AlignLeft,   true,  "crmacct_usr_username");

xDruple.XdUserAssociationList.populate = function () {
  try {
    _cntctId = _contact.id();
    var params = {
      "ViewMode": true,
      "cntct_id": _cntctId
    };

    if (privileges.value("MaintainxDrupleUserAssociations")) {
      _newXdUserAssociation.enabled = true;
    }

    var qry = toolbox.executeDbQuery("xdUserAssociation", "table", params);
    _xdUserAssociationList.populate(qry);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.populate() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sNew = function () {
  try {
    var params = {
      "mode": "new",
      "cntct_id": _contact.id()
    };

    var newdlg = toolbox.openWindow("xdrupleUserAssociation", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdUserAssociationList.populate();
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.sNew() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sView = function () {
  try {
    var params = {
      "mode": "view",
      "cntct_id": _contact.id(),
      "xd_user_contact_id": _xdUserAssociationList.id()
    };

    var newdlg = toolbox.openWindow("xdrupleUserAssociation", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdUserAssociationList.populate();
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.sEdit() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sEdit = function () {
  try {
    var params = {
      "mode": "edit",
      "cntct_id": _contact.id(),
      "xd_user_contact_id": _xdUserAssociationList.id()
    };

    var newdlg = toolbox.openWindow("xdrupleUserAssociation", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdUserAssociationList.populate();
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.sEdit() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sDelete = function () {
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete xDruple Site User Association?"),
                             qsTr("<p>Are you sure you want to delete this xDruple Site User Association?"),
                             QMessageBox.Yes, QMessageBox.No) == QMessageBox.No)
      return;

    var params = {
      "DeleteMode": true,
      "xd_user_contact_id": _xdUserAssociationList.id()
    };
    var qry = toolbox.executeDbQuery("xdUserAssociation", "table", params);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }

    xDruple.XdUserAssociationList.populate();
  } catch (e) {
    print("xDruple.XdUserAssociationList.sDelete() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sListActions = function (valid) {
  try {
    if (privileges.value("MaintainxDrupleUserAssociations")) {
      _editXdUserAssociation.setEnabled(valid);
      _deleteXdUserAssociation.setEnabled(valid);
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.sListActions() exception: " + e);
  }
};

xDruple.XdUserAssociationList.sListDoubleClick = function () {
  try {
    if (privileges.value("MaintainxDrupleUserAssociations")) {
      _editXdUserAssociation.animateClick();
    } else {
      _viewXdUserAssociation.animateClick();
    }
  } catch (e) {
    print("xDruple.XdUserAssociationList.sListDoubleClick() exception: " + e);
  }
};

_contact["newId(int)"].connect(xDruple.XdUserAssociationList.populate);
_newXdUserAssociation.clicked.connect(xDruple.XdUserAssociationList.sNew);
_viewXdUserAssociation.clicked.connect(xDruple.XdUserAssociationList.sView);
_editXdUserAssociation.clicked.connect(xDruple.XdUserAssociationList.sEdit);
_deleteXdUserAssociation.clicked.connect(xDruple.XdUserAssociationList.sDelete);

_xdUserAssociationList["valid(bool)"].connect(xDruple.XdUserAssociationList.sListActions);
_xdUserAssociationList["itemSelected(int)"].connect(xDruple.XdUserAssociationList.sListDoubleClick);
