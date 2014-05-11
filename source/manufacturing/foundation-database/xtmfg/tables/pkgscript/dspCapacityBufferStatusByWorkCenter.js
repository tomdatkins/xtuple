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

var widgets = toolbox.loadUi("dspCapacityBufferStatusByWorkCenter", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Capacity Buffer Status"));
mywindow.setListLabel(qsTr("Buffer Status"));
mywindow.setReportName("CapacityBufferStatusByWorkCenter");
mywindow.setMetaSQLOptions("capacitybufferstatus", "detail");

var _selectedWorkCenter = widgets.findChild("_selectedWorkCenter");
var _warehouse          = widgets.findChild("_warehouse");
var _maxdaysload        = widgets.findChild("_maxdaysload");
var _wrkcnt             = widgets.findChild("_wrkcnt");
var _selectedTooling    = widgets.findChild("_selectedTooling");
var _tooling            = widgets.findChild("_tooling");
var _workCenterGroup    = widgets.findChild("_workCenterGroup");
var _toolingGroup       = widgets.findChild("_toolingGroup");

_wrkcnt.populate("SELECT wrkcnt_id, (wrkcnt_code || '-' || wrkcnt_descrip) "
               + "FROM xtmfg.wrkcnt "
               + "ORDER BY wrkcnt_code;" );

mywindow.list().addColumn(qsTr("Site"),          -1, Qt.AlignCenter,true, "warehous_code");
mywindow.list().addColumn(qsTr("Type"),          -1, Qt.AlignLeft,  true, "resource_type");
mywindow.list().addColumn(qsTr("Resource"),      -1, Qt.AlignLeft,  true, "resource");
mywindow.list().addColumn(qsTr("Total Setup"),   -1, Qt.AlignRight, true, "sutime");
mywindow.list().addColumn(qsTr("Total Run"),     -1, Qt.AlignRight, true, "rntime");
mywindow.list().addColumn(qsTr("Daily Capacity"),-1, Qt.AlignRight, true, "dailycap");
mywindow.list().addColumn(qsTr("Days Load"),     -1, Qt.AlignRight, true, "daysload");
mywindow.list().addColumn(qsTr("Buffer Status"), -1, Qt.AlignRight, true, "bufrsts");

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

  params.workcenter=qsTr("Work Center");
  params.tooling=qsTr("Tooling");

  params.maxdaysload = _maxdaysload.value;
  params.includeFormatted = true;

  return true;
}

