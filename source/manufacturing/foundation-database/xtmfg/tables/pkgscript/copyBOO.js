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
var _captive = false;

// create a script var for each child of mywindow with an objectname starting _
var _close  = mywindow.findChild("_close");
var _copy   = mywindow.findChild("_copy");
var _source = mywindow.findChild("_source");
var _target = mywindow.findChild("_target");

function set(params)
{
  try {
    _captive = true;

    if("item_id" in params)
    {
      _source.setId(params.item_id);
      _source.enabled = false;
      _target.setFocus();
    }

    return mainwindow.NoError;
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

function sCopy()
{
  var params = new Object;
  params.source_id = _source.id();
  params.target_id = _target.id();

  var qry = toolbox.executeQuery("SELECT booitem_id "
                                +"  FROM xtmfg.booitem "
                                +" WHERE(booitem_item_id=<? value('source_id') ?>);", params);
  if (!qry.first())
  {
    QMessageBox.information(mywindow,
                       qsTr("Empty Routing"),
                       qsTr("The selected source Item does not have any Routing items associated with it."));
  }
  else
  {
    qry = toolbox.executeQuery("SELECT booitem_id "
                              +"  FROM xtmfg.booitem "
                              +" WHERE(booitem_item_id=<? value('target_id') ?>);", params);
    if (qry.first())
    {
      QMessageBox.information(mywindow,
                         qsTr("Existing Routing"),
                         qsTr("<p>The selected target Item already has a Routing associated with it. You must first delete the Routing for the selected target item before attempting copy an existing Routing."));
    }
    else
    {
      qry = toolbox.executeQuery("SELECT xtmfg.copyBOO(<? value('source_id') ?>, <? value('target_id') ?>) AS result;", params);
      if (qry.first() && qry.value("result") < 0)
        QMessageBox.information(mywindow, qsTr("Existing Routing"),
                           qsTr("<p>The selected target Item already has a Routing associated with it. You must first delete the Routing for the selected target item before attempting copy an existing Routing."));
    
      mainwindow.sBOOsUpdated(_target.id(), true);
    }
  }

  if(_captive)
    mydialog.accept();
  else
  {
    _source.setId(-1);
    _target.setId(-1);
    _source.setFocus();
  }
}

function sHandleButtons()
{
  try {
    _copy.enabled = _source.isValid() && _target.isValid();
  } catch(e) {
    print(e.lineNumber + ": " + e);
  }
}

_copy.clicked.connect(sCopy);
_source.valid.connect(sHandleButtons);
_target.valid.connect(sHandleButtons);

_close.clicked.connect(mydialog, "reject");

_source.setType(ItemLineEdit.cGeneralManufactured + ItemLineEdit.cGeneralPurchased + ItemLineEdit.cPlanning + ItemLineEdit.cJob)
_target.setType(ItemLineEdit.cGeneralManufactured + ItemLineEdit.cGeneralPurchased + ItemLineEdit.cPlanning + ItemLineEdit.cJob);

