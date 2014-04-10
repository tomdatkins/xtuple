SELECT dropIfExists('INDEX', 'raitem_raitem_status_idx');
CREATE INDEX raitem_raitem_status_idx ON raitem (raitem_status);

