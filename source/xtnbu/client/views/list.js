XT.extensions.xtnbu.initList = function () {
  enyo.kind({
    name: "XV.BackUpList",
    kind: "XV.List",
    label: "_backUp".loc(),
    collection: "XM.BackUpCollection",
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "database"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "storurl"},
            {kind: "XV.ListAttr", attr: "workdate"},
            {kind: "XV.ListAttr", attr: "loadedas"},
            {kind: "XV.ListAttr", attr: "ver"},
            {kind: "XV.ListAttr", attr: "edition"},
            {kind: "XV.ListAttr", attr: "packages"}
          ]}
        ]}
      ]}
    ]
  });
};
