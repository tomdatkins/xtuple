/*
 * This file is part of the Quality Package for xTuple ERP, and is
 * Copyright (c) 1999-2016 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */
 
 //debugger;

var _policy    = mywindow.findChild("_numberPolicy"); // XComboBox
var _nextNum   = mywindow.findChild("_nextNum");  // XLineEdit

_policy.append(0, "Manual",                  'M');
_policy.append(1, "Automatic",               'A');
_policy.append(2, "Automatic with Override", 'O');

_nextNum.setValidator(mainwindow.orderVal());

populate();

function populate()
{
  setPolicy();
  setNumber();
}

function setPolicy()
{
  var polQry = toolbox.executeQuery("SELECT fetchMetricText('QTNumberGeneration') AS policy");
  if (polQry.first())
    _policy.code = polQry.value("policy");
}

function setNumber()
{
  var numQry = toolbox.executeQuery("SELECT orderseq_number AS num FROM "
             + " orderseq WHERE orderseq_name = 'QTNumber'");
  if (numQry.first()) 
    _nextNum.text = numQry.value('num');
}

function sSave()
{
  savePol();
  saveNum();
}

function savePol()
{ 
  try
  { 
    var qry = toolbox.executeQuery("SELECT setMetric('QTNumberGeneration'", _policy.code);
             
    if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
  }      
  catch(e) 
  {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

function saveNum()
{ 
  try
  {
    var params = new Object();
    params.nextNum = _nextNum.text;
    var qry = toolbox.executeQuery("SELECT setNextNumber('QTNumber', <? value('nextNum') ?>)", params);
    if (qry.lastError().type != QSqlError.NoError) 
        throw new Error(qry.lastError().text);
  }      
  catch(e) 
  {
    QMessageBox.critical(mywindow, "Critical Error", "A critical error occurred at " + e.lineNumber + ": " + e);
  }
}

_nextNum["textChanged(QString)"].connect(saveNum);
_policy["newID(int)"].connect(savePol);
