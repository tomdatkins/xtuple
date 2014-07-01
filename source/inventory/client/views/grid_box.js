/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, enyo:true, _:true*/

(function () {

  XT.extensions.inventory.initGridBox = function () {

    // ..........................................................
    // SALES ORDER
    //

    enyo.kind({
      name: "XV.SalesOrderLineSupplyListRelations",
      kind: "XV.ListRelations",
      parentKey: "salesOrder",
      classes: "xv-grid-list",
      actions: [
        {name: "openItemWorkbench", label: "_workbench".loc(),
          prerequisite: "canOpenItemWorkbench",
          privilege: "ViewItemAvailabilityWorkbench",
          isViewMethod: true,
          notify: false}
      ],
      headerComponents: [
        {kind: "FittableColumns", classes: "xv-grid-list xv-list-header",
          components: [
          {kind: "XV.ListColumn", classes: "line-number", components: [
            {content: "#"},
          ]},
          {kind: "XV.ListColumn", classes: "name-column", components: [
            {content: "_item".loc()},
            {content: "_description".loc()},
            {content: "_site".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_quantity".loc()},
            {content: "_unit".loc()},
            {content: "_scheduled".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_shipped".loc()},
            {content: "_atShipping".loc()},
            {content: "_balance".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "right-column", components: [
            {content: "_onHand".loc()},
            {content: "_unit".loc()},
            {content: "_itemType".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_allocated".loc()},
            {content: "_unalloc.".loc()},
            {content: "_available".loc()}
          ]},
          {kind: "XV.ListColumn", classes: "quantity", components: [
            {content: "_ordered".loc()},
            {content: "_supply".loc()},
            {content: "_order#".loc()}
          ]}
        ]}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "line-number", components: [
              {kind: "XV.ListAttr", attr: "lineNumber"}
            ]},
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "XV.ListAttr", attr: "item.number",
                placeholder: "_noItem".loc()},
              {kind: "XV.ListAttr", attr: "item.description1",
                placeholder: "_noDescription".loc()},
              {kind: "XV.ListAttr", attr: "site.code"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "quantity",
                formatter: "formatQuantity", placeholder: "_noQuantity".loc()},
              {kind: "XV.ListAttr", attr: "quantityUnit.name",
                placeholder: "_noUnit".loc()},
              {kind: "XV.ListAttr", attr: "scheduleDate"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "shipped",
               formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "atShipping",
               formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "balance",
               formatter: "formatQuantity"},
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "availability.onHand",
               formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "item.inventoryUnit.name"},
              {kind: "XV.ListAttr", attr: "item.formatItemType"}
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", attr: "availability.allocated",
                formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "availability.unallocated",
                formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "availability.available",
                formatter: "formatQuantity"},
            ]},
            {kind: "XV.ListColumn", classes: "quantity", components: [
              {kind: "XV.ListAttr", formatter: "formatOrdered"},
              {kind: "XV.ListAttr", formatter: "formatOrderType"},
              {kind: "XV.ListAttr", attr: "childOrder.orderNumber"}
            ]},
            {name: "listItemMenu", kind: "onyx.Menu", floating: true, onSelect: "listActionSelected",
              maxHeight: 500, components: []
            }
          ]}
        ]}
      ],
      formatOrdered: function (value, view, model) {
        var childOrder = model.getValue("childOrder"),
          quantity = childOrder ? childOrder.get("quantity") :
            model.getValue("availability.ordered");

        return this.formatQuantity(quantity, view);
      },
      formatOrderType: function (value, view, model) {
        if (model.getValue("childOrder.orderNumber")) {
          return model.getValue("childOrder.formatOrderType");
        }
        return "";
      },
      openItemWorkbench: function (inEvent) {
        var item = this.getModel(inEvent.index).get("item"),
          afterDone = this.doneHelper(inEvent);

        this.doWorkspace({
          workspace: "XV.ItemWorkbenchWorkspace",
          id: item.id,
          callback: afterDone
        });
      }
    });

    // Add in supply list to grid box as panel
    var _proto = XV.SalesOrderLineItemGridBox.prototype,
      _setValue = _proto.setValue;

    _.extend(_proto.kindHandlers, {
      onWorkspace: "workspaceEvent",
      onActivatePanel: "panelActivated"
    });

    XV.SalesOrderNotify = function (model, message, options) {
      var list;

      if (options && options.request &&
        options.request === "itemSource") {

        // Select an item source
        list = new XV.ItemSourceList();
        this.bubble("onSearch", {
          list: "XV.ItemSourceList",
          callback: options.callback,
          parameterItemValues: [{name: "item", showing: false}],
          conditions: [{attribute: "item", value: options.payload}]
        }, this);
        return true;
      }

      // Moving on, nothing to see here.
      XV.EditorMixin.notify.apply(this, arguments);
    };

    _.extend(_proto.editorMixin, {
      /**
        Intercept notifications to see if there's
        a request for an item source
      */
      notify: XV.SalesOrderNotify
    });

    var _valueChanged = _proto.valueChanged,
      _bindCollection = _proto.bindCollection,
      _unbindCollection = _proto.unbindCollection;

    _.extend(_proto, {
      bindCollection: function () {
        var collection = this.getValue(),
          supplyList = this.$.supplyList;

        _bindCollection.apply(this, arguments);
        _.each(collection.models, function (model) {
          model.meta.on("change:availability", supplyList.refresh, supplyList);
        });
      },
      create: function () {
        var proto = XV.SalesOrderLineSupplyListRelations.prototype,
          components,
          listHeader,
          grid,
          panels,
          buttons;

        XV.Groupbox.prototype.create.apply(this, arguments);

        listHeader = {
          name: "supplyListHeader",
          components: proto.headerComponents,
          showing: false
        };

        components = this.buildComponents();

        // Replace grid with panels that contain grid and list
        grid = components.slice(2, 3)[0];
        panels = {
          kind: "Panels",
          draggable: false,
          fit: true,
          arrangerKind: "CollapsingArranger",
          name: "gridPanels",
          onTransitionFinish: "transitionFinished",
          components: [
            grid,
            {kind: "XV.SalesOrderLineSupplyListRelations", name: "supplyList",
              attr: "salesOrderLines"}
          ]
        };

        components.splice(2, 1, listHeader, panels);

        // Add nav buttons
        buttons = components.slice(4, 5)[0];
        // First button is plain with manually applied classes to make it marry
        // up nicely with the buttons on the adjacent radio group
        buttons.components = [
          {classes: "xv-buttons",
          controlClasses: "enyo-inline",
          components: [
            {kind: "onyx.Button", name: "newButton",
              onclick: "newItem", classes: "icon-plus text", content: "_new".loc()},
            {kind: "onyx.Button", name: "editButton", active: true, selected: true,
            classes: "icon-edit text selected", ontap: "togglePanels", content: "_edit".loc()},
            {kind: "onyx.Button", name: "supplyButton", ontap: "togglePanels", classes: "icon-truck text",
              content: "_supply".loc()},
            {kind: "onyx.Button", name: "exportButton", ontap: "exportAttr",
              classes: "icon-share text", content: "_export".loc()}
          ]}
        ];
        this.createComponents(components);
      },
      panelActivated: function () {
        var panels = this.$.gridPanels;

        // Go to next (supply list) if we came from supply list
        if (!panels.animate) {
          if (this.$.supplyButton.selected) {panels.next(); }
          panels.animate = true;
        }
      },
      setValue: function (value) {
        _setValue.apply(this, arguments);
        this.$.supplyList.setValue(value);
      },
      togglePanels: function (inSender, inEvent) {
        var tappedButtonName = inEvent.originator.name,
          supplySelected = tappedButtonName === "supplyButton",
          idx = supplySelected ? 1 : 0;

        this.$.supplyButton.selected = supplySelected;
        this.$.supplyButton.addRemoveClass("selected", supplySelected);

        this.$.editButton.selected = !supplySelected;
        this.$.editButton.addRemoveClass("selected", !supplySelected);

        this.$.gridPanels.setIndex(idx);
        this.$.gridHeader.setShowing(idx === 0);
        this.$.newButton.setDisabled(idx > 0);
        this.$.supplyListHeader.setShowing(idx === 1);
      },
      transitionFinished: function (inSender, inEvent) {
        var destroying = function (control) {
            if (control.destroying) {
              return true;
            } else if (control.parent) {
              return destroying(control.parent);
            }
            return false;
          };

        // Little hack. Without it white column appears on the right
        // where a scroll bar was/would be
        if (this.$.gridPanels.getIndex() === 1 &&
            !destroying(inSender)) {
          this.$.supplyList.render();
        }
      },
      unbindCollection: function () {
        var collection = this.getValue(),
          supplyList = this.$.supplyList;

        _unbindCollection.apply(this, arguments);
        _.each(collection.models, function (model) {
          model.meta.off("change:availability", supplyList.refresh, supplyList);
        });
      },
      valueChanged: function () {
        var panels = this.$.gridPanels;

        // Work around breakage when re-render on index 1.
        if (panels.getIndex() === 1) {
          panels.animate = false; // Get it done quickly
          panels.setIndex(0);
        }
        _valueChanged.apply(this, arguments);
        if (!panels.animate) {
          panels.setIndex(1);
          panels.animate = true;
        }
      },
      workspaceEvent: function (inSender, inEvent) {
        // The panels get reset by a resize event when we
        // come back so we can't navigate them any more.
        // Resolve by moving to 0 index first then move back
        // to supply list again when we're done with the workspace
        this.$.gridPanels.animate = false; // Get it done quickly
        this.$.gridPanels.setIndex(0);
      }
    });

    // ..........................................................
    // TRANSFER ORDER
    //

    enyo.kind({
      name: "XV.TransferOrderLineGridBox",
      kind: "XV.GridBox",
      classes: "small-panel",
      title: "_lineItems".loc(),
      workspace: "XV.TransferOrderLineWorkspace",
      parentKey: "transferOrder",
      orderBy: [{attribute: 'lineNumber'}],
      columns: [
        {classes: "line-number", header: "#", rows: [
          {readOnlyAttr: "lineNumber",
            editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
        ]},
        {classes: "grid-item", header: "_item".loc(), rows: [
          {readOnlyAttr: "item.number",
            editor: {kind: "XV.TransferOrderItemWidget",
              attr: {item: "item", transferOrder: "transferOrder"}}},
          {readOnlyAttr: "item.description1"}
        ]},
        {classes: "quantity", header: "_quantity".loc(), rows: [
          {readOnlyAttr: "quantity",
            editor: {kind: "XV.QuantityWidget", attr: "quantity",
              name: "quantityWidget"}},
          {readOnlyAttr: "unit",
            editor: {kind: "XV.InputWidget", attr: "unit"}}
        ]},
        {classes: "date", header: ["_scheduled".loc(), "_promised".loc()], rows: [
          {readOnlyAttr: "scheduleDate",
            editor: {kind: "XV.DateWidget", attr: "scheduleDate"}},
          {readOnlyAttr: "promiseDate",
            editor: {kind: "XV.DateWidget", attr: "promiseDate"}}
        ]},
        {classes: "quantity", header: ["_shipped".loc(), "_received".loc()], rows: [
          {readOnlyAttr: "shipped",
            editor: {kind: "XV.QuantityWidget", attr: "shipped",
              name: "shippedWidget"}},
          {readOnlyAttr: "received",
            editor: {kind: "XV.QuantityWidget", attr: "received",
              name: "receivedWidget"}},
        ]},
      ]
    });

    enyo.kind({
      name: "XV.TransferOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.TransferOrderWorkflowWorkspace"
    });

  };

}());
