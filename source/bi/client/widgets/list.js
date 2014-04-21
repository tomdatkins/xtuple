/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  /**
    An abstract list to be used for email profiles
  */
  enyo.kind({
    name: "XV.Toplist",
    kind: "List",
    count: 7,
    rowsPerPage: 3,
    published: {
      data: []
    },
    onSetupItem: "setupItem",
    components: [
      {kind: "XV.ListItem", name: "theitems", style: "border: 1px solid grey;",  components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "long", components: [
            {kind: "XV.ListAttr", name: "code", ontap: "clickDrill", classes: "hyperlink bold" },
          ]},
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {kind: "XV.ListAttr", name: "name"},
          ]},
          {kind: "XV.ListColumn", classes: "long", components: [
            {kind: "XV.ListAttr", name: "measure", style: "text-align: right;",}
          ]},
        ]}
      ]}
    ]
  });
}());