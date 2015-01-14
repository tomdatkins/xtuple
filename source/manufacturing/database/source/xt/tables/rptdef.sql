-- Almost identical to EnterReceipt receiving label definition.
select xt.add_report_definition('XM.PostProduction', 0, $${
  "settings": {
    "detailAttribute": "detail",
    "defaultFontSize": 12,
    "defaultMarginSize": 10,
    "pageBreakDetail": false,
    "paper": "A7",
    "landscape": true,
    "width": 150
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
      "options": {"x": 0, "y": 50}
    },
    {
      "definition": [
        {"attr": "itemSite.item.description1"}
      ],
      "options": {"x": 0, "y": 60, "fontSize": 10}
    },
    {
      "definition": [{"text": "WO", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 70, "fontSize": 10}
    },
    {
      "definition": [
        {"attr": "workOrder.name"}
      ],
      "options": {"x": 40, "y": 70, "fontSize": 10}
    },
    {
      "definition": [
        {"attr": "dueDate"}
      ],
      "options": {"fontSize": 10, "x": 80, "y": 70}
    },
    {
      "definition": [
        {"attr": "detail*trace"}
      ],
      "options": {"x": 0, "y": 80, "fontSize": 28, "font": "./fonts/f39.ttf"}
    },
    {
      "definition": [
        {"attr": "detail*trace"}
      ],
      "options": {"x": 0, "y": 105}
    },
    {
      "definition": [
        {"attr": "detail*expireDate"}
      ],
      "options": {"x": 0, "y": 120}
    }
  ],
  "headerElements": [
  ],
  "footerElements": [
  ]
}$$);
