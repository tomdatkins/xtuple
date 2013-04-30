/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.ppm.initList = function () {
    
    // ..........................................................
    // WORKSHEET
    //

    enyo.kind({
      name: "XV.WorksheetList",
      kind: "XV.List",
      label: "_worksheets".loc(),
      collection: "XM.WorksheetListItemCollection",
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      parameterWidget: "XV.WorksheetListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true},
                {kind: "XV.ListAttr", attr: "weekOf", fit: true,
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "status", classes: "right",
                  formatter: "formatStatus"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "employee.contact.name", classes: "italic",
                placeholder: "_noContact".loc()},
              {kind: "XV.ListAttr", attr: "owner.username"}
            ]}
          ]}
        ]}
      ],
      formatStatus: function (value, view, model) {
        var statusString;
        switch (value)
        {
        case 'O':
          statusString = '_open'.loc();
          break;
        case 'A':
          statusString = '_approved'.loc();
          break;
        case 'C':
          statusString = '_closed'.loc();
          break;
        default:
          statusString = '_error'.loc();
        }
        return statusString;
      }
    });

    XV.registerModelList("XM.WorksheetListItem", "XV.WorksheetList");
  };

}());
