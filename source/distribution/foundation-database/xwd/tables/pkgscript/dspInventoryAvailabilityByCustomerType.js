debugger;
include("ParameterGroupUtils");

try
{
  var _queryAct = mywindow.queryAction();
  var _list = mywindow.findChild("_list");
  var _custtype = mywindow.findChild("_custtype");
  var _onlyShowShortages = mywindow.findChild("_onlyShowShortages");
  var _showWoSupply = mywindow.findChild("_showWoSupply");
  var _useReservationNetting = mywindow.findChild("_useReservationNetting");

  var _layout  = toolbox.widgetGetLayout(_onlyShowShortages);

  var _availToShip = toolbox.createWidget("XCheckBox", mywindow, "_availToShip");
  _availToShip.text = qsTr("Only Show Available to Ship");
  _layout.insertWidget(1, _availToShip);

  toolbox.coreDisconnect(_queryAct, "triggered()", mywindow, "sFillList()");
  _queryAct.triggered.connect(sFillList);
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspInventoryAvailabilityByCustomerType",
                       "dspInventoryAvailabilityByCustomerType.js exception: " + e);
}

function sFillList()
{
  try
  {
    var params = new Object;
    if (_custtype.isSelected())
      params.custtype_id = _custtype.id();

    if(_availToShip.checked)
      params.availToShip = true;
    if(_onlyShowShortages.checked)
      params.onlyShowShortages = true;
    if (_showWoSupply.checked)
      params.showWoSupply = true;
    if (_useReservationNetting.checked)
      params.useReservationNetting = true;
    var qry = toolbox.executeDbQuery("inventoryAvailability", "byCustOrSOxwd", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
    _list.populate(qry, true);
    _list.expandAll();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "dspInventoryAvailabilityByCustomerType",
                         "sFillList exception: " + e);
  }
}
