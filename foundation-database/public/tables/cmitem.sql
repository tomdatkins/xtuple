SELECT xt.add_column('cmitem', 'cmitem_number',	'TEXT', NULL, 'public');
SELECT xt.add_column('cmitem', 'cmitem_descrip','TEXT', NULL, 'public');
SELECT xt.add_column('cmitem', 'cmitem_salescat_id', 'INTEGER', NULL, 'public');

SELECT xt.add_constraint('cmitem', 'fk_cmitem_salescat', 'FOREIGN KEY (cmitem_salescat_id) REFERENCES salescat (salescat_id)', 'public');
