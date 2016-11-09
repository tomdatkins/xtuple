debugger;

var _name  = mywindow.findChild("_name");
var _desc  = mywindow.findChild("_desc");
var _save  = mywindow.findChild("_save");
var _close = mywindow.findChild("_close");
var _id = -1;

function set(input)
{
  if("printer_id" in input) {
    _id = input.printer_id;
    var params = new Object();
    params.id = _id;
    var qry = toolbox.executeQuery("SELECT printer_name, printer_description "
            + "FROM xt.printer WHERE printer_id = <? value('id') ?>", params);
    if(qry.first()) {
      _name.text = qry.value("printer_name");
      _desc.text = qry.value("printer_description");
    } else
      QMessageBox.critical(mywindow, "Error", "Could not find printer");
  }
}

function sSave()
{
  if(_name.text.trim() == '') {
    QMessageBox.warning(mywindow, "Error", "Please enter a Printer Name.");
    return;
  }
  
  var params = new Object();
  params.name = _name.text.trim(); 
  params.desc = _desc.text;
  if(_id > 0) {
    params.id = _id;
    var qry = toolbox.executeQuery("UPDATE xt.printer SET "
         + "printer_name = <? value('name') ?>, "
         + "printer_description = <? value('desc') ?> "
         + "WHERE printer_id = <? value('id') ?>", params);
    if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
    }
  } 
  else 
  {
    var qry = toolbox.executeQuery("INSERT INTO xt.printer "
         + "(printer_name, printer_description) VALUES "
         + "(<? value('name') ?>, <? value('desc') ?>)", params);
    if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
    }
  } 
  mywindow.close();
}
    
_close.clicked.connect(mywindow.close);
_save.clicked.connect(sSave);