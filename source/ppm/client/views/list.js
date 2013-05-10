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
      handlers: {
        onSelect: "menuItemSelected"
      },
      query: {orderBy: [
        {attribute: 'number', numeric: true}
      ]},
      parameterWidget: "XV.WorksheetListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true},
                {kind: "XV.ListAttr", attr: "getWorksheetStatusString"},
                {kind: "XV.ListAttr", attr: "weekOf", fit: true,
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "employee.contact.name",
                  placeholder: "_noContact".loc()},
                {kind: "XV.ListAttr", attr: "totalHours", formatter: "formatHours",
                  classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "toInvoice", formatter: "formatInvoice",
                classes: "italic"},
              {kind: "XV.ListAttr", attr: "toVoucher", formatter: "formatVoucher"}
            ]}
          ]}
        ]}
      ],
      formatHours: XV.ProjectList.prototype.formatHours,
      formatInvoice: function (value, view, model) {
        var invoiced = model.get("invoiced");
        if (!value && invoiced) { return "_invoiced".loc(); }
        view.addRemoveClass("placeholder", !value);
        var scale = XT.session.locale.attributes.currencyScale;
        return value ? Globalize.format(value, "c" + scale) : "_noInvoice".loc();
      },
      formatVoucher: function (value, view, model) {
        var vouchered = model.get("vouchered");
        if (!value && vouchered) { return "_vouchered".loc(); }
        view.addRemoveClass("placeholder", !value);
        var scale = XT.session.locale.attributes.currencyScale;
        return value ? Globalize.format(value, "c" + scale) : "_noVoucher".loc();
      }
    });

    XV.registerModelList("XM.WorksheetListItem", "XV.WorksheetList");
  };

}());
