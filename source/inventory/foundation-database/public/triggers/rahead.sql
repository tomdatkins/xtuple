SELECT dropIfExists('TRIGGER', 'raheadTrigger');

CREATE OR REPLACE FUNCTION _raheadTrigger() RETURNS TRIGGER AS $$
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

  IF (TG_OP = 'INSERT') THEN
    IF (NOT checkPrivilege('MaintainReturns')) THEN
      RAISE EXCEPTION 'You do not have privileges to create a Return Authorization.';
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF ( (NOT checkPrivilege('MaintainReturns')) AND
         (NEW.rahead_expiredate = OLD.rahead_expiredate) ) THEN
      RAISE EXCEPTION 'You do not have privileges to change a Return Authorization.';
    END IF;
  ELSE
    IF (NOT checkPrivilege('MaintainReturns')) THEN
      RAISE EXCEPTION 'You do not have privileges to delete a Return Authorization.';
    END IF;
  END IF;

  IF ((TG_OP = 'INSERT') OR (TG_OP = 'UPDATE')) THEN
    IF ((NEW.rahead_disposition = 'C') AND (NEW.rahead_creditmethod = 'N')) THEN
      RAISE EXCEPTION 'Returns may not be saved with disposition of Credit and Credit Method of None.';
    END IF;
  END IF;
 
  IF (TG_OP = 'INSERT') THEN

    _numGen := fetchMetricText('RANumberGeneration');
    IF ((NEW.rahead_number IS NULL) AND (_numGen='M')) THEN
      RAISE EXCEPTION 'You must supply an Authorization Number.';
    ELSIF (NEW.rahead_number IS NULL AND (_numGen='A')) THEN
      SELECT fetchranumber() INTO NEW.rahead_number;
    END IF;

    IF (_cmnttypeid <> -1) THEN
      PERFORM postComment(_cmnttypeid, 'RA', NEW.rahead_id, 'Created');
    END IF;

    IF (NEW.rahead_orig_cohead_id IS NOT NULL) THEN
      PERFORM importCoitemsToRa(NEW.rahead_id,NEW.rahead_orig_cohead_id);
    END IF;

    --- clear the number from the issue cache
    PERFORM clearNumberIssue('RaNumber', NEW.rahead_number::INTEGER);

  ELSIF (TG_OP = 'UPDATE') THEN

    _numGen := fetchMetricText('RANumberGeneration');
    IF (_numGen='A') THEN
      IF (NEW.rahead_number <> OLD.rahead_number AND OLD.rahead_number != '0') THEN
        RAISE EXCEPTION 'The authorization number may not be changed.';
      END IF;
    END IF;

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

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM comment
    WHERE ( (comment_source='RA')
     AND (comment_source_id=OLD.rahead_id) );

    RETURN OLD;
  END IF;

  NEW.rahead_lastupdated = CURRENT_TIMESTAMP;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER raheadTrigger AFTER INSERT OR UPDATE OR DELETE ON rahead FOR EACH ROW EXECUTE PROCEDURE _raheadTrigger();
