DROP TRIGGER IF EXISTS itemlocdist_before_trigger ON itemlocdist;
CREATE TRIGGER itemlocdist_before_trigger BEFORE DELETE ON itemlocdist FOR EACH ROW
  EXECUTE PROCEDURE xt.itemlocdist_save_distribution_detail();