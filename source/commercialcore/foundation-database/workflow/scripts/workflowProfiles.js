include("xtCore");

var _profiles = mywindow.findChild("_profiles");
var _newBtn   = mywindow.findChild("_newBtn");
var _editBtn  = mywindow.findChild("_editBtn");
var _deleteBtn = mywindow.findChild("_deleteBtn");

_profiles.addColumn(qsTr("Name"),        100,  Qt.AlignLeft,  true,  "name"  );
_profiles.addColumn(qsTr("Description"),  -1,  Qt.AlignLeft,  true,  "desc"  );

popProfiles();

function sNew()
{
  var newdlg          = toolbox.openWindow("workflowProfile", mywindow,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({mode: "new"});
  newdlg.exec();
  
  popProfiles();
}

function sEdit()
{
  if(_profiles.id() <= 0)
    return;
    
  var newdlg          = toolbox.openWindow("workflowProfile", 0,
                                  Qt.ApplicationModal, Qt.Dialog);
  toolbox.lastWindow().set({profile_id: _profiles.id(), mode: "edit"});
  newdlg.exec();
  
  popProfiles();
}

function popProfiles()
{
  var qry = toolbox.executeQuery("SELECT emlprofile_id AS id, emlprofile_name AS name, "
          + "emlprofile_descrip AS desc FROM xt.emlprofile");
  if (xtCore.errorCheck(qry))
    _profiles.populate(qry);  
}  
  
function sDelete()
{
  if(_profiles.id() <= 0)
    return;

  if (QMessageBox.question(mywindow, qsTr("Delete Profile?"),
    qsTr("Are you sure you want to delete the selected profile?"),
    QMessageBox.Yes, QMessageBox.No | QMessageBox.Default) == QMessageBox.No)
      return;
      
  var txt = "DELETE FROM xt.emlprofile WHERE emlprofile_id = <? value('profile_id') ?>";
  var qry = toolbox.executeQuery(txt, {profile_id: _profiles.id()});
  if (xtCore.errorCheck(qry))   
    popProfiles();
}

function sPopulateMenu(pMenu, selected)
{
  var menuItem;
      menuItem = pMenu.addAction(qsTr("Open Profile"));
      menuItem.triggered.connect(sEdit);
      menuItem = pMenu.addAction(qsTr("Delete Profiler"));
      menuItem.triggered.connect(sDelete);
}

_profiles["populateMenu(QMenu*,XTreeWidgetItem*,int)"].connect(sPopulateMenu);
_profiles["itemSelected(int)"].connect(sEdit);

_newBtn.clicked.connect(sNew);
_editBtn.clicked.connect(sEdit);
_deleteBtn.clicked.connect(sDelete);