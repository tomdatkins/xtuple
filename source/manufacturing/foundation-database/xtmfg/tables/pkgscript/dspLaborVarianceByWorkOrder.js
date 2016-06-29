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

mywindow.setWindowTitle(qsTr("Labor Variance By Work Order"));
mywindow.setListLabel(qsTr("Labor Variance"));
mywindow.setReportName("LaborVarianceByWorkOrder");
mywindow.setMetaSQLOptions("manufacture", "laborvariance");
mywindow.setParameterWidgetVisible(true);

/*
mywindow.parameterWidget().append(qsTr("Start Date"), "startDate", ParameterWidget.Date);
mywindow.parameterWidget().append(qsTr("End Date"), "endDate", ParameterWidget.Date);
mywindow.parameterWidget().append(qsTr("Item"), "item_id", ParameterWidget.Item);
mywindow.parameterWidget().append(qsTr("Site"), "warehous_id", ParameterWidget.Site);
mywindow.parameterWidget().appendComboBox(qsTr("Work Center"), "wrkcnt_id", XComboBox.WorkCentersActive);
*/
mywindow.parameterWidget().append(qsTr("Work Order"), "wo_id", ParameterWidget.WorkOrder, -1, true);
mywindow.parameterWidget().applyDefaultFilterSet();
mywindow.parameterWidget().setFiltersVisible(true);

//InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo, InputManager.slotName("setId(int)"));

mywindow.list().addColumn(qsTr("Post Date"),  -1, Qt.AlignCenter,true, "woopervar_posted");
mywindow.list().addColumn(qsTr("Parent Item"),-1, Qt.AlignLeft  ,true, "item_number");
mywindow.list().addColumn(qsTr("Seq #"),      -1, Qt.AlignCenter,true, "woopervar_seqnumber");
mywindow.list().addColumn(qsTr("Work Center"),-1, Qt.AlignLeft,  true, "wrkcnt_code");
mywindow.list().addColumn(qsTr("Proj Setup"), -1, Qt.AlignRight, true, "woopervar_stdsutime");
mywindow.list().addColumn(qsTr("Proj. Run"),  -1, Qt.AlignRight, true, "woopervar_stdrntime");
mywindow.list().addColumn(qsTr("Act. Setup"), -1, Qt.AlignRight, true, "woopervar_sutime");
mywindow.list().addColumn(qsTr("Act. Run"),   -1, Qt.AlignRight, true, "woopervar_rntime");
mywindow.list().addColumn(qsTr("Setup Var."), -1, Qt.AlignRight, true, "suvar");
mywindow.list().addColumn(qsTr("Run Var."),   -1, Qt.AlignRight, true, "rnvar");

function setParams(params)
{
   var wo_id = mywindow.parameterWidget().parameters().wo_id;
   if(wo_id == undefined)
   {
     QMessageBox.critical(mywindow, qsTr("Invalid Selection"),
       qsTr("Please select a Work Order"));
     return false;     
   }
   else
   {
     return true;     
   }
}
