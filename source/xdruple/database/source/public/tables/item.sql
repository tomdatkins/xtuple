-- Add dimension columns to public.item.
select xt.add_column('item','item_length', 'numeric', '', 'public', 'The Item length dimension in UOM Dimension units.');
select xt.add_column('item','item_width', 'numeric', '', 'public', 'The Item width dimension in UOM Dimension units.');
select xt.add_column('item','item_height', 'numeric', '', 'public', 'The Item height dimension in UOM Dimension units.');
select xt.add_column('item','item_phy_uom_id', 'integer', '', 'public', 'The Item physical UOM.');
select xt.add_column('item','item_pack_length', 'numeric', '', 'public', 'The Item Package length dimension in UOM Dimension units.');
select xt.add_column('item','item_pack_width', 'numeric', '', 'public', 'The Item Package width dimension in UOM Dimension units.');
select xt.add_column('item','item_pack_height', 'numeric', '', 'public', 'The Item Package height dimension in UOM Dimension units.');
select xt.add_column('item','item_pack_phy_uom_id', 'integer', '', 'public', 'The Item Package physical UOM.');
select xt.add_column('item','item_mrkt_title', 'text', '', 'public', 'The Item Marketing Title.');
select xt.add_column('item','item_mrkt_subtitle', 'text', '', 'public', 'The Item Marketing Subtitle.');
select xt.add_column('item','item_mrkt_teaser', 'text', '', 'public', 'The Item Marketing Teaser.');
select xt.add_column('item','item_mrkt_descrip', 'text', '', 'public', 'The Item Marketing Description.');
select xt.add_column('item','item_mrkt_seokey', 'text', '', 'public', 'The Item Marketing SEO Keywords.');
select xt.add_column('item','item_mrkt_seotitle', 'text', '', 'public', 'The Item Marketing SEO Title.');

select xt.add_constraint('item', 'item_item_phy_uom_id_fkey', 'foreign key (item_phy_uom_id) references uom (uom_id)', 'public');
select xt.add_constraint('item', 'item_item_pack_phy_uom_id_fkey', 'foreign key (item_pack_phy_uom_id) references uom (uom_id)', 'public');
