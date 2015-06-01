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
xDruple.XdSiteList = {};

var _xdSiteList = mywindow.findChild("_xdSiteList");
var _newSite    = mywindow.findChild("_newSite");
var _viewSite   = mywindow.findChild("_viewSite");
var _editSite   = mywindow.findChild("_editSite");
var _deleteSite = mywindow.findChild("_deleteSite");

_xdSiteList.addColumn(qsTr("Name"),  100, Qt.AlignLeft,   true,  "xd_site_name");
_xdSiteList.addColumn(qsTr("URL"),   100, Qt.AlignLeft,   true,  "xd_site_url");
_xdSiteList.addColumn(qsTr("Notes"), 100, Qt.AlignLeft,   true,  "xd_site_notes");

xDruple.XdSiteList.populate = function () {
  try {
    var params = {
      "ViewMode": true
    };

    if (privileges.value("MaintainxDrupleSites")) {
      _newSite.enabled = true;
    }

    var qry = toolbox.executeDbQuery("xdSite", "table", params);
    _xdSiteList.populate(qry);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  } catch (e) {
    print("xDruple.XdSiteList.populate() exception: " + e);
  }
};

xDruple.XdSiteList.sNew = function () {
  try {
    var params = {
      "mode": "new"
    };

    var newdlg = toolbox.openWindow("xdrupleSite", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdSiteList.populate();
    }
  } catch (e) {
    print("xDruple.XdSiteList.sNew() exception: " + e);
  }
};

xDruple.XdSiteList.sView = function () {
  try {
    var params = {
      "mode": "view",
      "xd_site_id": _xdSiteList.id()
    };

    var newdlg = toolbox.openWindow("xdrupleSite", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdSiteList.populate();
    }
  } catch (e) {
    print("xDruple.XdSiteList.sEdit() exception: " + e);
  }
};

xDruple.XdSiteList.sEdit = function () {
  try {
    var params = {
      "mode": "edit",
      "xd_site_id": _xdSiteList.id()
    };

    var newdlg = toolbox.openWindow("xdrupleSite", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);

    if (newdlg.exec() > 0) {
      xDruple.XdSiteList.populate();
    }
  } catch (e) {
    print("xDruple.XdSiteList.sEdit() exception: " + e);
  }
};

xDruple.XdSiteList.sDelete = function () {
  try {
    if (QMessageBox.question(mywindow, qsTr("Delete xDruple Site?"),
                             qsTr("<p>Are you sure you want to delete this xDruple Site?"),
                             QMessageBox.Yes, QMessageBox.No) == QMessageBox.No)
      return;

    var params = {
      "DeleteMode": true,
      "xd_site_id": _xdSiteList.id()
    };
    var qry = toolbox.executeDbQuery("xdSite", "table", params);

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }

    xDruple.XdSiteList.populate();
  } catch (e) {
    print("xDruple.XdSiteList.sDelete() exception: " + e);
  }
};

xDruple.XdSiteList.sListActions = function (valid) {
  try {
    if (privileges.value("MaintainxDrupleSites")) {
      _editSite.setEnabled(valid);
      _deleteSite.setEnabled(valid);
    }
  } catch (e) {
    print("xDruple.XdSiteList.sListActions() exception: " + e);
  }
};

xDruple.XdSiteList.sListDoubleClick = function () {
  try {
    if (privileges.value("MaintainxDrupleSites")) {
      _editSite.animateClick();
    } else {
      _viewSite.animateClick();
    }
  } catch (e) {
    print("xDruple.XdSiteList.sListDoubleClick() exception: " + e);
  }
};

xDruple.XdSiteList.populate();
_newSite.clicked.connect(xDruple.XdSiteList.sNew);
_viewSite.clicked.connect(xDruple.XdSiteList.sView);
_editSite.clicked.connect(xDruple.XdSiteList.sEdit);
_deleteSite.clicked.connect(xDruple.XdSiteList.sDelete);

_xdSiteList["valid(bool)"].connect(xDruple.XdSiteList.sListActions);
_xdSiteList["itemSelected(int)"].connect(xDruple.XdSiteList.sListDoubleClick);
