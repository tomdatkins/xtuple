SELECT dropIfExists('FUNCTION', 'lshist(integer, integer, text, boolean, integer, date, date, char, integer)', 'public');
SELECT dropIfExists('TYPE', 'lshist', 'public');

-- This type is kept in the frozen manifest, so it cannot be updated
-- If you ever want to change it, you'll have to move it from 
-- frozen_manifest.js to manifest.js, and deal with the drop cascade
CREATE TYPE lshist AS
   (lshist_id 			INTEGER,
    lshist_level		INTEGER,
    lshist_warehous_code       TEXT,
    lshist_transdate 		TIMESTAMP WITH TIME ZONE,
    lshist_transtype		TEXT,
    lshist_ordernumber 		TEXT,
    lshist_invuom 		TEXT,
    lshist_item_number		TEXT,
    lshist_lotserial 		TEXT,
    lshist_locationname	TEXT,
    lshist_transqty		NUMERIC,
    lshist_qty_before		NUMERIC,
    lshist_qty_after		NUMERIC,
    lshist_posted		BOOLEAN,
    lshist_perishable           BOOLEAN,
    lshist_expiration           DATE,
    lshist_transqty_xtnumericrole   TEXT,
    lshist_qty_before_xtnumericrole TEXT,
    lshist_qty_after_xtnumericrole  TEXT,
    qtforegroundrole                TEXT,
    xtindentrole                    INTEGER);

COMMENT ON TYPE lshist IS 'Lot Serial History';
