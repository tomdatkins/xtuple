INSERT INTO evnttype (evnttype_name, evnttype_descrip, evnttype_module) VALUES ('ToNotesChanged', 'Transfer Order Comments Changed', 'I/M');

SELECT setMetric('DefaultBatchFromEmailAddress', '');
SELECT setMetric('EnableBatchManager', 'f');
SELECT setMetric('AutoFillPostOperationQty', 'f');
SELECT setMetric('DefaultPrintPOOnSave', 'f');
SELECT setMetric('DefaultPrintSOOnSave', 'f');
SELECT setMetric('EnableCustomerDeposits', 't');
SELECT setMetric('Registered', 'Yes');
SELECT setMetric('TONumberGeneration', 'A');
SELECT setMetric('DefaultTransitWarehouse', '-1');
SELECT setMetric('LotSerialControl', 't');
SELECT setMetric('TransferOrderChangeLog', 't');
SELECT setMetric('Transforms', 't');
SELECT setMetric('GLFFProfitCenters', 'f');
SELECT setMetric('GLFFSubaccounts', 'f');

SELECT pg_catalog.setval('rahead_rahead_id_seq', 1, false);
SELECT pg_catalog.setval('rahist_rahist_id_seq', 1, false);
SELECT pg_catalog.setval('raitem_raitem_id_seq', 1, false);
SELECT pg_catalog.setval('raitemls_raitemls_id_seq', 1, false);

INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('/_accnt/columnsShown', '0,on|1,on|2,on|3,on|4,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('commentTypes/_cmnttype/columnsShown', '0,on|1,on|2,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('configureSO/_creditMemoWatermarks/columnsShown', '0,on|1,on|2,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('configureSO/_invoiceWatermarks/columnsShown', '0,on|1,on|2,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('countries/_countries/columnsShown', '0,on|1,on|2,on|3,on|4,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('fixSerial/_serial/columnsShown', '0,on|1,on|2,on|3,on|4,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('reports/_report/columnsShown', '0,on|1,on|2,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('salesAccounts/_salesaccnt/columnsShown', '0,on|1,on|2,on|3,on|4,on|5,on|6,off|7,off|8,off|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('UseOldMenu', 'f', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('users/_usr/columnsShown', '0,on|1,on|2,on|', 'admin');
INSERT INTO usrpref (usrpref_name, usrpref_value, usrpref_username) VALUES ('virtualList/_listTab/columnsShown', '0,on|1,on|', 'admin');
UPDATE usrpref SET usrpref_value = '30' WHERE usrpref_name = 'IdleTimeout';
