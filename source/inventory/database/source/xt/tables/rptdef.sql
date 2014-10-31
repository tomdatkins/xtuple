select xt.add_report_definition('XM.IssueToShipping', 0, $${
  "settings": {
    "defaultFontSize": 8,
    "defaultMarginSize": 10,
    "pageBreakDetail": false,
    "width": 150
  },
  "detailElements": [
    {
      "definition": [
        {"attr": "itemSite.item.number"}
      ],
      "options": {"x": 0, "y": 0, "align": "center", "width": 150, "fontSize": 10, "fontBold": true}
    },
    {
      "definition": [
        {"attr": "itemSite.item.description1"}
      ],
      "options": {"x": 0, "y": 18, "width": 150, "align": "center", "wrap": 2}
    },
    {
      "definition": [
        {"attr": "itemSite.item.number"}
      ],
      "options": {"x": 0, "y": 35, "align": "center", "width": 150, "fontSize": 24, "font": "./fonts/f39.ttf"}
    },
    {"element": "bandLine", "size": 2},
    {
      "definition": [{"text": "_ord#", "label": true}],
      "options": {"x": 0, "y": 55}
    },
    {
      "definition": [
        {"attr": "order.number"}
      ],
      "options": {"x": 20, "y": 55, "align": "right", "width": 50, "fontBold": true, "fontSize": 10}
    },
    {
      "definition": [{"text": "_cust#", "label": true}],
      "options": {"x": 70, "y": 55, "align": "right", "width": 50}
    },
    {
      "definition": [
        {"attr": "order.custNumber"}
      ],
      "options": {"x": 110, "y": 55, "align": "right", "width": 50, "fontBold": true}
    },
    {
      "definition": [{"text": "_scheddate", "label": true}],
      "options": {"x": 75, "y": 65}
    },
    {
      "definition": [
        {"attr": "scheduleDate"}
      ],
      "options": {"x": 110, "y": 65, "align": "right", "width": 50}
    },
    {
      "definition": [{"text": "_shipto", "label": true}],
      "options": {"x": 0, "y": 65}
    },
    {
      "definition": [
        {"attr": "order.shipToName"},
        {"attr": "order.shipToAddress1"},
        {"attr": "order.shipToAddress2"},
        {"attr": "order.shipToAddress3"},
        {"attr": "order.shipToCity"},
        {"attr": "order.shipToState"},
        {"attr": "order.shipToPostalCode"},
        {"attr": "order.shipToPhone"}
      ],
      "transform": "address",
      "options": {"x": 0, "y": 75}
    }
  ],
  "headerElements": [
  ],
  "footerElements": [
  ],
  "pageFooterElements": [
  ]
}$$);

select xt.add_report_definition('XM.Location', 0, $${
  "settings": {
    "defaultFontSize": 12,
    "defaultMarginSize": 20
  },
  "headerElements": [
    {
      "definition": [{"text": "_location"}],
      "options": {"x": 83, "y": 0}
    },
    {
      "definition": [
        {"attr": "aisle"},
        {"attr": "rack"},
        {"attr": "bin"},
        {"attr": "location"}
      ],
      "transform": "arbl",
      "options": {"x": 30, "y": 40, "fontSize": 36, "font": "./fonts/f39.ttf"}
    },
    {
      "definition": [
        {"attr": "aisle"},
        {"attr": "rack"},
        {"attr": "bin"},
        {"attr": "location"}
      ],
      "transform": "arbl",
      "options": {"fontBold": true, "x": 75, "y": 75}
    }
  ],
  "detailElements": [
  ],
  "footerElements": [
  ]
}$$);

select xt.add_report_definition('XM.EnterReceipt', 0, $${
  "settings": {
    "detailAttribute": "detail",
    "defaultFontSize": 12,
    "defaultMarginSize": 20,
    "pageBreakDetail": true
  },
  "detailElements": [
    {
      "definition": [
        {"attr": "itemSite.item.number"}
      ],
      "options": {"x": 0, "y": 0, "fontSize": 36, "font": "./fonts/f39.ttf"}
    },
    {
      "definition": [
        {"attr": "itemSite.item.number"}
      ],
      "options": {"x": 40, "y": 50}
    },
    {
      "definition": [
        {"attr": "detail*trace"}
      ],
      "options": {"x": 0, "y": 80, "fontSize": 36, "font": "./fonts/f39.ttf"}
    },
    {
      "definition": [
        {"attr": "detail*trace"}
      ],
      "options": {"x": 40, "y": 110}
    },
    {
      "definition": [
        {"attr": "detail*expireDate"}
      ],
      "options": {"x": 40, "y": 160}
    }
  ],
  "headerElements": [
  ],
  "footerElements": [
  ]
}$$);

select xt.add_report_definition('XM.Shipment', 0, $${
  "settings": {
    "defaultFontSize": 12,
    "defaultMarginSize": 20,
    "detailAttribute": "lineItems"
  },
  "headerElements": [
    {
      "element": "image",
      "definition": "Shipment Logo",
      "options": {"x": 300, "y": 40, "width": 150}
    },
    {
      "definition": [{"text": "_packingList"}],
      "options": {"x": 0, "y": 40, "fontBold": true, "fontSize": 18}
    },
    {
      "definition": [{"attr": "number", "label": "_shipNumber"}],
      "options": {"x": 0, "y": 80}
    },
    {
      "definition": [{"attr": "order.number", "label": "_orderNumber"}],
      "options": {"x": 0, "y": 100}
    },
    {
      "definition": [{"attr": "order.customer.number", "label": "_customerNumber"}],
      "options": {"x": 0, "y": 120}
    },
    {
      "definition": [{"attr": "order.customerPurchaseOrderNumber", "label": "_purchaseOrderNumber"}],
      "options": {"x": 0, "y": 140}
    },
    {
      "definition": [{"attr": "order.orderDate", "label": "_orderDate"}],
      "options": {"x": 0, "y": 160}
    },
    {
      "definition": [{"attr": "order.scheduleDate", "label": "_scheduleDate"}],
      "options": {"x": 0, "y": 180}
    },
    {
      "definition": [{"attr": "shipVia", "label": "_shipVia"}],
      "options": {"x": 300, "y": 180}
    },
    {
      "definition": [{"text": "_billto", "label": true}],
      "options": {"x": 0, "y": 200}
    },
    {
      "definition": [
        {"attr": "order.billtoName"},
        {"attr": "order.billtoAddress1"},
        {"attr": "order.billtoAddress2"},
        {"attr": "order.billtoAddress3"},
        {"attr": "order.billtoCity"},
        {"attr": "order.billtoState"},
        {"attr": "order.billtoPostalCode"},
        {"attr": "order.billtoCountry"},
        {"attr": "order.billtoPhone"}
      ],
      "transform": "address",
      "options": {"x": 100, "y": 200, "width": 250}
    },
    {
      "definition": [{"text": "_shipto", "label": true}],
      "options": {"x": 300, "y": 200}
    },
    {
      "definition": [
        {"attr": "order.shiptoName"},
        {"attr": "order.shiptoAddress1"},
        {"attr": "order.shiptoAddress2"},
        {"attr": "order.shiptoAddress3"},
        {"attr": "order.shiptoCity"},
        {"attr": "order.shiptoState"},
        {"attr": "order.shiptoPostalCode"},
        {"attr": "order.shiptoCountry"},
        {"attr": "order.shiptoPhone"}
      ],
      "transform": "address",
      "options": {"x": 400, "y": 200, "width": 250}
    },
    {
      "definition": [{"attr": "order.contactName", "label": "_attention"}],
      "options": {"x": 0, "y": 280}
    },
    {
      "definition": [{"attr": "order.terms.description", "label": "_terms"}],
      "options": {"x": 300, "y": 280}
    },
    {"element": "fontBold"},
    {
      "element": "band",
      "definition": [
        {"text": "_lineNumber", "width": 100},
        {"text": "_item", "width": 100},
        {"text": "_uom", "width": 50},
        {"text": "_ordered", "width": 100},
        {"text": "_shipped", "width": 100},
        {"text": "_verified", "width": 100}
    ],
      "options": {"border": 0, "padding": 5, "x": 0, "y": 320}
    },
    {"element": "bandLine", "size": 2}
  ],
  "detailElements": [
    {"element": "fontNormal"},
    {
      "element": "band",
      "definition": [
        {"attr": "lineItems*orderLine.lineNumber", "width": 100},
        {"attr": "lineItems*orderLine.item.number", "width": 100},
        {"attr": "lineItems*orderLine.quantityUnit", "width": 50},
        {"attr": "lineItems*orderLine.ordered", "width": 100},
        {"attr": "lineItems*orderLine.quantity", "width": 100},
        {"attr": "lineItems*orderLine.verified", "width": 100}
      ],
      "options": {"fontBold": true, "border": 0, "padding": 12}
    }
  ],
  "footerElements": [
    {"element": "bandLine", "size": 2},
    {
      "definition": [
        {"attr": "notes", "label": true}
      ],
      "options": {"fontSize": 10, "width": 400}
    }
  ],
  "pageFooterElements": [
    {
      "element": "pageNumber", "definition": [],
      "options": {"align": "center"}
    }
  ]
}$$);
