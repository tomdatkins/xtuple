--  Create source for WO specific characteristics (which are separate from inherited Item characteristics)

DELETE FROM source WHERE source_charass = 'WO';
UPDATE source SET source_descrip = 'Work Order Item' WHERE source_charass='W';

SELECT createDocType(NULL,
'WO',
'WO',
'WO',
'Work Order',
'wo',
'wo_id',
'formatWonumber(wo_id)',
'formatWonumber(wo_id)',
'formatWonumber(wo_id)',
'',
'',
'wo_id',
'',
'MaintainWorkOrder',
'Manufacture');
