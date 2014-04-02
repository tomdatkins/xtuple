CREATE TABLE regtype (
    regtype_id serial NOT NULL,
    regtype_code text NOT NULL UNIQUE CHECK(regtype_code != ''),
    regtype_descrip text
);

COMMENT ON TABLE regtype IS 'Warranty Registration Types';

SELECT pg_catalog.setval('regtype_regtype_id_seq', 7, false);

INSERT INTO regtype VALUES (1, 'Shipment', 'Shipment');
INSERT INTO regtype VALUES (2, 'Internet', 'Internet');
INSERT INTO regtype VALUES (3, 'Mail', 'Mail');
INSERT INTO regtype VALUES (4, 'Phone', 'Phone');
INSERT INTO regtype VALUES (5, 'E-Mail', 'E-Mail');
INSERT INTO regtype VALUES (6, 'Other', 'Other');

ALTER TABLE ONLY regtype
    ADD CONSTRAINT regtype_pkey PRIMARY KEY (regtype_id);

REVOKE ALL ON TABLE regtype FROM PUBLIC;
GRANT ALL ON TABLE regtype TO xtrole;

REVOKE ALL ON SEQUENCE regtype_regtype_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE regtype_regtype_id_seq TO xtrole;
