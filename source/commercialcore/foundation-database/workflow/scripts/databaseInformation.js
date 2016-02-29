// add workflow checkbox to system setup screen

var _forceLicense = mywindow.findChild("_forceLicense");
var layout = toolbox.widgetGetLayout(_forceLicense);

var _workflow = toolbox.createWidget("QCheckBox", mywindow, "_workflow");
_workflow.text = qsTr("Create default workflows via database trigger");

layout.addWidget(_workflow, 8, 1);

populatewf();

function set(params)
{
  if("mode" in params)
  {
    if(params.mode == "view")
    {
      _workflow.setReadOnly(true);
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  var params = new Object;
  params.workflow = _workflow.checked;

  var qry = toolbox.executeQuery("UPDATE metric "
                                +"   SET metric_value = "
                                +"   (CASE WHEN <? value('workflow') ?> = true THEN 't' "
                                +"         ELSE 'f' "
                                +"   END) "
                                +" WHERE (metric_name='TriggerWorkflow');", params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function populatewf()
{
  var qry = toolbox.executeQuery("SELECT CASE WHEN metric_value = 't' THEN true "
                                +"  ELSE false END AS usewf "
                                +"  FROM metric "
                                +" WHERE (metric_name='TriggerWorkflow');");
  if(qry.first())
  {
    _workflow.checked = (qry.value("usewf"));
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return false;
  }
}

mywindow.saving.connect(sSave);

QWidget.setTabOrder(mywindow.findChild("_forceLicense"), _workflow);
QWidget.setTabOrder(_workflow, mywindow.findChild("_access"));