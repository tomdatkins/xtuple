/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/

debugger;
try
{
  var _poitem = mywindow.findChild("_poitem");
  var _delete = mywindow.findChild("_delete");

  var _layout  = toolbox.widgetGetLayout(_delete);

  var _moveUp = toolbox.createWidget("QPushButton", mywindow, "_moveUp");
  _moveUp.text = qsTr("Move Up");
  _moveUp.enabled = false;
  _layout.insertWidget(3, _moveUp);

  _moveUp.clicked.connect(sMoveUp);

  var _moveDown = toolbox.createWidget("QPushButton", mywindow, "_moveDown");
  _moveDown.text = qsTr("Move Down");
  _moveDown.enabled = false;
  _layout.insertWidget(4, _moveDown);

  _moveDown.clicked.connect(sMoveDown);

  _poitem.valid.connect(_moveUp, "setEnabled");
  _poitem.valid.connect(_moveDown, "setEnabled");
}
catch (e)
{
  QMessageBox.critical(mywindow, "purchaseOrder",
                       qsTr("purchaseOrder.js exception: ") + e);
}

function sMoveUp()
{
  try
  {
    var params = new Object;
    params.poitem_id = _poitem.id();
    var _poitemid = _poitem.id();

    var qry = "SELECT xwd.movePoitemUp(<? value('poitem_id') ?>) AS result;"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
        return;
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillList();
    _poitem.setId(_poitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("sMoveUp exception: ") + e);
  }
}

function sMoveDown()
{
  try
  {
    var params = new Object;
    params.poitem_id = _poitem.id();
    var _poitemid = _poitem.id();

    var qry = "SELECT xwd.movePoitemDown(<? value('poitem_id') ?>) AS result;"
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
        return;
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
    mywindow.sFillList();
    _poitem.setId(_poitemid);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("sMoveDown exception: ") + e);
  }
}
