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
 * Override the default UOMs list screen to include the uom_item_dimension column.
 */

var _uoms   = mywindow.findChild("_uoms");
var sql     = "SELECT uom.*, " +
              "  CASE WHEN (NOT uom_item_weight) THEN '' END AS uom_item_weight_qtdisplayrole, " +
              "  CASE WHEN (NOT uom_item_dimension) THEN '' END AS uom_item_dimension_qtdisplayrole " +
              "FROM uom " +
              "ORDER BY uom_name;";
var uomList = toolbox.executeQuery(sql);

_uoms.addColumn(qsTr("Item Dimension"), -1, Qt.AlignLeft, true, "uom_item_dimension");
_uoms.populate(uomList);
