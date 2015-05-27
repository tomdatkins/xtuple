/**
 * This file is part of the xDruple for xTuple ERP, and is
 * Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
 * It is licensed to you under the xTuple End-User License Agreement
 * ("the EULA"), the full text of which is available at www.xtuple.com/EULA
 * While the EULA gives you access to source code and encourages your
 * involvement in the development process, this Package is not free software.
 * By using this software, you agree to be bound by the terms of the EULA.
 */

/**
 * Add an Item to an Item Group.
 */

var xDrupleItemGroupsAttach = {};
var _itemgrp                = mywindow.findChild("_itemgrp");
var _buttonBox              = mywindow.findChild("_buttonBox");
var _itemid                 = false;

// Populate the Item Group select list.
function set(params) {
  try {
    if ("item_id" in params) {
      _itemid    = params.item_id;
      var qrystr = "SELECT * " +
                   "FROM itemgrp " +
                   "WHERE true " +
                   "  AND itemgrp_id NOT IN ( " +
                   "    SELECT " +
                   "      itemgrpitem_itemgrp_id " +
                   "    FROM itemgrpitem " +
                   "    WHERE true " +
                   "      AND (itemgrpitem_item_id = <? value('item_id') ?> " +
                   "        AND itemgrpitem_item_type = 'I' " +
                   "      ) " +
                   "  ) " +
                   "ORDER BY itemgrp_name;";
      var qry    = toolbox.executeQuery(qrystr, params);
      _itemgrp.populate(qry);

      if (qry.lastError().type != QSqlError.NoError) {
        QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);
      }
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "itemGroupsAttach",
                         qsTr("set exception: ") + e);
  }
}

// Insert the new Item Group Item association.
xDrupleItemGroupsAttach.attach = function () {
  try {
    var params      = {};
    params.item_id  = _itemid;
    params.group_id = _itemgrp.id();
    var qrystr      = "INSERT INTO itemgrpitem (itemgrpitem_itemgrp_id, itemgrpitem_item_type, itemgrpitem_item_id) " +
                      "VALUES (<? value('group_id') ?>,'I',<? value('item_id') ?>);";
    var qry         = toolbox.executeQuery(qrystr, params);

    if (qry.lastError().type != QSqlError.NoError) {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);

      return;
    }

    mydialog.accept();
  } catch (e) {
    QMessageBox.critical(mywindow, "itemGroupsAttach",
                         qsTr("attach exception: ") + e);
  }
};

_buttonBox.accepted.connect(xDrupleItemGroupsAttach.attach);
_buttonBox.rejected.connect(mywindow, "close");
