CREATE OR REPLACE FUNCTION _lsseqTrigger () RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  _qry TEXT;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    _qry := 'CREATE SEQUENCE public.lsseq_number_seq_' || NEW.lsseq_id || ' MINVALUE 0;';
    _qry := _qry || 'GRANT ALL ON SEQUENCE public.lsseq_number_seq_' || NEW.lsseq_id || ' to xtrole;';
    EXECUTE _qry;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    _qry := 'DROP SEQUENCE public.lsseq_number_seq_' || OLD.lsseq_id;
    EXECUTE _qry;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE 'plpgsql';

SELECT dropIfExists('TRIGGER', 'lsseqTrigger');
CREATE TRIGGER lsseqTrigger AFTER INSERT OR DELETE ON lsseq FOR EACH ROW EXECUTE PROCEDURE _lsseqTrigger();
