CREATE TABLE xtmfg.booimage (
    booimage_id integer NOT NULL,
    booimage_booitem_id integer NOT NULL,
    booimage_image_id integer NOT NULL,
    booimage_purpose character(1) NOT NULL,
    CONSTRAINT booimage_booimage_purpose_check CHECK (((((booimage_purpose = 'I'::bpchar) OR (booimage_purpose = 'E'::bpchar)) OR (booimage_purpose = 'M'::bpchar)) OR (booimage_purpose = 'P'::bpchar)))
);

COMMENT ON TABLE xtmfg.booimage IS 'Links Bills of Operations with Images.';

CREATE SEQUENCE xtmfg.booimage_booimage_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
ALTER SEQUENCE xtmfg.booimage_booimage_id_seq OWNED BY xtmfg.booimage.booimage_id;

ALTER TABLE xtmfg.booimage ALTER COLUMN booimage_id SET DEFAULT nextval('booimage_booimage_id_seq'::regclass);

ALTER TABLE ONLY xtmfg.booimage
    ADD CONSTRAINT booimage_pkey PRIMARY KEY (booimage_id);

ALTER TABLE ONLY xtmfg.booimage
    ADD CONSTRAINT booimage_booimage_booitem_id_fkey FOREIGN KEY (booimage_booitem_id) REFERENCES xtmfg.booitem(booitem_id) ON DELETE CASCADE;

ALTER TABLE ONLY xtmfg.booimage
    ADD CONSTRAINT booimage_booimage_image_id_fkey FOREIGN KEY (booimage_image_id) REFERENCES public.image(image_id) ON DELETE CASCADE;

REVOKE ALL ON TABLE xtmfg.booimage FROM PUBLIC;
GRANT ALL ON TABLE xtmfg.booimage TO xtrole;

REVOKE ALL ON SEQUENCE xtmfg.booimage_booimage_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE xtmfg.booimage_booimage_id_seq TO xtrole;
