--  Create source for WO specific characteristics (which are separate from inherited Item characteristics)

DELETE FROM source WHERE source_charass = 'WO';
UPDATE source SET source_descrip = 'Work Order Item' WHERE source_charass='W';

SELECT createDocType(NULL, --pDocAssNum
'WO', --pType
'WO', --pDocAss
'WO', --pCharAss
'Work Order', --pFull
'wo', --pTable
'wo_id', --pKey
'formatWonumber(wo_id)', --pNumber
'formatWonumber(wo_id)', --pName
'formatWonumber(wo_id)', --pDesc
'', --pWidget
'', --pJoin
'wo_id', --pParam
'workOrder', --pUi
'', -- pPriv, set this to 'MaintainWorkOrders' when Incident #28911 is implemented
'Manufacture' --pModule
);
