var modeVal;

modeVal = mywindow.mode("MaintainQualityPlanTypes");
mywindow.insert(qsTr("Quality Plan Types"), "qplantypes", setup.MasterInformation, Xt.ManufactureModule, modeVal, modeVal);

modeVal = mywindow.mode("MaintainQualitySpecs");
mywindow.insert(qsTr("Quality Release Codes"), "qreleasecodes", setup.MasterInformation, Xt.ManufactureModule, modeVal, modeVal);
mywindow.insert(qsTr("Quality Reason Codes"), "qreasoncodes", setup.MasterInformation, Xt.ManufactureModule, modeVal, modeVal);
mywindow.insert(qsTr("Quality Specification Types"), "qspectypes", setup.MasterInformation, Xt.ManufactureModule, modeVal, modeVal);

mywindow.insert(qsTr("Quality"), "qtconfig", setup.Configure, Xt.ManufactureModule, modeVal, modeVal);
