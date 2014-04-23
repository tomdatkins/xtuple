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
      {kind: "XV.ListItem", name: "theitems", style: "border-bottom: 1px solid grey;  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2)",  components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "long", style: "width: 100px", components: [
            {kind: "XV.ListAttr", name: "code", ontap: "clickDrill", classes: "hyperlink bold" },
          ]},
          {kind: "XV.ListColumn", classes: "name-column", style: "width: 250px", components: [
            {kind: "XV.ListAttr", name: "name"},
          ]},
          {kind: "XV.ListColumn", classes: "long", style: "width: 150px", components: [
            {kind: "XV.ListAttr", name: "measure", style: "text-align: right;",}
          ]},
        ]}
      ]}
    ]
  });
}());