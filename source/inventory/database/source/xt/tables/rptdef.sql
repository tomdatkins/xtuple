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
