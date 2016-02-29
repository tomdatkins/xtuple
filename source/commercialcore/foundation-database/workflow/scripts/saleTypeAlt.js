debugger;

// TODO: modify to use core EDI Profiles for email notifications

var _code        = mywindow.findChild("_code");
var _description = mywindow.findChild("_description");
var _active      = mywindow.findChild("_active");
var _default     = mywindow.findChild("_default");
var _holdType    = mywindow.findChild("_holdType");
var _emlProfile  = mywindow.findChild("_emlProfile");

var _buttonBox   = mywindow.findChild('_buttonBox');

var emlqry = " SELECT 0 AS emlprofile_id, 'None' AS emlprofile_name "
           + " UNION SELECT emlprofile_id, emlprofile_name FROM xt.salesemlprofile";

var _saletypeid = -1;
var _mode = "new";

_emlProfile.populate(emlqry);

_holdType.append( -1, "None" );
_holdType.append( 1, "Credit" );
_holdType.append( 2, "Shipping" );
_holdType.append( 3, "Packing" );
_holdType.append( 4, "Return" );

function set(input)
{
   var params = new Object;
   if("mode" in input)
      _mode = input.mode;
   if("saletype_id" in input) {
      params.saletype_id = input.saletype_id;
      _saletypeid = input.saletype_id;
   }
   if(_mode == 'edit') {    
	  var qry = " SELECT saletype_code, saletype_descr, saletype_active, "
	       + "    saletype_default, emlprofile_name, "
           + "   CASE WHEN saletypeext_default_hold_type = 'C' THEN 'Credit' "
           + "        WHEN saletypeext_default_hold_type = 'S' THEN 'Shipping' "
           + "        WHEN saletypeext_default_hold_type = 'P' THEN 'Packing' "
           + "        WHEN saletypeext_default_hold_type = 'R' THEN 'Return' "
           + "   ELSE 'None' "
           + " END AS hold_type "
           + " FROM saletype "
           + " LEFT JOIN xt.saletypeext ON saletypeext_id = saletype_id "
           + " LEFT JOIN xt.salesemlprofile ON saletypeext_emlprofile_id = emlprofile_id "
           + " WHERE saletype_id = <? value('saletype_id') ?> "
      var finalqry = toolbox.executeQuery(qry, params);
      if(finalqry.first()) {
         _code.text        = finalqry.value('saletype_code');
         _description.text = finalqry.value('saletype_desc');
         _active.checked   = finalqry.value('saletype_active');
         _default.checked  = finalqry.value('saletype_default');
         _emlProfile.text  = finalqry.value('emlprofile_name');
         _holdType.text    = finalqry.value('hold_type');
      }
      if(finalqry.lastError().type != QSqlError.NoError)
         QMessageBox.critical(mywindow, "error", "Set Error: " + finalqry.lastError().text);
   }  else if (_mode == "view")
    {
      _code.setEnabled(false);
      _active.setEnabled(false);
      _default.setEnabled(false);
      _description.setEnabled(false);
      _holdType.setEnabled(false);
      _emlProfile.setEnabled(false);
      _buttonBox.clear();
      _buttonBox.addButton(QDialogButtonBox.Close);
    }
}

function sSave()
{
  var saletypeqry = '';
  var saletypeextqry = '';
  
  var params = new Object;
      params.saletype_id = _saletypeid;
      params.code = _code.text;
      params.desc = _description.text;
      params.active = _active.checked;
      params.isdefault = _default.checked;
      params.emlprofile = _emlProfile.id();
      params.holdtype = _holdType.text;   

  if(_code.text == '') 
  {
    QMessageBox.critical(mywindow, "Save Error", "You must enter a valid Code before saving.");
    return;
  }

  if(_mode == "edit") 
  {
    saletypeqry = " UPDATE saletype SET "
                + " saletype_code = <? value('code') ?>, "
                + " saletype_descr = <? value('desc') ?>, "
                + " saletype_active = <? value('active') ?>, "
                + " saletype_default = <? value('isdefault') ?> "
                + " WHERE saletype_id = <? value('saletype_id') ?> ";
                         
    if((_emlProfile.id() > 0) && (_holdType.text != 'None')) 
    {
      var checkext = toolbox.executeQuery(" SELECT saletypeext_id FROM xt.saletypeext "
                   + " WHERE saletypeext_id = <? value('saletype_id') ?> ", params);
      if(checkext.first()) 
      {             
        saletypeextqry = " UPDATE xt.saletypeext "
                           + " SET <? if exists('emlprofile') ?> "
                           + " saletypeext_emlprofile_id = <? value('emlprofile') ?>, <? endif ?>"
                           + "     saletypeext_default_hold_type = "
                           + "     CASE WHEN <? value('holdtype') ?> = 'Credit' THEN 'C' "
                           + "          WHEN <? value('holdtype') ?> = 'Shipping' THEN 'S' "
                           + "          WHEN <? value('holdtype') ?> = 'Packing' THEN 'P' "
                           + "          WHEN <? value('holdtype') ?> = 'Return' THEN 'R' "
                           + "          ELSE NULL "
                           + "     END " 
                           + " WHERE saletypeext_id = <? value('saletype_id') ?> " ;
      } else { 
        saletypeextqry = " INSERT INTO xt.saletypeext "
                       + " (saletypeext_emlprofile_id, "
                       + "  saletypeext_default_hold_type) "
                       + " VALUES (<? value('emlprofile') ?>,  "
                       + "         <? value('holdtype')   ?> ) ";
      }
    }  
  } else {// _mode = new
    saletypeqry = " INSERT INTO saletype (saletype_code, saletype_descr, "
                + " saletype_active, saletype_default) VALUES ( "
                + " (SELECT <? value('code') ?>, <? value('desc') ?>, "
                + " <? value('active') ?>, <? value('isdefault') ?> ) ";
    if((_emlProfile.id() > 0) && (_holdType.text != 'None')) 
    {            
      saletypeextqry = "INSERT INTO xt.saletypeext ( "
      + "     <? if exists('emlprofile') ?>, saletypeext_emlprofile_id <? endif ?> "
      + "     <? if exists('holdtype') ?>, saletypeext_default_hold_type) <? endif ?> "  
      + "     VALUES ( "
      + "     <? if exists('emlprofile') ?>, <? value('emlprofile') ?> <? endif ?> "
      + "     <? if exists('holdtype') ?>, "
      + "     CASE WHEN <? value('holdtype') ?> = 'Credit' THEN 'C' "
      + "          WHEN <? value('holdtype') ?> = 'Shipping' THEN 'S' "
      + "          WHEN <? value('holdtype') ?> = 'Packing' THEN 'P' "
      + "          WHEN <? value('holdtype') ?> = 'Return' THEN 'R' "
      + "          ELSE NULL "
      + "     END <? endif ?> ";
    }
  }    
    
  toolbox.executeQuery("BEGIN");      
  try {
    var finalsaletypeqry = toolbox.executeQuery(saletypeqry, params);
    if(finalsaletypeqry.lastError().type != QSqlError.NoError)
      //throw syntax?
      throw finalsaletypeqry.lastError().text 
    if(!saletypeextqry = '') {
      var finalsaletypeextqry = toolbox.executeQuery(saletypeextqry, params);
      if(finalsaletypeextqry.lastError().type != QSqlError.NoError)
        throw finalsaletypeextqry.lastError().text 
    }
    toolbox.executeQuery("COMMIT");
  } catch (e) {
     toolbox.executeQuery("ROLLBACK");
     QMessageBox.critical(mywindow, "error", "Save Error: " + e);
  }
   
  mywindow.close;
}

_buttonBox.accepted.connect(sSave);
_buttonBox.rejected.connect(mywindow.close);
