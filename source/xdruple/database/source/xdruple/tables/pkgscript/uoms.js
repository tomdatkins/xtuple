/*
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
