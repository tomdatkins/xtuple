CREATE OR REPLACE FUNCTION public._uom_item_dimension_trigger()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  DECLARE
    _dims RECORD;
  BEGIN

    -- Check if there is already a UOM set to uom_item_dimension.
    IF ((TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.uom_item_dimension) THEN
      FOR _dims IN
        SELECT count(*) as count, uom_name
        FROM uom
        WHERE uom_item_dimension
        GROUP BY uom_name
      LOOP
        IF (OLD.uom_name != _dims.uom_name) THEN
          RAISE EXCEPTION 'There is already a UOM set for Item Dimensions (%)',
          _dims.uom_name;
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
ALTER FUNCTION public._uom_item_dimension_trigger()
  OWNER TO admin;
