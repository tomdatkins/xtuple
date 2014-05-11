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

var _actualQtyPer           = mywindow.findChild("_actualQtyPer");
var _actualQtyToDistribute  = mywindow.findChild("_actualQtyToDistribute");
var _openWoQty              = mywindow.findChild("_openWoQty");
var _save                   = mywindow.findChild("_save");
var _standardQtyPer         = mywindow.findChild("_standardQtyPer");
var _standardQtyToDistribute= mywindow.findChild("_standardQtyToDistribute");

var _brddistid       = -1;
var _cachedOpenWoQty = 0;

_actualQtyPer.setPrecision(mainwindow.qtyPerVal());
_openWoQty.setPrecision(mainwindow.qtyVal());
_standardQtyPer.setPrecision(mainwindow.qtyPerVal());
_standardQtyToDistribute.setPrecision(mainwindow.qtyVal());
_actualQtyToDistribute.setValidator(mainwindow.qtyVal());

function set(pParams)
{
  if ("brddist_id" in pParams)
  {
    _brddistid = pParams.brddist_id;

    var brddist = toolbox.executeQuery(
                     "SELECT brddist_wo_qty, brddist_wo_qty,"
                   + "       brddist_stdqtyper,"
                   + "       brddist_stdqtyper * brddist_wo_qty AS stdqty,"
                   + "       (brddist_qty / brddist_wo_qty) AS actqtyper,"
                   + "       brddist_qty "
                   + "FROM xtmfg.brddist "
                   + 'WHERE (brddist_id=<? value("brddist_id") ?>);',
                     pParams);
    if (brddist.first())
    {
      _cachedOpenWoQty = brddist.value("brddist_qty");
      _openWoQty.setDouble(brddist.value("brddist_wo_qty"));
      _standardQtyPer.setDouble(brddist.value("brddist_stdqtyper"));
      _standardQtyToDistribute.setDouble(brddist.value("stdqty"));
      _actualQtyPer.setDouble(brddist.value("actqtyper"));
      _actualQtyToDistribute.setDouble(brddist.value("brddist_qty"));
    }
    else if (brddist.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           brddist.lastError().text);
      return mainwindow.UndefinedError;
    }
  }

  return mainwindow.NoError;
}

function sUpdateQtyPer()
{
  _actualQtyPer.setDouble(_actualQtyToDistribute.toDouble() / _cachedOpenWoQty);
}

function sSave()
{
  var qty = _actualQtyToDistribute.toDouble();

  if (! _actualQtyToDistribute.isValid())
  {
    QMessageBox.warning(mywindow, qsTr("Invalid Quantity"),
                        qsTr("Please fix the Actual Qty. to Distribute."));
    _actualQtyToDistribute.setFocus();
    return;
  }

  var params = new Object;
  params.brddist_id = _brddistid;
  params.qty        = _actualQtyToDistribute.toDouble();
  var changeQty = toolbox.executeQuery(
                             "UPDATE xtmfg.brddist "
                           + 'SET brddist_qty=<? value("qty") ?> '
                           + 'WHERE (brddist_id=<? value("brddist_id") ?>);',
                           params);
  if (changeQty.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                         changeQty.lastError().text);
    return;
  }

  mydialog.accept();
}

_actualQtyToDistribute["editingFinished()"].connect(sUpdateQtyPer);
_save["clicked()"].connect(sSave);
