/*
  This file is part of the xtmfg Package for xTuple ERP,
  and is Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;

var _mode = "new";
var _booitemid = -1;
var _booimageid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _save    = mywindow.findChild("_save");
var _close   = mywindow.findChild("_close");
var _new     = mywindow.findChild("_new");
var _image   = mywindow.findChild("_image");
var _purpose = mywindow.findChild("_purpose");

_image.addColumn(qsTr("Name"),       150, Qt.AlignLeft, true, "image_name");
_image.addColumn(qsTr("Description"), -1, Qt.AlignLeft, true, "descrip");

function set(params)
{
  if("booitem_id" in params)
    _booitemid = params.booitem_id;

  if("booimage_id" in params)
  {
    _booimageid = params.booimage_id;
    populate();
  }

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _purpose.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
      _save.setFocus();
      _purpose.enabled = false;
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  var purpose = "M";
  if(_purpose.currentIndex == 0)
    purpose = "I";
  else if(_purpose.currentIndex == 1)
    purpose = "P";
  else if(_purpose.currentIndex == 2)
    purpose = "E";
  else if(_purpose.currentIndex == 3)
    purpose = "M";

  var q_str = "";
  if (_mode == "new")
  {
    _booimageid = -1;
    if(purpose != "M")
    {
      var p = new Object;
      p.booitem_id = _booitemid;
      p.booimage_purpose = purpose;

      var qc = toolbox.executeQuery("SELECT booimage_id "
                                   +"  FROM xtmfg.booimage "
                                   +" WHERE((booimage_booitem_id=<? value('booitem_id') ?>)"
                                   +"   AND (booimage_purpose=<? value('booimage_purpose') ?>) );", p);
      if(qc.first())
      {
        _booimageid = qc.value("booimage_id");
        _mode = "edit";
      }
      else if (qc.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow,
                           qsTr("Database Error"), qc.lastError().text);
        return;
      }
    }

    if(_booimageid == -1)
    {
      var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.booimage_booimage_id_seq') AS _booimage_id;");
      if (qid.first())
        _booimageid = qid.value("_booimage_id");
      else if (qid.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow,
                           qsTr("Database Error"), qid.lastError().text);
        return;
      }

      q_str = "INSERT INTO xtmfg.booimage "
             +"(booimage_id, booimage_booitem_id, booimage_purpose, booimage_image_id) "
             +"VALUES "
             +"(<? value('booimage_id') ?>, <? value('booimage_booitem_id') ?>, <? value('booimage_purpose') ?>, <? value('booimage_image_id') ?>);";
    }
  }
  if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.booimage "
           +"   SET booimage_purpose=<? value('booimage_purpose') ?>,"
           +"       booimage_image_id=<? value('booimage_image_id') ?> "
           +" WHERE (booimage_id=<? value('booimage_id') ?>);";
  }

  var params = new Object;
  params.booimage_id = _booimageid;
  params.booimage_booitem_id = _booitemid;
  params.booimage_image_id = _image.id();
  params.booimage_purpose = purpose;

  var qry = toolbox.executeQuery(q_str, params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }

  mydialog.done(_booimageid);
}

function sNew()
{
  var params = new Object;
  params.mode = "new";

  try {
    var wnd = toolbox.openWindow("image", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    if(wnd.exec() != 0)
      sFillList();
  } catch(e) {
    print("booitemImage open image exception @ " + e.lineNumber + ": " + e);
  }
}

function sFillList()
{
  var params = new Object;
  var qry = toolbox.executeDbQuery("booitemImage", "detail", params);
  _image.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function populate()
{
  var params = new Object;
  params.booimage_id = _booimageid;

  var qry = toolbox.executeQuery("SELECT booimage_purpose, booimage_image_id "
                                +"  FROM xtmfg.booimage "
                                +" WHERE(booimage_id=<? value('booimage_id') ?>);", params);
  if(qry.first())
  {
    var purpose = qry.value("booimage_purpose");
    if(purpose == "I")
      _purpose.currentIndex = 0;
    else if(purpose == "P")
      _purpose.currentIndex = 1;
    else if(purpose == "E")
      _purpose.currentIndex = 2;
    else if(purpose == "M")
      _purpose.currentIndex = 3;

    _image.setId(qry.value("booimage_image_id"));
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_save.clicked.connect(sSave);
_new.clicked.connect(sNew);

_close.clicked.connect(mydialog, "reject");

sFillList();

