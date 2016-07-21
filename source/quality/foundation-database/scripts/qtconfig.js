debugger;

var _policy    = mywindow.findChild("_numberPolicy"); // XComboBox
var _nextNum   = mywindow.findChild("_nextNum");  // XLineEdit

_policy.append(0, "Manual");
_policy.append(1, "Automatic");
_policy.append(2, "Automatic with Override");

_nextNum.setValidator(mainwindow.orderVal());

populate();

function populate()
{
  setPolicy();
  setNumber();
}

function setPolicy()
{
  var polQry = toolbox.executeQuery("SELECT "
    + " CASE "
    + "   WHEN metric_value = 'M' THEN 'Manual' "
    + "   WHEN metric_value = 'A' THEN 'Automatic' "
    + "   WHEN metric_value = 'O' THEN 'Automatic with Override' "
    + " END AS policy " 
    + " FROM metric where metric_name = 'QTNumberGeneration'");

  if (polQry.first())
    _policy.text = polQry.value("policy");
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
    var params = new Object();
    params.policy = _policy.text;
    
    var qry = toolbox.executeQuery("UPDATE metric "
             + " SET metric_value = CASE "
             + " WHEN <? value('policy') ?> = 'Manual' THEN 'M' "
             + " WHEN <? value('policy') ?> = 'Automatic' THEN 'A' "
             + " WHEN <? value('policy') ?> = 'Automatic with Override' THEN 'O' "
             + " ELSE <? value('policy') ?> END "
             + " WHERE metric_name = 'QTNumberGeneration'", params);
             
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
  
    var qry = toolbox.executeQuery("UPDATE orderseq "
             + " SET orderseq_number = <? value('nextNum') ?> "
             + " WHERE orderseq_name = 'QTNumber'", params);
             
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
