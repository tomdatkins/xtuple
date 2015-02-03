CREATE TABLE xtcore.potype (
    potype_id SERIAL NOT NULL PRIMARY KEY,
    potype_code text NOT NULL,
    potype_descr text,
    potype_active boolean not null default true,
--    potype_emlprofile_id integer NOT NULL REFERENCES xtcore.emlprofile(emlprofile_id),
    potype_emlprofile_id integer NOT NULL,

    UNIQUE (potype_code)
);

REVOKE ALL ON TABLE xtcore.potype FROM PUBLIC;
GRANT ALL ON TABLE xtcore.potype TO xtrole;
REVOKE ALL ON TABLE xtcore.potype_potype_id_seq FROM PUBLIC;
GRANT ALL ON TABLE xtcore.potype_potype_id_seq TO xtrole;
