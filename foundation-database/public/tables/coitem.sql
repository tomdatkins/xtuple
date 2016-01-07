SELECT xt.add_column('coitem', 'coitem_qtyreserved_uom_id', 'INTEGER', NULL, 'public');

comment on column public.coitem.coitem_qtyreserved_uom_id is 'UOM of qtyreserved (same as Item Inv UOM).';
