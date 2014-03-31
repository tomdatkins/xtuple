
CREATE OR REPLACE FUNCTION formatToNumber(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
SELECT COALESCE((SELECT (text(tohead_number) || '-' || (text(toitem_linenumber)))
                   FROM toitem JOIN tohead ON (toitem_tohead_id=tohead_id)
                  WHERE (toitem_id=($1))),'DELETED');
$$ LANGUAGE 'sql';

