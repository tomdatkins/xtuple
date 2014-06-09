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
include("ParameterGroupUtils");

try
{
  var _mode = "new";
  var _catconfigid = -1;

  var _provider             = mywindow.findChild("_provider");
  var _providerdescrip      = mywindow.findChild("_providerdescrip");
  var _classcode            = mywindow.findChild("_classcode");
  var _inventoryUOM         = mywindow.findChild("_inventoryUOM");
  var _warehouse            = mywindow.findChild("_warehouse");
  var _costMethod           = mywindow.findChild("_costMethod");
  var _controlMethod        = mywindow.findChild("_controlMethod");
  var _plannerCode          = mywindow.findChild("_plannerCode");
  var _costcat              = mywindow.findChild("_costcat");
  var _createSoPr           = mywindow.findChild("_createSoPr");
  var _createSoPo           = mywindow.findChild("_createSoPo");
  var _dropShip             = mywindow.findChild("_dropShip");
  var _vendtype             = mywindow.findChild("_vendtype");
  var _defaultTerms         = mywindow.findChild("_defaultTerms");
  var _taxzone              = mywindow.findChild("_taxzone");
  var _taxtype              = mywindow.findChild("_taxtype");
  var _reorderlevel         = mywindow.findChild("_reorderLevel");
  var _ordertoqty           = mywindow.findChild("_orderUpToQty");
  var _cyclecountfreq       = mywindow.findChild("_cycleCountFreq");
  var _loccntrl             = mywindow.findChild("_locationControl");
  var _safetystock          = mywindow.findChild("_safetyStock");
  var _minordqty            = mywindow.findChild("_minimumOrder");
  var _multordqty           = mywindow.findChild("_orderMultiple");
  var _leadtime             = mywindow.findChild("_leadTime");
  var _abcclass             = mywindow.findChild("_abcClass");
  var _eventfence           = mywindow.findChild("_eventFence");
  var _stocked              = mywindow.findChild("_stocked");
  var _locations            = mywindow.findChild("_locations");
  var _useparams            = mywindow.findChild("_useParameters");
  var _useparamsmanual      = mywindow.findChild("_useParametersOnManual");
  var _location             = mywindow.findChild("_miscLocationName");
  var _autoabcclass         = mywindow.findChild("_autoUpdateABCClass");
  var _ordergroup           = mywindow.findChild("_orderGroup");
  var _maxordqty            = mywindow.findChild("_maximumOrder");
  var _ordergroup_first     = mywindow.findChild("_orderGroupFirst");
  var _planning_type        = mywindow.findChild("_planningType");
  var _recvlocations        = mywindow.findChild("_recvlocations");
  var _issuelocations       = mywindow.findChild("_issuelocations");
  var _location_dist        = mywindow.findChild("_locations_dist");
  var _recvlocation_dist    = mywindow.findChild("_recvlocations_dist");
  var _issuelocation_dist   = mywindow.findChild("_issuelocations_dist");
  var _usedefaultlocation   = mywindow.findChild("_useDefaultLocation");

  _reorderlevel.setValidator(mainwindow.qtyVal());
  _ordertoqty.setValidator(mainwindow.qtyVal());
  _safetystock.setValidator(mainwindow.qtyVal());
  _minordqty.setValidator(mainwindow.qtyVal());
  _multordqty.setValidator(mainwindow.qtyVal());
  _maxordqty.setValidator(mainwindow.qtyVal());

  var _buttonBox  = mywindow.findChild("_buttonBox");

  if (!metrics.boolean("EnableDropShipments"))
    _dropShip.hide();

  _buttonBox.accepted.connect(save);
  _buttonBox.rejected.connect(mywindow, "close");
  _createSoPr.toggled.connect(sHandleSoPr);
  _createSoPo.toggled.connect(sHandleSoPo);
  _loccntrl.toggled.connect(sHandleDefaultLocation);
  _usedefaultlocation.toggled.connect(sHandleDefaultLocation);

  populate();
}
catch (e)
{
  QMessageBox.critical(mywindow, "catconfig",
                       "catconfig.js exception: " + e);
}

function set(params)
{
  try
  {
    if("catconfig_id" in params)
    {
      _catconfigid = params.catconfig_id;
      populate();
    }

    if("mode" in params)
    {
      if (params.mode == "new")
      {
        _mode = "new";
        _provider.setFocus();
      }
      else if (params.mode == "edit")
      {
        _mode = "edit";
        _provider.enabled = false;
        _providerdescrip.enabled = false;
        _warehouse.setFocus();
      }
      else if (params.mode == "view")
      {
        _mode = "view";

        _provider.enabled = false;
        _providerdescrip.enabled = false;
        _classcode.enabled = false;
        _inventoryUOM.enabled = false;
        _warehouse.enabled = false;
        _costMethod.enabled = false;
        _controlMethod.enabled = false;
        _plannerCode.enabled = false;
        _costcat.enabled = false;
        _createSoPr.enabled = false;
        _createSoPo.enabled = false;
        _dropShip.enabled = false;
        _vendtype.enabled = false;
        _defaultTerms.enabled = false;
        _taxzone.enabled = false;
        _taxtype.enabled = false;
        _reorderlevel.enabled = false;
        _ordertoqty.enabled = false;
        _cyclecountfreq.enabled = false;
        _loccntrl.enabled = false;
        _safetystock.enabled = false;
        _minordqty.enabled = false;
        _multordqty.enabled = false;
        _leadtime.enabled = false;
        _abcclass.enabled = false;
        _eventfence.enabled = false;
        _stocked.enabled = false;
        _locations.enabled = false;
        _useparams.enabled = false;
        _useparamsmanual.enabled = false;
        _location.enabled = false;
        _autoabcclass.enabled = false;
        _ordergroup.enabled = false;
        _maxordqty.enabled = false;
        _ordergroup_first.enabled = false;
        _planning_type.enabled = false;
        _recvlocations.enabled = false;
        _issuelocations.enabled = false;
        _location_dist.enabled = false;
        _recvlocation_dist.enabled = false;
        _issuelocation_dist.enabled = false;

        _buttonBox.clear();
        _buttonBox.addButton(QDialogButtonBox.Close);
        _buttonBox.setFocus();
      }
    }

    return mainwindow.NoError;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "set exception: " + e);
  }
}

function sHandleSoPr()
{
  try
  {
    if (_createSoPr.checked)
    {
      _createSoPo.setChecked(false);
      _dropShip.setChecked(false);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "sHandleSoPr exception: " + e);
  }
}

function sHandleSoPo()
{
  try
  {
    if (_createSoPo.checked)
      _createSoPr.setChecked(false);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "sHandleSoPo exception: " + e);
  }
}

function sHandleDefaultLocation()
{
  try
  {
    if (_loccntrl.checked)
      _usedefaultlocation.enabled = true;
    else
    {
      _usedefaultlocation.enabled = false;
      _usedefaultlocation.setChecked(false);
    }

    if (_usedefaultlocation.checked)
    {
       if ((_controlMethod.currentIndex == 2) ||
           (_controlMethod.currentIndex == 3))
       {
          _location_dist.enabled = true;
          _recvlocation_dist.enabled = false;
          _issuelocation_dist.enabled = false;
          _location_dist.setChecked(false);
          _recvlocation_dist.setChecked(false);
          _issuelocation_dist.setChecked(false);
       }
       else
       {
          _location_dist.enabled = _locations.checked;
          _recvlocation_dist.enabled = _recvlocations.checked;
          _issuelocation_dist.enabled = _issuelocations.checked;
       }
    }          
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "sHandleSoPo exception: " + e);
  }
}

function populate()
{
  try
  {
    var params = new Object;
    params.catconfig_id = _catconfigid;

    var qry = "SELECT * "
            + "FROM xwd.catconfig "
            + "WHERE(catconfig_id=<? value('catconfig_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _catconfigid = data.value("catconfig_id");
      _provider.setText(data.value("catconfig_provider"));
      _providerdescrip.setText(data.value("catconfig_provider_descrip"));
      _classcode.setId(data.value("catconfig_classcode_id"));
      _inventoryUOM.setId(data.value("catconfig_inv_uom_id"));
      if (data.value("catconfig_warehous_id") == -1)
        _warehouse.setAll();
      else
        _warehouse.setId(data.value("catconfig_warehous_id"));
      var costmethod = data.value("catconfig_costmethod");
      if (costmethod == "N")
        _costMethod.currentIndex = 0;
      if (costmethod == "A")
        _costMethod.currentIndex = 1;
      if (costmethod == "S")
        _costMethod.currentIndex = 2;
      if (costmethod == "J")
        _costMethod.currentIndex = 3;
      var controlmethod = data.value("catconfig_controlmethod");
      if (controlmethod == "N")
        _controlMethod.currentIndex = 0;
      if (controlmethod == "R")
        _controlMethod.currentIndex = 1;
      if (controlmethod == "L")
        _controlMethod.currentIndex = 2;
      if (controlmethod == "S")
        _controlMethod.currentIndex = 3;
      _plannerCode.setId(data.value("catconfig_plancode_id"));
      _costcat.setId(data.value("catconfig_costcat_id"));
      _createSoPr.setChecked(data.value("catconfig_createsopr"));
      _createSoPo.setChecked(data.value("catconfig_createsopo"));
      _dropShip.setChecked(data.value("catconfig_dropship"));
      _vendtype.setId(data.value("catconfig_vendtype_id"));
      _defaultTerms.setId(data.value("catconfig_terms_id"));
      _taxzone.setId(data.value("catconfig_taxzone_id"));
      _taxtype.setId(data.value("catconfig_taxtype_id"));
      _reorderlevel.setDouble(data.value("catconfig_reorderlevel"));
      _ordertoqty.setDouble(data.value("catconfig_ordertoqty"));
      _cyclecountfreq.value = data.value("catconfig_cyclecountfreq");
      _loccntrl.setChecked(data.value("catconfig_loccntrl"));
      _safetystock.setDouble(data.value("catconfig_safetystock"));
      _minordqty.setDouble(data.value("catconfig_minordqty"));
      _multordqty.setDouble(data.value("catconfig_multordqty"));
      _leadtime.value = data.value("catconfig_leadtime");
      var abcclass = data.value("catconfig_abcclass");
      if (abcclass == "A")
        _abcclass.currentIndex = 0;
      if (abcclass == "B")
        _abcclass.currentIndex = 1;
      if (abcclass == "C")
        _abcclass.currentIndex = 2;
      _eventfence.value = data.value("catconfig_eventfence");
      _stocked.setChecked(data.value("catconfig_stocked"));
      _locations.setId(data.value("catconfig_location_id"));
      if (_locations.id() > 0)
        _usedefaultlocation.setChecked(true);
      _useparams.setChecked(data.value("catconfig_useparams"));
      _useparamsmanual.setChecked(data.value("catconfig_useparamsmanual"));
      _autoabcclass.setChecked(data.value("catconfig_autoabcclass"));
      _ordergroup.value = data.value("catconfig_ordergroup");
      _maxordqty.setDouble(data.value("catconfig_maxordqty"));
      _ordergroup_first.setChecked(data.value("catconfig_ordergroup_first"));
      var planning_type = data.value("catconfig_planning_type");
      if (planning_type == "N")
        _planning_type.currentIndex = 0;
      if (planning_type == "M")
        _planning_type.currentIndex = 1;

      if (_warehouse.id() > 0)
        populateLocations();
      _locations.setId(data.value("catconfig_location_id"));
      if (_locations.id() > 0)
      {
        _usedefaultlocation.setChecked(true);
        _location_dist.enabled = true;
      }
      _recvlocations.setId(data.value("catconfig_recvlocation_id"));
      if (_recvlocations.id() > 0)
      {
        _usedefaultlocation.setChecked(true);
        _recvlocation_dist.enabled = true;
      }
      _issuelocations.setId(data.value("catconfig_issuelocation_id"));
      if (_issuelocations.id() > 0)
      {
        _usedefaultlocation.setChecked(true);
        _issuelocation_dist.enabled = true;
      }
      _location_dist.setChecked(data.value("catconfig_location_dist"));
      _recvlocation_dist.setChecked(data.value("catconfig_recvlocation_dist"));
      _issuelocation_dist.setChecked(data.value("catconfig_issuelocation_dist"));
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "populate exception: " + e);
  }
}

function populateLocations()
{
  try
  {
    var params = new Object;
    params.warehous_id = _warehouse.id();

    var qry = "SELECT location_id, formatLocationName(location_id) AS locationname "
            + "FROM location "
            + "WHERE(location_warehous_id=<? value('warehous_id') ?>)"
            + " AND (NOT location_restrict);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _locations.populate(data);
      _recvlocations.populate(data);
      _issuelocations.populate(data);
      sHandleDefaultLocation();
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "populateLocations exception: " + e);
  }
}

function save()
{
  try
  {
    var q_str = "";
    if (_mode == "new")
    {
      var qid = toolbox.executeQuery("SELECT NEXTVAL('xwd.catconfig_catconfig_id_seq') AS _catconfig_id;");
      if (qid.first())
        _catconfigid = qid.value("_catconfig_id");

      q_str = "INSERT INTO xwd.catconfig "
             +"( catconfig_id, catconfig_provider,"
             +"  catconfig_provider_descrip, catconfig_warehous_id,"
             +"  catconfig_classcode_id, catconfig_inv_uom_id,"
             +"  catconfig_plancode_id, catconfig_costcat_id,"
             +"  catconfig_vendtype_id, catconfig_terms_id,"
             +"  catconfig_controlmethod, catconfig_taxzone_id,"
             +"  catconfig_taxtype_id, catconfig_createsopr,"
             +"  catconfig_createsopo, catconfig_dropship,"
             +"  catconfig_costmethod,"
             +"  catconfig_reorderlevel, catconfig_ordertoqty,"
             +"  catconfig_cyclecountfreq, catconfig_loccntrl,"
             +"  catconfig_safetystock, catconfig_minordqty,"
             +"  catconfig_multordqty, catconfig_leadtime,"
             +"  catconfig_abcclass, catconfig_eventfence,"
             +"  catconfig_stocked, catconfig_location_id,"
             +"  catconfig_useparams, catconfig_useparamsmanual,"
             +"  catconfig_location, catconfig_autoabcclass,"
             +"  catconfig_ordergroup, catconfig_maxordqty,"
             +"  catconfig_ordergroup_first, catconfig_planning_type,"
             +"  catconfig_recvlocation_id, catconfig_issuelocation_id,"
             +"  catconfig_location_dist, catconfig_recvlocation_dist,"
             +"  catconfig_issuelocation_dist ) "
             +"VALUES "
             +"( <? value('catconfig_id') ?>, <? value('provider') ?>,"
             +"  <? value('providerdescrip') ?>, <? value('warehous_id') ?>,"
             +"  <? value('classcode_id') ?>, <? value('inv_uom_id') ?>,"
             +"  <? value('plancode_id') ?>, <? value('costcat_id') ?>,"
             +"  <? value('vendtype_id') ?>, <? value('terms_id') ?>,"
             +"  <? value('controlmethod') ?>, <? value('taxzone_id') ?>,"
             +"  <? value('taxtype_id') ?>, <? value('createsopr') ?>,"
             +"  <? value('createsopo') ?>, <? value('dropship') ?>,"
             +"  <? value('costmethod') ?>,"
             +"  <? value('reorderlevel') ?>, <? value('ordertoqty') ?>,"
             +"  <? value('cyclecountfreq') ?>, <? value('loccntrl') ?>,"
             +"  <? value('safetystock') ?>, <? value('minordqty') ?>,"
             +"  <? value('multordqty') ?>, <? value('leadtime') ?>,"
             +"  <? value('abcclass') ?>, <? value('eventfence') ?>,"
             +"  <? value('stocked') ?>, <? value('location_id') ?>,"
             +"  <? value('useparams') ?>, <? value('useparamsmanual') ?>,"
             +"  <? value('location') ?>, <? value('autoabcclass') ?>,"
             +"  <? value('ordergroup') ?>, <? value('maxordqty') ?>,"
             +"  <? value('ordergroup_first') ?>, <? value('planning_type') ?>,"
             +"  <? value('recvlocation_id') ?>, <? value('issuelocation_id') ?>,"
             +"  <? value('location_dist') ?>, <? value('recvlocation_dist') ?>,"
             +"  <? value('issuelocation_dist') ?> );"

    }
    else if (_mode == "edit")
    {
      q_str = "UPDATE xwd.catconfig "
            + "SET catconfig_warehous_id=<? value('warehous_id') ?>,"
            + "    catconfig_classcode_id=<? value('classcode_id') ?>,"
            + "    catconfig_inv_uom_id=<? value('inv_uom_id') ?>,"
            + "    catconfig_plancode_id=<? value('plancode_id') ?>,"
            + "    catconfig_costcat_id=<? value('costcat_id') ?>,"
            + "    catconfig_vendtype_id=<? value('vendtype_id') ?>,"
            + "    catconfig_terms_id=<? value('terms_id') ?>,"
            + "    catconfig_costmethod=<? value('costmethod') ?>,"
            + "    catconfig_controlmethod=<? value('controlmethod') ?>,"
            + "    catconfig_taxzone_id=<? value('taxzone_id') ?>,"
            + "    catconfig_taxtype_id=<? value('taxtype_id') ?>,"
            + "    catconfig_createsopr=<? value('createsopr') ?>,"
            + "    catconfig_createsopo=<? value('createsopo') ?>,"
            + "    catconfig_dropship=<? value('dropship') ?>,"
            + "    catconfig_reorderlevel=<? value('reorderlevel') ?>,"
            + "    catconfig_ordertoqty=<? value('ordertoqty') ?>,"
            + "    catconfig_cyclecountfreq=<? value('cyclecountfreq') ?>,"
            + "    catconfig_loccntrl=<? value('loccntrl') ?>,"
            + "    catconfig_safetystock=<? value('safetystock') ?>,"
            + "    catconfig_minordqty=<? value('minordqty') ?>,"
            + "    catconfig_multordqty=<? value('multordqty') ?>,"
            + "    catconfig_leadtime=<? value('leadtime') ?>,"
            + "    catconfig_abcclass=<? value('abcclass') ?>,"
            + "    catconfig_eventfence=<? value('eventfence') ?>,"
            + "    catconfig_stocked=<? value('stocked') ?>,"
            + "    catconfig_location_id=<? value('location_id') ?>,"
            + "    catconfig_useparams=<? value('useparams') ?>,"
            + "    catconfig_useparamsmanual=<? value('useparamsmanual') ?>,"
            + "    catconfig_location=<? value('location') ?>,"
            + "    catconfig_autoabcclass=<? value('autoabcclass') ?>,"
            + "    catconfig_ordergroup=<? value('ordergroup') ?>,"
            + "    catconfig_maxordqty=<? value('maxordqty') ?>,"
            + "    catconfig_ordergroup_first=<? value('ordergroup_first') ?>,"
            + "    catconfig_planning_type=<? value('planning_type') ?>,"
            + "    catconfig_recvlocation_id=<? value('recvlocation_id') ?>,"
            + "    catconfig_issuelocation_id=<? value('issuelocation_id') ?>,"
            + "    catconfig_location_dist=<? value('location_dist') ?>,"
            + "    catconfig_recvlocation_dist=<? value('recvlocation_dist') ?>,"
            + "    catconfig_issuelocation_dist=<? value('issuelocation_dist') ?> "
            + "WHERE (catconfig_id = <? value('catconfig_id') ?>);";
    }
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(q_str, params);

      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
      }
      mydialog.accept();
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.catconfig_id = _catconfigid;

    if (_mode == "new")
    {
      var qry = toolbox.executeQuery("SELECT catconfig_id FROM xwd.catconfig WHERE (catconfig_provider=<? value('provider') ?>);", params);
      if (qry.first())
      {
        QMessageBox.critical(mywindow, "catconfig",
                             "Provider already configured");
        return false;
      }
    }

    if (_loccntrl.checked)
    {
      if (_warehouse.id() > 0)
      {
        params.warehous_id = _warehouse.id();
        var qry = toolbox.executeQuery("SELECT location_id FROM location "
                                     + "WHERE (location_warehous_id=<? value('warehous_id') ?>);", params);
        if (!qry.first())
        {
          QMessageBox.critical(mywindow, "catconfig",
                               "You have indicated that this Provider "
                             + "should be Multiple Location Controlled "
                             + "but there are no non-restrictive Locations "
                             + "in the selected Site."
                             + "<p>You must first create at least one valid "
                             + "Location for this Site before it may be "
                             + "Multiple Location Controlled.");
          return false;
        }
      }
      else
      {
        var qry = toolbox.executeQuery("SELECT min_location FROM "
                                     + "(SELECT MIN(COALESCE(location_id, -1)) AS min_location "
                                     + "FROM whsinfo LEFT OUTER JOIN location ON (location_warehous_id=warehous_id) "
                                     + "GROUP BY warehous_id ) AS data "
                                     + "WHERE (min_location=-1);", params);
        if (qry.first())
        {
          QMessageBox.critical(mywindow, "catconfig",
                               "You have indicated that this Provider "
                             + "should be Multiple Location Controlled "
                             + "but there are no non-restrictive Locations "
                             + "in at least one Site."
                             + "<p>You must first create at least one valid "
                             + "Location for all Sites before it may be "
                             + "Multiple Location Controlled.");
          return false;
        }
      }
    }

    params.provider = _provider.text;
    params.providerdescrip = _providerdescrip.text;
    params.warehous_id = _warehouse.id();
    params.classcode_id = _classcode.id();
    params.inv_uom_id = _inventoryUOM.id();
    params.plancode_id = _plannerCode.id();
    params.costcat_id = _costcat.id();
    params.createsopr =  _createSoPr.checked;
    params.createsopo =  _createSoPo.checked;
    params.dropship =  _dropShip.checked;
    params.vendtype_id = _vendtype.id();
    params.terms_id = _defaultTerms.id();
    if (_taxzone.isValid())
      params.taxzone_id = _taxzone.id();
    params.taxtype_id = _taxtype.id();
    if (_controlMethod.currentIndex == 0)
      params.controlmethod ="N";
    if (_controlMethod.currentIndex == 1)
      params.controlmethod ="R";
    if (_controlMethod.currentIndex == 2)
      params.controlmethod ="L";
    if (_controlMethod.currentIndex == 3)
      params.controlmethod ="S";
    if (_costMethod.currentIndex == 0)
      params.costmethod ="N";
    if (_costMethod.currentIndex == 1)
      params.costmethod ="A";
    if (_costMethod.currentIndex == 2)
      params.costmethod ="S";
    if (_costMethod.currentIndex == 3)
      params.costmethod ="J";
    params.reorderlevel = _reorderlevel.toDouble();
    params.ordertoqty = _ordertoqty.toDouble();
    params.cyclecountfreq = _cyclecountfreq.value;
    params.loccntrl = _loccntrl.checked;
    params.safetystock = _safetystock.toDouble();
    params.minordqty = _minordqty.toDouble();
    params.multordqty = _multordqty.toDouble();
    params.leadtime = _leadtime.value;
    if (_abcclass.currentIndex == 0)
      params.abcclass ="A";
    if (_abcclass.currentIndex == 1)
      params.abcclass ="B";
    if (_abcclass.currentIndex == 2)
      params.abcclass ="C";
    params.eventfence = _eventfence.value;
    params.stocked = _stocked.checked;
    params.location_id = _locations.id();
    params.useparams = _useparams.checked;
    params.useparamsmanual = _useparamsmanual.checked;
    params.location = _location.text;
    params.autoabcclass = _autoabcclass.checked;
    if (_ordergroup.value > 0)
      params.ordergroup = _ordergroup.value;
    else
      params.ordergroup = 1;
    params.maxordqty = _maxordqty.toDouble();
    params.ordergroup_first = _ordergroup_first.checked;
    if (_planning_type.currentIndex == 0)
      params.planning_type ="N";
    if (_planning_type.currentIndex == 1)
      params.planning_type ="M";
    params.recvlocation_id = _recvlocations.id();
    params.issuelocation_id = _issuelocations.id();
    params.location_dist = _location_dist.checked;
    params.recvlocation_dist = _recvlocation_dist.checked;
    params.issuelocation_dist = _issuelocation_dist.checked;

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "catconfig",
                         "setParams(params) exception: " + e);
  }
}
