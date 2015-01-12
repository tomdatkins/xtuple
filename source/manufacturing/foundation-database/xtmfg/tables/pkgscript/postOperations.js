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

//debugger;

var _captive = false;
var _runqtyper = 0.0;
var _invProdUOMRatio = 0.0;
var _usingWotc = false;
var _wrkcntid = -1;
var _wotc_id = -1;
var _wotcTime = 0.0;
var _balance = 0.0;
var _costmethod = "";

// Determine WOTC Basis (Employee or User)
var empl = false;
if (metrics.value("TimeAttendanceMethod") == "Employee")
  empl = true;

// create a script var for each child of mywindow with an objectname starting _
var _post                  = mywindow.findChild("_post");
var _scrap                 = mywindow.findChild("_scrap");
var _close                 = mywindow.findChild("_close");
var _closeWO               = mywindow.findChild("_closeWO");
var _wo                    = mywindow.findChild("_wo");
var _wooper                = mywindow.findChild("_wooper");
var _womatl                = mywindow.findChild("_womatl");
var _postSutime            = mywindow.findChild("_postSutime");
var _postRntime            = mywindow.findChild("_postRntime");
var _postSpecifiedRntime   = mywindow.findChild("_postSpecifiedRntime");
var _qty                   = mywindow.findChild("_qty");
var _qtyOrdered            = mywindow.findChild("_qtyOrdered");
var _qtyReceived           = mywindow.findChild("_qtyReceived");
var _qtyBalance            = mywindow.findChild("_qtyBalance");
var _productionUOM         = mywindow.findChild("_productionUOM");
var _specifiedSutime       = mywindow.findChild("_specifiedSutime");
var _specifiedRntime       = mywindow.findChild("_specifiedRntime");
var _receiveInventory      = mywindow.findChild("_receiveInventory");
var _postStandardSutime    = mywindow.findChild("_postStandardSutime");
var _postStandardRntime    = mywindow.findChild("_postStandardRntime");
var _standardRntime        = mywindow.findChild("_standardRntime");
var _standardSutime        = mywindow.findChild("_standardSutime");
var _more                  = mywindow.findChild("_more");
var _moreTab               = mywindow.findChild("_moreTab");
var _setupUser             = mywindow.findChild("_setupUser");
var _runUser               = mywindow.findChild("_runUser");
var _setupEmp              = mywindow.findChild("_setupEmp");
var _runEmp                = mywindow.findChild("_runEmp");
var _issueComponents       = mywindow.findChild("_issueComponents");
var _inventoryUOM          = mywindow.findChild("_inventoryUOM");
var _markSuComplete        = mywindow.findChild("_markSuComplete");
var _markRnComplete        = mywindow.findChild("_markRnComplete");
var _wrkcnt                = mywindow.findChild("_wrkcnt");
var _sutimeGroup           = mywindow.findChild("_sutimeGroup");
var _postSpecifiedSutime   = mywindow.findChild("_postSpecifiedSutime");
var _rntimeGroup           = mywindow.findChild("_rntimeGroup");
var _transDate             = mywindow.findChild("_transDate");

_womatl.addColumn(qsTr("Item Number"), -1, Qt.AlignLeft,  true, "item_number");
_womatl.addColumn(qsTr("Description"), -1, Qt.AlignLeft,  true, "itemdescrip");
_womatl.addColumn(qsTr("Iss. UOM"),    -1, Qt.AlignLeft,  true, "uom_name");
_womatl.addColumn(qsTr("Qty. per"),    -1, Qt.AlignRight, true, "womatl_qtyper");

// Switch Widgets depending on Employee versus User setup
_setupUser.setVisible(!empl);
_runUser.setVisible(!empl);
_setupEmp.setVisible(empl);
_runEmp.setVisible(empl);

function set(params)
{
  _captive = true;

  if("issueComponents" in params)
    _issueComponents.checked = params.issueComponents;

  if("wo_id" in params)
  {
    _wo.setId(params.wo_id);
    _wo.enabled = false;
    _wooper.setFocus();
    if(_wo.id() != params.wo_id)
      return mainwindow.UndefinedError;
  }

  if("wooper_id" in params)
  {
    var oparams = new Object;
    oparams.wooper_id = params.wooper_id;
    var qry = toolbox.executeQuery("SELECT wooper_wo_id"
                                  +"  FROM xtmfg.wooper"
                                  +" WHERE (wooper_id=<? value('wooper_id') ?>);", oparams);
    if(qry.first())
    {
      _wo.setId(qry.value("wooper_wo_id"));
      _wo.enabled = false;
      _wooper.setId(params.wooper_id);
      _wooper.enabled = false;
      _qty.setFocus();
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    }
  }

  if("wotc_id" in params)
  {
    _wotc_id = params.wotc_id;
    var qry = toolbox.executeQuery("SELECT wotc_wo_id, wotc_wooper_id,"
                                  +"       intervalToMinutes(xtmfg.wotcTime(wotc_id)) AS time,"
                                  +"       wooper_rnrpt"
                                  +"  FROM xtmfg.wotc"
                                  +"    LEFT OUTER JOIN xtmfg.wooper ON (wooper_id=wotc_wooper_id)"
                                  +" WHERE (wotc_id=<? value('wotc_id') ?>);", params);
    if(qry.first())
    {
      _usingWotc = true;
      _wo.setId(qry.value("wotc_wo_id"));
      _wo.enabled = false;
      _wooper.setId(qry.value("wotc_wooper_id"));
      _wooper.enabled = false;
      _wotcTime = qry.value("time");
      if (qry.value("wooper_rnrpt"))
      {
        _specifiedSutime.clear();
        _specifiedRntime.setDouble(_wotcTime);
      }
      else
      {
        _specifiedRntime.clear();
        _specifiedSutime.setDouble(_wotcTime);
      }
      _qty.setFocus();
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    }
  }

  if("usr_id" in params)
  {
    _setupUser.setId(params.usr_id);
    _runUser.setId(params.usr_id);
  }

  if("emp_id" in params)
  {
    _setupEmp.setId(params.emp_id);
    _runEmp.setId(params.emp_id);
  }
	
  if("fromWOTC" in params)
  {
    _scrap.visible = !params.fromWOTC;
    _setupUser.enabled = false;
    _runUser.enabled = false;
    _setupEmp.enabled = false;
    _runEmp.enabled = false;

  }

  return mainwindow.NoError;
}

function sPost()
{
  if (!_transDate.isValid())
  {
    QMessageBox.critical( mywindow, qsTr("Invalid date"),
                          qsTr("You must enter a valid transaction date.") );
    _transDate.setFocus();
    return false;
  }

  if (_wooper.id() == -1)
  {
    QMessageBox.critical( mywindow, qsTr("Select W/O Operation to Post"),
                           qsTr("<p>Please select to W/O Operation to which you wish to post.") );

    _wooper.setFocus();
    return;
  }

  if (_wrkcnt.id() == -1)
  {
    QMessageBox.critical( mywindow, qsTr("Select WorkCenter to Post"),
                           qsTr("<p>Please select a valid Work Center.") );

    _wooper.setFocus();
    return;
  }

  if (_qty.toDouble() == 0.0 &&
      QMessageBox.question(mywindow, qsTr("Zero Quantity To Post"),
                              qsTr("<p>Are you sure that you want to post a "
                                  +"Quantity of Production = 0?"),
                              QMessageBox.Yes | QMessageBox.No,
                              QMessageBox.No) == QMessageBox.No)
  {
    _qty.setFocus();
    return;
  }

  if(_qty.toDouble() > _balance &&
    QMessageBox.warning(mywindow, qsTr("Quantity To Post Greater than Balance"),
        qsTr("<p>The Quantity to post that you have specified is greater than the "
            +"balance remaining for the Quantity to Receive. Are you sure you want to continue?"),
        QMessageBox.Yes | QMessageBox.No, QMessageBox.No) == QMessageBox.No)
  {
    _qty.setFocus();
    return;
  }

  // Double check to make sure work order has not been closed by someone else
  var params = new Object;
  params.wooper_id = _wooper.id();
  var qry = toolbox.executeQuery("SELECT wooper_id"
                            +"  FROM xtmfg.wooper "
                            +"   JOIN wo ON ((wooper_wo_id=wo_id) "
                            +"            AND (wo_status = 'C' )) "
                            +" WHERE (wooper_id=<? value('wooper_id') ?>);", params);
  if(qry.first())
  {
    QMessageBox.critical( mywindow, qsTr("Work Order has been closed"),
                           qsTr("<p>This work order has been closed by another session.") );
    if (_captive)
      mydialog.reject();
    else
    {
      _wo.setId(-1);
      _wo.setFocus();
      return;
    }
  }

  var sutime = _specifiedSutime.toDouble();
  var rntime = _specifiedRntime.toDouble();
  if (_usingWotc && Math.abs(sutime + rntime - _wotcTime) >= 0.016 // 1 sec
   && _postSpecifiedSutime.checked && _postSpecifiedRntime.checked)
  {

    //qDebug(qsTr("setup: %1\trun: %2\ttotal: %3\ttimeclock: %4\tdiff: %5")
    //         .arg(sutime) .arg(rntime) .arg(sutime+rntime) .arg(_wotcTime)
    //         .arg(sutime + rntime - _wotcTime));

    if (privileges.check("OverrideWOTCTime"))
    {
      if (QMessageBox.question(mywindow, qsTr("Work Times Mismatch"),
                            qsTr("<p>The specified setup and run times do not equal "
                                +"the time recorded by users clocking in and out:"
                                +"<br>%1 + %2 <> %3<p>Do you want to change the "
                                +"setup and run times?")
                            .arg(_specifiedSutime.text)
                            .arg(_specifiedRntime.text)
                            .arg(_wotcTime),
                            QMessageBox.Yes | QMessageBox.No,
                            QMessageBox.Yes) == QMessageBox.Yes)
      {
        _specifiedSutime.clear();
        _specifiedRntime.setDouble(_wotcTime);
        _specifiedSutime.setFocus();
        return;
      }
    }
    else
    {
      QMessageBox.warning(mywindow, qsTr("Work Times Mismatch"),
                            qsTr("<p>The specified setup and run times do not equal "
                                +"the time recorded by users clocking in and out:"
                                +"<br>%1 + %2 <> %3<p>Change the "
                                +"setup or run time so they total %4.")
                            .arg(_specifiedSutime.text)
                            .arg(_specifiedRntime.text)
                            .arg(_wotcTime)
                            .arg(_wotcTime));
      _specifiedSutime.clear();
      _specifiedRntime.setDouble(_wotcTime);
      _specifiedSutime.setFocus();
      return;
    }
  }

  var itemsiteid = -1;
  var thisLocid = -1;
  var nextLocid = -1;
  var loccntrl = false;
  var alreadyReceived = false;
  var disallowBlankWIP = false;

  params = new Object;
  params.wo_id = _wo.id();
  qry = toolbox.executeQuery("SELECT itemsite_id, COALESCE(itemsite_loccntrl, FALSE) AS loccntrl,"
                                +"       itemsite_disallowblankwip"
                                +"  FROM itemsite, wo"
                                +" WHERE ((wo_itemsite_id=itemsite_id)"
                                +"   AND  (wo_id=<? value('wo_id') ?>));", params);
  if(qry.first())
  {
    itemsiteid = qry.value("itemsite_id");
    loccntrl = qry.value("loccntrl");
    disallowBlankWIP = qry.value("itemsite_disallowblankwip");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  params = new Object;
  params.wooper_id = _wooper.id();
  qry = toolbox.executeQuery("SELECT wooper_id, wooper_seqnumber,"
                            +"       COALESCE(booitem_overlap, TRUE) AS overlap,"
                            +"       COALESCE( (SELECT p.wooper_rncomplete "
                            +"                    FROM xtmfg.wooper AS p "
                            +"                   WHERE ((p.wooper_wo_id=c.wooper_wo_id)"
                            +"                     AND  (p.wooper_seqnumber < c.wooper_seqnumber)) "
                            +"                   ORDER BY p.wooper_seqnumber DESC "
                            +"                   LIMIT 1), TRUE) AS prevcomplete,"
                            +"       wooper_wip_location_id "
                            +"  FROM xtmfg.wooper AS c LEFT OUTER JOIN xtmfg.booitem"
                            +"    ON (wooper_booitem_id=booitem_id) "
                            +" WHERE (wooper_id=<? value('wooper_id') ?>);", params);
  if(qry.first())
  {
    if(!qry.value("overlap") && !qry.value("prevcomplete"))
    {
      QMessageBox.critical( mywindow, qsTr("Operation May Not Overlap"),
                             qsTr("<p>This Operation is not allowed to overlap "
                                 +"with the preceding Operation. The preceding "
                                 +"Operation must be completed before you may "
                                 +"post Operations for this Operation.") );
      return;
    }

    thisLocid = qry.value("wooper_wip_location_id");
  }
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  if (_markRnComplete.checked)
  {
    params = new Object;
    params.wo_id = _wo.id();
    params.wooper_id = _wooper.id();
    qry = toolbox.executeQuery("SELECT count(*) AS countClockins "
                              +"  FROM xtmfg.wotc "
                              +" WHERE((wotc_timein IS NOT NULL)"
                              +"   AND (wotc_timeout IS NULL)"
                              +"   AND (wotc_wo_id=<? value('wo_id') ?>)"
                              +"   AND (wotc_wooper_id=<? value('wooper_id') ?>));", params);
    if (qry.first() && qry.value("countClockins") > 0)
    {
      QMessageBox.critical(mywindow, qsTr("Users Still Clocked In"),
                            qsTr("<p>This Operation still has %1 user(s) clocked "
                                +"in. Have those users clock out before marking "
                                +"this run as complete. For now, either click "
                                +"Cancel, uncheck Mark Operation as Complete and "
                                +"Post, or set the Quantity to 0 and Post.")
                            .arg(qry.value("countClockins")));
      return;
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }

  // If this is an MLC item we need to do some extra work to determine
  // some information for the WIP transfer functionality and if we should
  // even continue processing.
  if (_qty.toDouble() > 0.0 && loccntrl)
  {
    params = new Object;
    params.wooper_id = _wooper.id();
    // first we need to determine what the next location_id is or the final location_id
    // if this is the last operation.
    qry = toolbox.executeQuery("SELECT b.wooper_wip_location_id AS location_id"
                              +"  FROM xtmfg.wooper AS a, xtmfg.wooper AS b"
                              +" WHERE ((a.wooper_id=<? value('wooper_id') ?>)"
                              +"   AND  (b.wooper_wo_id=a.wooper_wo_id)"
                              +"   AND  (b.wooper_seqnumber > a.wooper_seqnumber))"
                              +" ORDER BY b.wooper_seqnumber"
                              +" LIMIT 1;", params);
    if(qry.first())
      nextLocid = qry.value("location_id");
    else
    {
      // We didn't find a next operation so lets look at the boohead
      qry = toolbox.executeQuery("SELECT boohead_final_location_id AS location_id"
                                +"  FROM wo, xtmfg.wooper, itemsite, xtmfg.boohead"
                                +" WHERE ((boohead_rev_id=wo_boo_rev_id)"
                                +"   AND  (wo_itemsite_id=itemsite_id)"
                                +"   AND  (boohead_item_id=itemsite_item_id)"
                                +"   AND  (wo_id=wooper_wo_id)"
                                +"   AND  (wooper_id=<? value('wooper_id') ?>))"
                                +" LIMIT 1;", params);
      if(qry.first())
        nextLocid = qry.value("location_id");
    }

    // Lets check the Location here and now. If the disallowBlankWIP option
    // is turned on we will have to stop and give an error message
    if(disallowBlankWIP && (nextLocid == -1))
    {
      QMessageBox.critical( mywindow, qsTr("No WIP/Final Location"),
        qsTr("No WIP/Final Location defined for next step. Please contact your System Administrator.") );
      return;
    }

    // If we are receiving inventory or if the next location is not
    // defined then there isn't much else to do here otherwise we
    // need to check if we have already received inventory and if
    // this location is not set then we need to determine the last
    // location that the inventory would have been placed into
    if((!_receiveInventory.checked) && (nextLocid != -1))
    {
      // first lets determine if we have already received inventory.
      // if not the rest is kinda pointless.
      params = new Object;
      params.wooper_id = _wooper.id();
      qry = toolbox.executeQuery("SELECT COALESCE(b.wooper_rcvinv, FALSE) AS result"
                                +"  FROM xtmfg.wooper AS a, xtmfg.wooper AS b"
                                +" WHERE ((a.wooper_id=<? value('wooper_id') ?>)"
                                +"   AND  (b.wooper_wo_id=a.wooper_wo_id)"
                                +"   AND  (b.wooper_rcvinv=true)"
                                +"   AND  (b.wooper_seqnumber < a.wooper_seqnumber))"
                                +" ORDER BY b.wooper_seqnumber DESC"
                                +" LIMIT 1;", params);
      if(qry.first())
        alreadyReceived = qry.value("result");

      if(alreadyReceived)
      {
        if(thisLocid == -1)
        {
          // We need to find the last location that was used so we can
          // determine what location we need to move from.
          params = new Object;
          params.wooper_id = _wooper.id();
          qry = toolbox.executeQuery("SELECT b.wooper_wip_location_id AS location_id"
                                    +"  FROM xtmfg.wooper AS a, xtmfg.wooper AS b"
                                    +" WHERE ((a.wooper_id=<? value('wooper_id') ?>)"
                                    +"   AND  (b.wooper_wo_id=a.wooper_wo_id)"
                                    +"   AND  (b.wooper_wip_location_id <> -1)"
                                    +"   AND  (b.wooper_seqnumber < a.wooper_seqnumber))"
                                    +" ORDER BY b.wooper_seqnumber DESC"
                                    +" LIMIT 1;", params);
          if(qry.first())
            thisLocid = qry.value("location_id");
        }
      }
    }
  }

  var qty = 0.0;
  var suTime = 0.0;
  var rnTime = 0.0;

  if (_productionUOM.checked)
    qty = (_qty.toDouble() / _invProdUOMRatio);
  else
    qty = _qty.toDouble();

  if (_postSutime.checked)
  {
    if (_postStandardSutime.checked)
      suTime = _standardSutime.toDouble();
    else
      suTime = _specifiedSutime.toDouble();
  }
  else
    suTime = 0.0;

  if (_postRntime.checked)
  {
    if (_postStandardRntime.checked)
      rnTime = _standardRntime.toDouble();
    else
      rnTime = _specifiedRntime.toDouble();
  }
  else
    rnTime = 0.0;

  if(_wrkcntid != _wrkcnt.id())
  {
    params = new Object;
    params.wooper_id = _wooper.id();
    params.wrkcnt_id = _wrkcnt.id();
    qry = toolbox.executeQuery("UPDATE xtmfg.wooper"
                              +"   SET wooper_wrkcnt_id=<? value('wrkcnt_id') ?>"
                              +" WHERE(wooper_id=<? value('wooper_id') ?>);", params);
    if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      return;
    }
  }

  // If the value alreadyReceived is set to true then we are going to popup the
  // relocate inventory screen first. This will allow a user to cancel the transaction.
  if(alreadyReceived)
  {
    params = new Object;
    params.itemsite_id = itemsiteid;
    params.qty = qty;
    if(thisLocid != -1)
      params.source_location_id = thisLocid;
    if(nextLocid != -1)
      params.target_location_id = nextLocid;

    var wnd = toolbox.openWindow("relocateInventory", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    if(wnd.exec() == 0)
      return;
  }

  toolbox.executeBegin(); // because of possible lot, serial, or location distribution cancelations
  params = new Object;
  params.wooper_id = _wooper.id();
  params.qty = qty;
  params.issueComponents = _issueComponents.checked;

  if (_costmethod != "J")
  {
     params.receiveInventory = _receiveInventory.checked;
  }

  params.setupComplete = _markSuComplete.checked;
  params.runComplete = _markRnComplete.checked;
  params.setupTime = suTime;
  params.runTime = rnTime;
  if(empl)
  {
    params.setupUser = _setupEmp.number;
    params.runUser = _runEmp.number;
  } else {
    params.setupUser = _setupUser.username();
    params.runUser = _runUser.username();
  }
  params.wotc_id = _wotc_id;
  params.transDate = _transDate.date;
  qry = toolbox.executeQuery("SELECT xtmfg.postOperation( <? value('wooper_id') ?>, <? value('qty') ?>, <? value('issueComponents') ?>, <? value('receiveInventory') ?>,"
                            +"                      <? value('setupUser') ?>, <? value('setupTime') ?>, <? value('setupComplete') ?>, "
                            +"                      <? value('runUser') ?>, <? value('runTime') ?>, <? value('runComplete') ?>, <? value('wotc_id') ?> ,"
                            +"                      <? value('transDate') ?>) AS result;", params);
  if (qry.first())
  {
    var itemlocSeries = qry.value("result");
    if (itemlocSeries < 0)
    {
      toolbox.executeRollback();
      QMessageBox.critical( mywindow, qsTr("Error"),
                          qsTr("A System Error occurred at postOperations, Work Order Operation ID #%2, Error #%3.")
                         .arg(_wooper.id())
                         .arg(itemlocSeries) );
      return;
    }
    else
    {
      if (qty > 0.0)
      {
        if (DistributeInventory.SeriesAdjust(qry.value("result"), mywindow) == 0)
        {
          toolbox.executeRollback();
          QMessageBox.information(mywindow, qsTr("Post Operation"),
                                     qsTr("Transaction Canceled") );
          return;
        }

        toolbox.executeCommit();

        mainwindow.sWorkOrdersUpdated(_wo.id(), true);

        if (_receiveInventory.checked)
        {
        // If this is a child W/O and the originating womatl
        // is auto issue then issue this receipt to the parent W/O
          params = new Object;
          params.itemlocseries = itemlocSeries;
          params.wo_id = _wo.id();
          params.qty = qty;
          qry = toolbox.executeQuery("SELECT issueWoMaterial(womatl_id, <? value('qty') ?>,"
                                    +"       <? value('itemlocseries') ?>, NOW(), invhist_id ) AS result "
                                    +"FROM wo, womatl, invhist "
                                    +"WHERE (wo_id=<? value('wo_id') ?>)"
                                    +"  AND (womatl_id=wo_womatl_id)"
                                    +"  AND (womatl_issuewo)"
                                    +"  AND (invhist_series=<? value('itemlocseries') ?>)"
                                    +"  AND (invhist_transtype='RM');", params );
          if (qry.first())
          {
            if (qry.value("result") < 0)
            {
              QMessageBox.critical( mywindow, qsTr("Error"),
                                    qsTr("A System Error occurred at issueWoMaterial, Work Order Operation ID #%2, Error #%3.")
                                    .arg(_wooper.id())
                                    .arg(qry.value("result")) );
              return;
            }
            else
            {
              qry = toolbox.executeQuery("SELECT postItemLocSeries(<? value('itemlocseries') ?>);", params);
              if (qry.lastError().type != QSqlError.NoError)
              {
                QMessageBox.critical(mywindow,
                                     qsTr("Database Error"), qry.lastError().text);
                return;
              }
            }
          }
          else if (qry.lastError().type != QSqlError.NoError)
          {
            QMessageBox.critical(mywindow,
                                 qsTr("Database Error"), qry.lastError().text);
            return;
          }

        // If this is a W/O for a Job Cost item and the parent is a S/O
        // then issue this receipt to the S/O
          params = new Object;
          params.itemlocseries = itemlocSeries;
          params.wo_id = _wo.id();
          params.qty = qty;
          qry = toolbox.executeQuery("SELECT issueToShipping('SO', coitem_id, <? value('qty') ?>,"
                                    +"       <? value('itemlocseries') ?>, NOW(), invhist_id) AS result "
                                    +"FROM wo, itemsite, coitem, invhist "
                                    +"WHERE (wo_id=<? value('wo_id') ?>)"
                                    +"  AND (wo_ordtype='S')"
                                    +"  AND (itemsite_id=wo_itemsite_id)"
                                    +"  AND (itemsite_costmethod='J')"
                                    +"  AND (coitem_id=wo_ordid)"
                                    +"  AND (invhist_series=<? value('itemlocseries') ?>)"
                                    +"  AND (invhist_transtype='RM');");
          if (qry.first())
          {
            if (qry.value("result") < 0)
            {
              QMessageBox.critical( mywindow, qsTr("Error"),
                                    qsTr("A System Error occurred at issueWoMaterial, Work Order Operation ID #%2, Error #%3.")
                                    .arg(_wooper.id())
                                    .arg(qry.value("result")) );
              return;
            }
            else
            {
              qry = toolbox.executeQuery("SELECT postItemLocSeries(<? value('itemlocseries') ?>);", params);
              if (qry.lastError().type != QSqlError.NoError)
              {
                QMessageBox.critical(mywindow,
                                     qsTr("Database Error"), qry.lastError().text);
                return;
              }
            }
          }
          else if (qry.lastError().type != QSqlError.NoError)
          {
            QMessageBox.critical(mywindow,
                                 qsTr("Database Error"), qry.lastError().text);
            return;
          }

        // If this is a breeder item and we receive inventory at this operation
        // then distribute the production
          params = new Object;
          params.wo_id = _wo.id();
          qry = toolbox.executeQuery("SELECT item_type "
                                    +"  FROM wo, itemsite, item "
                                    +" WHERE((wo_itemsite_id=itemsite_id)"
                                    +"   AND (itemsite_item_id=item_id)"
                                    +"   AND (wo_id=<? value('wo_id') ?>) );", params );
          if (qry.first() && qry.value("item_type") == "B")
          {
            params = new Object;
            params.mode = "new";
            params.wo_id = _wo.id();

            var wnd = toolbox.openWindow("distributeBreederProduction", mywindow, Qt.NonModal, Qt.Dialog);
            toolbox.lastWindow().set(params);
            wnd.exec();
          }
          else if (qry.lastError().type != QSqlError.NoError)
          {
            QMessageBox.critical(mywindow,
                               qsTr("Database Error"), qry.lastError().text);
            return;
          }
        } // receiveInventory
      } // qty to receive
      else
        toolbox.executeCommit();

      if (_closeWO.checked)
      {
        var wnd = toolbox.openWindow("closeWo", mywindow, Qt.NonModal, Qt.Dialog);
        toolbox.lastWindow().set({ wo_id: _wo.id() });
        wnd.setAttribute(55, true); // Qt.WA_DeleteOnClose
        toolbox.lastWindow().setAttribute(55, true);
        wnd.exec();
      }
    } // else postOperation succeeded
  } // postOperation query returned a row
  else
  {
    toolbox.executeRollback();
    QMessageBox.critical(mywindow, qsTr("Error"),
                 qsTr("<p>A System Error occurred posting Work Order Operation ID #%1."
                    + "<br><pre>%2</pre>")
                  .arg(_wooper.id())
                  .arg(qry.lastError().text));
    return;
  }

  if (_scrap.checked)
    sScrap();

  if (_captive)
    mydialog.accept();
  else
  {
    _close.text = qsTr("&Close");

    _wooper.setId(-1);
    _wo.setId(-1);
    _wo.setFocus();
  }
}

function sHandleQty()
{
  var qty = _qty.toDouble();
  _markRnComplete.checked = (qty >= _qtyBalance.toDouble());

  if (_wooper.id() == -1)
  {
    _standardRntime.clear();
    _markRnComplete.checked = false;
    _closeWO.checked = false;
    return;
  }
  else if (_closeWO.enabled)
  {
    if (_productionUOM.checked)
      _standardRntime.setDouble(_rnqtyper * qty);
    else
      _standardRntime.setDouble(_rnqtyper / _invProdUOMRatio * qty);

    _closeWO.checked = false;

    if(qty >= _balance)
    {
      var params = new Object;
      params.wooper_id = _wooper.id();
      var qry = toolbox.executeQuery("SELECT boohead_closewo, wooper_wo_id"
                                    +"  FROM wo, xtmfg.wooper, itemsite, xtmfg.boohead"
                                    +" WHERE ((wo_id=wooper_wo_id)"
                                    +"   AND (wo_itemsite_id=itemsite_id)"
                                    +"   AND (itemsite_item_id=boohead_item_id)"
                                    +"   AND (boohead_rev_id=wo_boo_rev_id)"
                                    +"   AND (wooper_id=<? value('wooper_id') ?>))"
                                    +" LIMIT 1;", params);
      if(qry.first() && qry.value("boohead_closewo"))
      {
        var woid = qry.value("wooper_wo_id");
        params.wo_id = woid;
        qry = toolbox.executeQuery("SELECT wooper_id"
                                  +"  FROM xtmfg.wooper"
                                  +" WHERE((NOT wooper_rncomplete)"
                                  +"   AND (wooper_wo_id=<? value('wo_id') ?>)"
                                  +"   AND (wooper_id != <? value('wooper_id') ?>))"
                                  +" LIMIT 1;", params);
        if(!qry.first())
          _closeWO.checked = true;
      }
    }
  }
}

function sHandleWooperid(pWooperid)
{
  _moreTab.enabled = false;

  if(_wooper.id() != -1)
  {
    var wooperSuConsumed = 0.0;

    var params = new Object;
    params.wooper_id = _wooper.id();
    var qry = toolbox.executeQuery("SELECT wo_qtyord,"
                                  +"       COALESCE(wooper_qtyrcv, 0) AS received,"
                                  +"       noNeg(wo_qtyord - COALESCE(wooper_qtyrcv, 0)) AS balance,"
                                  +"       wooper_issuecomp, wooper_rcvinv, wooper_produom,"
                                  +"       wooper_sucomplete, wooper_rncomplete,"
                                  +"       wooper_sutime, wooper_suconsumed,"
                                  +"       formatTime(noNeg(wooper_sutime - wooper_suconsumed)) AS suremaining,"
                                  +"       wooper_rnqtyper, wooper_invproduomratio, wooper_wrkcnt_id,"
                                  +"       (COALESCE(wooper_qtyrcv,0) = 0) AS noqty, "
                                  +"       item_type "
                                  +"  FROM wo, xtmfg.wooper, itemsite, item "
                                  +" WHERE((wooper_wo_id=wo_id)"
                                  +"   AND (wooper_id=<? value('wooper_id') ?>) "
                                  +"   AND (wo_itemsite_id=itemsite_id) "
                                  +"   AND (itemsite_item_id=item_id) );", params);
    if(qry.first())
    {
      _moreTab.enabled = true;
      _rnqtyper = qry.value("wooper_rnqtyper");
      _invProdUOMRatio = qry.value("wooper_invproduomratio");

      _qtyOrdered.setDouble(qry.value("wo_qtyord"));
      _qtyReceived.setDouble(qry.value("received"));
      _qtyBalance.setDouble(qry.value("balance"));
      _balance = qry.value("balance");
      //setProperty("_balance", _balance);
      if(metrics.boolean("AutoFillPostOperationQty"))
        _qty.setDouble(_balance);
      _productionUOM.text = qsTr("Production UOMs (%1)")
                             .arg(qry.value("wooper_produom"));

      _wrkcntid = qry.value("wooper_wrkcnt_id");
      _wrkcnt.setId(_wrkcntid);
      _wrkcnt.setReadOnly(!qry.value("noqty"));

      wooperSuConsumed = qry.value("wooper_suconsumed");

      if (!qry.value("wooper_sucomplete"))
      {
        _postSutime.enabled = true;
        _postSutime.checked = true;
        _markSuComplete.checked = true;
        _standardSutime.setDouble(qry.value("suremaining"));
      }
      else
      {
        _postSutime.enabled = false;
        _postSutime.checked = false;
        _markSuComplete.checked = false;
        _standardSutime.clear();
        _specifiedSutime.clear();
      }

      _postRntime.enabled = !qry.value("wooper_rncomplete");
      _postRntime.checked = !qry.value("wooper_rncomplete");

      if (_costmethod != "J")
      {
      _receiveInventory.enabled = qry.value("wooper_rcvinv");
      _receiveInventory.checked = qry.value("wooper_rcvinv");
      }

      if (qry.value("wooper_issuecomp"))
      {
        params.wooper_id = _wooper.id();
        wmq = toolbox.executeQuery("SELECT womatl_id, item_number, (item_descrip1 || ' ' || item_descrip2) AS itemdescrip,"
                                  +"       uom_name, womatl_qtyper, 'qtyper' AS womatl_qtyper_xtnumericrole "
                                  +"  FROM womatl, itemsite, item, uom "
                                  +" WHERE((womatl_itemsite_id=itemsite_id)"
                                  +"   AND (womatl_issuemethod IN ('L', 'M'))"
                                  +"   AND (womatl_uom_id=uom_id)"
                                  +"   AND (itemsite_item_id=item_id)"
                                  +"   AND (womatl_wooper_id=<? value('wooper_id') ?>) ) "
                                  +"ORDER BY item_number;", params);
        _womatl.populate(wmq);
        if (wmq.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow,
                             qsTr("Database Error"), wmq.lastError().text);
          return;
        }

        if (wmq.size() > 0)
        {
          _issueComponents.enabled = true;
          _issueComponents.checked = true;
        }
        else
        {
          _issueComponents.enabled = false;
          _issueComponents.checked = false;
        }
      }
      else
      {
        _womatl.clear();
        _issueComponents.enabled = false;
        _issueComponents.checked = false;
      }

      _closeWO.enabled = !((qry.value("item_type").toString() == "J" || !privileges.check("CloseWorkOrders")));
      sHandleQty();
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }

    qry = toolbox.executeQuery("SELECT intervalToMinutes(xtmfg.wooperTime(<? value('wooper_id') ?>)) AS time;", params);
    if(qry.first() && qry.value("time") > 0)
    {
      _usingWotc = true;
      _wotcTime = qry.value("time");
      _specifiedSutime.setDouble(wooperSuConsumed);
      _specifiedRntime.setDouble(qry.value("time") - wooperSuConsumed);
      _postSpecifiedSutime.checked = true;
      _postSpecifiedRntime.checked = true;
    }
    else if (qry.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow,
                         qsTr("Database Error"), qry.lastError().text);
      return;
    }
    else
    {
      _usingWotc = false;
      _wotcTime = 0.0;
      _specifiedSutime.clear();
      _specifiedRntime.clear();
      _postStandardSutime.checked = true;
      _postStandardRntime.checked = true;
    }
  }
  else
  {
    _qtyOrdered.clear();
    _qtyReceived.clear();
    _qtyBalance.clear();
    _productionUOM.text = qsTr("Production UOMs");

    _qty.clear();

    _wrkcntid = -1;
    _wrkcnt.setId(_wrkcntid);
    _wrkcnt.setReadOnly(true);

    if (_costmethod != "J")
    {
       _issueComponents.checked = false;
      _receiveInventory.checked = false;
    }

    _womatl.clear();

    _postSutime.enabled = false;
    _postSutime.checked = false;
    _markSuComplete.checked = false;
    _standardSutime.clear();
    _specifiedSutime.clear();

    _postRntime.enabled = false;
    _postRntime.checked = false;
    _markRnComplete.checked = false;
    _standardRntime.clear();
    _specifiedRntime.clear();
  }
  _wooper.setFocus();
}

function sHandleWoid(pWoid)
{

/*Added by Larry Cartee to prevent Work Orders producing itmes with a cost method of "J
 for job cost from being received into inventory
*/
  if(pWoid != -1)
  {
     qry = toolbox.executeQuery("SELECT itemsite_costmethod FROM itemsite WHERE itemsite_id=(SELECT	                        	   wo_itemsite_id FROM wo WHERE wo_id=" + pWoid + ")");

     if(qry.first())
     {	
        _costmethod = qry.value(0);
     }
     else
     {
        _costmethod=""
     }

     if (_costmethod == "J")
     {
        _receiveInventory.checked=false
        _receiveInventory.enabled=false
     }
  }

  if(pWoid != -1 && _wo.method() == "D")
  {
    QMessageBox.critical(mywindow, mywindow.windowTitle,
                         qsTr("Posting of Operations against disassembly work orders is not supported."));
    if (_captive)
      mydialog.reject();
    _wo.setId(-1);
    _wo.setFocus();
    return;
  }

  var params = new Object;
  params.wo_id = pWoid;

  var qry = toolbox.executeQuery("SELECT wooper_id, (wooper_seqnumber || ' - ' || wooper_descrip1 || ' ' || wooper_descrip2) "
                                +"  FROM xtmfg.wooper "
                                +" WHERE (wooper_wo_id=<? value('wo_id') ?>) "
                                +" ORDER BY wooper_seqnumber;", params);
  _wooper.populate(qry);
  if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

  qry = toolbox.executeQuery("SELECT uom_name "
                            +"  FROM wo, itemsite, item, uom "
                            +" WHERE((wo_itemsite_id=itemsite_id)"
                            +"   AND (itemsite_item_id=item_id)"
                            +"   AND (item_inv_uom_id=uom_id)"
                            +"   AND (wo_id=<? value('wo_id') ?>) );", params);
  if(qry.first())
    _inventoryUOM.text = qsTr("Inventory UOMs (%1)").arg(qry.value("uom_name"));
  else if (qry.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
    return;
  }

}

function sScrap()
{
  var params = new Object;
  params.wo_id = _wo.id();

  if (_costmethod != "J")
  {
    params.allowTopLevel = _receiveInventory.checked;
  }

  try {
    var wnd = toolbox.openWindow("scrapWoMaterialFromWIP", mywindow, 0, 1);
    toolbox.lastWindow().set(params);
    wnd.exec();
  } catch(e) {
    print("postOperations open scrapWoMaterialFromWIP exception @ " + e.lineNumber + ": " + e);
  }
}

function sHandlePostRunTime(pBool)
{
  _rntimeGroup.enabled = _postRntime.checked;
  _specifiedRntime.enabled = (_postRntime.checked &&
                              _postSpecifiedRntime.checked &&
                              privileges.check("OverrideWOTCTime"));
}

function sHandlePostSetupTime(pPostTime)
{
  if (pPostTime)
  {
    _sutimeGroup.enabled = true;
    _specifiedSutime.enabled = _postSpecifiedSutime.checked;
  }
  else
    _sutimeGroup.enabled = false;
}

function sSetupChanged()
{
  if (_wotcTime > 0)
  {
    if (! privileges.check("OverrideWOTCTime") &&
        _specifiedSutime.toDouble() > _wotcTime)
      _specifiedSutime.setDouble(_wotcTime);
    else
    {
      var runtimeDbl = _wotcTime - _specifiedSutime.toDouble();
      _specifiedRntime.setDouble(runtimeDbl > 0 ? runtimeDbl : 0);
    }
  }
}

function sCatchWooperid(pWooperid)
{
  var params = new Object;
  params.wooper_id = pWooperid;
  var qry = toolbox.executeQuery("SELECT wooper_wo_id FROM xtmfg.wooper WHERE (wooper_id=<? value('wooper_id') ?>);", params);
  if(qry.first())
  {
    _wo.setId(qry.value("wooper_wo_id"));
    _wooper.setId(pWooperid);
    _qty.setFocus();
  }
}

function closeEvent()
{
  preferences.set("PostOpsShowAll", _more.checked);
}

_post.clicked.connect(sPost);
_wo.newId.connect(sHandleWoid);
_wooper.newID.connect(sHandleWooperid);
_postSutime.toggled.connect(sHandlePostSetupTime);
_postRntime.toggled.connect(sHandlePostRunTime);
_postSpecifiedRntime.toggled.connect(sHandlePostRunTime);
_qty.textChanged.connect(sHandleQty);
_productionUOM.toggled.connect(sHandleQty);
_specifiedSutime.textChanged.connect(sSetupChanged);

_close.clicked.connect(mydialog, "reject");

_transDate.enabled = privileges.check("AlterTransactionDates");
_transDate.date = mainwindow.dbDate();
InputManager.notify(InputManager.cBCWorkOrder, mywindow, _wo, InputManager.slotName("setId(int)"));
InputManager.notify(InputManager.cBCWorkOrderOperation, mywindow, _wooper, InputManager.slotName("setId(int)"));
InputManager.readWorkOrderOperation.connect(sCatchWooperid);

_wo.type = 14; // cWoExploded(2) | cWoIssued(4) | cWoReleased(8)
_wooper.allowNull = true;

if (_costmethod != "J")
{
_receiveInventory.enabled = privileges.check("ChangeReceiveInventory");
}


_postStandardSutime.enabled = privileges.check("OverrideWOTCTime");
_postStandardRntime.enabled = privileges.check("OverrideWOTCTime");
_specifiedRntime.enabled = privileges.check("OverrideWOTCTime");

_qty.setValidator(mainwindow.qtyVal());
_qtyOrdered.setPrecision(mainwindow.qtyVal());
_qtyReceived.setPrecision(mainwindow.qtyVal());
_qtyBalance.setPrecision(mainwindow.qtyVal());

_standardRntime.setPrecision(mainwindow.runTimeVal());
_standardSutime.setPrecision(mainwindow.runTimeVal());
_specifiedSutime.setValidator(mainwindow.runTimeVal());
_specifiedRntime.setValidator(mainwindow.runTimeVal());

var layout = toolbox.widgetGetLayout(mydialog);
layout.sizeConstraint = QLayout.SetFixedSize;

if(!preferences.boolean("PostOpsShowAll"))
  _more.click();

