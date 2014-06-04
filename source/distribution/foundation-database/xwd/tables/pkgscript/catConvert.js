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

include("storedProcErrorLookup");
include("xwdErrors");

try
{
  var _mfrShortname         = mywindow.findChild("_mfrShortname");
  var _mfrCatnum            = mywindow.findChild("_mfrCatnum");
  var _convertItem          = mywindow.findChild("_convertItem");
  var _convertItemsrc       = mywindow.findChild("_convertItemsrc");
  var _item                 = mywindow.findChild("_item");
  var _dropShip             = mywindow.findChild("_item");

  var _buttonBox  = mywindow.findChild("_buttonBox");

  _buttonBox.accepted.connect(sConvert);
  _buttonBox.rejected.connect(mywindow, "close");

  var _catalogid = -1;
}
catch (e)
{
  QMessageBox.critical(mywindow, "catConvert",
                       "catConvert.js exception: " + e);
}

function set(params)
{
  if ("catalog_id" in params)
  {
    _catalogid = params.catalog_id;
    populate();
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.catalog_id = _catalogid;

    var qry = "SELECT *, COALESCE(catalog_i2_cat_num, catalog_mfr_cat_num) AS cat_num "
            + "FROM xwd.catalog "
            + "WHERE (catalog_id = <? value('catalog_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _mfrShortname.setText(data.value("catalog_mfr_shortname"));
      _mfrCatnum.setText(data.value("cat_num"));
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catConvert",
                         "populate exception: " + e);
  }
}

function sConvert()
{
  try
  {
    if (_convertItemsrc.checked && !_item.isValid())
    {
      QMessageBox.critical(mywindow, qsTr("Cannot Convert"),
                           qsTr("You must select an existing Item"));
      return;
    }

    var answer = QMessageBox.question(mywindow,
                         qsTr("Convert Product Catalog"),
                         qsTr("<p>Are you sure that you want to convert the selected Catalog Item?"),
                         QMessageBox.Yes | QMessageBox.No,
                         QMessageBox.Yes);
    if(answer == QMessageBox.Yes)
    {
      var params = new Object;
      params.catalog_id = _catalogid;
      if (_convertItemsrc.checked)
      {
        params.item_id = _item.id();
        qry = toolbox.executeQuery('SELECT xwd.convertCatalogItemsrc(<? value("catalog_id") ?>, <? value("item_id") ?>) AS result;',
                                   params );
      }
      else
        qry = toolbox.executeQuery('SELECT xwd.convertCatalog(<? value("catalog_id") ?>) AS result;',
                                   params );

      if (qry.first())
      {
        var result = qry.value("result");
        if (result < 0)
        {
          QMessageBox.critical(mywindow, qsTr("Processing Error"),
                               storedProcErrorLookup("convertCatalog", result, xwdErrors));
          return;
        }

        if (_convertItem.checked)
        {
          params.item_id = result;
          params.mode = "edit";
          var wnd = toolbox.openWindow("item", 0, Qt.NonModal, Qt.Window);
          wnd.set(params);
        }

        mywindow.close();
//        mydialog.done(result);
      }
      else if (qry.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
        return;
      }
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catConvert",
                         "sConvert exception: " + e);
  }
}

