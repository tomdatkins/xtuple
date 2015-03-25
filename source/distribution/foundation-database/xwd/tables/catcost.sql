-- Catalog Cost table definition

select xt.create_table('catcost', 'xwd');

select xt.add_column('catcost','catcost_id', 'serial', null, 'xwd');
select xt.add_column('catcost','catcost_item_id', 'integer', null, 'xwd');
select xt.add_column('catcost','catcost_item_number', 'text', null, 'xwd');
select xt.add_column('catcost','catcost_wholesale_price', 'numeric', null, 'xwd');
select xt.add_column('catcost','catcost_price_uom', 'text', null, 'xwd');
select xt.add_column('catcost','catcost_po_cost', 'numeric', null, 'xwd');
select xt.add_column('catcost','catcost_po_uom', 'text', null, 'xwd');
select xt.add_column('catcost','catcost_itemsrcp_qtybreak', 'numeric', null, 'xwd');
select xt.add_column('catcost','catcost_vend_number', 'text', null, 'xwd');
select xt.add_column('catcost','catcost_cost_invvendoruomratio', 'numeric', null, 'xwd');
select xt.add_column('catcost','catcost_warehous_code', 'text', null, 'xwd');
select xt.add_column('catcost','catcost_upc', 'text', null, 'xwd');

select xt.add_primary_key('catcost', 'catcost_id', 'xwd');

comment on table xwd.catcost is 'Catalog cost update table';

-- Fix sequence permission issue
GRANT ALL ON TABLE xwd.catcost_catcost_id_seq TO xtrole;
