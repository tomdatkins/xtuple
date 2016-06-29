SELECT dropIfExists('TRIGGER', 'raheadTrigger');
SELECT dropIfExists('TRIGGER', 'raheadBeforeInsertTrigger');
SELECT dropIfExists('TRIGGER', 'raheadBeforeUpdateTrigger');
SELECT dropIfExists('TRIGGER', 'raheadBeforeDeleteTrigger');
SELECT dropIfExists('TRIGGER', 'raheadAfterInsertTrigger');
SELECT dropIfExists('TRIGGER', 'raheadAfterUpdateTrigger');
SELECT dropIfExists('TRIGGER', 'raheadAfterDeleteTrigger');

CREATE OR REPLACE FUNCTION _raheadBeforeInsertTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN

  IF (NOT checkPrivilege('MaintainReturns')) THEN
    RAISE EXCEPTION 'You do not have privileges to create a Return Authorization. [xtuple: _raheadBeforeInsertTrigger, -1]';
  END IF;

  IF ((NEW.rahead_disposition = 'C') AND (NEW.rahead_creditmethod = 'N')) THEN
    RAISE EXCEPTION 'Returns may not be saved with disposition of Credit and Credit Method of None. [xtuple: _raheadBeforeInsertTrigger, -2]';
  END IF;

  NEW.rahead_billtoaddress1   := COALESCE(NEW.rahead_billtoaddress1, '');
  NEW.rahead_billtoaddress2   := COALESCE(NEW.rahead_billtoaddress2, '');
  NEW.rahead_billtoaddress3   := COALESCE(NEW.rahead_billtoaddress3, '');
  NEW.rahead_billtocity       := COALESCE(NEW.rahead_billtocity, '');
  NEW.rahead_billtocountry    := COALESCE(NEW.rahead_billtocountry, '');
  NEW.rahead_billtozip        := COALESCE(NEW.rahead_billtozip, '');
  NEW.rahead_billtostate      := COALESCE(NEW.rahead_billtostate, '');
  NEW.rahead_shipto_address1  := COALESCE(NEW.rahead_shipto_address1, '');
  NEW.rahead_shipto_address2  := COALESCE(NEW.rahead_shipto_address2, '');
  NEW.rahead_shipto_address3  := COALESCE(NEW.rahead_shipto_address3, '');
  NEW.rahead_shipto_city      := COALESCE(NEW.rahead_shipto_city, '');
  NEW.rahead_shipto_country   := COALESCE(NEW.rahead_shipto_country, '');
  NEW.rahead_shipto_zipcode   := COALESCE(NEW.rahead_shipto_zipcode, '');
  NEW.rahead_shipto_state     := COALESCE(NEW.rahead_shipto_state, '');

  _numGen := fetchMetricText('RANumberGeneration');
  IF ((NEW.rahead_number IS NULL) AND (_numGen='M')) THEN
    RAISE EXCEPTION 'You must supply an Authorization Number. [xtuple: _raheadBeforeInsertTrigger, -3]';
  ELSIF (NEW.rahead_number IS NULL AND (_numGen='A')) THEN
    NEW.rahead_number := fetchranumber();
  END IF;

  NEW.rahead_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _raheadBeforeUpdateTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN

  IF ( (NOT checkPrivilege('MaintainReturns')) AND
       COALESCE(NEW.rahead_expiredate, '1970-01-01') = COALESCE(OLD.rahead_expiredate, '1970-01-01') ) THEN
    RAISE EXCEPTION 'You do not have privileges to change a Return Authorization [xtuple: _raheadBeforeUpdateTrigger, -1]';
  END IF;

  IF ((NEW.rahead_disposition = 'C') AND (NEW.rahead_creditmethod = 'N')) THEN
    RAISE EXCEPTION 'Returns may not be saved with disposition of Credit and Credit Method of None [xtuple: _raheadBeforeUpdateTrigger, -2]';
  END IF;

  NEW.rahead_billtoaddress1   := COALESCE(NEW.rahead_billtoaddress1, '');
  NEW.rahead_billtoaddress2   := COALESCE(NEW.rahead_billtoaddress2, '');
  NEW.rahead_billtoaddress3   := COALESCE(NEW.rahead_billtoaddress3, '');
  NEW.rahead_billtocity       := COALESCE(NEW.rahead_billtocity, '');
  NEW.rahead_billtocountry    := COALESCE(NEW.rahead_billtocountry, '');
  NEW.rahead_billtozip        := COALESCE(NEW.rahead_billtozip, '');
  NEW.rahead_billtostate      := COALESCE(NEW.rahead_billtostate, '');
  NEW.rahead_shipto_address1  := COALESCE(NEW.rahead_shipto_address1, '');
  NEW.rahead_shipto_address2  := COALESCE(NEW.rahead_shipto_address2, '');
  NEW.rahead_shipto_address3  := COALESCE(NEW.rahead_shipto_address3, '');
  NEW.rahead_shipto_city      := COALESCE(NEW.rahead_shipto_city, '');
  NEW.rahead_shipto_country   := COALESCE(NEW.rahead_shipto_country, '');
  NEW.rahead_shipto_zipcode   := COALESCE(NEW.rahead_shipto_zipcode, '');
  NEW.rahead_shipto_state     := COALESCE(NEW.rahead_shipto_state, '');
 
  _numGen := fetchMetricText('RANumberGeneration');
  IF (_numGen='A') THEN
    IF (NEW.rahead_number <> OLD.rahead_number AND OLD.rahead_number != '0') THEN
      RAISE EXCEPTION 'The authorization number may not be changed [xtuple: _raheadBeforeUpdateTrigger, -3]';
    END IF;
  END IF;

  NEW.rahead_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _raheadBeforeDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN

  IF (NOT checkPrivilege('MaintainReturns')) THEN
    RAISE EXCEPTION 'You do not have privileges to delete a Return Authorization [xtuple: _raheadBeforeDeleteTrigger, -1]';
  END IF;
 
  RETURN OLD;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _raheadAfterInsertTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN

  IF (fetchMetricBool('ReturnAuthorizationChangeLog') ) THEN
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF NOT FOUND THEN
      _cmnttypeid := -1;
    END IF;
  END IF;

  IF (_cmnttypeid <> -1) THEN
    PERFORM postComment(_cmnttypeid, 'RA', NEW.rahead_id, 'Created');
  END IF;

  IF (NEW.rahead_orig_cohead_id IS NOT NULL) THEN
    PERFORM importCoitemsToRa(NEW.rahead_id,NEW.rahead_orig_cohead_id);
  END IF;

  --- clear the number from the issue cache
  PERFORM clearNumberIssue('RaNumber', NEW.rahead_number::INTEGER);

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _raheadAfterUpdateTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN

  IF ( (COALESCE(NEW.rahead_orig_cohead_id,0) <> COALESCE(OLD.rahead_orig_cohead_id,0)) OR
       (COALESCE(NEW.rahead_disposition,' ') <> COALESCE(OLD.rahead_disposition,' ')) ) THEN
    PERFORM importCoitemsToRa(NEW.rahead_id,NEW.rahead_orig_cohead_id);
  END IF;

  IF (COALESCE(NEW.rahead_taxzone_id,-1) <> COALESCE(OLD.rahead_taxzone_id,-1)) THEN
    UPDATE raitem SET raitem_taxtype_id=getItemTaxType(itemsite_item_id,NEW.rahead_taxzone_id)
    FROM itemsite 
    WHERE ((itemsite_id=raitem_itemsite_id)
    AND (raitem_rahead_id=NEW.rahead_id));
  END IF;

  IF (COALESCE(NEW.rahead_shipto_id, -1) <> COALESCE(OLD.rahead_shipto_id, -1)) THEN
    IF (COALESCE(NEW.rahead_new_cohead_id, -1) > 0) THEN
      UPDATE cohead SET cohead_shipto_id=NEW.rahead_shipto_id,
                        cohead_shiptoname=NEW.rahead_shipto_name,
                        cohead_shiptoaddress1=NEW.rahead_shipto_address1,
                        cohead_shiptoaddress2=NEW.rahead_shipto_address2,
                        cohead_shiptoaddress3=NEW.rahead_shipto_address3,
                        cohead_shiptocity=NEW.rahead_shipto_city,
                        cohead_shiptostate=NEW.rahead_shipto_state,
                        cohead_shiptozipcode=NEW.rahead_shipto_zipcode,
                        cohead_shiptocountry=NEW.rahead_shipto_country
      WHERE (cohead_id=NEW.rahead_new_cohead_id)
        AND (cohead_status <> 'C');
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION _raheadAfterDeleteTrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _numGen CHAR(1);

BEGIN
 
  DELETE FROM comment
  WHERE ( (comment_source='RA')
   AND (comment_source_id=OLD.rahead_id) );

  RETURN OLD;

END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER raheadBeforeInsertTrigger BEFORE INSERT ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadBeforeInsertTrigger();
CREATE TRIGGER raheadBeforeUpdateTrigger BEFORE UPDATE ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadBeforeUpdateTrigger();
CREATE TRIGGER raheadBeforeDeleteTrigger BEFORE DELETE ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadBeforeDeleteTrigger();
CREATE TRIGGER raheadAfterInsertTrigger AFTER INSERT ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadAfterInsertTrigger();
CREATE TRIGGER raheadAfterUpdateTrigger AFTER UPDATE ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadAfterUpdateTrigger();
CREATE TRIGGER raheadAfterDeleteTrigger AFTER DELETE ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadAfterDeleteTrigger();

