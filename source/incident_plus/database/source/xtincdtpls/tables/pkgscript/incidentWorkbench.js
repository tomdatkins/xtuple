// This needs to be run in order AFTER the xtincident version of the same script
mywindow.setMetaSQLOptions("incidents", "xtuple");

var _list = mywindow.list();
var _pWidget = mywindow.parameterWidget();

var qryVer = "SELECT DISTINCT prjver_version, prjver_version "
           + "FROM  xtincdtpls.prjver "
           + "ORDER BY prjver_version DESC; ";

_pWidget.append(qsTr("Found In"), "foundverList", ParameterWidget.Multiselect, null, false, qryVer);
_pWidget.append(qsTr("Fixed In"), "fixedverList", ParameterWidget.Multiselect, null, false, qryVer);

_list.addColumn("Found In",  -1, Qt.AlignLeft, false, "found_version");
_list.addColumn("Fixed In",  -1, Qt.AlignLeft, false, "fixed_version");

_pWidget.applyDefaultFilterSet();

