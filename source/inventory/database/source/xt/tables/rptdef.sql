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
      "definition": [{"attr": "shipDate", "label": true}],
      "options": {"x": 0, "y": 120}
    },
    {
      "definition": [{"text": "_billto", "label": true}],
      "options": {"x": 0, "y": 140}
    },
    {
      "definition": [
        {"attr": "order.billtoName"}
      ],
      "options": {"x": 100, "y": 140, "width": 250}
    },
    {
      "definition": [{"attr": "shipVia", "label": true}],
      "options": {"x": 300, "y": 160}
    },
    {
      "definition": [{"text": "_shipto", "label": true}],
      "options": {"x": 0, "y": 160}
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
      "options": {"x": 100, "y": 160, "width": 250}
    },
    {
      "definition": [{"attr": "attention", "label": "_attention"}],
      "options": {"x": 0, "y": 220}
    },
    {
      "definition": [{"attr": "terms", "label": "_terms"}],
      "options": {"x": 300, "y": 220}
    },
    {
      "definition": [{"attr": "notes", "label": true}],
      "options": {"x": 0, "y": 240}
    },
    {"element": "fontBold"},
    {
      "element": "band",
      "definition": [
        {"text": "_lineNumber", "width": 100},
        {"text": "_item", "width": 100},
        {"text": "_uom", "width": 100},
        {"text": "_ordered", "width": 100},
        {"text": "_shipped", "width": 100},
        {"text": "_verified", "width": 100}
      ],
      "options": {"border": 0, "padding": 5, "x": 0, "y": 280}
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
        {"attr": "lineItems*orderLine.quantityUnit", "width": 100},
        {"attr": "lineItems*orderLine.quanity", "width": 100},
        {"attr": "lineItems*orderLine.transacted", "width": 100},
        {"attr": "", "width": 100}
      ],
      "options": {"fontBold": true, "border": 0, "padding": 12}
    }
  ],
  "footerElements": [
  ]
}$$);
