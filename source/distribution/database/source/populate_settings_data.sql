-- Set our path to xwd so inserts work without xwd.foo notation.
SET search_path = public, pg_catalog;

-- Set sequence values.
SELECT pg_catalog.setval('metric_metric_id_seq', 313, true);
SELECT pg_catalog.setval('form_form_id_seq', 24, true);

-- Insert all the data into the public schema.
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (304, 'BOOSubstitute', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (305, 'DefaultSOLineItemsTab', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (306, 'RequireSOReservations', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (307, 'ItemPricingPrecedence', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (308, 'WholesalePriceCosting', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (309, 'Long30Markups', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (311, 'SOManualReservations', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (312, 'CheckForUpdates', 'f', NULL);
INSERT INTO metric (metric_id, metric_name, metric_value, metric_module) VALUES (313, 'EnableGaplessNumbering', 'f', NULL);

INSERT INTO form (form_id, form_name, form_descrip, form_report_id, form_key, form_report_name) VALUES (24, 'Order_ack', 'Order Acknowlegement', NULL, 'SO', 'Order Acknowledgement');
