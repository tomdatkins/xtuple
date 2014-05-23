CREATE OR REPLACE FUNCTION setNextRaNumber(INTEGER) RETURNS INTEGER  AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pNumber ALIAS FOR $1;
  _orderseqid INTEGER;

BEGIN

  SELECT orderseq_id INTO _orderseqid
  FROM orderseq
  WHERE (orderseq_name=''RaNumber'');

  IF (NOT FOUND) THEN
    SELECT NEXTVAL(''orderseq_orderseq_id_seq'') INTO _orderseqid;
    INSERT INTO orderseq (orderseq_id, orderseq_name, orderseq_number, orderseq_table, orderseq_numcol)
    VALUES (_orderseqid, ''RaNumber'', pNumber, ''rahead'', ''rahead_id'');

  ELSE
    UPDATE orderseq
    SET orderseq_number=pNumber
    WHERE (orderseq_name=''RaNumber'');
  END IF;

  RETURN _orderseqid;

END;
' LANGUAGE 'plpgsql';
