SELECT dropIfExists('VIEW', 'lotserialreg', 'api');

CREATE VIEW api.lotserialreg AS
SELECT 
  lsreg_number::varchar AS registration_number,
  regtype_code AS registration_type,
  lsreg_regdate AS register_date,
  lsreg_solddate AS sold_date,
  lsreg_expiredate AS expire_date,
  crmacct_number AS crm_account,
  item_number,
  ls_number AS lotserial_number,
  lsreg_qty AS qty,
  cntct_number AS contact_number,
  cntct_honorific AS honorific,
  cntct_first_name AS first,
  cntct_middle AS middle,
  cntct_last_name AS last,
  cntct_suffix AS suffix,
  cntct_initials AS initials,
  cntct_title AS job_title,
  cntct_phone AS voice,
  cntct_phone2 AS alternate,
  cntct_fax AS fax,
  cntct_email AS email,
  cntct_webaddr AS web,
  (''::TEXT) AS contact_change,
  addr_number AS address_number,
  addr_line1 AS address1,
  addr_line2 AS address2,
  addr_line3 AS address3,
  addr_city AS city,
  addr_state AS state,
  addr_postalcode AS postal_code,
  addr_country AS country,
  (''::TEXT) AS address_change,
  cohead_number AS sales_order_number,
  shiphead_number AS shipment_number,
  lsreg_notes AS notes
FROM
  lsreg
    LEFT OUTER JOIN crmacct ON (lsreg_crmacct_id=crmacct_id)
    LEFT OUTER JOIN cohead ON (lsreg_cohead_id=cohead_id)
    LEFT OUTER JOIN shiphead ON (lsreg_shiphead_id=shiphead_id),
  regtype,cntct
    LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id),
  ls,item
WHERE ((lsreg_regtype_id=regtype_id)
AND (lsreg_ls_id=ls_id)
AND (lsreg_cntct_id=cntct_id)
AND (ls_item_id=item_id))
ORDER BY lsreg_number;
  

GRANT ALL ON TABLE api.lotserialreg TO xtrole;
COMMENT ON VIEW api.lotserialreg IS 'Lot/Serial Registration';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.lotserialreg DO INSTEAD

INSERT INTO lsreg
	(lsreg_number,
	 lsreg_regtype_id,
	 lsreg_regdate,
	 lsreg_solddate,
	 lsreg_expiredate,
	 lsreg_crmacct_id,
	 lsreg_ls_id,
	 lsreg_qty,
	 lsreg_cntct_id,
	 lsreg_cohead_id,
	 lsreg_shiphead_id,
	 lsreg_notes )
        VALUES
        (COALESCE(NEW.registration_number,fetchlsregnumber()),
         getregtypeid(NEW.registration_type),
         NEW.register_date,
         NEW.sold_date,
         NEW.expire_date,
         getcrmacctid(NEW.crm_account),
         getlsid(NEW.item_number,NEW.lotserial_number),
         NEW.qty,
         saveCntct(
          getCntctId(NEW.contact_number),
          NEW.contact_number,
          NULL,
          saveAddr(
            getAddrId(NEW.address_number),
            NEW.address_number,
            NEW.address1,
            NEW.address2,
            NEW.address3,
            NEW.city,
            NEW.state,
            NEW.postal_code,
            NEW.country,
            NEW.address_change),
          NEW.honorific,
          NEW.first,
          NEW.middle,
          NEW.last,
          NEW.suffix,
          NEW.initials,
          NULL,
          NEW.voice,
          NEW.alternate,
          NEW.fax,
          NEW.email,
          NEW.web,
          NULL,
          NEW.job_title,
          NEW.contact_change
          ),
          getcoheadid(NEW.sales_order_number),
          getshipheadid(NEW.shipment_number),
          NEW.notes);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.lotserialreg DO INSTEAD

UPDATE lsreg SET
    lsreg_regtype_id=getregtypeid(NEW.registration_type),
    lsreg_regdate=NEW.register_date,
    lsreg_solddate=NEW.sold_date,
    lsreg_expiredate=NEW.expire_date,
    lsreg_crmacct_id=getcrmacctid(NEW.crm_account),
    lsreg_ls_id=getlsid(NEW.item_number,NEW.lotserial_number),       
    lsreg_qty=NEW.qty,
    lsreg_cntct_id=saveCntct(
          getCntctId(NEW.contact_number),
          NEW.contact_number,
          NULL,
          saveAddr(
            getAddrId(NEW.address_number),
            NEW.address_number,
            NEW.address1,
            NEW.address2,
            NEW.address3,
            NEW.city,
            NEW.state,
            NEW.postal_code,
            NEW.country,
            NEW.address_change),
          NEW.honorific,
          NEW.first,
          NEW.middle,
          NEW.last,
          NEW.suffix,
          NEW.initials,
          NULL,
          NEW.voice,
          NEW.alternate,
          NEW.fax,
          NEW.email,
          NEW.web,
          NULL,
          NEW.job_title,
          NEW.contact_change ),
    lsreg_cohead_id=getcoheadid(NEW.sales_order_number),
    lsreg_shiphead_id=getshipheadid(NEW.shipment_number),
    lsreg_notes=NEW.notes
  WHERE (lsreg_number=OLD.registration_number);

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.lotserialreg DO INSTEAD

DELETE FROM charass
WHERE ((charass_target_type='LSR')
AND (charass_target_id=(getlsregid(OLD.registration_number))));

CREATE OR REPLACE RULE "_DELETE_CHAR" AS
    ON DELETE TO api.lotserialreg DO INSTEAD
    
DELETE FROM lsreg
WHERE (lsreg_number=OLD.registration_number);
