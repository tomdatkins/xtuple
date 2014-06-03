CREATE TABLE xwd.catitemalias
(catitemalias_id SERIAL NOT NULL,
 catitemalias_item_id INTEGER NOT NULL,
 catitemalias_number TEXT NOT NULL,
 catitemalias_cust_id INTEGER NOT NULL,
 CONSTRAINT catitemalias_pkey PRIMARY KEY (catitemalias_id)
);

ALTER TABLE xwd.catitemalias OWNER TO "admin";
GRANT ALL ON TABLE xwd.catitemalias TO "admin";
GRANT ALL ON TABLE xwd.catitemalias TO xtrole;
GRANT ALL ON SEQUENCE xwd.catitemalias_catitemalias_id_seq TO xtrole;

COMMENT ON TABLE xwd.catitemalias IS 'External Catalog Item Alias table extension';
