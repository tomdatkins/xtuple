INSERT INTO image (image_id, image_name, image_descrip, image_data) VALUES (14, 'BACKGROUND', 'Blue Pinstripe Background', 'begin 644 internal
MB5!.1PT*&@H````-24A$4@````(````""`(```#]U)IS````"7!(67,```L2
M```+$@''2W7[\````%DE$050(F6-DLNUD8&!@\?+R8F!@```-9P&L)F@250``
*``!)14Y$KD)@@@``
`
end
');
INSERT INTO evnttype (evnttype_id, evnttype_name, evnttype_descrip, evnttype_module) VALUES (26, 'ToNotesChanged', 'Transfer Order Comments Changed', 'I/M');
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (123, 'DefaultBatchFromEmailAddress', '', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (124, 'EnableBatchManager', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (148, 'AutoFillPostOperationQty', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (147, 'DefaultPrintPOOnSave', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (149, 'DefaultPrintSOOnSave', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (146, 'DefaultTransitWarehouse', '-1', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (150, 'EnableCustomerDeposits', 't', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (205, 'Registered', 'Yes', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (135, 'TONumberGeneration', 'A', NULL);

INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol, orderseq_seqiss) VALUES (7, 'VcNumber', 1, 'vohead', 'vohead_number', NULL);
INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol, orderseq_seqiss) VALUES (10, 'PlanNumber', 1, 'planord', 'planord_number', NULL);
INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol, orderseq_seqiss) VALUES (1, 'WoNumber', 1, 'wo', 'wo_number', NULL);
INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol, orderseq_seqiss) VALUES (12, 'IncidentNumber', 1, 'incdt', 'incdt_number', NULL);
INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol, orderseq_seqiss) VALUES (2, 'SoNumber', 1, 'cohead', 'cohead_number', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (316, 'Products', 'MaintainUOMs', 'Can Add/Edit/Delete Unit of Measures', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (4, 'Products', 'ViewBOMs', 'Can View Bills of Materials', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (119, 'Inventory', 'CreateInterWarehouseTrans', 'Can Create a Inter-Warehouse Transfer Transaction', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (149, 'Inventory', 'ReassignLotSerial', 'Can Reassign Lot/Serial #s', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (367, 'Inventory', 'CreateTransformTrans', 'Can Create Transform Transactions', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (472, 'Inventory', 'MaintainTransferOrders', 'Can Add/Edit/Delete Transfer Orders', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (473, 'Inventory', 'ViewTransferOrders', 'Can View Transfer Orders', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (474, 'Inventory', 'OverrideTODate', 'Can Change the Order Date of existing Transfer Orders', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (497, 'Accounting', 'ProcessCreditCards', 'Can Process Credit Card Transactions', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (498, 'Sales', 'MaintainReservations', 'Can modify S/O Reservation quantities.', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (182, 'Manufacture', 'ScrapWoMaterials', NULL, NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (187, 'Accounting', 'MaintainVouchers', 'Can Add/Edit/Delete Vouchers', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (62, 'Accounting', 'MaintainTerms', 'Can Add/Edit/Delete Terms', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (485, 'System', 'MaintainPreferencesSelf', 'Can Maintain the preferences for their own user only.', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (486, 'System', 'MaintainPreferencesOthers', 'Can Maintain the preferences of other users.', NULL);
INSERT INTO priv (priv_id, priv_module, priv_name, priv_descrip, priv_seq) VALUES (390, 'Products', 'PostStandardCosts', 'Can Post Product Standard Costs', NULL);
SELECT pg_catalog.setval('quitem_quitem_id_seq', 89, true);
SELECT pg_catalog.setval('rahead_rahead_id_seq', 1, false);
SELECT pg_catalog.setval('rahist_rahist_id_seq', 1, false);
SELECT pg_catalog.setval('raitem_raitem_id_seq', 1, false);
SELECT pg_catalog.setval('raitemls_raitemls_id_seq', 1, false);
