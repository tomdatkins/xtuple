
CREATE OR REPLACE FUNCTION setNextPlanNumber(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pPlanNumber ALIAS FOR $1;
  _orderseqid INTEGER;

BEGIN

  SELECT orderseq_id INTO _orderseqid
  FROM orderseq
  WHERE (orderseq_name='PlanNumber');
  IF (FOUND) THEN
    UPDATE orderseq
    SET orderseq_number=pPlanNumber
    WHERE (orderseq_id=_orderseqid);

  ELSE
    INSERT INTO orderseq
    (orderseq_name, orderseq_number)
    VALUES
    ('PlanNumber', pPlanNumber);
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

