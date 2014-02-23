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
