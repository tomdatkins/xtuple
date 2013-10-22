XT.extensions.xtnbu.initWorkspace = function () {
  enyo.kind({
    name: "XV.BackUpWorkspace",
    kind: "XV.Workspace",
    title: "_xtnBackUp".loc(),
    model: "XM.BackUp",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "database"},
            {kind: "XV.InputWidget", attr: "storurl"},
            {kind: "XV.DateWidget", attr: "workdate"},
            {kind: "XV.InputWidget", attr: "loadedas"},
            {kind: "XV.InputWidget", attr: "ver"},
            {kind: "XV.InputWidget", attr: "edition"},
            {kind: "XV.InputWidget", attr: "packages"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.BackUp", "XV.BackUpWorkspace");
};

