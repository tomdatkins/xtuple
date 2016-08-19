<<<<<<< HEAD
SELECT createdoctype(95, 'QPLAN', 'QPLAN', 'QPLAN', 'Quality Plans', 'xt.qphead', 
    'qphead_id', 'qphead_code', 'qphead_code', 'qphead_descrip',
    'SELECT qthead_id, qthead_number, qphead_code FROM xt.qthead JOIN xt.qphead ON qthead_qphead_id = qphead_id;', 
    '', 'qphead_id', 'qplan', 'MaintainQualityPlans', 'Quality');
    
SELECT createdoctype(96, 'QTEST', 'QTEST', 'QTEST', 'Quality Tests', 'xt.qthead', 
    'qthead_id', 'qthead_number::text', 'qthead_code', 'qthead_descrip',
    'SELECT qphead_id, qphead_code, qphead_descrip FROM xt.qphead;', 
    '', 'qthead_id', 'qtest', 'MaintainQualityTests', 'Quality');
=======
UPDATE source SET                   
        source_docass       = 'QPLAN'                 --pDocAss
      , source_charass      = 'QPLAN'                 --pCharAss
      , source_table        = 'xt.qphead'             --pTable
      , source_key_field    = 'qphead_id'             --pKey
      , source_number_field = 'qphead_code'           --pNumber
      , source_name_field   = 'qphead_code'           --pName
      , source_desc_field   = 'qphead_descrip'        --pDesc
      , source_widget       = 'SELECT qthead_id, qthead_number, qphead_code FROM xt.qthead JOIN xt.qphead ON qthead_qphead_id = qphead_id;'
      , source_joins        = ''                      --pJoin
      , source_key_param    = 'qphead_id'             --pParam
      , source_uiform_name  = 'qplan'                 --pUi
      , source_create_priv  = 'MaintainQualityPlans' --pPriv
WHERE source_name = 'QPLAN';

UPDATE source SET                   
        source_docass       = 'QTEST'                 --pDocAss
      , source_charass      = 'QTEST'                 --pCharAss
      , source_table        = 'xt.qthead'             --pTable
      , source_key_field    = 'qthead_id'             --pKey
      , source_number_field = 'qthead_number::text'           --pNumber
      , source_name_field   = 'qphead_code'           --pName
      , source_desc_field   = 'qphead_descrip'        --pDesc
      , source_widget       = 'SELECT qphead_id, qphead_code, qphead_descrip FROM xt.qphead;'
      , source_joins        = 'join xt.qphead ON qthead_qphead_id = qphead_id' --pJoin
      , source_key_param    = 'qthead_id'             --pParam
      , source_uiform_name  = 'qtest'                 --pUi
      , source_create_priv  = 'MaintainQualityTests' --pPriv
WHERE source_name = 'QTEST';
>>>>>>> xtuple/4_10_x
