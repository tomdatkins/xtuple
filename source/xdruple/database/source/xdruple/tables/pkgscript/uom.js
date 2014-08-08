/*
 * Override default UOM add/edit form to include new uom_item_dimension flag.
 */

var xDrupleUom     = {};
var _buttonBox     = mywindow.findChild("_buttonBox");
var _name          = mywindow.findChild("_name");
var _description   = mywindow.findChild("_description");
var _weightUom     = mywindow.findChild("_weightUom");
var _mode          = false;
var _uomId         = false;
var _layout        = toolbox.widgetGetLayout(_weightUom);
var _dimensionUom  = toolbox.createWidget("QCheckBox", mywindow, "_dimensionUom");
_dimensionUom.text = "Item dimension unit of measure";

// layout, control, row, column
toolbox.layoutGridAddWidget(_layout, _dimensionUom, 3, 1);

// Initialize.
function set(params) {
  if ("mode" in params) {
    _mode = params.mode;
  }

  if ("uom_id" in params) {
    _uomId = params.uom_id;
  }

  xDrupleUom.populate(params);
}

// Populate the UOM screen.
xDrupleUom.populate = function (params) {
  if (params.mode == "edit") {
    var qrystr = "SELECT * FROM uom WHERE uom_id = <? value('uom_id') ?>;";

    var qry = toolbox.executeQuery(qrystr, params);

    if (qry.lastError().type != QSqlError.NoError) {
      QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);

      return;
    } else {
      if (qry.first()) {
        _name.setText(qry.value("uom_name"));
        _description.setText(qry.value("uom_descrip"));

        if (qry.value("uom_item_weight")) {
          _weightUom.checked = true;
        } else {
          _weightUom.checked = false;
        }

        if (qry.value("uom_item_dimension")) {
          _dimensionUom.checked = true;
        } else {
          _dimensionUom.checked = false;
        }

        params.uom_name           = _name.text;
        params.uom_descrip        = _description.text;
        params.uom_item_weight    = _weightUom.checked;
        params.uom_item_dimension = _dimensionUom.checked;
      }
    }
  }
};

// Insert or Update the UOM.
xDrupleUom.save = function () {
  var params                = {};
  params.uom_id             = _uomId;
  params.uom_name           = _name.text;
  params.uom_descrip        = _description.text;
  params.uom_item_weight    = _weightUom.checked;
  params.uom_item_dimension = _dimensionUom.checked;

  var qrystr = "";

  if (_mode === "new") {
    qrystr = "INSERT INTO uom (uom_name, uom_descrip, uom_item_weight, uom_item_dimension) " +
             "VALUES (<? value('uom_name') ?>, " +
             "        <? value('uom_descrip') ?>, " +
             "        <? value('uom_item_weight') ?>, " +
             "        <? value('uom_item_dimension') ?>);";
  } else {
    qrystr = "UPDATE uom " +
             "SET uom_name           = <? value('uom_name') ?>, " +
             "    uom_descrip        = <? value('uom_descrip') ?>, " +
             "    uom_item_weight    = <? value('uom_item_weight') ?>, " +
             "    uom_item_dimension = <? value('uom_item_dimension') ?> " +
             "WHERE (uom_id = <? value('uom_id') ?>);";
  }

  var qry = toolbox.executeQuery(qrystr, params);

  if (qry.lastError().type != QSqlError.NoError) {
    QMessageBox.critical(mywindow, qsTr("Database Error"), qry.lastError().text);

    return;
  }

  mywindow.accept();
};

toolbox.coreDisconnect(_buttonBox, "accepted()", mywindow, "sSave()");
_buttonBox.accepted.connect(xDrupleUom.save);
