CREATE OR REPLACE FUNCTION xwd.createLostsale() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _charid INTEGER := -1;

BEGIN

  SELECT char_id INTO _charid FROM char WHERE UPPER(char_name)='LOSTSALE';
  IF (COALESCE(_charid, -1) = -1) THEN
    INSERT INTO char(char_name, char_items, char_options, char_attributes,
                     char_lotserial, char_customers, char_crmaccounts,
                     char_addresses, char_contacts, char_opportunity,
                     char_employees, char_incidents, char_type, char_order, char_search,
                     char_notes)
           VALUES   ('LOSTSALE', 'f', 'f', 'f',
                     'f', 't', 'f',
                     'f', 'f', 'f',
                     'f', 'f', 1, 0, 'f',
                     'xWD Lost Sale Reason Code')
    RETURNING char_id INTO _charid;
    INSERT INTO charopt(charopt_char_id, charopt_value, charopt_order)
           VALUES      (_charid, 'No Inventory', 0);
    INSERT INTO charopt(charopt_char_id, charopt_value, charopt_order)
           VALUES      (_charid, 'Lead Time', 0);
    INSERT INTO charopt(charopt_char_id, charopt_value, charopt_order)
           VALUES      (_charid, 'Price Issue', 0);
    INSERT INTO charopt(charopt_char_id, charopt_value, charopt_order)
           VALUES      (_charid, 'Cust. Returned', 0);
  END IF;
  RETURN _charid;

END;
$$ LANGUAGE 'plpgsql';

SELECT xwd.createLostsale();

DROP FUNCTION xwd.createLostsale();
