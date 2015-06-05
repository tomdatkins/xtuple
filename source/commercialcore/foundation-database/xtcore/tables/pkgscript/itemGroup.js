/**
 * Add Document and Characteristic association support to Item Groups.
 */

function set(pParams) {
}

(function () {
  var _charass   = toolbox.createWidget("CharacteristicsWidget", mywindow, "_charass"),
      _docass    = toolbox.createWidget("Documents", mywindow, "_documents"),
      _lytwidget = mywindow.findChild("_memberItemsLit"),
      _lyt       = toolbox.widgetGetLayout(_lytwidget),
      _tab       = toolbox.createWidget("QTabWidget", mywindow, "_tab")
  ;

  _lyt.addWidget(_tab);
  _tab.insertTab(0, _charass, qsTr("Characteristics"));
  _tab.insertTab(1, _docass,  qsTr("Documents"));

  _charass.setType("ITEMGRP");
  _docass.setType("ITEMGRP");
  mywindow["newId(int)"].connect(_charass, "setId");
  mywindow["newId(int)"].connect(_docass,  "setId");
  mywindow["newMode(int)"].connect(sHandleMode);

  function sHandleMode(mode) {
    _charass.setReadOnly(mode == mainwindow.cView);
  }
})();
