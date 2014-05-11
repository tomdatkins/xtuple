var _list=mywindow.list();

with(_list)
{
    addColumn("Phone", -1,1, false,"phone");
    addColumn("Address", -1,1, false,"address");
    addColumn("Email", -1,1, false,"email");
    addColumn("Manager", -1,1, false,"manager_code");
    addColumn("Department", -1,1, false,"department");
    addColumn("Site", -1,1, false,"site");
    addColumn("Shift", -1,1, false,"shift");
    addColumn("Start Date", -1,1, false,"start_date");
}

//  Add Query Parameters
var sql = "SELECT shift_id, shift_name FROM shift";
mywindow.parameterWidget().appendComboBox(qsTr("Shift"), "shift_id", sql, null, false);
var sql2 = "SELECT dept_id, dept_name FROM dept";
mywindow.parameterWidget().appendComboBox(qsTr("Department"), "dept_id", sql2, null, false);
mywindow.parameterWidget().append(qsTr("Manager"), "mgr_id", ParameterWidget.Employee, null, false);
mywindow.parameterWidget().append(qsTr("Start Date"), "start_date", ParameterWidget.Date, null, false);
mywindow.parameterWidget().append(qsTr("CRM Account"), "accnt_id", ParameterWidget.Crmacct, null, false);
mywindow.parameterWidget().applyDefaultFilterSet();
