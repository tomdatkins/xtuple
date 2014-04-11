SELECT dropIfExists('INDEX', 'tohead_tohead_status_idx');
CREATE INDEX tohead_tohead_status_idx ON tohead (tohead_status);

