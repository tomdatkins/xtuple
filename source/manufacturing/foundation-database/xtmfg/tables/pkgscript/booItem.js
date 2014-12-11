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
var _revisionid = -1;

// create a script var for each child of mywindow with an objectname starting _
var _tab             = mywindow.findChild("_tab");
var _materials       = mywindow.findChild("materials");
var _save            = mywindow.findChild("_save");
var _close           = mywindow.findChild("_close");
var _runTime         = mywindow.findChild("_runTime");
var _runTimePer      = mywindow.findChild("_runTimePer");
var _stdopn          = mywindow.findChild("_stdopn");
var _opntype          = mywindow.findChild("_opntype");
var _fixedFont       = mywindow.findChild("_fixedFont");
var _invProdUOMRatio = mywindow.findChild("_invProdUOMRatio");
var _wrkcnt          = mywindow.findChild("_wrkcnt");
var _newImage        = mywindow.findChild("_newImage");
var _editImage       = mywindow.findChild("_editImage");
var _deleteImage     = mywindow.findChild("_deleteImage");
var _item            = mywindow.findChild("_item");
var _dates           = mywindow.findChild("_dates");
var _prodUOM         = mywindow.findChild("_prodUOM");
var _setupReport     = mywindow.findChild("_setupReport");
var _runReport       = mywindow.findChild("_runReport");
var _booimage        = mywindow.findChild("_booimage");
var _pullThrough     = mywindow.findChild("_pullThrough");
var _invRunTime      = mywindow.findChild("_invRunTime");
var _invPerMinute    = mywindow.findChild("_invPerMinute");
var _setupTime       = mywindow.findChild("_setupTime");
var _receiveStock    = mywindow.findChild("_receiveStock");
var _executionDay    = mywindow.findChild("_executionDay");
var _description1    = mywindow.findChild("_description1");
var _description2    = mywindow.findChild("_description2");
var _reportSetup     = mywindow.findChild("_reportSetup");
var _reportRun       = mywindow.findChild("_reportRun");
var _issueComp       = mywindow.findChild("_issueComp");
var _wipLocation     = mywindow.findChild("_wipLocation");
var _toolingReference= mywindow.findChild("_toolingReference");
var _overlap         = mywindow.findChild("_overlap");
var _instructions    = mywindow.findChild("_instructions");
var _invUOM1         = mywindow.findChild("_invUOM1");
var _invUOM2         = mywindow.findChild("_invUOM2");
var _operSeqNum      = mywindow.findChild("_operSeqNum");
var _bomitem         = mywindow.findChild("_bomitem");
var _editMatl        = mywindow.findChild("_editMatl");
var _newMatl         = mywindow.findChild("_newMatl");
var _viewMatl        = mywindow.findChild("_viewMatl");
var _expireMatl      = mywindow.findChild("_expireMatl");
var _attachMatl      = mywindow.findChild("_attachMatl");
var _detachMatl      = mywindow.findChild("_detachMatl");
var _showExpired     = mywindow.findChild("_showExpired");
var _showFuture      = mywindow.findChild("_showFuture");

var costReportTypes = [ "D", "O", "N" ];

with (_booimage)
{
  addColumn(qsTr("Image Name"), 150, Qt.AlignLeft, true, "image_name");
  addColumn(qsTr("Description"), -1, Qt.AlignLeft, true, "descrip");
  addColumn(qsTr("Purpose"),    150, Qt.AlignLeft, true, "purpose");
}

with (_bomitem)
{
  addColumn(qsTr("#"),            40,   Qt.AlignCenter, true, "bomitem_seqnumber");
  addColumn(qsTr("Item Number"),  100,  Qt.AlignLeft,   true, "item_number");
  addColumn(qsTr("Description"),  -1,   Qt.AlignLeft,   true, "item_description");
  addColumn(qsTr("Issue UOM"),    45,   Qt.AlignCenter, true, "issueuom");
  addColumn(qsTr("Issue Method"), 100,  Qt.AlignCenter, true, "issuemethod");
  addColumn(qsTr("Fixd. Qty."),   80,   Qt.AlignRight,  true, "bomitem_qtyfxd" );
  addColumn(qsTr("Qty. Per"),     80,   Qt.AlignRight,  true, "bomitem_qtyper" );
  addColumn(qsTr("Scrap %"),      55,   Qt.AlignRight,  true, "bomitem_scrap" );
  addColumn(qsTr("Effective"),    80,   Qt.AlignCenter, true, "effective");
  addColumn(qsTr("Expires"),      80,   Qt.AlignCenter, true, "expires");
  addColumn(qsTr("Notes"),        100,  Qt.AlignLeft,  false, "bomitem_notes"   );
  addColumn(qsTr("Reference"),    100,  Qt.AlignLeft,  false, "bomitem_ref"   );
}

// Populate Operation Type combo
_opntype.populate("SELECT opntype_id, opntype_descrip FROM xtmfg.opntype");

function set(params)
{
  if("booitem_id" in params)
  {
    _booitemid = params.booitem_id;
    populate();
  }

  if("item_id" in params)
  {
    _item.setId(params.item_id);
    if(_item.itemType() == "J")
    {
      _receiveStock.enabled = false;
      _receiveStock.checked = false;
    }
  }

  if("revision_id" in params)
    _revisionid = params.revision_id;

  if("stdopn_id" in params)
    _stdopn.setId(params.stdopn_id);

  if("mode" in params)
  {
    if (params.mode == "new")
    {
      _mode = "new";
      _stdopn.setFocus();
    }
    else if (params.mode == "edit")
    {
      _mode = "edit";
    }
    else if (params.mode == "view")
    {
      _mode = "view";

      toolbox.coreDisconnect(_booimage, "valid(bool)", _editImage, "setEnabled(bool)");
      toolbox.coreDisconnect(_booimage, "valid(bool)", _deleteImage, "setEnabled(bool)");
      toolbox.coreDisconnect(_bomitem, "valid(bool)", _editMatl, "setEnabled(bool)");
      toolbox.coreDisconnect(_bomitem, "valid(bool)", _expireMatl, "setEnabled(bool)");
      toolbox.coreDisconnect(_bomitem, "valid(bool)", _detachMatl, "setEnabled(bool)");

      _dates.enabled = false;
      _executionDay.enabled = false;
      _description1.enabled = false;
      _description2.enabled = false;
      _setupTime.enabled = false;
      _prodUOM.enabled = false;
      _invProdUOMRatio.enabled = false;
      _runTime.enabled = false;
      _runTimePer.enabled = false;
      _reportSetup.enabled = false;
      _reportRun.enabled = false;
      _issueComp.enabled = false;
      _receiveStock.enabled = false;
      _wrkcnt.enabled = false;
      _wipLocation.enabled = false;
      _toolingReference.enabled = false;
      _setupReport.enabled = false;
      _runReport.enabled = false;
      _stdopn.enabled = false;
      _opntype.enabled = false;
      _overlap.enabled = false;
      _pullThrough.enabled = false;
      _instructions.enabled = false;
      _newImage.enabled = false;
      _newMatl.enabled = false;
      _attachMatl.enabled = false;

      _close.text = qsTr("&Close");
      _save.hide();

      _close.setFocus();
    }
  }

  return mainwindow.NoError;
}

function sSave()
{
  if (_wrkcnt.id() == -1)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Routing Item"),
                       qsTr("You must select a Work Center for this Routing Item before you may save it."));
    _wrkcnt.setFocus();
    return;
  }

  if (_setupReport.currentIndex == -1)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Routing Item"),
                       qsTr("You must select a Setup Cost reporting method for this Routing Item before you may save it."));
    _setupReport.setFocus();
    return;
  }

  if (_runReport.currentIndex == -1)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Routing Item"),
                       qsTr("You must select a Run Cost reporting method for this Routing Item before you may save it."));
    _runReport.setFocus();
    return;
  }

  if (_dates.endDate < _dates.startDate)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Cannot Save Routing Item"),
                       qsTr("The expiration date cannot be earlier than the effective date."));
    _dates.setFocus();
    return;
  }

  if (_receiveStock.checked)
  {
    var params2 = new Object;
    params2.item_id = _item.id();
    var qry2 = toolbox.executeQuery("UPDATE xtmfg.booitem "
                                   +"   SET booitem_rcvinv=FALSE "
                                   +" WHERE(booitem_item_id=<? value('item_id') ?>);", params2);
    if(qry2.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry2.lastError().text);
      return;
    }
  }

  var q_str = "";
  if (_mode == "new")
  {
    var qid = toolbox.executeQuery("SELECT NEXTVAL('xtmfg.booitem_booitem_id_seq') AS _booitem_id;");
    if (qid.first())
      _booitemid = qid.value("_booitem_id");
    else if(qid.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qid.lastError().text);
      return;
    }

    q_str = "INSERT INTO xtmfg.booitem "
           +"( booitem_effective, booitem_expires, booitem_execday,"
           +"  booitem_id, booitem_item_id,"
           +"  booitem_seqnumber,"
           +"  booitem_wrkcnt_id, booitem_stdopn_id, booitem_opntype_id, "
           +"  booitem_descrip1, booitem_descrip2,"
           +"  booitem_toolref,"
           +"  booitem_sutime, booitem_sucosttype, booitem_surpt,"
           +"  booitem_rntime, booitem_rncosttype, booitem_rnrpt,"
           +"  booitem_produom, booitem_invproduomratio,"
           +"  booitem_rnqtyper,"
           +"  booitem_issuecomp, booitem_rcvinv,"
           +"  booitem_pullthrough, booitem_overlap,"
           +"  booitem_configtype, booitem_configid, booitem_configflag,"
           +"  booitem_instruc, booitem_wip_location_id, booitem_rev_id ) "
           +"VALUES "
           +"( <? value('effective') ?>, <? value('expires') ?>, <? value('booitem_execday') ?>,"
           +"  <? value('booitem_id') ?>, <? value('booitem_item_id') ?>,"
           +"  ((SELECT COALESCE(MAX(booitem_seqnumber), 0) FROM xtmfg.booitem WHERE (booitem_item_id=<? value('booitem_item_id') ?>)) + 10),"
           +"  <? value('booitem_wrkcnt_id') ?>, <? value('booitem_stdopn_id') ?>, <? value('booitem_opntype_id') ?>,"
           +"  <? value('booitem_descrip1') ?>, <? value('booitem_descrip2') ?>,"
           +"  <? value('booitem_toolref') ?>,"
           +"  <? value('booitem_sutime') ?>, <? value('booitem_sucosttype') ?>, <? value('booitem_surpt') ?>,"
           +"  <? value('booitem_rntime') ?>, <? value('booitem_rncosttype') ?>, <? value('booitem_rnrpt') ?>,"
           +"  <? value('booitem_produom') ?>, <? value('booitem_invproduomratio') ?>,"
           +"  <? value('booitem_rnqtyper') ?>,"
           +"  <? value('booitem_issuecomp') ?>, <? value('booitem_rcvinv') ?>,"
           +"  <? value('booitem_pullthrough') ?>, <? value('booitem_overlap') ?>,"
           +"  <? value('booitem_configtype') ?>, <? value('booitem_configid') ?>, <? value('booitem_configflag') ?>,"
           +"  <? value('booitem_instruc') ?>, <? value('booitem_wip_location_id') ?>, <? value('booitem_rev_id') ?> );";
  }
  else if (_mode == "edit")
  {
    q_str = "UPDATE xtmfg.booitem "
           +"   SET booitem_effective=<? value('effective') ?>,"
           +"       booitem_expires=<? value('expires') ?>,"
           +"       booitem_execday=<? value('booitem_execday') ?>,"
           +"       booitem_wrkcnt_id=<? value('booitem_wrkcnt_id') ?>,"
           +"       booitem_stdopn_id=<? value('booitem_stdopn_id') ?>,"
           +"       booitem_opntype_id=<? value('booitem_opntype_id') ?>,"
           +"       booitem_descrip1=<? value('booitem_descrip1') ?>,"
           +"       booitem_descrip2=<? value('booitem_descrip2') ?>,"
           +"       booitem_toolref=<? value('booitem_toolref') ?>,"
           +"       booitem_sutime=<? value('booitem_sutime') ?>,"
           +"       booitem_sucosttype=<? value('booitem_sucosttype') ?>,"
           +"       booitem_surpt=<? value('booitem_surpt') ?>,"
           +"       booitem_rntime=<? value('booitem_rntime') ?>,"
           +"       booitem_rncosttype=<? value('booitem_rncosttype') ?>,"
           +"       booitem_rnrpt=<? value('booitem_rnrpt') ?>,"
           +"       booitem_produom=<? value('booitem_produom') ?>,"
           +"       booitem_invproduomratio=<? value('booitem_invproduomratio') ?>,"
           +"       booitem_rnqtyper=<? value('booitem_rnqtyper') ?>,"
           +"       booitem_issuecomp=<? value('booitem_issuecomp') ?>,"
           +"       booitem_rcvinv=<? value('booitem_rcvinv') ?>,"
           +"       booitem_pullthrough=<? value('booitem_pullthrough') ?>,"
           +"       booitem_overlap=<? value('booitem_overlap') ?>,"
           +"       booitem_configtype=<? value('booitem_configtype') ?>,"
           +"       booitem_configid=<? value('booitem_configid') ?>,"
           +"       booitem_configflag=<? value('booitem_configflag') ?>,"
           +"       booitem_instruc=<? value('booitem_instruc') ?>,"
           +"       booitem_wip_location_id=<? value('booitem_wip_location_id') ?>"
           +" WHERE(booitem_id=<? value('booitem_id') ?>);";
  }

  var params = new Object;
  params.booitem_id = _booitemid;
  params.booitem_item_id = _item.id();
  params.effective = _dates.startDate;
  params.expires = _dates.endDate;
  params.booitem_execday = _executionDay.value;
  params.booitem_descrip1 = _description1.text;
  params.booitem_descrip2 = _description2.text;
  params.booitem_produom = _prodUOM.currentText;
  params.booitem_toolref = _toolingReference.text;
  params.booitem_instruc =         _instructions.plainText;
  params.booitem_invproduomratio = _invProdUOMRatio.toDouble();
  params.booitem_sutime = _setupTime.toDouble();
  params.booitem_rntime = _runTime.toDouble();
  params.booitem_sucosttype = costReportTypes[_setupReport.currentIndex];
  params.booitem_rncosttype = costReportTypes[_runReport.currentIndex];
  params.booitem_rnqtyper = _runTimePer.toDouble();
  params.booitem_rnrpt =       _reportRun.checked;
  params.booitem_surpt =       _reportSetup.checked;
  params.booitem_issuecomp =   _issueComp.checked;
  params.booitem_rcvinv =      _receiveStock.checked;
  params.booitem_pullthrough = _pullThrough.checked;
  params.booitem_overlap =     _overlap.checked;
  params.booitem_wrkcnt_id = _wrkcnt.id();
  params.booitem_wip_location_id = _wipLocation.id();
  params.booitem_stdopn_id = _stdopn.id();
  params.booitem_opntype_id = _opntype.id();
  params.booitem_configtype = "N";
  params.booitem_configid = -1;
  params.booitem_configflag = false;
  params.booitem_rev_id = _revisionid;

  var qry = toolbox.executeQuery(q_str, params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }

  mainwindow.sBOOsUpdated(_booitemid, true);
  mydialog.done(_booitemid);
}

function sHandleStdopn(pStdopnid)
{
  if(_stdopn.id() != -1)
  {
    var params = new Object;
    params.stdopn_id = pStdopnid;

    var qry = toolbox.executeQuery( "SELECT *"
                                   +"  FROM xtmfg.stdopn "
                                   +" WHERE(stdopn_id=<? value('stdopn_id') ?>);", params );
    if (qry.first())
    {
      _description1.enabled = false;
      _description2.enabled = false;
      _instructions.enabled = false;

      _description1.text = qry.value("stdopn_descrip1");
      _description2.text = qry.value("stdopn_descrip2");
      _instructions.plainText = qry.value("stdopn_instructions");
      _toolingReference.text = qry.value("stdopn_toolref");
      _wrkcnt.setId(qry.value("stdopn_wrkcnt_id"));
      _opntype.setId(qry.value("stdopn_opntype_id"));
      _opntype.enabled = false;

      if(qry.value("stdopn_stdtimes") == true)
      {
        _setupTime.setDouble(qry.value("stdopn_sutime"));
        _runTime.setDouble(qry.value("stdopn_rntime"));
        _runTimePer.setDouble(qry.value("stdopn_rnqtyper"));
        _prodUOM.text = qry.value("stdopn_produom");
        _invProdUOMRatio.setDouble(qry.value("stdopn_invproduomratio"));

        if(qry.value("stdopn_sucosttype") == "D")
          _setupReport.currentIndex = 0;
        else if(qry.value("stdopn_sucosttype") == "O")
          _setupReport.currentIndex = 1;
        else if(qry.value("stdopn_sucosttype") == "N")
          _setupReport.currentIndex = 2;

        if(qry.value("stdopn_rncosttype") == "D")
          _runReport.currentIndex = 0;
        else if(qry.value("stdopn_rncosttype") == "O")
          _runReport.currentIndex = 1;
        else if(qry.value("stdopn_rncosttype") == "N")
          _runReport.currentIndex = 2;
      }
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }
  else
  {
    _description1.enabled = true;
    _description1.clear();
    _description2.enabled = true;
    _description2.clear();
    _instructions.enabled = true;
    _instructions.clear();
  }
}

function populate()
{
  var params = new Object;
  params.booitem_id = _booitemid;

  var qry = toolbox.executeQuery("SELECT item_config,"
                                +"       booitem_effective, booitem_expires,"
                                +"       booitem_execday, booitem_item_id, booitem_seqnumber,"
                                +"       booitem_wrkcnt_id, booitem_stdopn_id, booitem_opntype_id,"
                                +"       booitem_descrip1, booitem_descrip2, booitem_toolref,"
                                +"       booitem_sutime, booitem_sucosttype, booitem_surpt,"
                                +"       booitem_rntime, booitem_rncosttype, booitem_rnrpt,"
                                +"       booitem_produom, uom_name,"
                                +"       booitem_invproduomratio,"
                                +"       booitem_rnqtyper,"
                                +"       booitem_issuecomp, booitem_rcvinv,"
                                +"       booitem_pullthrough, booitem_overlap,"
                                +"       booitem_configtype, booitem_configid, booitem_configflag,"
                                +"       booitem_instruc, booitem_wip_location_id"
                                +"  FROM xtmfg.booitem, item, uom"
                                +" WHERE((booitem_item_id=item_id)"
                                +"   AND (item_inv_uom_id=uom_id)"
                                +"   AND (booitem_id=<? value('booitem_id') ?>));", params);
  if(qry.first())
  {
    _stdopn.setId(qry.value("booitem_stdopn_id"));
    _opntype.setId(qry.value("booitem_opntype_id"));
    if(_stdopn.id() > 0) 
      _opntype.enabled = false; 

    if(qry.value("booitem_stdopn_id") != -1)
    {
      _description1.enabled = false;
      _description2.enabled = false;
      _instructions.enabled = false;
    }

    _dates.startDate = qry.value("booitem_effective");
    _dates.endDate = qry.value("booitem_expires");
    _executionDay.value = qry.value("booitem_execday");
    _operSeqNum.text = qry.value("booitem_seqnumber");
    _description1.text = qry.value("booitem_descrip1");
    _description2.text = qry.value("booitem_descrip2");
    _toolingReference.text = qry.value("booitem_toolref");
    _setupTime.setDouble(qry.value("booitem_sutime"));
    _prodUOM.text = qry.value("booitem_produom");
    _invUOM1.text = qry.value("uom_name");
    _invUOM2.text = qry.value("uom_name");
    _invProdUOMRatio.setDouble(qry.value("booitem_invproduomratio"));
    _runTime.setDouble(qry.value("booitem_rntime"));
    _runTimePer.setDouble(qry.value("booitem_rnqtyper"));

    _reportSetup.checked = qry.value("booitem_surpt");
    _reportRun.checked = qry.value("booitem_rnrpt");
    _issueComp.checked = qry.value("booitem_issuecomp");
    _receiveStock.checked = qry.value("booitem_rcvinv");
    _overlap.checked = qry.value("booitem_overlap");
    _pullThrough.checked = qry.value("booitem_pullthrough");
    _instructions.plainText = qry.value("booitem_instruc");
    _wrkcnt.setId(qry.value("booitem_wrkcnt_id"));
    _wipLocation.setId(qry.value("booitem_wip_location_id"));

    if(qry.value("booitem_sucosttype") == "D")
      _setupReport.currentIndex = 0;
    else if(qry.value("booitem_sucosttype") == "O")
      _setupReport.currentIndex = 1;
    else if(qry.value("booitem_sucosttype") == "N")
      _setupReport.currentIndex = 2;

    if(qry.value("booitem_rncosttype") == "D")
      _runReport.currentIndex = 0;
    else if(qry.value("booitem_rncosttype") == "O")
      _runReport.currentIndex = 1;
    else if(qry.value("booitem_rncosttype") == "N")
      _runReport.currentIndex = 2;

    _item.setId(qry.value("booitem_item_id"))
    if(_item.itemType() == "J")
    {
      _receiveStock.enabled = false;
      _receiveStock.checked = false;
    }

    sCalculateInvRunTime();
    sFillImageList();
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function sCalculateInvRunTime()
{
  if ((_runTimePer.toDouble() != 0.0) && (_invProdUOMRatio.toDouble() != 0.0))
  {
    _invRunTime.setDouble(_runTime.toDouble() / _runTimePer.toDouble() / _invProdUOMRatio.toDouble());
    _invPerMinute.setDouble(_runTimePer.toDouble() / _runTime.toDouble() * _invProdUOMRatio.toDouble());
  }
  else
  {
    _invRunTime.setDouble(0.0);
    _invPerMinute.setDouble(0.0);
  }
}

function sHandleFont(pFixed)
{
  if(pFixed)
    _instructions.font = mainwindow.fixedFont();
  else
    _instructions.font = mainwindow.systemFont();
}

function sPopulateLocations()
{
  var locid = _wipLocation.id();

  var params = new Object;
  params.wrkcnt_id = _wrkcnt.id();
  params.item_id = _item.id();
  var qry = toolbox.executeDbQuery("booItem", "locations", params);
  _wipLocation.populate(qry, locid);
  if(qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function openBooimage(params)
{
  try {
    var wnd = toolbox.openWindow("booitemImage", 0, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result = wnd.exec();
    if(result != 0)
      sFillImageList();
  } catch(e) {
    print("booList open boo exception @ " + e.lineNumber + ": " + e);
  }
}

function sNewImage()
{
  if(_mode == "new")
  {
    QMessageBox.information(mywindow,
                       qsTr("Must Save Routing Item"),
                       qsTr("You must save the Routing Item before you can add images to it."));
    return;
  }
  var params = new Object;
  params.mode = "new";
  params.booitem_id = _booitemid;

  openBooimage(params);
}

function sEditImage()
{
  var params = new Object;
  params.mode = "edit";
  params.booimage_id = _booimage.id();

  openBooimage(params);
}

function sDeleteImage()
{
  var params = new Object;
  params.booimage_id = _booimage.id();
  var qry = toolbox.executeQuery("DELETE FROM xtmfg.booimage WHERE(booimage_id=<? value('booimage_id') ?>);", params);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }

  sFillImageList();
}

function sFillImageList()
{
  var params = new Object;
  params.inventory = qsTr("Inventory Description");
  params.product = qsTr("Product Description");
  params.engineering = qsTr("Engineering Reference");
  params.misc = qsTr("Miscellaneous");
  params.other = qsTr("Other");
  params.booitem_id = _booitemid;
  var qry = toolbox.executeDbQuery("booItem", "images", params);
  _booimage.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow,
                       qsTr("Database Error"), qry.lastError().text);
    return;
  }
}

function sMatlEdit()
{
  var chldwind = toolbox.openWindow("bomItem", 0, Qt.NonModal, Qt.Dialog);
  var params = new Object();

  params.mode = "edit";
  params.bomitem_id  = _bomitem.id();

  var tmp = toolbox.lastWindow().set(params);
  var accepted = chldwind.exec();
  if (accepted)
    sFillMatlList();
}

function sMatlView()
{
  var chldwind = toolbox.openWindow("bomItem", 0, Qt.NonModal, Qt.Dialog);
  var params = new Object();

  params.mode = "view";
  params.bomitem_id  = _bomitem.id();

  var tmp = toolbox.lastWindow().set(params);
  chldwind.exec();
}

function sMatlNew()
{
  var chldwind = toolbox.openWindow("bomItem", 0, Qt.NonModal, Qt.Dialog);

  var sql = "SELECT booitem_seq_id, "
	+ "getActiveRevId('BOM',<? value('item_id') ?>) AS revision_id "
	+ "FROM xtmfg.booitem "
	+ "WHERE (booitem_id=<? value('booitem_id') ?>);";
  var bparams = new Object();
  bparams.booitem_id=_booitemid;
  bparams.item_id= _item.id();
  var q=toolbox.executeQuery(sql, bparams);
  q.first();

  var params = new Object();
  params.mode = "new";
  params.item_id  = _item.id();
  params.booitem_seq_id = q.value("booitem_seq_id");
  params.revision_id = q.value("revision_id");

  var tmp = toolbox.lastWindow().set(params);
  var accepted = chldwind.exec();
  if (accepted)
    sFillMatlList();
}

function sMatlReplace()
{
  var chldwind = toolbox.openWindow("bomItem", 0, Qt.NonModal, Qt.Dialog);
  var sql = "SELECT getActiveRevId('BOM',<? value('item_id') ?>) AS revision_id;";
  var bparams = new Object();
  bparams.item_id= _item.id();
  var q=toolbox.executeQuery(sql, bparams);
  q.first();

  var params = new Object();
  params.mode = "replace";
  params.bomitem_id  = _bomitem.id();
  params.revision_id = q.value("revision_id");

  var tmp = toolbox.lastWindow().set(params);
  var accepted = chldwind.exec();
  if (accepted)
    sFillMatlList();
}

function sMatlExpire()
{
  var sql = "UPDATE bomitem "
          +  "SET bomitem_expires=CURRENT_DATE "
          +  "WHERE (bomitem_id=<? value('bomitem_id') ?>);";

  var params = new Object();
  params.bomitem_id = _bomitem.id();
  toolbox.executeQuery(sql, params);
  
  mainwindow.sBOMsUpdated(_item.id(), true);
  sFillMatlList();
}

function sMatlAttach()
{
  var chldwind = toolbox.openWindow("bomitems", 0, Qt.NonModal, Qt.Dialog);
  var params = new Object();

  params.mode = "new";
  params.item_id  = _item.id();
  params.booitem_id = _booitemid

  var tmp = toolbox.lastWindow().set(params);
  var bomitemid = chldwind.exec();
  if (!bomitemid)
    return;
  
  var sql = "UPDATE bomitem "
          +  "SET bomitem_booitem_seq_id=booitem_seq_id "
          +  "FROM xtmfg.booitem "
          +  "WHERE ((bomitem_id=<? value('bomitem_id') ?>) "
          +  " AND (booitem_id=<? value('booitem_id') ?>));";

  var params = new Object();
  params.booitem_id = _booitemid;
  params.bomitem_id = bomitemid;
  toolbox.executeQuery(sql, params);
  
  mainwindow.sBOMsUpdated(_item.id(), true);
  sFillMatlList();
}

function sMatlDetach()
{
  var sql = "UPDATE bomitem "
          +  "SET bomitem_booitem_seq_id=-1 "
          +  "WHERE (bomitem_id=<? value('bomitem_id') ?>);";

  var params = new Object();
  params.bomitem_id = _bomitem.id();
  toolbox.executeQuery(sql, params);
  
  mainwindow.sBOMsUpdated(_item.id(), true);
  sFillMatlList();
}

function sPopulateMenu(menu, item, col)
{
  var act1 = menu.addAction(qsTr("View"));
  act1.enabled = (true);
  act1.triggered.connect(sMatlView);
  
  if (_mode == "edit")
  {
    var act2 = menu.addAction(qsTr("Edit"));
    act2.enabled = (true);
    act2.triggered.connect(sMatlEdit);

    var act3 = menu.addAction(qsTr("Expire"));
    act3.enabled = (true);
    act3.triggered.connect(sMatlExpire);

    var act4 = menu.addAction(qsTr("Replace"));
    act4.enabled = (true);
    act4.triggered.connect(sMatlReplace);

    menu.addSeparator();

    var act6 = menu.addAction(qsTr("Detach"));
    act6.enabled = (true);
    act6.triggered.connect(sMatlDetach);
  }
}

function sFillMatlList()
{
  // This block disallowes using the material tab for new records
  // TO DO: Eventually need to do some additional work to allow users to do this
  if (_booitemid == -1) {
    _tab.setTabEnabled(_tab.indexOf(_materials), false);
    return;
  }
  else
    _tab.setTabEnabled(_tab.indexOf(_materials), true);

  var params = new Object();
  params.push = qsTr("Push");
  params.pull = qsTr("Pull");
  params.mixed = qsTr("Mixed");
  params.error = qsTr("Error");
  params.always = qsTr("Always");
  params.never = qsTr("Never");
  params.item_id = _item.id();
  params.booitem_id = _booitemid;
  if (_showExpired.checked)
    params.showExpired = true;
  if (_showFuture.checked)
    params.showFuture = true;

  var qry = toolbox.executeDbQuery("bomItems", "detail", params);
  _bomitem.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                       qry.lastError().text);
    return;
  }
}

_save.clicked.connect(sSave);
_runTime.textChanged.connect(sCalculateInvRunTime);
_runTimePer.textChanged.connect(sCalculateInvRunTime);
_stdopn.newID.connect(sHandleStdopn);
_fixedFont.toggled.connect(sHandleFont);
_invProdUOMRatio.textChanged.connect(sCalculateInvRunTime);
_wrkcnt.newID.connect(sPopulateLocations);
_newImage.clicked.connect(sNewImage);
_editImage.clicked.connect(sEditImage);
_deleteImage.clicked.connect(sDeleteImage);

_item.newId.connect(sFillMatlList);
_editMatl.clicked.connect(sMatlEdit);
_viewMatl.clicked.connect(sMatlView);
_newMatl.clicked.connect(sMatlNew);
_expireMatl.clicked.connect(sMatlExpire);
_attachMatl.clicked.connect(sMatlAttach);
_detachMatl.clicked.connect(sMatlDetach);
_showExpired.toggled.connect(sFillMatlList);
_showFuture.toggled.connect(sFillMatlList);
_bomitem["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu);

_close.clicked.connect(mydialog, "reject");

_item.setReadOnly(true);
_dates.setStartNull(qsTr("Always"), mainwindow.startOfTime(), true);
_dates.setStartCaption(qsTr("Effective"));
_dates.setEndNull(qsTr("Never"), mainwindow.endOfTime(), true);
_dates.setEndCaption(qsTr("Expires"));
_prodUOM.type = XComboBox.UOMs;
_wrkcnt.populate("SELECT wrkcnt_id, wrkcnt_code, wrkcnt_code "
                +"  FROM xtmfg.wrkcnt JOIN site() ON (warehous_id=wrkcnt_warehous_id) "
                +" ORDER BY wrkcnt_code");
_stdopn.populate("SELECT -1, TEXT('None') AS stdopn_number, TEXT('None') AS stdopn_number2 "
                +" UNION "
                +"SELECT stdopn_id, stdopn_number, stdopn_number "
                +"  FROM xtmfg.stdopn"
                +"  LEFT OUTER JOIN xtmfg.wrkcnt ON (wrkcnt_id=stdopn_wrkcnt_id)"
                +"  LEFT OUTER JOIN site() ON (warehous_id=wrkcnt_warehous_id) "
                +" WHERE((stdopn_wrkcnt_id=-1)"
                +"    OR (warehous_id IS NOT NULL)) "
                +" ORDER BY stdopn_number");

_setupReport.currentIndex = -1;
_runReport.currentIndex = -1;

_runTimePer.setValidator(mainwindow.qtyVal());
_invProdUOMRatio.setValidator(mainwindow.ratioVal());
_invRunTime.setPrecision(mainwindow.runTimeVal());
_invPerMinute.setPrecision(mainwindow.runTimeVal());
_setupTime.setValidator(mainwindow.runTimeVal());
_runTime.setValidator(mainwindow.runTimeVal());

sHandleFont(_fixedFont.checked);

// hide the Allow Pull Through option as it doesn't perform any function at this time.
_pullThrough.visible = false;

//mywindow.adjustSize();
