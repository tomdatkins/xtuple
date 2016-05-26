// shared info for workflow activities

var wftype = {
  Sales: {
  	name: "Sales",
    id: "1",
    module: "xt.saletypewf",
    wfmodule: "xt.wf",
    typeqry: "SELECT saletype_id AS id, saletype_code AS code FROM saletype",
    types: [
      { id: 1, code: "O", text: "OTHER"},
      { id: 2, code: "P", text: "PACK" },
      { id: 3, code: "S", text: "SHIP" },
      { id: 4, code: "C", text: "CREDIT CHECK" }
    ]
  },
  Purchase: {
    name: "Purchase",
    id: "2",
    module: "xt.potypewf",
    wfmodule: "xt.powf",
    typeqry: "SELECT potype_id AS id, potype_code AS code FROM xt.potype",
    types: [
      { id: 1, code: "O", text: "OTHER" },
      { id: 2, code: "R", text: "RECEIVE" },
      { id: 3, code: "T", text: "POST RECEIPT" }
    ] 
  },
  Inventory: {
    name: "Inventory",
    id: "3",
    module: "xt.sitetypewf",
    wfmodule: "xt.towf",
    typeqry: "SELECT sitetype_id AS id, sitetype_name AS code FROM sitetype",
   types: [
      { id: 1, code: "O", text: "OTHER" },
      { id: 2, code: "R", text: "RECEIVE" },
      { id: 3, code: "T", text: "POST RECEIPT" },
      { id: 4, code: "P", text: "PACK" },
      { id: 5, code: "S", text: "SHIP" }
    ]
  },
  Project: {
  	 name: "Project",
     id: "4",
     module: "xt.prjtypewf",
     wfmodule: "xt.prjwf",
   typeqry: "SELECT prjtype_id AS id, prjtype_code AS code FROM prjtype",
   types: [
      { id: 1, code: "O", text: "OTHER" }
    ]
  },
  Manufacture: {
  	name: "Manufacture",
     id: "5",
     module: "xt.plancodewf",
     wfmodule: "xt.wowf",
   typeqry: "SELECT plancode_id AS id, plancode_code AS code FROM plancode",
   types: [
      { id: 1, code: "O", text: "OTHER" },
      { id: 2, code: "I", text: "ISSUE MATERIAL" },
      { id: 3, code: "P", text: "POST PRODUCTION" },
      { id: 4, code: "T", text: "TEST" }
    ]
  },
  Quality: {
  	name: "Quality",
     id: "6",
     module: "xt.qualityplanwf",
     wfmodule: "xt.qualitytestwf",
   typeqry: "SELECT qphead_id AS id, qphead_code AS code FROM xt.qphead",
   types: [
      { id: 1, code: "I", text: "IN-PROCESS" },
      { id: 2, code: "OK", text: "RELEASE" },
      { id: 3, code: "Q", text: "QUARANTINE" },
      { id: 4, code: "R", text: "REWORK" },
      { id: 5, code: "S", text: "SCRAP" }
    ]
  }

};

var status = {
   options: [
     { id: 1, code: 'P', text: 'Pending' },
     { id: 2, code: 'I', text: 'In-Process' },
     { id: 3, code: 'C', text: 'Completed' },
     { id: 4, code: 'D', text: 'Deferred' }
    ]
};

var next_status = {
   options: [
      { id: 1, code: 'O', text: 'Open' },
      { id: 2, code: 'C', text: 'Closed' },
      { id: 3, code: 'U', text: 'Unreleased' },
      { id: 4, code: '', text: 'No Change' }
   ]
};

var ismfg_qry = "SELECT EXISTS(SELECT * FROM information_schema.tables " +
            "WHERE table_schema = 'xt' AND  table_name = 'plancodewf') AS test"
var ismfg_result = toolbox.executeQuery(ismfg_qry);
if(ismfg_result.first())
    var ismfg = ismfg_result.value('test');

var hasqual_qry = "SELECT EXISTS(SELECT * FROM information_schema.tables " +
            "WHERE table_schema = 'xt' AND  table_name = 'qualityplanwf') AS test"
var hasqual_result = toolbox.executeQuery(hasqual_qry);
if(hasqual_result.first())
    var hasqual = hasqual_result.value('test');