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
// debugger;

var _changeQty  = mywindow.findChild("_changeQty");
var _close      = mywindow.findChild("_close");
var _distrib    = mywindow.findChild("_distrib");
var _distribute = mywindow.findChild("_distribute");
var _item       = mywindow.findChild("_item");
var _transDate  = mywindow.findChild("_transDate");

var _woid = -1;

_distrib.addColumn(qsTr("Item Number"),XTreeWidget.itemColumn, Qt.AlignLeft, true, "item_number");
_distrib.addColumn(qsTr("Description 1"),                  -1, Qt.AlignLeft, true, "item_descrip1");
_distrib.addColumn(qsTr("Description 2"),                  -1, Qt.AlignLeft, true, "item_descrip2");
_distrib.addColumn(qsTr("Qty. Per."),   XTreeWidget.qtyColumn, Qt.AlignRight,true, "qtyper");
_distrib.addColumn(qsTr("Qty."),        XTreeWidget.qtyColumn, Qt.AlignRight,true, "brddist_qty");

function set(pParams)
{
  if ("wo_id" in pParams)
  {
    var qry = toolbox.executeQuery("SELECT wo_itemsite_id "
                                 + "FROM wo "
                                 + 'WHERE (wo_id=<? value("wo_id") ?>);',
                                 pParams);
    if (qry.first())
    {
      _item.setItemsiteid(qry.value("wo_itemsite_id"));
      _woid = pParams.wo_id;
      _item.setReadOnly(true);
  
      sFillList();
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           qry.lastError().text);
      return mainwindow.UndefinedError;
    }
  }

  if ("mode" in pParams)
  {
    if (pParams.mode == "new")
      _distrib.setFocus();
  }
  
  if ("transDate" in pParams)
    _transDate.date = pParams.transDate;

  return mainwindow.NoError;
}

/* NOTE: sDistribute must be called within a transaction and
   that transaction needs to be wrapped in a try/catch wit
   a rollback in the catch block
*/
function sDistribute()
{
  try
  {
    var params = new Object;
    params.wo_id = _woid;
    params.transDate = _transDate.date

    var qry = toolbox.executeQuery('SELECT xtmfg.distributeBreederProduction(<? value("wo_id") ?>,<? value("transDate") ?>) AS result;',
                                   params);
    if (qry.first())
    {
      if (DistributeInventory.SeriesAdjust(qry.value("result"),
                                           mywindow) == QDialog.Rejected)
        throw new Error(qsTr("Transaction Canceled") );
    }
    else if (qry.lastError().type != QSqlError.NoError)
      throw new Error(qry.lastError().text);
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, qsTr("Processing Error"), e.message);
    return;
  }

  mydialog.accept();
}

function sChangeQty()
{
  var params = new Object;
  params.brddist_id = _distrib.id();

  var newdlg = toolbox.openWindow("changeQtyToDistributeFromBreeder", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  var tmp = toolbox.lastWindow();
  tmp.set(params);
  
  if (newdlg.exec() != QDialog.Rejected)
    sFillList();
}

function sFillList()
{
  var params = new Object;
  params.wo_id = _woid;

  var qry = toolbox.executeQuery("SELECT brddist_id, item_number,"
                      + "       item_descrip1, item_descrip2, brddist_qty,"
                      + "       (brddist_qty / brddist_wo_qty) AS qtyper,"
                      + "       'qtyper' AS qtyper_xtnumericrole,"
                      + "       'qty' AS brddist_qty_xtnumericrole "
                      + "FROM xtmfg.brddist"
                      + "   JOIN itemsite ON (brddist_itemsite_id=itemsite_id)"
                      + "   JOIN item ON (itemsite_item_id=item_id)"
                      + "WHERE ((NOT brddist_posted)"
                      + '   AND (brddist_wo_id=<? value("wo_id") ?>) );',
                      params);
  _distrib.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

_changeQty["clicked()"].connect(sChangeQty);
_distribute["clicked()"].connect(sDistribute);
_transDate.enabled = privileges.check("AlterTransactionDates");
_transDate.date = mainwindow.dbDate();
