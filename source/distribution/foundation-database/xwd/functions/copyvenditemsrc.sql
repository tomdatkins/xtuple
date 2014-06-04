CREATE OR REPLACE FUNCTION xwd.copyVendItemsrc(pVendid INTEGER,
                                               pParentid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _itemsrcid INTEGER;
  _itemsrc RECORD;

BEGIN

  FOR _itemsrc IN
    SELECT *
    FROM itemsrc
    WHERE (itemsrc_vend_id=pVendid) LOOP

    SELECT NEXTVAL('itemsrc_itemsrc_id_seq') INTO _itemsrcid;

    INSERT INTO itemsrc
    ( itemsrc_id,
      itemsrc_item_id,
      itemsrc_vend_id,
      itemsrc_vend_item_number,
      itemsrc_vend_item_descrip,
      itemsrc_comments,
      itemsrc_vend_uom,
      itemsrc_invvendoruomratio,
      itemsrc_minordqty,
      itemsrc_multordqty,
      itemsrc_leadtime,
      itemsrc_ranking,
      itemsrc_active,
      itemsrc_manuf_name,
      itemsrc_manuf_item_number,
      itemsrc_manuf_item_descrip,
      itemsrc_default,
      itemsrc_upccode,
      itemsrc_effective,
      itemsrc_expires,
      itemsrc_contrct_id )
    VALUES
    ( _itemsrcid,
      _itemsrc.itemsrc_item_id,
      pParentid,
      _itemsrc.itemsrc_vend_item_number,
      _itemsrc.itemsrc_vend_item_descrip,
      _itemsrc.itemsrc_comments,
      _itemsrc.itemsrc_vend_uom,
      _itemsrc.itemsrc_invvendoruomratio,
      _itemsrc.itemsrc_minordqty,
      _itemsrc.itemsrc_multordqty,
      _itemsrc.itemsrc_leadtime,
      _itemsrc.itemsrc_ranking,
      _itemsrc.itemsrc_active,
      _itemsrc.itemsrc_manuf_name,
      _itemsrc.itemsrc_manuf_item_number,
      _itemsrc.itemsrc_manuf_item_descrip,
      FALSE,
      _itemsrc.itemsrc_upccode,
      _itemsrc.itemsrc_effective,
      _itemsrc.itemsrc_expires,
      _itemsrc.itemsrc_contrct_id );

    INSERT INTO itemsrcp
    ( itemsrcp_itemsrc_id,
      itemsrcp_qtybreak,
      itemsrcp_price,
      itemsrcp_updated,
      itemsrcp_curr_id,
      itemsrcp_dropship,
      itemsrcp_warehous_id,
      itemsrcp_type,
      itemsrcp_discntprcnt,
      itemsrcp_fixedamtdiscount )
    SELECT
      _itemsrcid,
      itemsrcp_qtybreak,
      itemsrcp_price,
      itemsrcp_updated,
      itemsrcp_curr_id,
      itemsrcp_dropship,
      itemsrcp_warehous_id,
      itemsrcp_type,
      itemsrcp_discntprcnt,
      itemsrcp_fixedamtdiscount
      FROM itemsrcp
     WHERE (itemsrcp_itemsrc_id=_itemsrc.itemsrc_id);

    UPDATE itemsrc SET itemsrc_active=FALSE, itemsrc_default=FALSE
    WHERE itemsrc_id=_itemsrc.itemsrc_id;

  END LOOP;

  RETURN _itemsrcid;

END;
$$ LANGUAGE plpgsql;
