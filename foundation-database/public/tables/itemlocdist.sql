select xt.add_column('itemlocdist', 'itemlocdist_child_series', 'INTEGER', NULL, 'public');
select xt.add_column('itemlocdist', 'itemlocdist_transtype', 'TEXT', NULL, 'public');

COMMENT ON COLUMN public.itemlocdist.itemlocdist_order_id
  IS 'This is actually orderitem_id';

SELECT xt.add_constraint('itemlocdist', 'itemlocdist_itemlocdist_id_fkey', 
    'FOREIGN KEY (itemlocdist_itemlocdist_id) REFERENCES itemlocdist(itemlocdist_id)', 'public');