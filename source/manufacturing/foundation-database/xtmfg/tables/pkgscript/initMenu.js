/*
  This file is part of the xtattend Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

var tmpaction;

function sDspTimeClockSummary(){
  toolbox.newDisplay("dspTaSummary", 0,
                     Qt.NonModal, Qt.Window);
}

function sTaTimeClock(){
  toolbox.openWindow("taTimeClock", 0, Qt.NonModal, Qt.Window);
}

// Set Up Time Attendance Menu in Accounting
var accntsMenu 	= mainwindow.findChild("menu.accnt");
var reptMenu	= mainwindow.findChild("menu.accnt.financialreports");
var employeeMenu	= mainwindow.findChild("menu.sys.employee");

// Create Time Attendance menu
var timeAttendMenu = new QMenu(qsTr("Attendance Time"),mainwindow);
accntsMenu.insertMenu(reptMenu.menuAction(), timeAttendMenu);
toolbox.menuInsertSeparator(accntsMenu, reptMenu);

// Time Attendance Actions
tmpaction = timeAttendMenu.addAction(qsTr("Attendance Time Clock"), mainwindow);
tmpaction.enabled = privileges.value("taTimeClock");
tmpaction.setData("taTimeClock");
tmpaction.objectName = "ta.taTimeClock";
tmpaction.triggered.connect(sTaTimeClock);
tmpaction.toolTip = qsTr("Attendance Time Clock In/Out");

tmpaction = employeeMenu.addAction(qsTr("Attendance Time Clock"), mainwindow);
tmpaction.enabled = privileges.value("taTimeClock");
tmpaction.setData("taTimeClock");
tmpaction.objectName = "ta.taTimeClock";
tmpaction.triggered.connect(sTaTimeClock);
tmpaction.toolTip = qsTr("Attendance Time Clock In/Out");

tmpaction = timeAttendMenu.addAction(qsTr("Attendance Time Summary..."));
tmpaction.enabled = privileges.value("MaintainTaTimeClock") || privileges.value("ViewTaTimeClock");
tmpaction.setData("MaintainTaTimeClock ViewTaTimeClock");
tmpaction.objectName = "ta.timeClockSummary";
tmpaction.triggered.connect(sDspTimeClockSummary);

tmpaction = employeeMenu.addAction(qsTr("Attendance Time Summary..."));
tmpaction.enabled = privileges.value("MaintainTaTimeClock") || privileges.value("ViewTaTimeClock");
tmpaction.setData("MaintainTaTimeClock ViewTaTimeClock");
tmpaction.objectName = "ta.timeClockSummary";
tmpaction.triggered.connect(sDspTimeClockSummary);

