select xt.add_report_definition('XM.QualityTest', 0, $${
  "settings": {
    "detailAttribute": "qualityTestItems",
    "defaultFontSize": 10,
    "defaultMarginSize": 20
  },
  "headerElements": [
    {
      "definition": [{"text": "_qualityTest"}],
      "options": {"fontBold": true, "fontSize": 18, "x": 250, "y": 40, "align": "right"}
    },
    {
      "definition": [{"text": "_startDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 70}
    },
    {
      "definition": [{"attr": "startDate"}],
      "options": {"x": 500, "y": 70, "align": "right"}
    },
    {
      "definition": [{"text": "_completedDate", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 85}
    },
    {
      "definition": [{"attr": "completedDate"}],
      "options": {"x": 500, "y": 85, "align": "right"}
    },
    {
      "definition": [{"text": "_testStatus", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 100}
    },
    {
      "definition": [{"attr": "testStatus"}],
      "options": {"x": 500, "y": 100, "align": "right"}
    },
    {
      "definition": [{"text": "_testDisposition", "label": true}],
      "options": {"fontBold": true, "x": 400, "y": 115}
    },
    {
      "definition": [{"attr": "testDisposition"}],
      "options": {"x": 500, "y": 115, "align": "right"}
    },
    {
      "definition": [{"text": "_testNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 70}
    },
    {
      "definition": [{"attr": "number"}],
      "options": {"x": 100, "y": 70}
    },
    {
      "definition": [{"text": "_revisionNumber", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 100}
    },
    {
      "definition": [{"attr": "revisionNumber"}],
      "options": {"x": 100, "y": 100}
    },
    {
      "definition": [{"text": "_qualityPlan", "label": true}],
      "options": {"fontBold": true, "x": 0, "y": 115}
    },
    {
      "definition": [{"attr": "qualityPlan.number"}],
      "options": {"x": 100, "y": 115}
    },
    {"element": "fontBold"},
    {
      "element": "band",
      "definition": [
        {"text": "_quality_test_items", "width": 50, "align": "left"},
        {"text": "_description", "width": 100, "align": "left"},
        {"text": "_target", "width": 50},
        {"text": "_actual", "width": 80},
        {"text": "_result", "width": 80},
        {"text": "_notes", "width": 300, "align": "left"}
      ],
      "options": {"border": 0, "padding": 5, "x": 0, "y": 140}
    },
    {"element": "bandLine", "size": 2}
  ],
  "detailElements": [
    {"element": "fontNormal"},
    {
      "element": "band",
      "definition": [
        {"attr": "qualityTestItems*lineNumber", "width": 50, "align": "left"},
        {"attr": "qualityTestItems*description", "width": 100, "align": "left"},
        {"attr": "qualityTestItems*target", "width": 50},
        {"attr": "qualityTestItems*actual", "width": 80, "fontBold": true},
        {"attr": "qualityTestItems*result", "width": 80, "fontBold": true},
        {"attr": "qualityTestItems*notes", "height": 50, "width": 300, "align": "left"}
      ],
      "options": {"fontBold": true, "border": 0, "padding": 5}
    }
  ],
  "footerElements": [
    {"element": "bandLine", "size": 2},
    { "definition": [{"text": "_notes", "width": 300, "align": "left"}],
      "options": {"fontBold": true}
    },  
    {
      "definition": [{"attr": "testNotes", "label": false}],
      "options": {"fontSize": 10, "width": 500}
    }
  ],
  "pageFooterElements": [
    {
      "element": "pageNumber", "definition": [],
      "options": {"x": 800, "align": "right", "padding": 12}
    }
  ]
}$$);
