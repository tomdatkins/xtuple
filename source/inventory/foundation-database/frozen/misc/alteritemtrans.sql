SELECT dropIfExists('CONSTRAINT', 'itemtrans_itemtrans_source_item_id_key');
SELECT dropIfExists('INDEX',      'itemtrans_itemtrans_source_item_id_key');
SELECT dropIfExists('CONSTRAINT', 'itemtrans_itemtrans_source_item_id_fkey');
SELECT dropIfExists('CONSTRAINT', 'itemtrans_itemtrans_target_item_id_fkey');

ALTER TABLE ONLY itemtrans
    ADD CONSTRAINT itemtrans_itemtrans_source_item_id_fkey FOREIGN KEY (itemtrans_source_item_id) REFERENCES item(item_id);

ALTER TABLE ONLY itemtrans
    ADD CONSTRAINT itemtrans_itemtrans_target_item_id_fkey FOREIGN KEY (itemtrans_target_item_id) REFERENCES item(item_id);

CREATE UNIQUE INDEX itemtrans_itemtrans_source_item_id_key ON itemtrans (itemtrans_source_item_id, itemtrans_target_item_id);
