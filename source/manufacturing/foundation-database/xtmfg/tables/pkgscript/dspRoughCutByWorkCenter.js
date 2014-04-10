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

var widgets = toolbox.loadUi("dspRoughCutByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Rough Cut Capacity Plan"));
mywindow.setListLabel(qsTr("Rough Cut Capacity Load"));
mywindow.setReportName("RoughCutCapacityPlanByWorkCenter");
mywindow.setMetaSQLOptions("roughcutcapacity", "detail");

/*
QButtonGroup* _workCenterGroupInt = new QButtonGroup(this);
_workCenterGroupInt.addButton(_allWorkCenters);
_workCenterGroupInt.addButton(_selectedWorkCenter);
*/
var _roughCut           = mywindow.list();
var _dates              = mywindow.findChild("_dates");
var _warehouse          = mywindow.findChild("_warehouse");
var _selectedWorkCenter = mywindow.findChild("_selectedWorkCenter");
var _wrkcnt             = mywindow.findChild("_wrkcnt");
var _selectedTooling    = mywindow.findChild("_selectedTooling");
var _tooling            = mywindow.findChild("_tooling");
var _workCenterGroup    = mywindow.findChild("_workCenterGroup");
var _toolingGroup	 = mywindow.findChild("_toolingGroup");

_roughCut.addColumn(qsTr("Site"),        XTreeWidget.whsColumn, Qt.AlignCenter,true, "warehous_code");
_roughCut.addColumn(qsTr("Type"),       -1,                     Qt.AlignLeft,  true, "resource_type");
_roughCut.addColumn(qsTr("Resource"),   -1,                     Qt.AlignLeft,  true, "resource");
_roughCut.addColumn(qsTr("Total Setup"),XTreeWidget.timeColumn, Qt.AlignRight, true, "setuptime");
_roughCut.addColumn(qsTr("Setup $"),    XTreeWidget.costColumn, Qt.AlignRight, true, "setupcost");
_roughCut.addColumn(qsTr("Total Run"),  XTreeWidget.timeColumn, Qt.AlignRight, true, "runtime");
_roughCut.addColumn(qsTr("Run $"),      XTreeWidget.costColumn, Qt.AlignRight, true, "runcost");

_dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
_dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

var sql = "SELECT item_id, item_number || '-' || item_descrip1, item_number "
	+ "FROM item "
	+ "WHERE ((item_type='T') "
	+ " AND (item_active)) ";
_tooling.populate(sql);

function setParams(params)
{
  if (!_workCenterGroup.checked && !_toolingGroup.checked) {
    QMessageBox.critical(mywindow, qsTr("Selection Error"),
	qsTr("You must select Work Center or Tooling as a criteria."));
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  params.startDate = _dates.startDate;
  params.endDate   = _dates.endDate;

  if (_workCenterGroup.checked) {
    params.showWorkCenters = true;
    if (_selectedWorkCenter.checked)
      params.wrkcnt_id = _wrkcnt.id();
  }

  if (_toolingGroup.checked) {
    params.showTooling = true;
    if (_selectedTooling.checked)
      params.item_id = _tooling.id();
  }

  params.report_name = "RoughCutCapacityPlanByWorkCenter";
  params.workcenter=qsTr("Work Center");
  params.tooling=qsTr("Tooling");
  params.includeFormatted = true;

  return true;
}

