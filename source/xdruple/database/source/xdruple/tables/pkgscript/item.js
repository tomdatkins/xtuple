/*
 * Adds an attributes tab to the item master with additional fields there.
 */

// Base vars
var itemAttributes         = {};
var _tab                   = mywindow.findChild("_tab");
var _save                  = mywindow.findChild("_save");
var _attrWidget            = toolbox.loadUi("itemAttributes", mywindow);
var _itemAttributes        = _tab.widget(_tab.insertTab(_tab.count + 1, _attrWidget, qsTr("Attributes")));
var _itemId                = false;

// Product Only
var _prodLength            = mywindow.findChild("_prodLength");
var _prodLengthUnitLit     = mywindow.findChild("_prodLengthUnitLit");
var _prodWidth             = mywindow.findChild("_prodWidth");
var _prodWidthUnitLit      = mywindow.findChild("_prodWidthUnitLit");
var _prodHeight            = mywindow.findChild("_prodHeight");
var _prodHeightUnitLit     = mywindow.findChild("_prodHeightUnitLit");
var _prodWeight            = mywindow.findChild("_prodWeight");
var _prodWeight_new        = mywindow.findChild("_prodWeight_new");
var _prodWeightUnitLit     = mywindow.findChild("_prodWeightUnitLit");
var _prodUOM               = mywindow.findChild("_prodUOM");

// Empty Package
var _packLength            = mywindow.findChild("_packLength");
var _packLengthUnitLit     = mywindow.findChild("_packLengthUnitLit");
var _packWidth             = mywindow.findChild("_packWidth");
var _packWidthUnitLit      = mywindow.findChild("_packWidthUnitLit");
var _packHeight            = mywindow.findChild("_packHeight");
var _packHeightUnitLit     = mywindow.findChild("_packHeightUnitLit");
var _packWeight            = mywindow.findChild("_packWeight");
var _packWeight_new        = mywindow.findChild("_packWeight_new");
var _packWeightUnitLit     = mywindow.findChild("_packWeightUnitLit");
var _packUOM               = mywindow.findChild("_packUOM");

// Bar Code
var _upcCode               = mywindow.findChild("_upcCode");
var _upcCode_new           = mywindow.findChild("_upcCode_new");

// Item Groups
var attrItemGroup          = {};
var _itemGroupsAttach      = mywindow.findChild("_itemGroupsAttach");
var _itemGroupsEdit        = mywindow.findChild("_itemGroupsEdit");
var _itemGroupsDetatch     = mywindow.findChild("_itemGroupsDetatch");
var _itemGroups            = mywindow.findChild("_itemGroups");

_itemAttributes.objectName = "_itemAttributes";
_itemAttributes.setEnabled(false);
_itemGroups.addColumn(qsTr("Group Name"), -1,Qt.AlignLeft, true, "itemgrp_name");
_itemGroups.addColumn(qsTr("Description"), -1,Qt.AlignLeft, true, "itemgrp_descrip");
_itemGroups.addColumn(qsTr("Web Site Catalog Group"), -1,Qt.AlignLeft, true, "catalog_group_child");

// xTupleCommerce
var xTupleCommerce         = {};

//debugger;
//QMessageBox.information(mywindow, "item", "foo");

// Initialize the Attributes tab data.
itemAttributes.initializeAttr = function (params) {
  try {
    _itemId = mywindow.id();

    _itemAttributes.setEnabled(true);

    itemAttributes.initialize();
    attrItemGroup.fillItemGroups();
    xTupleCommerce.xTupleCommInitialize();
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("initializeAttr exception: ") + e);
  }
};

// Save the Attributes tab data.
itemAttributes.saveAttr = function () {
  try {
    if (_itemAttributes.enabled) {
      itemAttributes.save();
      xTupleCommerce.xTupleCommSave();
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("saveAttr exception: ") + e);
  }
};

/*
 * Base Item Attributes features.
 */

// Initialize the base Item Attributes data.
itemAttributes.initialize = function () {
  try {
    // Get the UOM Weight and Dimension values.
    var uomDimQryStr = "SELECT uom_name FROM uom WHERE uom_item_dimension;";
    var uomDimQry = toolbox.executeQuery(uomDimQryStr);

    if (uomDimQry.first()) {
      itemAttributes.uomDimension = uomDimQry.value("uom_name");
    }

    var uomWeightQryStr = "SELECT uom_name FROM uom WHERE uom_item_weight;";
    var uomWeightQry = toolbox.executeQuery(uomWeightQryStr);

    if (uomWeightQry.first()) {
      itemAttributes.uomWeight = uomWeightQry.value("uom_name");
    }

    // Get this item.
    var itemParams = {
      "item_id": _itemId
    };
    var itemQryStr = "SELECT * " +
                     "FROM item " +
                     "WHERE true " +
                     "  AND item_id = <? value('item_id') ?>;";
    var itemQry = toolbox.executeQuery(itemQryStr, itemParams);

    if (itemQry.first()) {
      itemAttributes.item = itemQry;
    }

    itemAttributes.pupulate();
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("initialize exception: ") + e);
  }
};

// Populate the base Item Attributes fields.
itemAttributes.pupulate = function () {
  try {
// TODO: Remove old fields and use the new ones. For now, we just populate the
// text with the old ones and leave them disabled.
    // Set read only value for new/duplicate fields to be moved.
    _prodWeight_new.text = _prodWeight.text;
    _packWeight_new.text = _packWeight.text;
    _upcCode_new.text    = _upcCode.text;

    // Populate Dimension UOM Literals.
    if (itemAttributes.uomDimension) {
      _prodLengthUnitLit.text = itemAttributes.uomDimension;
      _prodWidthUnitLit.text  = itemAttributes.uomDimension;
      _prodHeightUnitLit.text = itemAttributes.uomDimension;
      _packLengthUnitLit.text = itemAttributes.uomDimension;
      _packWidthUnitLit.text  = itemAttributes.uomDimension;
      _packHeightUnitLit.text = itemAttributes.uomDimension;
    } else {
      QMessageBox.information(mywindow, "item", qsTr("No UOM has been designated as the Dimension UOM. Please contact your Administrator: "));
    }

    // Populate Dimensions.
    if (itemAttributes.item) {
      _prodLength.text = itemAttributes.item.value("item_length");
      _prodWidth.text  = itemAttributes.item.value("item_width");
      _prodHeight.text = itemAttributes.item.value("item_height");
      _packLength.text = itemAttributes.item.value("item_pack_length");
      _packWidth.text  = itemAttributes.item.value("item_pack_width");
      _packHeight.text = itemAttributes.item.value("item_pack_height");
    }

    // Populate Weight UOM literal labels.
    if (itemAttributes.uomWeight) {
      _prodWeightUnitLit.text = itemAttributes.uomWeight;
      _packWeightUnitLit.text = itemAttributes.uomWeight;
    } else {
      QMessageBox.information(mywindow, "item", qsTr("No UOM has been designated as the Weight UOM. Please contact your Administrator: "));
    }

    // Populate Physical UOMs.
    if (itemAttributes.item) {
      _prodUOM.type = XComboBox.UOMs;
      _packUOM.type = XComboBox.UOMs;

      // Set the select value to the current uom_id.
      _prodUOM.setId(itemAttributes.item.value("item_phy_uom_id"));
      _packUOM.setId(itemAttributes.item.value("item_pack_phy_uom_id"));

      // Get the selected value when saving.
      //_prodUOM.currentText;
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("pupulate exception: ") + e);
  }
};

// Save the base Item Attributes fields.
itemAttributes.save = function () {
  try {
// TODO: Save the _upcCode_new, _prodWeight_new and _packWeight_new. For now,
// these are read only duplicates of the originals that should be moved.

    if (itemAttributes.item) {
      // Save Dimensions and Physical UOMs.
      var attrParams = {
        "item_length": _prodLength.toDouble(),
        "item_width": _prodWidth.toDouble(),
        "item_height": _prodHeight.toDouble(),
        "item_phy_uom_id": _prodUOM.id(),
        "item_pack_length": _packLength.toDouble(),
        "item_pack_width": _packWidth.toDouble(),
        "item_pack_height": _packHeight.toDouble(),
        "item_pack_phy_uom_id": _packUOM.id(),
        "item_id": _itemId,
      };
      var attrQryStr = "UPDATE item SET " +
                       "  item_length          = <? value('item_length') ?>, " +
                       "  item_width           = <? value('item_width') ?>, " +
                       "  item_height          = <? value('item_height') ?>, " +
                       "  item_phy_uom_id      = <? value('item_phy_uom_id') ?>, " +
                       "  item_pack_length     = <? value('item_pack_length') ?>, " +
                       "  item_pack_width      = <? value('item_pack_width') ?>, " +
                       "  item_pack_height     = <? value('item_pack_height') ?>, " +
                       "  item_pack_phy_uom_id = <? value('item_pack_phy_uom_id') ?> " +
                       "WHERE true " +
                       "  AND item_id = <? value('item_id') ?>;";
      toolbox.executeQuery(attrQryStr, attrParams);
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("pupulate exception: ") + e);
  }
};


/*
 * Item Group features.
 */

// Fill the Item Group list for this item.
attrItemGroup.fillItemGroups = function () {
  try {
    var params     = {};
    params.item_id = mywindow.id();
    var qrystr     = "SELECT " +
                     "  itemgrp_id, " +
                     "  itemgrpitem_id, " +
                     "  itemgrp_name, " +
                     "  itemgrp_descrip, " +
                     "  iscatalogitemgrp(itemgrp_id) AS catalog_group_child " +
                     "FROM itemgrp, itemgrpitem " +
                     "WHERE true " +
                     "  AND itemgrpitem_item_id = <? value('item_id') ?> " +
                     "  AND itemgrpitem_itemgrp_id = itemgrp_id" +
                     "  AND itemgrpitem_item_type = 'I';";
    var qry        = toolbox.executeQuery(qrystr, params);

    if (qry.first()) {
      _itemGroups.populate(qry, true);
    } else {
      _itemGroups.populate(qry, true);
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("fillItemGroups exception: ") + e);
  }
};

// Bring up the item group attach screen.
attrItemGroup.attachItemGroup = function () {
  try {
    var params     = {};
    params.captive = true;
    params.mode    = "attach";
    params.item_id = mywindow.id();
    var newdlg     = toolbox.openWindow("itemGroupsAttach", mywindow, Qt.ApplicationModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    var result     = newdlg.exec();

    if (result > 0) {
      attrItemGroup.fillItemGroups();
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("attachItemGroup exception: ") + e);
  }
};

// Bring up the Item Group edit screen.
attrItemGroup.editItemGroup = function () {
  try {
    var params        = {};
    params.itemgrp_id = _itemGroups.id();
    params.mode       = "edit";
    var newwnd        = toolbox.openWindow("itemGroup");
    toolbox.lastWindow().set(params);

    newwnd.show();

// TODO: Call attrItemGroup.fillItemGroups() when itemGroup is saved.
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("editItemGroup exception: ") + e);
  }
};

// Detach the item group.
attrItemGroup.detatchGroup = function () {
  try {
    var params            = {};
    params.itemgrpitem_id = _itemGroups.altId();
    var qrystr            = "DELETE FROM itemgrpitem " +
                            "WHERE itemgrpitem_id = <? value('itemgrpitem_id') ?>;";
    var qry               = toolbox.executeQuery(qrystr, params);

    if (qry.numRowsAffected() < 1) {
      toolbox.messageBox("information", mywindow,
        "Failed", "There was an error detatching the item from this group.");

      return;
    } else {
      attrItemGroup.fillItemGroups();
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("detatchGroup exception: ") + e);
  }
};

/*
 * xTupleCommerce features.
 */

// Enable itemGroups Edit and Detach buttons.
attrItemGroup.itemGroupsButtons = function (isSelected) {
  _itemGroupsEdit.setEnabled(isSelected);
  _itemGroupsDetatch.setEnabled(isSelected);
};

// Initialize xTupleCommerce data.
xTupleCommerce.xTupleCommInitialize = function () {
  try {
    // Make sure xDruple extension is installed.
    var qrystr = "SELECT * " +
                 "FROM xt.ext " +
                 "WHERE true " +
                 "  AND ext_name = 'xdruple';";
    var qry    = toolbox.executeQuery(qrystr);

    if (qry.first()) {
      // Get any registered sites.
      var qrtSitesStr = "SELECT xd_site_name, xd_site_url FROM xdruple.xd_site;";
      var qrySites = toolbox.executeQuery(qrtSitesStr);

// TODO: Handle more than one site???
      if (qrySites.first()) {
        xTupleCommerce.site = {
          "name": qrySites.value("xd_site_name"),
          "url": qrySites.value("xd_site_url")
        };
      } else {
        QMessageBox.information(mywindow, "item", qsTr("No xTupleCommerce Sites have been setup. Please contact your Administrator."));
      }

      // Check xdruple.xd_commerce_product_data table to see if item is published.
      var prodParams = {
        "item_id": _itemId
      };
      var qrtProdStr = "SELECT item_id " +
                       "FROM xdruple.xd_commerce_product_data " +
                       "WHERE true " +
                       "  AND item_id = <? value('item_id') ?>;";
      var qryProd    = toolbox.executeQuery(qrtProdStr, prodParams);

      if (qryProd.first()) {
        xTupleCommerce.product = qryProd.value("item_id");
      }

      xTupleCommerce.xTupleCommPopulate();
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("xTupleCommInitialize exception: ") + e);
  }
};

// Populate xTupleCommerce data for this item.
xTupleCommerce.xTupleCommPopulate = function () {
  try {
    // Keep xTupleCommerce vars isolated so it will be easier to move the rest to core.
    xTupleCommerce._xtCommGroup   = mywindow.findChild("_xtCommGroup");
    xTupleCommerce._xtCommProdPub = mywindow.findChild("_xtCommProdPub");
    xTupleCommerce._xtCommProdUrl = mywindow.findChild("_xtCommProdUrl");
    xTupleCommerce._itemDbId      = mywindow.findChild("_itemDbId");

    xTupleCommerce._itemDbId.text = _itemId;
    xTupleCommerce._xtCommProdPub.setEnabled(privileges.check("AccessxDrupleExtension"));

    if (xTupleCommerce.product) {
      xTupleCommerce.wasPublished           = true;
      xTupleCommerce._xtCommProdPub.checked = true;

      if (xTupleCommerce.site) {
        xTupleCommerce._xtCommProdUrl.url  = xTupleCommerce.site.url + "/products/" + _itemId;
        xTupleCommerce._xtCommProdUrl.text = "View on " + xTupleCommerce.site.name + " Web site";
        xTupleCommerce._xtCommProdUrl.setEnabled(true);

        // When "View" URL is clicked, open the website.
        xTupleCommerce._xtCommProdUrl["leftClickedURL(QString)"].connect(toolbox.openUrl);
      }
    } else {
      xTupleCommerce.wasPublished = false;
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("xTupleCommPopulate exception: ") + e);
  }
};

// Save xTupleCommerce data for this item.
xTupleCommerce.xTupleCommSave = function () {
  try {
    // Unpublish this item from xDruple.
    if (xTupleCommerce._xtCommProdPub && xTupleCommerce.wasPublished && !xTupleCommerce._xtCommProdPub.checked) {
      var unpubParams = {
        "item_id": _itemId
      };
      var unpubQryStr = "DELETE FROM xdruple.xd_commerce_product_data " +
                        "WHERE true " +
                        "  AND item_id = <? value('item_id') ?>;";
      toolbox.executeQuery(unpubQryStr, unpubParams);
      delete(xTupleCommerce.product);
      delete(xTupleCommerce.site);
      xTupleCommerce.xTupleCommPopulate();
    } else if (xTupleCommerce._xtCommProdPub && !xTupleCommerce.wasPublished && xTupleCommerce._xtCommProdPub.checked) {
      // Publish the item in xDruple.
      var pubParams = {
        "item_id": _itemId
      };
      var pubQryStr = "INSERT INTO xdruple.xd_commerce_product_data (" +
                      "  item_id " +
                      ") VALUES ( " +
                      "  <? value('item_id') ?> " +
                      ");";
      toolbox.executeQuery(pubQryStr, pubParams);
      xTupleCommerce.xTupleCommInitialize();
    }
  } catch (e) {
    QMessageBox.critical(mywindow, "item",
                         qsTr("xTupleCommPopulate exception: ") + e);
  }
};

/*
 * Connections
 */
mywindow["saved(int)"].connect(itemAttributes.saveAttr);
_itemGroupsAttach.clicked.connect(attrItemGroup.attachItemGroup);
_itemGroupsEdit.clicked.connect(attrItemGroup.editItemGroup);
_itemGroupsDetatch.clicked.connect(attrItemGroup.detatchGroup);
_itemGroups.valid.connect(attrItemGroup.itemGroupsButtons);
mywindow.newId.connect(itemAttributes.initializeAttr);
