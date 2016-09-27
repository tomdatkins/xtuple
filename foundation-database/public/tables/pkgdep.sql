
--
-- TOC entry 711 (class 1259 OID 146569577)
-- Dependencies: 8
-- Name: pkgdep; Type: TABLE; Schema: public; Owner: admin; Tablespace:
--

CREATE TABLE pkgdep (
    pkgdep_id integer NOT NULL,
    pkgdep_pkghead_id integer NOT NULL,
    pkgdep_parent_pkghead_id integer NOT NULL
);


ALTER TABLE public.pkgdep OWNER TO admin;

--
-- TOC entry 10046 (class 0 OID 0)
-- Dependencies: 711
-- Name: TABLE pkgdep; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE pkgdep IS 'Package Dependencies list describing which packages are dependent on which other packages.';


--
-- TOC entry 10047 (class 0 OID 0)
-- Dependencies: 711
-- Name: COLUMN pkgdep.pkgdep_pkghead_id; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN pkgdep.pkgdep_pkghead_id IS 'This is the internal ID of a package which requires at least one other package to be installed first to operate successfully';


--
-- TOC entry 10048 (class 0 OID 0)
-- Dependencies: 711
-- Name: COLUMN pkgdep.pkgdep_parent_pkghead_id; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN pkgdep.pkgdep_parent_pkghead_id IS 'This is the internal ID of a package which must be installed for the package pointed to by pkgdep_pkghead_id to operate successfully.';


--
-- TOC entry 712 (class 1259 OID 146569580)
-- Dependencies: 711 8
-- Name: pkgdep_pkgdep_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE pkgdep_pkgdep_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pkgdep_pkgdep_id_seq OWNER TO admin;

--
-- TOC entry 10050 (class 0 OID 0)
-- Dependencies: 712
-- Name: pkgdep_pkgdep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE pkgdep_pkgdep_id_seq OWNED BY pkgdep.pkgdep_id;



--
-- TOC entry 8074 (class 2606 OID 146573724)
-- Dependencies: 7510 713 711 8894
-- Name: pkgdep_pkgdep_parent_pkghead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pkgdep
    ADD CONSTRAINT pkgdep_pkgdep_parent_pkghead_id_fkey FOREIGN KEY (pkgdep_parent_pkghead_id) REFERENCES pkghead(pkghead_id);


--
-- TOC entry 8075 (class 2606 OID 146573729)
-- Dependencies: 7510 713 711 8894
-- Name: pkgdep_pkgdep_pkghead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pkgdep
    ADD CONSTRAINT pkgdep_pkgdep_pkghead_id_fkey FOREIGN KEY (pkgdep_pkghead_id) REFERENCES pkghead(pkghead_id);

--
-- TOC entry 6601 (class 2604 OID 146570411)
-- Dependencies: 712 711
-- Name: pkgdep_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pkgdep ALTER COLUMN pkgdep_id SET DEFAULT nextval('pkgdep_pkgdep_id_seq'::regclass);

--
-- TOC entry 7509 (class 2606 OID 146571319)
-- Dependencies: 711 711 8894
-- Name: pkgdep_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace:
--

ALTER TABLE ONLY pkgdep
    ADD CONSTRAINT pkgdep_pkey PRIMARY KEY (pkgdep_id);

--
-- TOC entry 10049 (class 0 OID 0)
-- Dependencies: 711
-- Name: pkgdep; Type: ACL; Schema: public; Owner: admin
--

REVOKE ALL ON TABLE pkgdep FROM PUBLIC;
REVOKE ALL ON TABLE pkgdep FROM admin;
GRANT ALL ON TABLE pkgdep TO admin;
GRANT ALL ON TABLE pkgdep TO xtrole;


--
-- TOC entry 10051 (class 0 OID 0)
-- Dependencies: 712
-- Name: pkgdep_pkgdep_id_seq; Type: ACL; Schema: public; Owner: admin
--

REVOKE ALL ON SEQUENCE pkgdep_pkgdep_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE pkgdep_pkgdep_id_seq FROM admin;
GRANT ALL ON SEQUENCE pkgdep_pkgdep_id_seq TO admin;
GRANT ALL ON SEQUENCE pkgdep_pkgdep_id_seq TO xtrole;





