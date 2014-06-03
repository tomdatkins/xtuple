CREATE OR REPLACE FUNCTION xwd.createInsideRep() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _charid INTEGER := -1;

BEGIN

  SELECT char_id INTO _charid FROM char WHERE UPPER(char_name)='INSIDEREP';
  IF (COALESCE(_charid, -1) = -1) THEN
    INSERT INTO char(char_name, char_items, char_options, char_attributes,
                     char_lotserial, char_customers, char_crmaccounts,
                     char_addresses, char_contacts, char_opportunity,
                     char_employees, char_incidents,
                     char_quotes, char_salesorders,
                     char_type, char_order, char_search,
                     char_notes)
           VALUES   ('INSIDEREP', 'f', 'f', 'f',
                     'f', 't', 'f',
                     'f', 'f', 'f',
                     'f', 'f',
                     't', 't',
                     0, 0, 'f',
                     'xWD Inside Sales Rep')
    RETURNING char_id INTO _charid;
  END IF;
  RETURN _charid;

END;
$$ LANGUAGE 'plpgsql';

SELECT xwd.createInsideRep();

DROP FUNCTION xwd.createInsideRep();
