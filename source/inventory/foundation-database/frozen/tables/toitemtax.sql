CREATE TABLE toitemtax (
)
INHERITS (taxhist);

ALTER TABLE ONLY toitemtax
    ADD CONSTRAINT toitemtax_pkey PRIMARY KEY (taxhist_id);

ALTER TABLE ONLY toitemtax
    ADD CONSTRAINT toitemtax_taxhist_basis_tax_id_fkey FOREIGN KEY (taxhist_basis_tax_id) REFERENCES tax(tax_id);

ALTER TABLE ONLY toitemtax
    ADD CONSTRAINT toitemtax_taxhist_parent_id_fkey FOREIGN KEY (taxhist_parent_id) REFERENCES toitem(toitem_id) ON DELETE CASCADE;

ALTER TABLE ONLY toitemtax
    ADD CONSTRAINT toitemtax_taxhist_tax_id_fkey FOREIGN KEY (taxhist_tax_id) REFERENCES tax(tax_id);

ALTER TABLE ONLY toitemtax
    ADD CONSTRAINT toitemtax_taxhist_taxtype_id_fkey FOREIGN KEY (taxhist_taxtype_id) REFERENCES taxtype(taxtype_id);

REVOKE ALL ON TABLE toitemtax FROM PUBLIC;
GRANT ALL ON TABLE toitemtax TO xtrole;
