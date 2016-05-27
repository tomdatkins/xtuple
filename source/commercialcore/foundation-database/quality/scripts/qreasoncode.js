debugger;

var _name  = mywindow.findChild("_name");
var _desc  = mywindow.findChild("_desc");
var _save  = mywindow.findChild("_save");
var _close = mywindow.findChild("_close");
var _id = -1;

function set(input)
{
  if("qtrsncode_id" in input) {
    _id = input.qtrsncode_id;
    var params = new Object();
    params.id = _id;
    var qry = toolbox.executeQuery("SELECT qtrsncode_code, qtrsncode_descrip "
            + "FROM xt.qtrsncode WHERE qtrsncode_id = <? value('id') ?>", params);
    if(qry.first()) {
      _name.text = qry.value("qtrsncode_code");
      _desc.text = qry.value("qtrsncode_descrip");
    } else
      QMessageBox.critical(mywindow, "Error", "Could not find Quality Reason Code");
  }
}

function sSave()
{
  if(_name.text == '' || _desc.text == '') {
    QMessageBox.warning(mywindow, "Error", "Please enter a value for Quality Reason Code and Description");
    return;
  }
  
  var params = new Object();
  params.name = _name.text; 
  params.desc = _desc.text;
  if(_id > 0) {
    params.id = _id;
    var qry = toolbox.executeQuery("UPDATE xt.qtrsncode SET "
         + "qtrsncode_code = <? value('name') ?>, "
         + "qtrsncode_descrip = <? value('desc') ?> "
         + "WHERE qtrsncode_id = <? value('id') ?>", params);
    if (qry.lastError().type != QSqlError.NoError) {
          QMessageBox.critical(mywindow,
                        qsTr("Database Error"), qry.lastError().text);
    }
  } 
  else 
  {
    var qry = toolbox.executeQuery("INSERT INTO xt.qtrsncode "
         + "(qtrsncode_code, qtrsncode_descrip) VALUES "
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