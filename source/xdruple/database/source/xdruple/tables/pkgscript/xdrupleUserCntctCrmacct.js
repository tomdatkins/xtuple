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
xDruple.UserCntctCrmacct = {};

var _xdUserSave                  = mywindow.findChild("_xdUserSave");
var _xdUserClose                 = mywindow.findChild("_xdUserClose");
var _xdrupleUsercontactCluster   = mywindow.findChild("_xdrupleUsercontactCluster");
var _xdUserIsCustomer            = mywindow.findChild("_xdUserIsCustomer");
var _xdUserIsProspect            = mywindow.findChild("_xdUserIsProspect");
var _xdUserContactSite           = mywindow.findChild("_xdUserContactSite");
var _xdUserContactDrupalUserUuid = mywindow.findChild("_xdUserContactDrupalUserUuid");
var _xdUserUrl                   = mywindow.findChild("_xdUserUrl");

var _mode = "new";
var _xdUsrCntctId = null;
var _xdUsrCntctCntctId = null;
var _xdUsrCntctSiteId = null;
var _xdUsrCntctSiteUrl = null;
var _xdUsrCntctSiteName = null;
var _xdUsrCntctDrupalUserUuid = null;

function set(params) {
  try {
    if ("xd_user_contact_id" in params) {
      _xdUsrCntctId = params.xd_user_contact_id;
    }
    if ("cntct_id" in params) {
      _xdUsrCntctCntctId = params.cntct_id;
    }
    if ("mode" in params) {
      _mode = params.mode;
    }

    xDruple.UserCntctCrmacct.populateSite();
    xDruple.UserCntctCrmacct.populateUrl();
    xDruple.UserCntctCrmacct.populate();

    return 0;
  } catch (e) {
    print("set() exception: " + e);
  }

  return 1;
}

xDruple.UserCntctCrmacct.sHandleType = function() {
  try {
    if (_xdUserIsCustomer.checked) {
      _xdUserIsProspect.unchecked;
    } else {
      _xdUserIsCustomer.unchecked;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.sHandleType() exception: "), e.message);
    return false;
  }
}

xDruple.UserCntctCrmacct.populate = function() {
  try {
    var params = {
      "ViewMode": true
    };

    if (_xdUsrCntctId) {
      params.xd_user_contact_id = _xdUsrCntctId;
    }

    if (_xdUsrCntctCntctId) {
      _xdrupleUsercontactCluster.setId(_xdUsrCntctCntctId);
      _xdrupleUsercontactCluster.enabled = false;
    }

    if (_mode == "edit") {
      var qry = toolbox.executeDbQuery("xdUserContactAccounts", "table", params);

      if (qry.first()) {
        _xdUsrCntctSiteId = qry.value("xd_user_contact_site_id");
        _xdUsrCntctDrupalUserUuid = qry.value("xd_user_contact_drupal_user_uuid")

        if (qry.value("is_customer")) {
          _xdUserIsCustomer.checked = true;
          _xdUserIsProspect.checked = false;
          _xdUserIsProspect.enabled = false;
        } else if (qry.value("is_prospect")) {
          _xdUserIsProspect.checked = true;
          _xdUserIsCustomer.checked = false;
        }

        if (_xdUsrCntctDrupalUserUuid) {
          _xdUserContactDrupalUserUuid.text = _xdUsrCntctDrupalUserUuid;
          _xdUserContactDrupalUserUuid.enabled = false;
        }

        if (_xdUsrCntctSiteId) {
          _xdUserContactSite.setId(_xdUsrCntctSiteId);
          _xdUserContactSite.enabled = false;
          _xdUsrCntctSiteUrl = qry.value("xd_site_url");
          _xdUsrCntctSiteName = qry.value("xd_site_name");
          xDruple.UserCntctCrmacct.populateUrl();
        }
      }

      if (qry.lastError().type != 0) {
        throw new Error(qry.lastError().text);
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.populate() exception: "), e.message);
  }
}

xDruple.UserCntctCrmacct.populateSite = function() {
  try {
    var params = {
      "ViewMode": true
    };

    var qry = toolbox.executeDbQuery("xdSite", "table", params);

    _xdUserContactSite.populate(qry);
    if (qry.first()) {
      _xdUserContactSite.setId(qry.value("xd_site_id"));
      _xdUsrCntctSiteUrl = qry.value("xd_site_url");
      _xdUsrCntctSiteName = qry.value("xd_site_name");
    }

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.populateSite() exception: "), e.message);
  }
}

xDruple.UserCntctCrmacct.populateUrl = function() {
  try {
    if (_xdUsrCntctDrupalUserUuid) {
      _xdUserUrl.url  = _xdUsrCntctSiteUrl + "/redirect/user/uuid/" + _xdUsrCntctDrupalUserUuid;
      _xdUserUrl.text = "View on " + _xdUsrCntctSiteName + " Web site";
    } else {
      _xdUserUrl.url  = _xdUsrCntctSiteUrl + "/admin/people";
      _xdUserUrl.text = "Find User's UUID on " + _xdUsrCntctSiteName + " Web site";
    }

    _xdUserUrl.setEnabled(true);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.populateUrl() exception: "), e.message);
  }
}

xDruple.UserCntctCrmacct.sHandleSite = function() {
  try {
    var params = {
      "xd_site_id": _xdUserContactSite.id(),
      "ViewMode": true
    };

    var qry = toolbox.executeDbQuery("xdSite", "table", params);

    if (qry.first()) {
      _xdUsrCntctSiteUrl = qry.value("xd_site_url");
      _xdUsrCntctSiteName = qry.value("xd_site_name");
    }

    xDruple.UserCntctCrmacct.populateUrl();

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.sHandleSite() exception: "), e.message);
  }
}

xDruple.UserCntctCrmacct.save = function() {
  try {
    var params = {
      "is_customer": _xdUserIsCustomer.checked,
      "is_prospect": _xdUserIsProspect.checked
    };

    if (_mode == "new") {
      params.xd_user_contact_site_id = _xdUserContactSite.id();
      params.xd_user_contact_drupal_user_uuid = _xdUserContactDrupalUserUuid.text;
      params.xd_user_contact_cntct_id = _xdrupleUsercontactCluster.id();
      params.NewMode = true;
    } else if (_mode == "edit") {
      params.xd_user_contact_id = _xdUsrCntctId;
      params.EditMode = true;
    }

    var qry = toolbox.executeDbQuery("xdUserContactAccounts", "table", params);

    if (qry.lastError().type == 0) {
      var returnParams = {
        "xd_user_contact_drupal_user_uuid": _xdUserContactDrupalUserUuid.text,
        "ViewMode": true
      };

      var returnQry = toolbox.executeDbQuery("xdUserContactAccounts", "table", returnParams);
      if (returnQry.first()) {
        _xdUsrCntctId = returnQry.value("xd_user_contact_id");
        return _xdUsrCntctId;
      }

      if (returnQry.lastError().type != 0) {
        throw new Error(returnQry.lastError().text);
      }
    }

    if (qry.lastError().type != 0) {
      throw new Error(qry.lastError().text);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.UserCntctCrmacct.save() exception: "), e.message);
    return false;
  }
}

xDruple.UserCntctCrmacct.sClose = function() {
  mywindow.close();
}

xDruple.UserCntctCrmacct.sSave = function() {
  var saveval = xDruple.UserCntctCrmacct.save();
  if (saveval) {
    mywindow.close();
  }
}

_xdUserClose.clicked.connect(xDruple.UserCntctCrmacct.sClose);
_xdUserSave.clicked.connect(xDruple.UserCntctCrmacct.sSave);

_xdUserIsCustomer.toggled.connect(xDruple.UserCntctCrmacct.sHandleType);
_xdUserIsProspect.toggled.connect(xDruple.UserCntctCrmacct.sHandleType);
_xdUserContactSite["currentIndexChanged(int)"].connect(xDruple.UserCntctCrmacct.sHandleSite);

// When "View" URL is clicked, open the website.
_xdUserUrl["leftClickedURL(QString)"].connect(toolbox.openUrl);
