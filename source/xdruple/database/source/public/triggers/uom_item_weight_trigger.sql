CREATE OR REPLACE FUNCTION public._uom_item_weight_trigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  DECLARE
    _weight RECORD;
  BEGIN

    -- Check if there is already a UOM set to uom_item_weight.
    IF ((TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.uom_item_weight) THEN
      FOR _weight IN
        SELECT count(*) as count, uom_name
        FROM uom
        WHERE uom_item_weight
        GROUP BY uom_name
      LOOP
        IF (OLD.uom_name != _weight.uom_name) THEN
          RAISE EXCEPTION 'There is already a UOM set for Item Weight (%)',
          _weight.uom_name;
        END IF;
      END LOOP;

      RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END;
$BODY$
  LANGUAGE plpgsql;
ALTER FUNCTION public._uom_item_weight_trigger()
  OWNER TO admin;
