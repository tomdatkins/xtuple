var modeVal;

modeVal = mywindow.mode("MaintainWorkflow");
mywindow.insert(qsTr("Workflow"), "Workflow", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);

modeVal = mywindow.mode("MaintainPrinters");
mywindow.insert(qsTr("Printers"), "printers", setup.MasterInformation, Xt.SystemModule, modeVal, modeVal);