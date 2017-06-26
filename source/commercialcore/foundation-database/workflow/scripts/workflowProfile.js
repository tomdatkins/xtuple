include("xtCore");

var _close        = mywindow.findChild("_close");        // QPushButton
var _save         = mywindow.findChild("_save");         // QPushButton
var _name         = mywindow.findChild("_name");         // XLineEdit
var _desc         = mywindow.findChild("_desc");         // XLineEdit

var _emailGroup   = mywindow.findChild("_emailGroup");   // QGroupBox
var _emailBCC     = mywindow.findChild("_emailBCC");     // XLineEdit
var _emailBody    = mywindow.findChild("_emailBody");    // XTextEdit
var _emailCC      = mywindow.findChild("_emailCC");      // XLineEdit
var _emailSubject = mywindow.findChild("_emailSubject"); // XLineEdit
var _emailTo      = mywindow.findChild("_emailTo");      // XLineEdit
var _emailFrom    = mywindow.findChild("_emailFrom");    // XLineEdit

var _printGroup   = mywindow.findChild("_printGroup");   // QGroupBox
var _printer      = mywindow.findChild("_printer");      // XComboBox
var _report       = mywindow.findChild("_report");       // XComboBox

var _id = -1;

var _tooltip      = qsTr("Email Variables\n\nVariables can be utilized in email text and are replaced when the email "
                  + "text is generated.\n\n</owner> Owner\n</owner_email> Owner email address\n</assigned> Assigned\n"
                  + "</assigned_email>  Assigned email address\n</wf_name> Workflow Name field\n</wf_description> Workflow Description field\n"
                  + "</startdate> Workflow item start date\n</duedate> Workflow item due date\n"
                  + "</status> Workflow Status\n</priority> Workflow Priority\n"
                  + "</docnumber> Source Document number\n</doctype> Source Document type");

// define variable tooltips
  _emailTo.toolTip = _tooltip;
  _emailCC.toolTip = _tooltip;
  _emailBCC.toolTip = _tooltip;
  _emailFrom.toolTip = _tooltip;
  _emailSubject.toolTip = _tooltip;
  _emailBody.toolTip = _tooltip;

// Get List of Printers
var printqry = toolbox.executeQuery("SELECT printer_id, printer_name FROM xt.printer");
if (xtCore.errorCheck(printqry))
  _printer.populate(printqry);

function set(input)
{
  if("profile_id" in input) {
    _id = input.profile_id;
    params = {id: _id};
    var qry = toolbox.executeQuery("SELECT * FROM xt.emlprofile "
            + " WHERE emlprofile_id = <? value('id') ?>", params);
    if(qry.first())
    {
      _name.text = qry.value("emlprofile_name");
      _desc.text = qry.value("emlprofile_descrip");
      if (qry.value("emlprofile_to").length > 1)
      {
         _emailGroup.checked = true;
         _emailTo.text            = qry.value("emlprofile_to");
         _emailFrom.text          = qry.value("emlprofile_from");
         _emailCC.text            = qry.value("emlprofile_cc");
         _emailBCC.text           = qry.value("emlprofile_bcc");
         _emailSubject.text       = qry.value("emlprofile_subject");
         _emailBody.plainText     = qry.value("emlprofile_body");
      }
      if (qry.value("emlprofile_printer").length > 1)
      {
        _printGroup.checked = true;
        _printer.text             = qry.value("emlprofile_printer");
        _report.setId(qry.value("emlprofile_report"));
      }
      
    } else
      QMessageBox.critical(mywindow, "Error", qsTr("Could not find Workflow Profile"));
  }
}

function sSave()
{
  if (_name.text.trim().length == 0 || _desc.text.trim().length == 0) 
  {
    QMessageBox.warning(mywindow, qsTr("Error"), qsTr("Please enter a Profile Name and Description."));
    return;
  }
  if (!_emailGroup.checked && !_printGroup.checked)
  {
    QMessageBox.warning(mywindow, qsTr("Error"), qsTr("You must select one or both of Email options and Print Options"));
    return;
  }

  if (_emailGroup.checked)
  {
    if (_emailTo.text.trim().length < 1)
    {
      QMessageBox.warning(mywindow, qsTr("Error"), qsTr("Please enter an email To address."));
      return;
    }
    if (_emailSubject.text.trim().length < 1)
    {
      QMessageBox.warning(mywindow, qsTr("Error"), qsTr("Please enter an Email Subject."));
      return;
    }
  }

  if (_printGroup.checked && (_printer.text == "" || !_report.isValid()))
  {
    QMessageBox.warning(mywindow, qsTr("Error"), qsTr("Please select a Printer and Report"));
    return;
  }
    
  var params = {name: _name.text.trim(),
                desc: _desc.text};
  if (_emailGroup.checked)
  {
    params.emailto        = _emailTo.text.trim();
    params.emailfrom      = _emailFrom.text.trim();
    params.emailcc        = _emailCC.text.trim();
    params.emailbcc       = _emailBCC.text.trim();
    params.emailsubject   = _emailSubject.text.trim();
    params.emailbody      = _emailBody.plainText;
  }
  if (_printGroup.checked)
  {
    params.printer        = _printer.text;
    params.report         = _report.id();
  }

  if(_id > 0)   
  {
    params.id = _id;

    var _sql = "UPDATE xt.emlprofile SET "
             + "emlprofile_name = <? value('name') ?>, "
             + "emlprofile_descrip = <? value('desc') ?>, "
             + "emlprofile_to = <? value('emailto') ?>, "
             + "emlprofile_from = <? value('emailfrom') ?>, "
             + "emlprofile_cc = <? value('emailcc') ?>, "
             + "emlprofile_bcc = <? value('emailbcc') ?>, "
             + "emlprofile_subject = <? value('emailsubject') ?>, "
             + "emlprofile_body = <? value('emailbody') ?>, "
             + "emlprofile_printer = <? value('printer') ?>, "
             + "emlprofile_report = <? value('report') ?> "
             + "WHERE emlprofile_id = <? value('id') ?>"; 
  } 
  else 
  {
    var _sql = "INSERT INTO xt.emlprofile "
            + "(emlprofile_name, emlprofile_descrip, emlprofile_from, "
            + "emlprofile_to, emlprofile_cc, emlprofile_bcc, emlprofile_subject, "
            + "emlprofile_body, emlprofile_printer, emlprofile_report) "
            + " VALUES "
            + "(<? value('name') ?>, <? value('desc') ?>, <? value('emailfrom') ?>, "
            + " <? value('emailto') ?>, <? value('emailcc') ?>, <? value('emailbcc') ?>, <? value('emailsubject') ?>, "
            + "  <? value('emailbody') ?>, <? value('printer') ?>, <? value('report') ?>);";
  } 
  var qry = toolbox.executeQuery(_sql, params);
  if (xtCore.errorCheck(qry))
    mywindow.close(); 
}
    
_close.clicked.connect(mywindow.close);
_save.clicked.connect(sSave);
