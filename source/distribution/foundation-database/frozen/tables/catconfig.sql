CREATE TABLE xwd.catconfig
(catconfig_id SERIAL NOT NULL,
 catconfig_provider TEXT,
 catconfig_provider_descrip TEXT,
 catconfig_warehous_id INTEGER,
 catconfig_plancode_id INTEGER,
 catconfig_terms_id INTEGER,
 catconfig_vendtype_id INTEGER,
 catconfig_costcat_id INTEGER,
 catconfig_controlmethod CHAR(1),
 catconfig_taxzone_id INTEGER,
 catconfig_taxtype_id INTEGER,
 catconfig_createsopr BOOLEAN DEFAULT FALSE,
 catconfig_createsopo BOOLEAN DEFAULT FALSE,
 catconfig_dropship BOOLEAN DEFAULT FALSE,
 catconfig_costmethod CHAR(1),
 catconfig_classcode_id INTEGER DEFAULT -1,
 catconfig_inv_uom_id INTEGER DEFAULT -1,
 catconfig_reorderlevel NUMERIC(18,6) DEFAULT 1.0,
 catconfig_ordertoqty NUMERIC(18,6) DEFAULT 2.0,
 catconfig_cyclecountfreq INTEGER DEFAULT 0,
 catconfig_loccntrl BOOLEAN DEFAULT FALSE,
 catconfig_safetystock NUMERIC(18,6) DEFAULT 0.0,
 catconfig_minordqty NUMERIC(18,6) DEFAULT 0.0,
 catconfig_multordqty NUMERIC(18,6) DEFAULT 0.0,
 catconfig_leadtime INTEGER DEFAULT 0,
 catconfig_abcclass CHAR(1),
 catconfig_eventfence INTEGER DEFAULT 0,
 catconfig_stocked BOOLEAN DEFAULT FALSE,
 catconfig_location_id INTEGER,
 catconfig_useparams BOOLEAN DEFAULT FALSE,
 catconfig_useparamsmanual BOOLEAN DEFAULT FALSE,
 catconfig_location TEXT,
 catconfig_autoabcclass BOOLEAN DEFAULT FALSE,
 catconfig_ordergroup INTEGER DEFAULT 1,
 catconfig_maxordqty NUMERIC(18,6) DEFAULT 0.0,
 catconfig_ordergroup_first BOOLEAN DEFAULT FALSE,
 catconfig_planning_type CHAR(1) DEFAULT 'M'::bpchar,
 catconfig_recvlocation_id INTEGER DEFAULT -1,
 catconfig_issuelocation_id INTEGER DEFAULT -1,
 catconfig_location_dist BOOLEAN DEFAULT FALSE,
 catconfig_recvlocation_dist BOOLEAN DEFAULT FALSE,
 catconfig_issuelocation_dist BOOLEAN DEFAULT FALSE,
 CONSTRAINT catconfig_pkey PRIMARY KEY (catconfig_id)
);

ALTER TABLE xwd.catconfig OWNER TO "admin";
GRANT ALL ON TABLE xwd.catconfig TO "admin";
GRANT ALL ON TABLE xwd.catconfig TO xtrole;
GRANT ALL ON SEQUENCE xwd.catconfig_catconfig_id_seq TO xtrole;

COMMENT ON TABLE xwd.catconfig IS 'Trade Service Catalog conversion to xTuple configuration parameters';
