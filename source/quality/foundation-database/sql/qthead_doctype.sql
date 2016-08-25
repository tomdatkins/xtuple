SELECT createdoctype(95, 'QPLAN', 'QPLAN', 'QPLAN', 'Quality Plans', 'xt.qphead', 
    'qphead_id', 'qphead_code', 'qphead_code', 'qphead_descrip',
    'SELECT qthead_id, qthead_number, qphead_code FROM xt.qthead JOIN xt.qphead ON qthead_qphead_id = qphead_id;', 
    '', 'qphead_id', 'qplan', 'MaintainQualityPlans', 'Quality');
    
SELECT createdoctype(96, 'QTEST', 'QTEST', 'QTEST', 'Quality Tests', 'xt.qthead', 
    'qthead_id', 'qthead_number::text', 'qthead_code', 'qthead_descrip',
    'SELECT qphead_id, qphead_code, qphead_descrip FROM xt.qphead;', 
    '', 'qthead_id', 'qtest', 'MaintainQualityTests', 'Quality');