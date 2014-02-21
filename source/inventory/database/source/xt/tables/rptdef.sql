select xt.add_report_definition('XM.Location', 0, $${
  "settings": {
    "defaultFontSize": 12,
    "defaultMarginSize": 20
  },
  "headerElements": [
    {
      "definition": [{"text": "_orderNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 180}
    },
    {
      "definition": [{"attr": "aisle"}],
      "options": {"x": 500, "y": 60, "align": "right", "font": "./fonts/f39.ttf"}
    }
  ],
  "detailElements": [
  ],
  "footerElements": [
  ]
}$$);
