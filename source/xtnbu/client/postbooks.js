XT.extensions.xtnbu.initPostbooks = function () {
  var panels, relevantPrivileges;

  panels = [
    {name: "backUpList", kind: "XV.BackUpList"}
  ];
  XT.app.$.postbooks.appendPanels("setup", panels);
};
