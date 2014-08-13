-- Add Item Dimension flag to public.uom.
select xt.add_column('uom','uom_item_dimension', 'boolean', 'not null default false', 'public', 'Item dimension unit of measure flag.');

-- Add constraint to prevent weight and dimension UOM from being the same.
select xt.add_constraint('uom', 'uom_weight_dimension_check', 'CHECK (uom_item_weight AND uom_item_weight <> uom_item_dimension OR uom_item_dimension AND uom_item_weight <> uom_item_dimension OR NOT uom_item_weight AND NOT uom_item_dimension)', 'public');

-- Create triggers to prevent duplicate weight and dimension flags being set.
drop trigger if exists uom_item_weight_trigger on public.uom;
create trigger uom_item_weight_trigger before insert or update on public.uom for each row execute procedure public._uom_item_weight_trigger();
drop trigger if exists uom_item_dimension_trigger on public.uom;
create trigger uom_item_dimension_trigger before insert or update on public.uom for each row execute procedure public._uom_item_dimension_trigger();
