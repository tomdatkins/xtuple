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

var widgets = toolbox.loadUi("dspLaborVarianceByBOOItem", mywindow);
var layout = toolbox.createLayout("QVBoxLayout", mywindow);
layout.addWidget(widgets);
mywindow.optionsWidget().setLayout(layout);

mywindow.setWindowTitle(qsTr("Labor Variance By BOO Item"));
mywindow.setListLabel(qsTr("Labor Variance"));
mywindow.setReportName("LaborVarianceByBOOItem");
mywindow.setMetaSQLOptions("manufacture", "laborvariance");

var _booitem   = widgets.findChild("_booitem");
var _item      = widgets.findChild("_item");
var _dates     = widgets.findChild("_dates");
var _warehouse = widgets.findChild("_warehouse");

_item.setType(ItemLineEdit.cGeneralManufactured);
_dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
_dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

mywindow.list().addColumn(qsTr("Post Date"), -1, Qt.AlignCenter,true, "woopervar_posted");
mywindow.list().addColumn(qsTr("Ordered"),   -1, Qt.AlignRight, true, "woopervar_qtyord");
mywindow.list().addColumn(qsTr("Produced"),  -1, Qt.AlignRight, true, "woopervar_qtyrcv");
mywindow.list().addColumn(qsTr("Proj Setup"),-1, Qt.AlignRight, true, "woopervar_stdsutime");
mywindow.list().addColumn(qsTr("Proj. Run"), -1, Qt.AlignRight, true, "woopervar_stdrntime");
mywindow.list().addColumn(qsTr("Act. Setup"),-1, Qt.AlignRight, true, "woopervar_sutime");
mywindow.list().addColumn(qsTr("Act. Run"),  -1, Qt.AlignRight, true, "woopervar_rntime");
mywindow.list().addColumn(qsTr("Setup Var."),-1, Qt.AlignRight, true, "suvar");
mywindow.list().addColumn(qsTr("Run Var."),  -1, Qt.AlignRight, true, "rnvar");

function setParams(params)
{
  if (_booitem.id() == -1)
  {
    _booitem.setFocus();
    return false;
  }

  if (! _dates.allValid())
  {
    _dates.setFocus();
    return false;
  }

  if (_warehouse.isSelected())
    params.warehous_id = _warehouse.id();

  params.startDate   = _dates.startDate;
  params.endDate     = _dates.endDate;
  params.item_id    = _item.id();
  params.booitem_id = _booitem.id();
  params.report_name= "LaborVarianceByBOOItem";

  return true;
}

function sPopulateComponentItems(pItemid)
{
  if (pItemid != -1)
  {
    _booitem.clear();
    var tmpid = -1;

    var params = new Object;
    params.item_id = pItemid;
    var booitemq = toolbox.executeQuery("SELECT booitem_id,"
                                 + "       (booitem_seqnumber || '- ' || booitem_descrip1 || ' ' || booitem_descrip2) AS longtext,"
                                 + "        booitem_seqnumber "
                                 + "FROM xtmfg.booitem "
                                 + 'WHERE (booitem_item_id=<? value("item_id") ?>) '
                                 + "ORDER BY booitem_seqnumber;",
                                   params);
    /* Note: can't use xcombobox::populate because the script engine calls
       xcombobox::populate(QString) instead of the expected ::populate(XSqlQuery)
     */
    while(booitemq.next())
    {
       if (tmpid < 0)
         tmpid = booitemq.value("booitem_id");
       _booitem.append(booitemq.value("booitem_id"), booitemq.value("longtext"),
                       booitemq.value("booitem_seqnumber"));
    }
    _booitem.setId(tmpid);

    if (booitemq.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                         booitem.lastError().text);
      return;
    }
  }
  else
    _booitem.clear();
}

_item["newId(int)"].connect(sPopulateComponentItems);
