CREATE TABLE xtmfg.itemsitecap (
    itemsitecap_id SERIAL PRIMARY KEY,
    itemsitecap_itemsite_id INTEGER REFERENCES itemsite (itemsite_id) ON DELETE CASCADE,
    itemsitecap_avgsutime NUMERIC(10,7) DEFAULT 0,
    itemsitecap_dailycap NUMERIC(18,6) DEFAULT 0,
    itemsitecap_efficfactor NUMERIC(10,6) DEFAULT 0,
    itemsitecap_avgqueuedays INTEGER DEFAULT 0,
    itemsitecap_dept_id INTEGER NOT NULL);

  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_id IS 'The primary key for itemsitecap';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_itemsite_id IS 'Reference key for itemsite';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_avgsutime IS 'Average set up time';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_dailycap IS 'Capacity available in minutes per day';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_efficfactor IS 'The efficiency factor percentage';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_avgqueuedays IS 'Average queue days';
  COMMENT ON COLUMN xtmfg.itemsitecap.itemsitecap_dept_id IS 'Reference key for department ID';

REVOKE ALL ON TABLE xtmfg.itemsitecap FROM public;
GRANT ALL ON TABLE xtmfg.itemsitecap TO xtrole;
GRANT ALL ON SEQUENCE xtmfg.itemsitecap_itemsitecap_id_seq TO xtrole;
