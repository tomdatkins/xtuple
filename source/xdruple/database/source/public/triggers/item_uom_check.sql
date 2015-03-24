CREATE OR REPLACE FUNCTION public._item_uom_check()
  RETURNS trigger AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.

-- This trigger checks the all item uom_id columns have valid conversion ratios.
BEGIN

  IF (NEW.item_active AND NEW.item_sold) THEN
    IF (NEW.item_inv_uom_id <> NEW.item_price_uom_id) THEN
      BEGIN
        PERFORM itemuomtouomratio(NEW.item_id, NEW.item_inv_uom_id, NEW.item_price_uom_id)
        FROM item
        WHERE TRUE
          AND item_id = NEW.item_id;
      EXCEPTION
        WHEN SQLSTATE 'P0001' THEN
          RAISE EXCEPTION 'An invalid UOM was set on this item. Please verify that the Unit Price UOM has a conversion to the Inventory UOM.';
      END;
    END IF;

    IF (NEW.item_phy_uom_id <> NEW.item_pack_phy_uom_id) THEN
      BEGIN
        PERFORM itemuomtouomratio(NEW.item_id, NEW.item_phy_uom_id, NEW.item_pack_phy_uom_id)
        FROM item
        WHERE TRUE
          AND item_id = NEW.item_id;
      EXCEPTION
        WHEN SQLSTATE 'P0001' THEN
          RAISE EXCEPTION 'An invalid UOM was set on this item. Please verify that the Physical Properties For UOM has a conversion between Product Only and Empty Package.';
      END;
    END IF;

    IF (NEW.item_phy_uom_id <> NEW.item_price_uom_id AND NEW.item_phy_uom_id IS NOT NULL) THEN
      BEGIN
        PERFORM itemuomtouomratio(NEW.item_id, NEW.item_phy_uom_id, NEW.item_price_uom_id)
        FROM item
        WHERE TRUE
          AND item_id = NEW.item_id;
      EXCEPTION
        WHEN SQLSTATE 'P0001' THEN
          RAISE EXCEPTION 'An invalid UOM was set on this item. Please verify that the Product Only For UOM has a conversion to the Unit Price UOM.';
      END;
    END IF;

    IF (NEW.item_pack_phy_uom_id <> NEW.item_price_uom_id AND NEW.item_pack_phy_uom_id IS NOT NULL) THEN
      BEGIN
        PERFORM itemuomtouomratio(NEW.item_id, NEW.item_pack_phy_uom_id, NEW.item_price_uom_id)
        FROM item
        WHERE TRUE
          AND item_id = NEW.item_id;
      EXCEPTION
        WHEN SQLSTATE 'P0001' THEN
          RAISE EXCEPTION 'An invalid UOM was set on this item. Please verify that the Empty Package For UOM has a conversion to the Unit Price UOM.';
      END;
    END IF;

  END IF;

  RETURN NEW;

END;
$BODY$
  LANGUAGE plpgsql;
ALTER FUNCTION public._item_uom_check()
  OWNER TO admin;
