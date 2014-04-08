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

try
{
  var _scheduledDate = mywindow.findChild("_scheduledDate");
  var _promisedDate  = mywindow.findChild("_promisedDate");
  var _warehouse     = mywindow.findChild("_warehouse");

  if (metrics.boolean("UseSiteCalendar"))
    _warehouse["newID(int)"].connect(setCal);

  var _woIndentedList = mywindow.findChild("_woIndentedList");
  var _supplyWoNewMatl = mywindow.findChild("_supplyWoNewMatl");
  var _supplyWoEdit = mywindow.findChild("_supplyWoEdit");
  var _supplyWoDelete = mywindow.findChild("_supplyWoDelete");

  var layout = toolbox.widgetGetLayout(_supplyWoNewMatl);
  var _supplyWoNewOper = toolbox.createWidget("QPushButton", mywindow, "_supplyWoNewOper");
  _supplyWoNewOper.text = qsTr("New Oper.");
  layout.insertWidget(1, _supplyWoNewOper);

  _supplyWoNewOper.clicked.connect(sNewOperation);
  _supplyWoEdit.clicked.connect(sEditOperation);
  _supplyWoDelete.clicked.connect(sDeleteOperation);
  mainwindow.workOrderOperationsUpdated.connect(sCatchOperationsUpdated);
}
catch(e)
{
  QMessageBox.critical(mywindow, "salesOrderItem",
                       qsTr("salesOrderItem exception: ") + e);
}

function setCal()
{
  try
  {
    if ( (mywindow.mode() != 3) && (mywindow.mode() != 35) ) // sales order and quote view mode
    {
      _scheduledDate.setCalendarSiteId(_warehouse.id());
      _promisedDate.setCalendarSiteId(_warehouse.id());
      if (_scheduledDate.isValid())
        _scheduledDate.setDate(_scheduledDate.date);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("setCal exception: ") + e);
  }
}

function openOperation(params)
{
  try {
    var wnd = toolbox.openWindow("woOperation", mywindow, 0, 1);
    toolbox.lastWindow().set(params);
    wnd.exec();
    mywindow.sFillWoIndentedList();
  } catch(e) {
    print("workOrderOperations open woOperation exception @ " + e.lineNumber + ": " + e);
  }
}

function sNewOperation()
{
  var params = new Object;
  params.mode = "new";
  params.showPrice = true;
  params.wo_id = mywindow.supplyid();

  openOperation(params);
}

function sEditOperation()
{
  if (_woIndentedList.altId() == 3 && _woIndentedList.id() > -1)
  {
    var params = new Object;
    params.mode = "edit";
    params.showPrice = true;
    params.wooper_id = _woIndentedList.id();

    openOperation(params);
  }
}

function sViewOperation()
{
  if (_woIndentedList.altId() == 3 && _woIndentedList.id() > -1)
  {
    var params = new Object;
    params.mode = "view";
    params.showPrice = true;
    params.wooper_id = _woIndentedList.id();

    openOperation(params);
  }
}

function sDeleteOperation()
{
  if (_woIndentedList.altId() == 3 && _woIndentedList.id() > -1)
  {
    if (QMessageBox.question(mywindow, qsTr("Delete W/O Operation"),
                           qsTr("<p>If you Delete the selected W/O Operation you "
                              + "will not be able to post Labor to this Operation"
                              + ".<p>Are you sure that you want to delete the "
                              + "selected W/O Operation?"),
                             QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
      return;

    var params = new Object;
    params.wooper_id = _woIndentedList.id();

    var qry = toolbox.executeQuery("SELECT xtmfg.deleteWooper(<? value('wooper_id') ?>) AS result;", params);
    if(qry.first())
    {
      var result = qry.value("result");
      if(result < 0)
      {
        QMessageBox.critical(mywindow, qsTr("Could not Delete W/O Operation"),
                           storedProcErrorLookup("deleteWooper", result, xtmfgErrors));
        return;
      }
      else
        mainwindow.sWorkOrderOperationsUpdated(_wo.id(), _wooper.id(), true);
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }

    mywindow.sFillWoIndentedList();
  }
}

function sCatchOperationsUpdated(pWoid, pWooperid, pBool)
{
  mywindow.sFillWoIndentedList();
}

