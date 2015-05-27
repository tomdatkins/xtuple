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
xDruple.XdSite = {};

var _xdSiteSave      = mywindow.findChild("_xdSiteSave");
var _xdSiteClose     = mywindow.findChild("_xdSiteClose");
var _xdSiteName      = mywindow.findChild("_xdSiteName");
var _xdSiteUrl       = mywindow.findChild("_xdSiteUrl");
var _xdSiteUrlLink   = mywindow.findChild("_xdSiteUrlLink");
var _xdSiteNotes     = mywindow.findChild("_xdSiteNotes");

var _mode            = "new";
var _xdrupleSiteId   = null;
var _xdrupleSiteName = null;
var _xdrupleSiteUrl  = null;

function set(params) {
  try {
    if ("xd_site_id" in params) {
      _xdrupleSiteId = params.xd_site_id;
    }
    if ("mode" in params) {
      _mode = params.mode;
    }

    xDruple.XdSite.populateUrl();
    xDruple.XdSite.populate();

    return 0;
  } catch (e) {
    print("set() exception: " + e);
  }

  return 1;
}

xDruple.XdSite.populate = function() {
  try {
    var params = {
      "ViewMode": true
    };

    if (privileges.value("MaintainxDrupleSites")) {
      _xdSiteSave.enabled = true;
    }

    if (_xdrupleSiteId) {
      params.xd_site_id = _xdrupleSiteId;
    }

    if (_mode == "view" || _mode == "edit") {
      var qry = toolbox.executeDbQuery("xdSite", "table", params);

      if (qry.first()) {
        _xdrupleSiteId = qry.value("xd_site_id");

        if (_xdrupleSiteId) {
          _xdrupleSiteName = qry.value("xd_site_name");
          _xdSiteName.text = _xdrupleSiteName;
          _xdrupleSiteUrl = qry.value("xd_site_url");
          _xdSiteUrl.text = _xdrupleSiteUrl;
          _xdSiteNotes.plainText = qry.value("xd_site_notes");
          xDruple.XdSite.populateUrl();
        }
      }

      if (_mode == "view") {
        _xdSiteSave.enabled = false;
        _xdSiteName.enabled = false;
        _xdSiteNotes.enabled = false;
      }

      if (qry.lastError().type != 0) {
        throw new Error(qry.lastError().text);
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.XdSite.populate() exception: "), e.message);
  }
}

xDruple.XdSite.populateUrl = function() {
  try {
    if (_xdrupleSiteId) {
      _xdSiteUrlLink.url  = _xdrupleSiteUrl;
      _xdSiteUrlLink.text = "View the " + _xdrupleSiteName + " Web site";
    }

    _xdSiteUrlLink.setEnabled(true);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, qsTr("xDruple.XdSite.populateUrl() exception: "), e.message);
  }
}

xDruple.XdSite.save = function() {
  try {
    var params = {
      "xd_site_name": _xdSiteName.text,
      "xd_site_url": _xdSiteUrl.text,
      "xd_site_notes": _xdSiteNotes.plainText
    };

    if (_mode == "new") {
      params.NewMode = true;
    } else if (_mode == "edit") {
      params.xd_site_id = _xdrupleSiteId;
      params.EditMode = true;
    }

    var qry = toolbox.executeDbQuery("xdSite", "table", params);

    if (qry.lastError().type == 0) {
      var returnParams = {
        "xd_site_name": _xdSiteName.text,
        "ViewMode": true
      };

      var returnQry = toolbox.executeDbQuery("xdSite", "table", returnParams);
      if (returnQry.first()) {
        _xdrupleSiteId = returnQry.value("xd_site_id");
        return _xdrupleSiteId;
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
    QMessageBox.critical(mywindow, qsTr("xDruple.XdSite.save() exception: "), e.message);
    return false;
  }
}

xDruple.XdSite.sClose = function() {
  mydialog.reject();
}

xDruple.XdSite.sSave = function() {
  var saveval = xDruple.XdSite.save();

  if (saveval) {
    mydialog.done(saveval);
  }
}

_xdSiteClose.clicked.connect(xDruple.XdSite.sClose);
_xdSiteSave.clicked.connect(xDruple.XdSite.sSave);

// When "View" URL is clicked, open the website.
_xdSiteUrlLink["leftClickedURL(QString)"].connect(toolbox.openUrl);
