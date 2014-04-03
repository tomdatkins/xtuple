CREATE TABLE lsseq (
	lsseq_id      SERIAL PRIMARY KEY,
	lsseq_number  TEXT NOT NULL CHECK(lsseq_number != ''),
	lsseq_descrip TEXT,
	lsseq_seqlen  INTEGER DEFAULT 5,
	lsseq_prefix  TEXT DEFAULT '',
	lsseq_suffix  TEXT DEFAULT ''
);

GRANT ALL ON TABLE lsseq TO xtrole;
GRANT ALL ON SEQUENCE lsseq_lsseq_id_seq TO xtrole;
ALTER TABLE lsseq ADD UNIQUE (lsseq_number);
ALTER TABLE lsseq ADD CHECK (lsseq_seqlen > 0);

COMMENT ON TABLE lsseq IS 'Lot/Serial sequence for automatically created lot/serial numbers';
COMMENT ON COLUMN lsseq.lsseq_id IS 'Primary key';
COMMENT ON COLUMN lsseq.lsseq_number IS 'Sequence number';
COMMENT ON COLUMN lsseq.lsseq_descrip IS 'Description';
COMMENT ON COLUMN lsseq.lsseq_seqlen IS 'Minimum length of sequence number.  Smaller numbers are padded with zeros.';
COMMENT ON COLUMN lsseq.lsseq_prefix IS 'A text prefix for generated lot/serial numbers.';
COMMENT ON COLUMN lsseq.lsseq_suffix IS 'A text suffix for generated lot/serial numbers.';
