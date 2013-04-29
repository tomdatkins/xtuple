/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initWorkspaces = function () {
    
    // ..........................................................
    // PROJECT
    //
  
    var extensions = [
      {kind: "onyx.GroupboxHeader", container: "mainGroup", content: "_billing".loc()},
      {kind: "XV.CustomerWidget", container: "mainGroup", attr: "customer"},
      {kind: "XV.MoneyWidget", container: "mainGroup", attr: "rate"}
    ];

    XV.appendExtension("XV.ProjectWorkspace", extensions);
    
    // ..........................................................
    // WORKSHEET
    //

    enyo.kind({
      name: "XV.WorksheetWorkspace",
      kind: "XV.Workspace",
      title: "_worksheet".loc(),
      model: "XM.Worksheet",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel",
            components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "weekOf"},
              {kind: "XV.EmployeeWidget", attr: "employee"},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.WorksheetTimeBox", attr: "time"},
          {kind: "XV.WorksheetExpenseBox", attr: "expenses"},
          {kind: "XV.WorksheetDocumentsBox", attr: "documents"}
        ]}
      ]
    });
  
    XV.registerModelWorkspace("XM.WorksheetListItem", "XV.WorksheetWorkspace");
  };

}());
