var _triggerWorkflow = mywindow.findChild("_triggerWorkflow"); // QCheckBox

_triggerWorkflow.setChecked(metrics.boolean("TriggerWorkflow"));

function sSaveMetric()
{
  metrics.set("TriggerWorkflow", _triggerWorkflow.checked);
}

_triggerWorkflow.clicked.connect(sSaveMetric);

