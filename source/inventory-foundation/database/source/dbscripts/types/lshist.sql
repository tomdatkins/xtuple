SELECT dropIfExists('FUNCTION', 'lshist(integer, integer, text, boolean, integer, date, date, char, integer)', 'public');
SELECT dropIfExists('TYPE', 'lshist', 'public');

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
    lshist_transqty_xtnumericrole   TEXT,
    lshist_qty_before_xtnumericrole TEXT,
    lshist_qty_after_xtnumericrole  TEXT,
    qtforegroundrole                TEXT,
    xtindentrole                    INTEGER);

COMMENT ON TYPE lshist IS 'Lot Serial History';
