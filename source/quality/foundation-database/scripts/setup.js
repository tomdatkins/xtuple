var modeVal;

modeVal = mywindow.mode("MaintainQualitySpecs");

mywindow.insert(qsTr("Quality Release Codes"), "qreleasecodes", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);
mywindow.insert(qsTr("Quality Reason Codes"), "qreasoncodes", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);
mywindow.insert(qsTr("Quality Specification Types"), "qspectypes", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);

// TODO: add a config screen for numbering 
mywindow.insert(qsTr("Quality"), "qtconfig", setup.Configure, Xt.SystemModule, modeVal, modeVal);
