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

// Variables
var _select = mywindow.findChild("_select");
var _cancel = mywindow.findChild("_cancel");
var _bomitem = mywindow.findChild("_bomitem");
var _showExpired = mywindow.findChild("_showExpired");
var _showFuture = mywindow.findChild("_showFuture");

var _itemid = -1;
var _booitemid = -1;

with (_bomitem)
{
  addColumn("BOM #",        40,   Qt.AlignCenter, true, "bomitem_seqnumber");
  addColumn("BOO #",        40,   Qt.AlignCenter, true, "booitem_seqnumber");
  addColumn("BOO Desc.",    100,  Qt.AlignLeft,   true, "booitem_descrip1");
  addColumn("Item Number",  100,  Qt.AlignLeft,   true, "item_number");
  addColumn("Description",  -1,   Qt.AlignLeft,   true, "item_description");
  addColumn("Issue UOM",    45,   Qt.AlignCenter, true, "issueuom");
  addColumn("Issue Method", 100,  Qt.AlignCenter, true, "issuemethod");
  addColumn("Fixd. Qty.",   80,   Qt.AlignRight,  true, "bomitem_qtyfxd" );
  addColumn("Qty. Per",     80,   Qt.AlignRight,  true, "bomitem_qtyper" );
  addColumn("Scrap %",      55,   Qt.AlignRight,  true, "bomitem_scrap" );
  addColumn("Effective",    80,   Qt.AlignCenter, true, "effective");
  addColumn("Expires",      80,   Qt.AlignCenter, true, "expires");
  addColumn("Notes",        100,  Qt.AlignLeft,  false, "bomitem_notes"   );
  addColumn("Reference",    100,  Qt.AlignLeft,  false, "bomitem_ref"   );
}

function set(params)
{
  if("item_id" in params)
    _itemid = params.item_id;

  if("booitem_id" in params)
    _booitemid = params.booitem_id;

  sFillList();
}

function sFillList()
{
  var sql = "SELECT bomitem_id, item_id, *,"
            +     "       (item_descrip1 || ' ' || item_descrip2) AS item_description,"
            +     "       uom_name AS issueuom,"
            +     "       CASE WHEN (bomitem_issuemethod = 'S') THEN <? value('push') ?>"
            +     "            WHEN (bomitem_issuemethod = 'L') THEN <? value('pull') ?>"
            +     "            WHEN (bomitem_issuemethod = 'M') THEN <? value('mixed') ?>"
            +     "            ELSE <? value('error') ?>"
            +     "       END AS issuemethod, "
            +     "       'qty' AS bomitem_qtyfxd_xtnumericrole, "
            +     "       'qtyper' AS bomitem_qtyper_xtnumericrole,"
            +     "       'percent' AS bomitem_scrap_xtnumericrole,"
            +     "       CASE WHEN (bomitem_effective = startOfTime()) THEN NULL "
            +     "            ELSE bomitem_effective END AS effective,"
            +     "       CASE WHEN (bomitem_expires = endOfTime()) THEN NULL "
            +     "            ELSE bomitem_expires END AS expires,"
            +     "       <? value('always') ?> AS effective_xtnullrole,"
            +     "       <? value('never') ?>  AS expires_xtnullrole,"
            +     "       CASE WHEN (bomitem_expires < CURRENT_DATE) THEN 'expired'"
            +     "            WHEN (bomitem_effective >= CURRENT_DATE) THEN 'future'"
            +     "            WHEN (item_type='M') THEN 'altemphasis'"
            +     "       END AS qtforegroundrole "
            +     "FROM bomitem(<? value('item_id') ?>) "
            +     "  LEFT OUTER JOIN xtmfg.booitem ON (bomitem_booitem_seq_id = booitem_seq_id) "
            +     "AND (bomitem_parent_item_id = booitem_item_id)"
            +     " , item, uom "
            +     "WHERE ((bomitem_item_id=item_id)"
            +     " AND (bomitem_uom_id=uom_id)"
            +     "<? if not exists('showExpired') ?>"
            +     " AND (bomitem_expires > CURRENT_DATE)"
            +     "<? endif ?>"
            +     "<? if not exists('showFuture') ?>"
            +     " AND (bomitem_effective <= CURRENT_DATE)"
            +     "<? endif ?>"
            +     "<? if exists('booitem_id') ?>"
            +     " AND (COALESCE(booitem_id,-1) != <? value('booitem_id') ?>)"
            +     "<? endif ?>"
            +     ") "
            +     "ORDER BY bomitem_seqnumber, bomitem_effective;";

  var params = new Object();
  params.push = qsTr("Push");
  params.pull = qsTr("Pull");
  params.mixed = qsTr("Mixed");
  params.error = qsTr("Error");
  params.always = qsTr("Always");
  params.never = qsTr("Never");
  params.item_id = _itemid;
  if (_booitemid != -1)
    params.booitem_id = _booitemid;
  if (_showExpired.checked)
    params.showExpired = true;
  if (_showFuture.checked)
    params.showFuture = true;
  _bomitem.populate(toolbox.executeQuery(sql, params));
}

function select()
{
  mydialog.done(_bomitem.id());
}

_cancel.clicked.connect(mydialog, "reject");
_select.clicked.connect(select);
_showExpired.clicked.connect(sFillList);
_showFuture.clicked.connect(sFillList);
