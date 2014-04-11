CREATE OR REPLACE FUNCTION reserveAllSo(pAddPackList BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _r RECORD;
  _retval INTEGER;

BEGIN
   FOR _r IN SELECT coitem_id, coitem_cohead_id
               FROM coitem JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
                           JOIN site() ON (warehous_id=itemsite_warehous_id)
              WHERE(coitem_status NOT IN ('X', 'C'))
              ORDER BY coitem_scheddate, coitem_created LOOP
    SELECT reserveSoLineBalance(_r.coitem_id)
      INTO _retval;

    IF (pAddPackList AND _retval >= 0) THEN
      PERFORM addToPackingListBatch('SO', _r.coitem_cohead_id);
    END IF;
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION reserveAllSo(pAddPackList BOOLEAN,
                                        pStartDate DATE,
                                        pEndDate DATE,
                                        pCustid INTEGER,
                                        pShiptoid INTEGER,
                                        pCusttypeid INTEGER,
                                        pCusttypePattern TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
BEGIN

  RETURN reserveAllSo(pAddPackList, TRUE, pStartDate, pEndDate, pCustid, pShiptoid, pCusttypeid, pCusttypePattern);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION reserveAllSo(pAddPackList BOOLEAN,
                                        pPartialReservations BOOLEAN,
                                        pStartDate DATE,
                                        pEndDate DATE,
                                        pCustid INTEGER,
                                        pShiptoid INTEGER,
                                        pCusttypeid INTEGER,
                                        pCusttypePattern TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _r RECORD;
  _retval INTEGER;

BEGIN
   FOR _r IN SELECT coitem_id, coitem_cohead_id
               FROM coitem, cohead, custinfo, custtype, itemsite, site()
              WHERE((coitem_status NOT IN ('X', 'C'))
                AND (coitem_cohead_id=cohead_id)
                AND (cohead_cust_id=cust_id)
                AND (cust_custtype_id=custtype_id)
                AND (coitem_scheddate BETWEEN pStartDate AND pEndDate)
                AND ((pCustid IS NULL) OR (cust_id=pCustid))
                AND ((pShiptoid IS NULL) OR (cohead_shipto_id=pShiptoid))
                AND ((pCusttypeid IS NULL) OR (custtype_id=pCusttypeid))
                AND ((pCusttypePattern IS NULL) OR (custtype_code ~ pCusttypePattern))
                AND (itemsite_id=coitem_itemsite_id)
                AND (warehous_id=itemsite_warehous_id))
              ORDER BY coitem_scheddate, coitem_created LOOP
    SELECT reserveSoLineBalance(_r.coitem_id, pPartialReservations)
      INTO _retval;

    IF (pAddPackList AND _retval >= 0) THEN
      PERFORM addToPackingListBatch('SO', _r.coitem_cohead_id);
    END IF;
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

