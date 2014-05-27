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
try
{
  var _itemNumber = mywindow.findChild("_itemNumber");
  var _inventoryUOM = mywindow.findChild("_inventoryUOM");
  var _classcode = mywindow.findChild("_classcode");
  var _itemtype = mywindow.findChild("_itemtype");
}
catch (e)
{
  QMessageBox.critical(mywindow, "item",
                       qsTr("item.js exception: ") + e);
}

function set(params)
{
  try
  {
    if("mode" in params)
    {
      if(params.mode == "new")
      {
        // apply catconfig defaults
        var qry = "SELECT *, CURRENT_TIME::TEXT AS currtime "
                + "FROM xwd.catconfig "
                + "ORDER BY catconfig_provider;";
        var data = toolbox.executeQuery(qry);
        if (data.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"),
                               data.lastError().text);
          return mainwindow.NoError;
        }
        while (data.next())
        {
          if (QMessageBox.question(mywindow, qsTr("Use Catalog Configuration Defaults?"),
                                   qsTr("Use Catalog Configuration Provider %1 as Item defaults?").arg(data.value("catconfig_provider")),
                                   QMessageBox.Yes,
                                   QMessageBox.No | QMessageBox.Default)
                                   == QMessageBox.Yes)
          {
            // first, cause the item row to be created
            _itemNumber.setText("TEMP-" + data.value("currtime"));
            _itemtype.setCurrentIndex(0);
            _inventoryUOM.setId(data.value("catconfig_inv_uom_id"));
            _classcode.setId(data.value("catconfig_classcode_id"));
            _itemNumber.setText("");
            // second, retrieve the item_id and build itemsite
            var params2 = new Object;
            params2.item_number = ("TEMP-" + data.value("currtime"));
            params2.plancode_id = data.value("catconfig_plancode_id");
            params2.costcat_id = data.value("catconfig_costcat_id");
            params2.createsopr = data.value("catconfig_createsopr");
            params2.createsopo = data.value("catconfig_createsopo");
            params2.dropship = data.value("catconfig_dropship");
            params2.controlmethod = data.value("catconfig_controlmethod");
            params2.costmethod = data.value("catconfig_costmethod");
            params2.warehous_id = data.value("catconfig_warehous_id");
            params2.reorderlevel = data.value("catconfig_reorderlevel");
            params2.ordertoqty = data.value("catconfig_ordertoqty");
            params2.cyclecountfreq = data.value("catconfig_cyclecountfreq");
            params2.loccntrl = data.value("catconfig_loccntrl");
            params2.safetystock = data.value("catconfig_safetystock");
            params2.minordqty = data.value("catconfig_minordqty");
            params2.multordqty = data.value("catconfig_multordqty");
            params2.leadtime = data.value("catconfig_leadtime");
            params2.abcclass = data.value("catconfig_abcclass");
            params2.eventfence = data.value("catconfig_eventfence");
            params2.stocked = data.value("catconfig_stocked");
            params2.location_id = data.value("catconfig_location_id");
            params2.useparams = data.value("catconfig_useparams");
            params2.useparamsmanual = data.value("catconfig_useparamsmanual");
            params2.location = data.value("catconfig_location");
            params2.autoabcclass = data.value("catconfig_autoabcclass");
            params2.ordergroup = data.value("catconfig_ordergroup");
            params2.maxordqty = data.value("catconfig_maxordqty");
            params2.ordergroup_first = data.value("catconfig_ordergroup_first");
            params2.planning_type = data.value("catconfig_planning_type");
            params2.recvlocation_id = data.value("catconfig_recvlocation_id");
            params2.issuelocation_id = data.value("catconfig_issuelocation_id");
            params2.location_dist = data.value("catconfig_location_dist");
            params2.recvlocation_dist = data.value("catconfig_recvlocation_dist");
            params2.issuelocation_dist = data.value("catconfig_issuelocation_dist");
            var qry2 = "SELECT item_id FROM item WHERE item_number=<? value('item_number') ?>;";
            var data2 = toolbox.executeQuery(qry2, params2);
            if (data2.first())
            {
              params2.item_id = data2.value("item_id");
              var qry3 = "INSERT INTO itemsite "
                       + "( itemsite_item_id, itemsite_warehous_id, itemsite_qtyonhand,"
                       + "  itemsite_useparams, itemsite_useparamsmanual, itemsite_reorderlevel,"
                       + "  itemsite_ordertoqty, itemsite_minordqty, itemsite_maxordqty, itemsite_multordqty,"
                       + "  itemsite_safetystock, itemsite_cyclecountfreq,"
                       + "  itemsite_leadtime, itemsite_eventfence, itemsite_plancode_id, itemsite_costcat_id,"
                       + "  itemsite_poSupply, itemsite_woSupply, itemsite_createpr, itemsite_createwo,"
                       + "  itemsite_createsopr, itemsite_createsopo,"
                       + "  itemsite_sold, itemsite_soldranking,"
                       + "  itemsite_stocked, itemsite_planning_type, itemsite_supply_itemsite_id,"
                       + "  itemsite_controlmethod, itemsite_perishable, itemsite_active,"
                       + "  itemsite_loccntrl, itemsite_location_id, itemsite_location,"
                       + "  itemsite_recvlocation_id, itemsite_issuelocation_id,"
                       + "  itemsite_location_dist, itemsite_recvlocation_dist, itemsite_issuelocation_dist,"
                       + "  itemsite_location_comments, itemsite_notes,"
                       + "  itemsite_abcclass, itemsite_autoabcclass,"
                       + "  itemsite_freeze, itemsite_datelastused, itemsite_ordergroup, itemsite_ordergroup_first,"
                       + "  itemsite_mps_timefence,"
                       + "  itemsite_disallowblankwip,"
                       + "  itemsite_costmethod, itemsite_value, itemsite_cosdefault,"
                       + "  itemsite_warrpurc, itemsite_autoreg, itemsite_lsseq_id) "
                       + "SELECT "
                       + "  <? value('item_id') ?>, warehous_id, 0.0,"
                       + "  <? value('useparams') ?>, <? value('useparamsmanual') ?>, <? value('reorderlevel') ?>,"
                       + "  <? value('ordertoqty') ?>, <? value('minordqty') ?>, <? value('maxordqty') ?>, <? value('multordqty') ?>,"
                       + "  <? value('safetystock') ?>, <? value('cyclecountfreq') ?>,"
                       + "  <? value('leadtime') ?>, <? value('eventfence') ?>, <? value('plancode_id') ?>, <? value('costcat_id') ?>,"
                       + "  TRUE, FALSE, FALSE, FALSE,"
                       + "  <? value('createsopr') ?>, <? value('createsopo') ?>,"
                       + "  TRUE, 1,"
                       + "  <? value('stocked') ?>, <? value('planning_type') ?>, NULL,"
                       + "  <? value('controlmethod') ?>, FALSE, TRUE,"
                       + "  <? value('loccntrl') ?>, <? value('location_id') ?>, <? value('location') ?>,"
                       + "  <? value('recvlocation_id') ?>, <? value('issuelocation_id') ?>,"
                       + "  <? value('location_dist') ?>, <? value('recvlocation_dist') ?>, <? value('issuelocation_dist') ?>,"
                       + "  '', '',"
                       + "  <? value('abcclass') ?>, <? value('autoabcclass') ?>,"
                       + "  FALSE, startOfTime(), <? value('ordergroup') ?>, <? value('ordergroup_first') ?>,"
                       + "  0,"
                       + "  FALSE,"
                       + "  <? value('costmethod') ?>, 0, NULL,"
                       + "  FALSE, FALSE, NULL "
                       + "FROM whsinfo "
                       + "WHERE ( (<? value('warehous_id') ?> = -1) OR (<? value('warehous_id') ?> = warehous_id) );";
              var data3 = toolbox.executeQuery(qry3, params2);
              if (data3.lastError().type != QSqlError.NoError)
              {
                QMessageBox.critical(mywindow, qsTr("Database Error"),
                                     data3.lastError().text);
              }
              if (metrics.value("Application") == "Standard")
              {
                var qry4 = "UPDATE itemsite SET itemsite_dropship=<? value('dropship') ?> "
                         + "WHERE itemsite_item_id=<? value('item_id') ?>;";
                var data4 = toolbox.executeQuery(qry4, params2);
                if (data4.lastError().type != QSqlError.NoError)
                {
                  QMessageBox.critical(mywindow, qsTr("Database Error"),
                                       data4.lastError().text);
                }
              }
              mywindow.sFillListItemSites();
              if (data.value("catconfig_taxtype_id") > 0)
              {
                // build itemtax
                params2.taxtype_id = data.value("catconfig_taxtype_id");
                if (data.value("catconfig_taxzone_id") > 0)
                  params2.taxzone_id = data.value("catconfig_taxzone_id");
                var qry5 = "INSERT INTO itemtax "
                         + "( itemtax_item_id, itemtax_taxtype_id, itemtax_taxzone_id ) "
                         + "VALUES "
                         + "( <? value('item_id') ?>, <? value('taxtype_id') ?>, <? value('taxzone_id') ?> );";
                var data5 = toolbox.executeQuery(qry5, params2);
                if (data5.lastError().type != QSqlError.NoError)
                {
                  QMessageBox.critical(mywindow, qsTr("Database Error"),
                                       data5.lastError().text);
                }
                mywindow.sFillListItemtax();
              }
            }
            else if (data2.lastError().type != QSqlError.NoError)
            {
              QMessageBox.critical(mywindow, qsTr("Database Error"),
                                   data2.lastError().text);
            }
            break;
          }
        }
      }
    }
    return mainwindow.NoError;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         qsTr("set exception: ") + e);
  }
}
