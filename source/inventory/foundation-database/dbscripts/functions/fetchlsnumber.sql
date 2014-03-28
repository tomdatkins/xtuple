CREATE OR REPLACE FUNCTION fetchLsNumber(integer) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pLsseqId ALIAS FOR $1;
  _qry TEXT;
  _r1 RECORD;
  _r2 RECORD;
  _result TEXT;
  _number TEXT;
  _test INTEGER;
  _rows INTEGER;

BEGIN

  LOOP
  
    -- Get lot/serial sequence profile
    SELECT * INTO _r1 FROM lsseq WHERE lsseq_id = pLsseqId; 
    GET DIAGNOSTICS _rows = ROW_COUNT;
    IF (_rows = 0) THEN
      RAISE EXCEPTION 'Lot/Serial Sequence profile does not exist for id %', pLsseqId;
    END IF;

    -- Determine number
    _qry := 'SELECT nextval(''lsseq_number_seq_' || pLsseqId || ''')::text AS number;';
    FOR _r2 IN
      EXECUTE _qry
    LOOP
      IF (length(_r2.number) < _r1.lsseq_seqlen) THEN
        _number := lpad(_r2.number,_r1.lsseq_seqlen,'0');
      ELSE
        _number := _r2.number;
      END IF;
    END LOOP;

    -- Concatenate with other text in profile
    _result := COALESCE(_r1.lsseq_prefix,'') || _number || COALESCE(_r1.lsseq_suffix,'');

    -- Check to make sure it doesn't already exist
    SELECT ls_id INTO _test
    FROM ls
    WHERE (ls_number=_result);

    GET DIAGNOSTICS _rows = ROW_COUNT;
    IF (_rows = 0) THEN
      EXIT;
    END IF;

  END LOOP;
  
  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';
