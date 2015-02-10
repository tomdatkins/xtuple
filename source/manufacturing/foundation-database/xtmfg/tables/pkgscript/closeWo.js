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

var _closeWo              = mywindow.findChild("_closeWo");
var _postMaterialVariance = mywindow.findChild("_postMaterialVariance");
var _wo                   = mywindow.findChild("_wo");
var _transDate            = mywindow.findChild("_transDate");
var _captive              = false;

var _postLaborVariance = new XCheckBox(qsTr("Post &Labor Variances"), mywindow);
_postLaborVariance.objectName = "_postLaborVariance";
_postLaborVariance.forgetful  = true;
_postLaborVariance.checked    = metrics.boolean("PostLaborVariances");

var _cblayout = toolbox.widgetGetLayout(_postMaterialVariance);
_cblayout.addWidget(_postLaborVariance);

function set(params)
{
  _captive = true;
}

function sCloseWo()
{
  if (! mywindow.okToSave())
    return;

  var params = new Object;
  params.wo_id = _wo.id();
  var clockinq = toolbox.executeQuery("SELECT COUNT(*) AS countClockins "
                                    + "FROM xtmfg.wotc "
                                    + "WHERE ((wotc_timein IS NOT NULL)"
                                    + "   AND (wotc_timeout IS NULL)"
                                    + '   AND (wotc_wo_id=<? value("wo_id") ?>));',
                                    params);
  if (clockinq.first())
  {
    var clockins = clockinq.value("countClockins");
    if (clockins > 0)
    {
      if (privileges.check("ViewWoTimeClock") ||
          privileges.check("MaintainWoTimeClock"))
      {
        if (QMessageBox.question(mywindow,
                               qsTr("Users Stilled Clocked In"),
                               qsTr("<p>This Work Order still has %1 user(s) "
                                  + "clocked in. Have those users clock out "
                                  + "before closing this Work Order. Would you "
                                  + "like to see the time clock data for this "
                                  + "Work Order?").arg(clockins),
                               QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
        {
          var newdlg = toolbox.newDisplay("dspWoEffortByWorkOrder", 0,
                                          Qt.NonModal, Qt.Window);
          newdlg.set(params);
          mywindow.close();
        }
      }
      else
        QMessageBox.warning(mywindow,
                           qsTr("Users Stilled Clocked In"),
                           qsTr("<p>This Work Order still has %1 user(s) "
                              + "clocked in. Have those users clock out "
                              + "before closing this Work Order.").arg(clockins));
      return;
    }
  }
  else if (clockinq.lastError().type != QSqlError.NoError)
  {
    systemError(this, clockinq.lastError().text, __FILE__, __LINE__);
    return;
  }

  if (QMessageBox.question(mywindow, qsTr("Close Work Order"),
                         qsTr("<p>Are you sure you want to close this Work Order?"),
                         QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.Yes)
  {
    var params = new Object;
    params.wo_id        = _wo.id();
    params.postMatVar   = _postMaterialVariance.checked;
    params.postLaborVar = _postLaborVariance.checked;
    params.date         = _transDate.date;

    var qry = toolbox.executeQuery('SELECT xtmfg.closeWo(<? value("wo_id") ?>,'
                                 + '               <? value("postMatVar") ?>,'
                                 + '               <? value("postLaborVar") ?>,'
                                 + '               <? value("date") ?>)'
                                 + '       AS result;',
                                 params);
    if (qry.first())
    {
      var result = qry.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                           qsTr("Could not close Work Order"),
                           storedProcErrorLookup("closewo", result));
        return;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         qry.lastError().text);
      return;
    }

    mainwindow.sWorkOrdersUpdated(_wo.id(), true);

    if (_captive)
      mywindow.close();
    else
      mywindow.clear();
  }
}

//_closeWo.clicked.disconnect(mywindow.sCloseWo);
toolbox.coreDisconnect(_closeWo, "clicked()", mywindow, "sCloseWo()");
_closeWo.clicked.connect(sCloseWo);

include("storedProcErrorLookup");
