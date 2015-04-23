
--                   pEnum pType  pFull              pTable      pKey          pNumber               pName            pDesc
--                   pWidget pJoin pParam pUi pPriv
select createDoctype( 1, 'ADDR', 'Address',          'addr',     'addr_id',     'addr_number',         'addr_line1',    'addr_line2');
select createDoctype( 2, 'BBH',  'Breeder BOM Head', 'bbomhead', 'bbomhead_id', 'bbomhead_docnum',     'item_number',   'firstline(item_descrip1)',
                     '', 'join item on bomhead_item_id = item_id', 'bomhead_id', 'bom');
select createDoctype( 3, 'BBI',  'Breeder BOM Item', 'bbomitem', 'bbomitem_id', 'bbomitem_docnum',     'item_number',   'firstline(item_descrip1)',
                     '', 'join item on bbomitem_item_id = item_id', 'bbomitem_id', 'bbom');
select createDoctype( 4, 'BMH',  'BOM Head',         'bomhead',  'bomhead_id',  'bomhead_docnum',      'item_number',   'firstline(item_descrip1)',
                     '', 'join item on bomhead_item_id = item_id', 'bomhead_id', 'bom');
select createDoctype( 5, 'BMI',  'BOM Item',         'bomitem', 'bomitem_id', 'p.item_number',      'c.item_number', 'firstline(c.item_descrip1)',
                     '', 'join item p on bomitem_parent_item_id = p.item_id join item c on bomitem_item_id = c.item_id');
select createDoctype( 6, 'BOH',  'Routing Head',     'booitem', 'booitem_id', 'p.item_number',      'c.item_number', 'firstline(c.item_descrip1)',
                     '', 'join item p on booitem_parent_item_id = p.item_id join item c on bomitem_item_id = c.item_id');
select createDoctype( 7, 'BOI',  'Routing Item',     'bomitem', 'bomitem_id', 'p.item_number',      'c.item_number', 'firstline(c.item_descrip1)',
                     '', 'join item p on bomitem_parent_item_id = p.item_id join item c on bomitem_item_id = c.item_id');
select createDoctype( 8, 'CRMA', 'Account',          'crmacct', 'crmacct_id', 'crmacct_number',     'crmacct_name',  'firstline(crmacct_notes)',
                     'core', '',     'crmacct_id', 'crmaccount');
select createDoctype( 9, 'T',    'Contact',          'cntct',   'cntct_id',   'cntct_number',       'cntct_name',    'cntct_title',
                     'core', '',     'cntct_id',   'contact');
select createDoctype(10, 'CNTR', 'Contract',         'cntrct',  'cntrct_id',  'cntrct_number',      'vend_name',     'cntrct_descrip',
                     '', '',     'cntrct_id',  'contrct');
select createDoctype(11, 'CM',   'Return',           'cmhead',  'cmhead_id',  'cmhead_number',      'cust_name',     'firstline(cmhead_comments)',
                     '', 'join custinfo on cmhead_cust_id = cust_id', 'cmhead_id', 'creditMemo');
select createDoctype(12, 'CMI',  'Return Item',      'cmitem',  'cmitem_id',  'cmhead_number',      'cust_name',     'item_number',
                     '', 'join cmhead on cmitem_cmhead_id=cmhead_id join custinfo on cmhead_cust_id=cust_id ' ||
                     'join itemsite on cmitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(13, 'C',    'Customer',         'custinfo',  'cust_id',  'cust_number',        'cust_name',     'firstline(cust_comments)',
                     'core', '',     'cust_id',    'customer');
select createDoctype(14, 'EMP',  'Employee',         'emp',     'emp_id',     'emp_number',         'cntct_name',    'cntct_title',
                     'core', 'left outer join cntct on emp_cntct_id = cntct_id', 'emp_id', 'employee');
select createDoctype(15, 'INCDT','Incident',         'incdt',   'incdt_id',   'incdt_number::text', 'incdt_summary', 'firstline(incdt_descrip)',
                     'core', '',     'incdt_id',         'incident', 'MaintainPersonalIncidents MaintainAllIncidents');
select createDoctype(16, 'INV',  'Invoice',          'invchead','invchead_id','invchead_invcnumber','cust_name', 'firstline(invchead_notes)',
                     'core', 'join custinfo on invchead_cust_id = cust_id', 'invchead_id', 'invoice');
select createDoctype(17, 'INVI', 'Invoice Item',     'invcitem','invcitem_id','invchead_invcnumber','cust_name', 'item_number', '',
                     'join invchead on invcitem_invchead_id = invchead_id ' ||
                     'join custinfo on invchead_cust_id = cust_id join item on invcitem_item_id=item_id');
select createDoctype(18, 'I',    'Item',             'item',    'item_id',    'item_number',         'firstline(item_descrip1)', 'firstline(item_descrip2)',
                     'core', '',     'item_id',    'item');
select createDoctype(19, 'IS',   'Item Site',        'itemsite','itemsite_id','item_number',         'warehous_code', 'firstline(item_descrip1)',
                     '', 'join item on itemsite_item_id = item_id join whsinfo on itemsite_item_id = warehous_id');
select createDoctype(20, 'IR',   'Item Source',      'itemsrc', 'itemsrc_id', 'item_number',         'vend_name',     'firstline(item_descrip1)',
                     '', 'join item on itemsrc_item_id = item_id join vendinfo on itemsrc_vend_id = vend_id', 'itemsrc_id', 'itemSource');
select createDoctype(21, 'L',    'Location',         'location','location_id','location_formatname', 'warehous_code', 'NULL',
                     '', 'join whsinfo on location_warehous_id = warehous_id');
select createDoctype(22, 'LS',   'Lot/Serial',       'ls',      'ls_id',      'ls_number',           'item_number',   'firstline(ls_notes)',
                     '', 'join item on ls_item_id = item_id', 'ls_id', 'lotSerial');
select createDoctype(23, 'OPP',  'Opportunity',      'ophead',  'ophead_id',  'ophead_id::text',     'ophead_name',   'firstline(ophead_notes)',
                     'core', '',     'opphead_id', 'opportunity', 'MaintainPersonalOpportunities MaintainAllOpportunities');
select createDoctype(24, 'J',    'Project',          'prj',     'prj_id',     'prj_number',          'prj_name',      'firstline(prj_descrip)',
                     'core', '',     'prj_id',     'project',     'MaintainPersonalProjects MaintainAllProjects');
select createDoctype(25, 'P',    'Purchase Order',   'pohead',  'pohead_id',  'pohead_number',       'vend_name',     'firstline(pohead_comments)',
                     'core', 'join vendinfo on pohead_vend_id = vend_id', 'pohead_id', 'purchaseOrder');
select createDoctype(26, 'PI',   'Purchase Order Item', 'poitem',  'poitem_id',  'pohead_number',      'vend_name',     'item_number',
                     '', 'join pohead on poitem_pohead_id=pohead_id join vendinfo on pohead_vend_id=vend_id ' ||
                     'join itemsite on poitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(27, 'RA',   'Return Authorization', 'rahead',  'rahead_id',  'rahead_number',       'vend_name',     'firstline(rahead_comments)',
                     '', 'join vendinfo on rahead_vend_id = vend_id', 'rahead_id', 'purchaseOrder');
select createDoctype(28, 'RI',   'Return Authorization Item', 'raitem',  'raitem_id',  'rahead_number',      'vend_name',     'item_number',
                     '', 'join rahead on raitem_rahead_id=rahead_id join vendinfo on rahead_vend_id=vend_id ' ||
                     'join itemsite on raitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(29, 'Q',    'Quote', 'quhead',  'quhead_id',  'quhead_number',      'cust_name', 'firstline(quhead_ordercomments)',
                     '', 'join custinfo on quhead_cust_id = cust_id', 'quhead_id', 'salesOrder');
select createDoctype(30, 'QI',   'Quote Item', 'quitem',  'quitem_id',  'quhead_number',      'cust_name',     'item_number',
                     '', 'join quhead on quitem_quhead_id=quhead_id join custinfo on quhead_cust_id=cust_id ' ||
                     'join itemsite on quitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(31, 'S',    'Sales Order', 'cohead',  'cohead_id',  'cohead_number',      'cust_name', 'firstline(cohead_ordercomments)',
                     'core', 'join custinfo on cohead_cust_id = cust_id', 'sohead_id', 'salesOrder');
select createDoctype(32, 'SI',   'Sales Order Item', 'coitem',  'coitem_id',  'cohead_number',      'cust_name',     'item_number',
                     '', 'join cohead on coitem_cohead_id=cohead_id join custinfo on cohead_cust_id=cust_id ' ||
                     'join itemsite on coitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(33, 'SHP',  'Ship To', 'shipto',  'shipto_id',  'shipto_num',         'cust_name',     'shipto_name',
                     '', 'join custinfo on shipto_cust_id=cust_id', 'shipto_id', 'shipTo');
select createDoctype(34, 'TE',   'Time Expense', 'tehead',  'tehead_id',  'tehead_number',      'emp_number', 'formatDate(tehead_weekending)',
                     '', 'join emp on tehead_emp_id = emp_id', 'tehead_id', 'timeExpenseSheet');
select createDoctype(35, 'TODO', 'To-Do', 'todoitem','todoitem_id','todoitem_id::text',  'todoitem_name', 'firstline(todoitem_description)',
                     '', '',     'todoItem_id', 'todoItem', 'MaintainPersonalToDoItems MaintainAllToDoItems');
select createDoctype(36, 'TO',   'Transfer Order', 'tohead',  'tohead_id',  'tohead_number',      'cust_name', 'firstline(tohead_ordercomments)',
                     '', 'join custinfo on tohead_cust_id = cust_id', 'sohead_id', 'salesOrder');
select createDoctype(37, 'TI',   'Transfer Order Item', 'toitem',  'toitem_id',  'cohead_number',      'cust_name',     'item_number',
                     '', 'join cohead on toitem_cohead_id=cohead_id join custinfo on cohead_cust_id=cust_id ' ||
                     'join itemsite on toitem_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(38, 'V',    'Vendor', 'vendinfo','vend_id',    'vend_number',        'vend_name',    'firstline(vend_comments)',
                     'core', '',     'vend_id',      'vendor');
select createDoctype(39, 'VCH',  'Voucher', 'vohead',  'vohead_id',  'vohead_number', 'vend_name',        'firstline(vohead_notes)',
                     '', 'join vendinfo on vohead_vend_id=vend_id');
select createDoctype(40, 'WH',   'Site',       'whsinfo', 'warehous_id','warehous_code',         'warehous_descrip', 'NULL');
select createDoctype(41, 'W',    'Work Order', 'wo',      'wo_id',      'formatWonumber(wo_id)', 'item_descrip1', 'item_descrip2',
                     'core', 'join itemsite on wo_itemsite_id=itemsite_id join item on itemsite_item_id=item_id');
select createDoctype(42, 'TASK', 'Project Task', 'prjtask', 'prjtask_id', 'prjtask_number',      'prjtask_name','firstline(prjtask_descrip)');
select setval('doctype_doctype_id_seq', max(doctype_id)) from doctype;
