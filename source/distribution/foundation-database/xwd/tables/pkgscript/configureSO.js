_layout = toolbox.widgetGetLayout(mywindow.findChild("_lineItemsSO"));

// Inside Rep settings
var _useInsideRep = toolbox.createWidget("QCheckBox", mywindow, "_useInsideRep");
_useInsideRep.text = qsTr("Use Inside Sales Rep");

_layout.addWidget(_useInsideRep, 5,0,2);

function sSave() {
  metrics.set("UseInsideRep", _useInsideRep.checked);
}

mywindow.saving.connect(sSave);

if(metrics.value("UseInsideRep") == "t")
  _useInsideRep.checked = true;