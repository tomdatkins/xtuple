/*
  This file is part of the xwd Package for xTuple ERP,
  and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It
  is licensed to you under the xTuple End-User License Agreement ("the
  EULA"), the full text of which is available at www.xtuple.com/EULA.
  While the EULA gives you access to source code and encourages your
  involvement in the development process, this Package is not free
  software.  By using this software, you agree to be bound by the
  terms of the EULA.
*/
  
include("storedProcErrorLookup");
include("xwdErrors");
mywindow.setWindowTitle(qsTr("Display CatCosts"));
mywindow.setMetaSQLOptions('catcost','detail');
mywindow.setQueryOnStartEnabled(true);
mywindow.setSearchVisible(true);

var _parameterWidget     = mywindow.findChild("_parameterWidget");
var _catcost_id          = mywindow.findChild("_catcost_id");
var _catcost_item_number = mywindow.findChild("_catcost_item_number"); 
var _provider            = mywindow.findChild("_provider"); 
  
  var _list = mywindow.list();

  _list.addColumn(qsTr("Item #"),           -1,    Qt.AlignLeft,   true,  "catcost_item_number"   );
  _list.addColumn(qsTr("Wholesale Price"),  XTreeWidget.itemColumn,    Qt.AlignLeft,   true,  "wholesale_price"   );
  _list.addColumn(qsTr("Price UOM"),        XTreeWidget.itemColumn,    Qt.AlignLeft,   true,  "catcost_price_uom"   ); 
  _list.addColumn(qsTr("PO Cost"),          XTreeWidget.moneyColumn,   Qt.AlignRight,  true,  "po_cost"  );
  _list.addColumn(qsTr("PO UOM"),           XTreeWidget.itemColumn,    Qt.AlignRight,  true,  "catcost_po_uom"  );
  _list.addColumn(qsTr("PO QTY BREAK"),     XTreeWidget.qtyColumn,     Qt.AlignRight,  true,  "qtybreak"  );
  _list.addColumn(qsTr("Vendor"),           XTreeWidget.itemColumn,    Qt.AlignRight,  true,  "catcost_vend_number"  );
  _list.addColumn(qsTr("INV TO UOM Ratio"), XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "catcost_invvendoruomratio"  );
  _list.addColumn(qsTr("PO-WHS"), 	    XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "warehous_code"  );
  _list.addColumn(qsTr("Provider"), 	    XTreeWidget.itemColumn,    Qt.AlignRight,   true,  "provider"  );

  mywindow.setParameterWidgetVisible(false);

  var _updatecatcost=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_updatecatcost"); 
  _updatecatcost.text=qsTr("Populate CatCost");
  var _updatecatcostAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _updatecatcost);

  var _deletecatcost=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_deletecatcost"); 
  _deletecatcost.text=qsTr("Clear CatCost Table");
   var _deletecatcostAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _deletecatcost);

  var _updateitems=toolbox.createWidget("QToolButton", mywindow.toolBar(), "_updateitems"); 
  _updateitems.text=qsTr("Update All Items From Catcost");
  var _updateitemsAct=mywindow.toolBar().insertWidget(mywindow.querySeparator(), _updateitems);

if(privileges.check("MaintainCatCost")) 
{
_list.itemSelected.connect(sEdit);
}
else if(privileges.check("ViewCatCost"))
{
_list.itemSelected.connect(sView);
}

  function sRefresh()
    {
      try
          {

            var params = new Object;    
            var qry = toolbox.executeDbQuery("catcost", "detail", params);
           _list.populate(qry, true);
          }
            catch (e)
                      {
                        QMessageBox.critical(mywindow, "catcost",
                        "sRefresh exception: " + e);
                      }

     }

  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(sPopulateMenu)


  function sUpdateCatCost()
    {
      try
          {
            (toolbox.messageBox("question", mywindow,
            qsTr("Update CatCost?"),
            qsTr("This will Populate the CatCost table "
            + "from  your current Item Costs "),
            QMessageBox.No,
            QMessageBox.Yes | QMessageBox.Default
            == QMessageBox.No))
                         
            var params = new Object;
            var qry1 = toolbox.executeQuery("SELECT  xwd.populaecatcostitems();", params);
         }
            catch (e)
                      {
                        QMessageBox.critical(mywindow, "catcost",
                        "sUpdateCatCost exception: " + e);
                      }
  sRefresh();
    return;

    }


  function sDeleteCatCost()
    {
      try
          {
            (toolbox.messageBox("question", mywindow,
            qsTr("Delete All CatCost Items?"),
            qsTr("This will Clear the CatCost table"),
            QMessageBox.No,
            QMessageBox.Yes | QMessageBox.Default
            == QMessageBox.No))
                         
            var params = new Object;
            var qry1 = toolbox.executeQuery(" DELETE FROM xwd.catcost;");
          }
      
    
            catch (e)
              {
                QMessageBox.critical(mywindow, "catcost",
                "sDeleteCatcost exception: " + e);
              }
  sRefresh();
    return;
    }
  
   function sUpdateItems()
    {
      try
          { var qry = "SELECT catconfig_provider "
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
                    if (QMessageBox.question(mywindow, qsTr("This will update your current item data?"),
                    qsTr(" update Cat Cost table Data Using Provider %1 ").arg(data.value("catconfig_provider")),
                          
                    QMessageBox.Yes,
                    QMessageBox.No | QMessageBox.Default)
                    == QMessageBox.Yes)
                     {     
                       var params = new Object;
                       params.catconfig_provider = data.value("catconfig_provider");                       
                       var qry1 = toolbox.executeQuery("SELECT xwd.updatecatalog(<? value('catconfig_provider') ?>,'F','F');", params);  
                  
                       if (qry1.lastError().type != QSqlError.NoError)
                      {
                       QMessageBox.critical(mywindow, qsTr("Database Error"), qry1.lastError().text);
      
                       }
                       break;
                     }
                  
                   }
                    
	    }
	      	
              catch (e)
                {
                  QMessageBox.critical(mywindow, "catcost",
                  "sUpdateCatcost exception: " + e);
                 }
    
    sRefresh();
    return;
   

      }
      
_updatecatcost.clicked.connect(sUpdateCatCost); 
_deletecatcost.clicked.connect(sDeleteCatCost);
_updateitems.clicked.connect(sUpdateItems); 

  function sPopulateMenu(pMenu, pItem, pCol)
    {
      try
          {
            if(pMenu == null)
            pMenu = _list.findChild("_menu");  
            if(pMenu != null)
            {
              tmpact = pMenu.addAction(qsTr("Edit..."));
              tmpact.enabled = (privileges.check("MaintainCatCost"));
              tmpact.triggered.connect(sEdit);

              tmpact = pMenu.addAction(qsTr("View..."));
              tmpact.enabled = (privileges.check("MaintainCatCost") || privileges.check("ViewCatCost"));
              tmpact.triggered.connect(sView);

              tmpact = pMenu.addAction(qsTr("Update Item..."));
              tmpact.enabled = (privileges.check("MaintainCatCost"));
              tmpact.triggered.connect(sUpdateItem);

              tmpact = pMenu.addAction(qsTr("Delete CatCost Item..."));
              tmpact.enabled = (privileges.check("MaintainCatCost"));
              tmpact.triggered.connect(sDeleteItem);

            }
         }
           catch(e)
             {
               QMessageBox.critical(mywindow, "catCostList",
               "sPopulateMenu exception: " + e);
             }
    }

  function opencatCost(params) 
    {
      try
        {
          var wnd = toolbox.openWindow("catCost", mywindow, Qt.ApplicationModal, Qt.Dialog);
          var tmp = toolbox.lastWindow().set(params);
          
          wnd.exec();
         
        }
          catch (e)
           {
             QMessageBox.critical(mywindow, "catcost",
             "openCatcost exception: " + e);
           }
     }

  function sEdit()
    {
      try
        {		
          var params = new Object;
          params.mode = "edit";
          params.catcost_id = _list.id();
          opencatCost(params);	
         }
 
          catch (e)
            {
              QMessageBox.critical(mywindow, "catcost",
              "sEdit Catcost exception: " + e);
             }
	
     }

  function sView()
    {
      try
        {
          var params = new Object;
          params.mode = "view";
          params.catcost_id = _list.id();
          opencatCost(params);
         }
           catch (e)
             {
               QMessageBox.critical(mywindow, "catcost",
               "sView Catcost exception: " + e);
             }
     }

  function sUpdateItem()
    {
      try
        {
          var params = new Object; 
          params.catcost_id = _list.id();
          var qry1 = toolbox.executeQuery("SELECT xwd.updatecatcostitem(<? value('catcost_id') ?>);", params);
        } 
          catch (e)
            {
              QMessageBox.critical(mywindow, "catcost",
              "sUpdateitem exception: " + e);
            }
      sRefresh();
      return;
    }

  function sDeleteItem()
    {
      try 
        { 
 	  var params = new Object;
  	  params.catcost_id = _list.id();
          var qry1 = toolbox.executeQuery("DELETE FROM xwd.catcost WHERE catcost_id = (<? value('catcost_id') ?>);", params);
        }
          catch (e)
            {
              QMessageBox.critical(mywindow, "catcost",
              "sDelete Catcost exception: " + e);
            }
  
      sRefresh();
      return;
    }

