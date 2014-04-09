INSERT INTO evnttype (evnttype_id, evnttype_name, evnttype_descrip, evnttype_module) VALUES (26, 'ToNotesChanged', 'Transfer Order Comments Changed', 'I/M');

DELETE FROM metric WHERE metric_name IN ('AutoFillPostOperationQty', 'DefaultPrintPOOnSave', 'DefaultPrintSOOnSave', 'EnableCustomerDeposits', 'TONumberGeneration', 'DefaultBatchFromEmailAddress', 'DefaultTransitWarehouse');
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('DefaultBatchFromEmailAddress', '', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('EnableBatchManager', 'f', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('AutoFillPostOperationQty', 'f', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('DefaultPrintPOOnSave', 'f', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('DefaultPrintSOOnSave', 'f', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('DefaultTransitWarehouse', '-1', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('EnableCustomerDeposits', 't', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('Registered', 'Yes', NULL);
INSERT INTO metric (metric_name, metric_value, metric_module) VALUES ('TONumberGeneration', 'A', NULL);


SELECT pg_catalog.setval('quitem_quitem_id_seq', 89, true);
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
