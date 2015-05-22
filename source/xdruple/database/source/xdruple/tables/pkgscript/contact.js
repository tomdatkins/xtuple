debugger;
//find the tab list and create a new widget to insert into it.
var _contact = mywindow.findChild("_contact");
var tablist  = mywindow.findChild("_tabWidget");
var _cntctId = false;

// load a predefined screen by name from the database
var page = toolbox.loadUi("xdrupleUserCntct", mywindow);

//insert the new tab
toolbox.tabInsertTab(tablist, 7, page, "xDruple Users");

var _xdUserContactAccountList            = mywindow.findChild("_xdUserContactAccountList");
var _addXdUserContactAccount             = mywindow.findChild("_addXdUserContactAccount");
var _editXdUserContactAccount            = mywindow.findChild("_editXdUserContactAccount");
var _deleteXdUserContactAccount          = mywindow.findChild("_deleteXdUserContactAccount");

_xdUserContactAccountList.addColumn(qsTr("xDruple Site"),     100, Qt.AlignLeft,   true,  "xd_site_name"  );
_xdUserContactAccountList.addColumn(qsTr("xDruple Site URL"), 100, Qt.AlignLeft,   true,  "xd_site_url"  );
_xdUserContactAccountList.addColumn(qsTr("Drupal User UUID"), 100, Qt.AlignLeft,   true,  "xd_user_contact_drupal_user_uuid"  );
_xdUserContactAccountList.addColumn(qsTr("CRM Account"),      100, Qt.AlignLeft,   true,  "crmacct_number"  );
_xdUserContactAccountList.addColumn(qsTr("Is Customer"),      50,  Qt.AlignLeft,   true,  "is_customer"  );
_xdUserContactAccountList.addColumn(qsTr("Is Prospect"),      50,  Qt.AlignLeft,   true,  "is_prospect"  );
_xdUserContactAccountList.addColumn(qsTr("Is Vendor"),        50,  Qt.AlignLeft,   false, "is_vendor"  );
_xdUserContactAccountList.addColumn(qsTr("Is Employee"),      50,  Qt.AlignLeft,   false, "is_employee"  );
_xdUserContactAccountList.addColumn(qsTr("Is Sales Rep"),     50,  Qt.AlignLeft,   false, "is_salesrep"  );
_xdUserContactAccountList.addColumn(qsTr("Is Partner"),       50,  Qt.AlignLeft,   false, "is_partner"  );
_xdUserContactAccountList.addColumn(qsTr("Is Competitor"),    50,  Qt.AlignLeft,   false, "is_competitor"  );
_xdUserContactAccountList.addColumn(qsTr("Is PG User"),       50,  Qt.AlignLeft,   true,  "is_pguser"  );
_xdUserContactAccountList.addColumn(qsTr("PG Username"),      100, Qt.AlignLeft,   true,  "crmacct_usr_username"  );

var populateXdUserContactAccountList = function () {
  _cntctId = _contact.id();
  var cntctParams = {
    "cntct_id": _cntctId
  };

  var qry = toolbox.executeDbQuery("xdUserContactAccounts", "detail", cntctParams);
  _xdUserContactAccountList.populate(qry);

  if (qry.lastError().type != 0) {
    throw new Error(qry.lastError().text);
  }
};

_contact['newId(int)'].connect(populateXdUserContactAccountList);
