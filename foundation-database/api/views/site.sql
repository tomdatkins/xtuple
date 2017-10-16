-- View: api.site

<<<<<<< HEAD
SELECT dropIfExists('VIEW', 'site', 'api');
=======
-- DROP VIEW api.site;
>>>>>>> 198b7e0af38c88f1a6075b682c0bed0b9ed88aa3

CREATE OR REPLACE VIEW api.site AS 
 SELECT whsinfo.warehous_code::character varying AS code,
    st.sitetype_name AS type,
    whsinfo.warehous_active AS active,
    whsinfo.warehous_descrip AS description,
    m.addr_number AS address_number,
    m.addr_line1 AS address1,
    m.addr_line2 AS address2,
    m.addr_line3 AS address3,
    m.addr_city AS city,
    m.addr_state AS state,
    m.addr_postalcode AS postal_code,
    m.addr_country AS country,
    ''::text AS address_change,
    c.cntct_number AS contact_number,
    c.cntct_honorific AS honorific,
    c.cntct_first_name AS first,
    c.cntct_middle AS middle,
    c.cntct_last_name AS last,
    c.cntct_suffix AS suffix,
    c.cntct_title AS job_title,
    c.cntct_phone AS phone,
    c.cntct_fax AS fax,
    c.cntct_email AS email,
    ''::text AS contact_change,
    formatglaccount(a.accnt_id) AS post_unassigned_transactions_to,
    a.accnt_descrip AS post_unassigned_transactions_to_description,
    whsinfo.warehous_transit AS transit_type,
<<<<<<< HEAD
    COALESCE(NOT warehous_transit, true) AS inventory_type,
=======
        CASE
            WHEN whsinfo.warehous_transit THEN false
            ELSE true
        END AS inventory_type,
>>>>>>> 198b7e0af38c88f1a6075b682c0bed0b9ed88aa3
        CASE
            WHEN whsinfo.warehous_transit THEN ''::text
            ELSE whsinfo.warehous_bol_prefix
        END AS next_bill_of_lading_prefix,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            ELSE whsinfo.warehous_bol_number
        END AS next_bill_of_lading_number,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            ELSE whsinfo.warehous_shipping
        END AS shipping_site,
        CASE
            WHEN whsinfo.warehous_transit THEN ''::text
            ELSE whsinfo.warehous_counttag_prefix
        END AS next_count_tag_prefix,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            ELSE whsinfo.warehous_counttag_number
        END AS next_count_tag_number,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            ELSE whsinfo.warehous_useslips
        END AS force_the_use_of_count_slips,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            ELSE whsinfo.warehous_usezones
        END AS force_the_use_of_zones,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            ELSE whsinfo.warehous_sequence
        END AS scheduling_sequence,
        CASE
            WHEN whsinfo.warehous_transit THEN 0::numeric
            ELSE whsinfo.warehous_shipping_commission * 100.0
        END AS shipping_commission,
        CASE
            WHEN whsinfo.warehous_transit THEN ''::text
            ELSE t.taxzone_code
        END AS tax_zone,
        CASE
            WHEN whsinfo.warehous_transit THEN ''::text
            ELSE whsinfo.warehous_fob
        END AS default_fob,
        CASE
            WHEN whsinfo.warehous_transit THEN s.shipvia_code
            ELSE ''::text
        END AS default_ship_via,
        CASE
            WHEN whsinfo.warehous_transit THEN f.shipform_name
            ELSE ''::text
        END AS default_shipping_form,
        CASE
            WHEN whsinfo.warehous_transit THEN cc.costcat_code
            ELSE ''::text
        END AS default_cost_category,
        CASE
            WHEN whsinfo.warehous_transit THEN whsinfo.warehous_shipcomments
            ELSE ''::text
        END AS shipping_comments,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            ELSE whsinfo.warehous_enforcearbl
        END AS enforce_arbl_naming_convention,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            WHEN whsinfo.warehous_enforcearbl THEN whsinfo.warehous_aislesize
            ELSE 0
        END AS aisle_size,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            WHEN whsinfo.warehous_enforcearbl AND whsinfo.warehous_aislealpha THEN true
            ELSE false
        END AS aisle_allow_alpha_characters,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            WHEN whsinfo.warehous_enforcearbl THEN whsinfo.warehous_racksize
            ELSE 0
        END AS rack_size,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            WHEN whsinfo.warehous_enforcearbl AND whsinfo.warehous_rackalpha THEN true
            ELSE false
        END AS rack_allow_alpha_characters,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            WHEN whsinfo.warehous_enforcearbl THEN whsinfo.warehous_binsize
            ELSE 0
        END AS bin_size,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            WHEN whsinfo.warehous_enforcearbl AND whsinfo.warehous_binalpha THEN true
            ELSE false
        END AS bin_allow_alpha_characters,
        CASE
            WHEN whsinfo.warehous_transit THEN 0
            WHEN whsinfo.warehous_enforcearbl THEN whsinfo.warehous_locationsize
            ELSE 0
        END AS location_size,
        CASE
            WHEN whsinfo.warehous_transit THEN false
            WHEN whsinfo.warehous_enforcearbl AND whsinfo.warehous_locationalpha THEN true
            ELSE false
        END AS location_allow_alpha_characters
   FROM whsinfo
<<<<<<< HEAD
     LEFT JOIN addr m ON whsinfo.warehous_addr_id=m.addr_id
     LEFT JOIN cntct c ON whsinfo.warehous_cntct_id=c.cntct_id
     LEFT JOIN accnt a ON whsinfo.warehous_default_accnt_id=a.accnt_id
     LEFT JOIN taxzone t ON whsinfo.warehous_taxzone_id=t.taxzone_id
     LEFT JOIN shipvia s ON whsinfo.warehous_shipvia_id=s.shipvia_id
     LEFT JOIN shipform f ON whsinfo.warehous_shipform_id=f.shipform_id
     LEFT JOIN costcat cc ON whsinfo.warehous_costcat_id=cc.costcat_id
     LEFT JOIN sitetype st ON whsinfo.warehous_sitetype_id=st.sitetype_id
=======
     LEFT JOIN addr m ON whsinfo.warehous_addr_id = m.addr_id
     LEFT JOIN cntct c ON whsinfo.warehous_cntct_id = c.cntct_id
     LEFT JOIN accnt a ON whsinfo.warehous_default_accnt_id = a.accnt_id
     LEFT JOIN taxzone t ON whsinfo.warehous_taxzone_id = t.taxzone_id
     LEFT JOIN shipvia s ON whsinfo.warehous_shipvia_id = s.shipvia_id
     LEFT JOIN shipform f ON whsinfo.warehous_shipform_id = f.shipform_id
     LEFT JOIN costcat cc ON whsinfo.warehous_costcat_id = cc.costcat_id
     LEFT JOIN sitetype st ON whsinfo.warehous_sitetype_id = st.sitetype_id
>>>>>>> 198b7e0af38c88f1a6075b682c0bed0b9ed88aa3
  ORDER BY whsinfo.warehous_code;

ALTER TABLE api.site
  OWNER TO admin;
GRANT ALL ON TABLE api.site TO admin;
GRANT ALL ON TABLE api.site TO xtrole;
COMMENT ON VIEW api.site
  IS 'Site';

-- Rule: "_DELETE" ON api.site

-- DROP RULE "_DELETE" ON api.site;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.site DO NOTHING;

-- Rule: "_INSERT" ON api.site

-- DROP RULE "_INSERT" ON api.site;

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.site DO INSTEAD  INSERT INTO whsinfo (warehous_code, warehous_descrip, warehous_fob, warehous_active, warehous_counttag_prefix, warehous_counttag_number, warehous_bol_prefix, warehous_bol_number, warehous_shipping, warehous_useslips, warehous_usezones, warehous_aislesize, warehous_aislealpha, warehous_racksize, warehous_rackalpha, warehous_binsize, warehous_binalpha, warehous_locationsize, warehous_locationalpha, warehous_enforcearbl, warehous_default_accnt_id, warehous_shipping_commission, warehous_cntct_id, warehous_addr_id, warehous_taxzone_id, warehous_transit, warehous_shipform_id, warehous_shipvia_id, warehous_shipcomments, warehous_costcat_id, warehous_sitetype_id, warehous_sequence)
  VALUES (COALESCE(new.code, ''::character varying), COALESCE(new.description, ''::text),
        CASE
            WHEN new.inventory_type THEN COALESCE(new.default_fob, ''::text)
            ELSE ''::text
        END, COALESCE(new.active, true),
        CASE
            WHEN new.inventory_type THEN COALESCE(new.next_count_tag_prefix, ''::text)
            ELSE ''::text
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.next_count_tag_number, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.next_bill_of_lading_prefix, ''::text)
            ELSE ''::text
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.next_bill_of_lading_number, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.shipping_site, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.force_the_use_of_count_slips, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.force_the_use_of_zones, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.aisle_size, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.aisle_allow_alpha_characters, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.rack_size, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.rack_allow_alpha_characters, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.bin_size, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.bin_allow_alpha_characters, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.location_size, 0)
            ELSE 0
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.location_allow_alpha_characters, false)
            ELSE false
        END,
        CASE
            WHEN new.inventory_type THEN COALESCE(new.enforce_arbl_naming_convention, false)
            ELSE false
        END, COALESCE(getglaccntid(new.post_unassigned_transactions_to), '-1'::integer),
        CASE
            WHEN new.inventory_type THEN COALESCE(new.shipping_commission * 0.01, 0::numeric)
            ELSE 0::numeric
        END, savecntct(getcntctid(new.contact_number), new.contact_number, NULL::integer, new.honorific, new.first, new.middle, new.last, new.suffix, new.phone, NULL::text, new.fax, new.email, NULL::text, new.job_title, new.contact_change), saveaddr(getaddrid(new.address_number), new.address_number, new.address1, new.address2, new.address3, new.city, new.state, new.postal_code, new.country, new.address_change),
        CASE
		    WHEN new.inventory_type THEN gettaxzoneid(new.tax_zone)
            ELSE NULL::integer
        END,
        CASE
            WHEN new.inventory_type THEN false
            WHEN new.transit_type THEN true
            ELSE false
        END,
        CASE
            WHEN new.transit_type THEN COALESCE(getshipformid(new.default_shipping_form)::numeric, fetchmetricvalue('DefaultShipFormId'::text))
            ELSE NULL::numeric
        END,
        CASE
            WHEN new.transit_type THEN COALESCE(getshipviaid(new.default_ship_via)::numeric, fetchmetricvalue('DefaultShipViaId'::text))
            ELSE NULL::numeric
        END,
        CASE
            WHEN new.transit_type THEN COALESCE(new.shipping_comments, ''::text)
            ELSE ''::text
        END,
        CASE
            WHEN new.transit_type THEN COALESCE(getcostcatid(new.default_cost_category), '-1'::integer)
            ELSE NULL::integer
        END, COALESCE(getsitetypeid(new.type), '-1'::integer), COALESCE(new.scheduling_sequence, 0));

-- Rule: "_UPDATE" ON api.site

-- DROP RULE "_UPDATE" ON api.site;

CREATE OR REPLACE RULE "_UPDATE" AS
<<<<<<< HEAD
    ON UPDATE TO api.site DO INSTEAD  UPDATE whsinfo SET warehous_descrip=new.description, 
	warehous_fob=CASE  WHEN new.inventory_type THEN new.default_fob
					   ELSE NULL::text
				  END,
	warehous_active=new.active, 
	warehous_counttag_prefix=CASE WHEN new.inventory_type THEN new.next_count_tag_prefix
								  ELSE NULL::text
							 END, 
	warehous_counttag_number=CASE WHEN new.inventory_type THEN new.next_count_tag_number
								  ELSE NULL::integer
							 END, 
	warehous_bol_prefix=CASE WHEN new.inventory_type THEN new.next_bill_of_lading_prefix
							 ELSE NULL::text
						END, 
	warehous_bol_number=CASE WHEN new.inventory_type THEN new.next_bill_of_lading_number
							 ELSE NULL::integer
						END, 
	warehous_shipping=CASE WHEN new.inventory_type THEN new.shipping_site
						   ELSE NULL::boolean
					  END, 
	warehous_useslips=CASE WHEN new.inventory_type THEN new.force_the_use_of_count_slips
						   ELSE NULL::boolean
					  END, 
	warehous_usezones=CASE WHEN new.inventory_type THEN new.force_the_use_of_zones
						   ELSE NULL::boolean
					  END,
	warehous_aislesize=CASE WHEN new.inventory_type THEN new.aisle_size
						    ELSE NULL::integer
					   END, 
	warehous_aislealpha=CASE WHEN new.inventory_type THEN new.aisle_allow_alpha_characters
							 ELSE NULL::boolean
						END, 
	warehous_racksize=CASE WHEN new.inventory_type THEN new.rack_size
						  ELSE NULL::integer
					  END,
	warehous_rackalpha=CASE WHEN new.inventory_type THEN new.rack_allow_alpha_characters
							ELSE NULL::boolean
					   END,
	warehous_binsize=CASE WHEN new.inventory_type THEN new.bin_size
						  ELSE NULL::integer
					 END, 
	warehous_binalpha=CASE WHEN new.inventory_type THEN new.bin_allow_alpha_characters
						   ELSE NULL::boolean
					  END, 
	warehous_locationsize=CASE WHEN new.inventory_type THEN new.location_size
								ELSE NULL::integer
						  END, 
	warehous_locationalpha=CASE WHEN new.inventory_type THEN new.location_allow_alpha_characters
								ELSE NULL::boolean
						   END, 
	warehous_enforcearbl=CASE WHEN new.inventory_type THEN new.enforce_arbl_naming_convention
							  ELSE NULL::boolean
						 END, 
	warehous_default_accnt_id=getglaccntid(new.post_unassigned_transactions_to), 
	warehous_shipping_commission=CASE WHEN new.inventory_type THEN new.shipping_commission * 0.01
									  ELSE NULL::numeric
								 END,
	warehous_cntct_id=savecntct(getcntctid(new.contact_number), new.contact_number, NULL::integer, new.honorific, new.first,
	new.middle, new.last, new.suffix, new.phone, NULL::text, new.fax, new.email, NULL::text, new.job_title, new.contact_change), 
	warehous_addr_id=saveaddr(getaddrid(new.address_number), new.address_number, new.address1, new.address2, new.address3, new.city, new.state, new.postal_code, new.country, new.address_change), 
	warehous_taxzone_id=CASE WHEN new.inventory_type THEN gettaxzoneid(new.tax_zone)
							 ELSE NULL::integer
						END, 
	warehous_transit=CASE WHEN new.inventory_type THEN false
						  WHEN new.transit_type THEN true
						  ELSE NULL::boolean
					 END, 
	warehous_shipform_id=CASE WHEN new.transit_type THEN getshipformid(new.default_shipping_form)
							  ELSE NULL::integer
						 END, 
	warehous_shipvia_id=CASE WHEN new.transit_type THEN getshipviaid(new.default_ship_via)
							 ELSE NULL::integer
						END, 
	warehous_shipcomments=CASE WHEN new.transit_type THEN new.shipping_comments
							   ELSE NULL::text
						  END,
	warehous_costcat_id=CASE WHEN new.transit_type THEN getcostcatid(new.default_cost_category)
							 ELSE NULL::integer
						END, 
	warehous_sitetype_id=getsitetypeid(new.type), warehous_sequence=new.scheduling_sequence
  WHERE whsinfo.warehous_id=getwarehousid(old.code::text, 'ALL'::text);
=======
    ON UPDATE TO api.site DO INSTEAD  UPDATE whsinfo SET warehous_descrip = new.description, warehous_fob =
        CASE
            WHEN new.inventory_type THEN new.default_fob
            ELSE NULL::text
        END, warehous_active = new.active, warehous_counttag_prefix =
        CASE
            WHEN new.inventory_type THEN new.next_count_tag_prefix
            ELSE NULL::text
        END, warehous_counttag_number =
        CASE
            WHEN new.inventory_type THEN new.next_count_tag_number
            ELSE NULL::integer
        END, warehous_bol_prefix =
        CASE
            WHEN new.inventory_type THEN new.next_bill_of_lading_prefix
            ELSE NULL::text
        END, warehous_bol_number =
        CASE
            WHEN new.inventory_type THEN new.next_bill_of_lading_number
            ELSE NULL::integer
        END, warehous_shipping =
        CASE
            WHEN new.inventory_type THEN new.shipping_site
            ELSE NULL::boolean
        END, warehous_useslips =
        CASE
            WHEN new.inventory_type THEN new.force_the_use_of_count_slips
            ELSE NULL::boolean
        END, warehous_usezones =
        CASE
            WHEN new.inventory_type THEN new.force_the_use_of_zones
            ELSE NULL::boolean
        END, warehous_aislesize =
        CASE
            WHEN new.inventory_type THEN new.aisle_size
            ELSE NULL::integer
        END, warehous_aislealpha =
        CASE
            WHEN new.inventory_type THEN new.aisle_allow_alpha_characters
            ELSE NULL::boolean
        END, warehous_racksize =
        CASE
            WHEN new.inventory_type THEN new.rack_size
            ELSE NULL::integer
        END, warehous_rackalpha =
        CASE
            WHEN new.inventory_type THEN new.rack_allow_alpha_characters
            ELSE NULL::boolean
        END, warehous_binsize =
        CASE
            WHEN new.inventory_type THEN new.bin_size
            ELSE NULL::integer
        END, warehous_binalpha =
        CASE
            WHEN new.inventory_type THEN new.bin_allow_alpha_characters
            ELSE NULL::boolean
        END, warehous_locationsize =
        CASE
            WHEN new.inventory_type THEN new.location_size
            ELSE NULL::integer
        END, warehous_locationalpha =
        CASE
            WHEN new.inventory_type THEN new.location_allow_alpha_characters
            ELSE NULL::boolean
        END, warehous_enforcearbl =
        CASE
            WHEN new.inventory_type THEN new.enforce_arbl_naming_convention
            ELSE NULL::boolean
        END, warehous_default_accnt_id = getglaccntid(new.post_unassigned_transactions_to), warehous_shipping_commission =
        CASE
            WHEN new.inventory_type THEN new.shipping_commission * 0.01
            ELSE NULL::numeric
        END, warehous_cntct_id = savecntct(getcntctid(new.contact_number), new.contact_number, NULL::integer, new.honorific, new.first, new.middle, new.last, new.suffix, new.phone, NULL::text, new.fax, new.email, NULL::text, new.job_title, new.contact_change), warehous_addr_id = saveaddr(getaddrid(new.address_number), new.address_number, new.address1, new.address2, new.address3, new.city, new.state, new.postal_code, new.country, new.address_change), warehous_taxzone_id =
        CASE
            WHEN new.inventory_type THEN gettaxzoneid(new.tax_zone)
            ELSE NULL::integer
        END, warehous_transit =
        CASE
            WHEN new.inventory_type THEN false
            WHEN new.transit_type THEN true
            ELSE NULL::boolean
        END, warehous_shipform_id =
        CASE
            WHEN new.transit_type THEN getshipformid(new.default_shipping_form)
            ELSE NULL::integer
        END, warehous_shipvia_id =
        CASE
            WHEN new.transit_type THEN getshipviaid(new.default_ship_via)
            ELSE NULL::integer
        END, warehous_shipcomments =
        CASE
            WHEN new.transit_type THEN new.shipping_comments
            ELSE NULL::text
        END, warehous_costcat_id =
        CASE
            WHEN new.transit_type THEN getcostcatid(new.default_cost_category)
            ELSE NULL::integer
        END, warehous_sitetype_id = getsitetypeid(new.type), warehous_sequence = new.scheduling_sequence
  WHERE whsinfo.warehous_id = getwarehousid(old.code::text, 'ALL'::text);
>>>>>>> 198b7e0af38c88f1a6075b682c0bed0b9ed88aa3

