CREATE TABLE toheadtax (
)
INHERITS (taxhist);

ALTER TABLE ONLY toheadtax
    ADD CONSTRAINT toheadtax_pkey PRIMARY KEY (taxhist_id);

ALTER TABLE ONLY toheadtax
    ADD CONSTRAINT toheadtax_taxhist_basis_tax_id_fkey FOREIGN KEY (taxhist_basis_tax_id) REFERENCES tax(tax_id);

ALTER TABLE ONLY toheadtax
    ADD CONSTRAINT toheadtax_taxhist_parent_id_fkey FOREIGN KEY (taxhist_parent_id) REFERENCES tohead(tohead_id) ON DELETE CASCADE;

ALTER TABLE ONLY toheadtax
    ADD CONSTRAINT toheadtax_taxhist_tax_id_fkey FOREIGN KEY (taxhist_tax_id) REFERENCES tax(tax_id);

ALTER TABLE ONLY toheadtax
    ADD CONSTRAINT toheadtax_taxhist_taxtype_id_fkey FOREIGN KEY (taxhist_taxtype_id) REFERENCES taxtype(taxtype_id);

REVOKE ALL ON TABLE toheadtax FROM PUBLIC;
GRANT ALL ON TABLE toheadtax TO xtrole;
