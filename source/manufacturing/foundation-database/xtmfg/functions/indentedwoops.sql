
CREATE OR REPLACE FUNCTION xtmfg.indentedwoops(integer,integer) RETURNS SETOF wodata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pwoid ALIAS FOR $1;
  plevel ALIAS FOR $2;
  _row wodata%ROWTYPE;  
  
BEGIN

  FOR _row IN
    SELECT 
      wooper_id AS wodata_id,
      3::integer AS wodata_id_type,    
      NULL::integer AS wodata_number,        
      wooper_seqnumber AS wodata_subnumber,
      wrkcnt_code AS wodata_itemnumber,
      wooper_descrip1 AS wodata_descrip,
      CASE WHEN (wo_status = 'C') THEN 'C'
        WHEN (wooper_sucomplete) THEN 'I'
        ELSE wo_status 
      END AS wodata_status,
      wo_startdate AS wodata_startdate,
      wooper_scheduled AS wodata_duedate,
      wo_adhoc AS wodata_adhoc,     
      NULL::integer AS wodata_itemsite_id,
      wooper_price AS wodata_custprice,
      wooper_price AS wodata_listprice,
      NULL::numeric AS wodata_qoh,
      noneg(wo_qtyord - wooper_qtyrcv) AS wodata_short, 
      NULL::numeric AS wodata_qtyper,
      NULL::numeric AS wodata_qtyiss,
      wooper_qtyrcv AS wodata_qtyrcv,   
      wo_qtyord AS wodata_qtyordreq, 
      uom_name AS wodata_qtyuom, 
      NULL::numeric AS wodata_scrap,
      CASE WHEN (wooper_sucomplete) THEN 0
        ELSE noNeg(wooper_sutime - wooper_suconsumed)
      END AS wodata_setup,
      CASE WHEN (wooper_rncomplete) THEN 0
        ELSE noNeg(wooper_rntime - wooper_rnconsumed)
      END AS wodata_run,
      wooper_instruc AS wodata_notes,
      NULL::text AS wodata_ref,           
      plevel + 1 AS wodata_level  
    FROM wo
     JOIN xtmfg.wooper ON (wooper_wo_id=wo_id)
     JOIN xtmfg.wrkcnt ON (wooper_wrkcnt_id=wrkcnt_id)
     JOIN itemsite ON (wo_itemsite_id=itemsite_id)
     JOIN item ON (itemsite_item_id=item_id)
     JOIN uom ON (item_inv_uom_id=uom_id)
    WHERE (wooper_wo_id=pwoid)
    ORDER BY wooper_seqnumber
    LOOP 
      RETURN NEXT _row; 
    END LOOP;

    RETURN;
    
END;
$$ LANGUAGE 'plpgsql';
