DO $$
DECLARE
  _col INTEGER;
BEGIN

  _col := (SELECT 1
           FROM information_schema.columns
           WHERE table_name='cohead'
           AND column_name='cohead_type');

  IF NOT FOUND THEN
     RETURN;
  END IF;

-- Check if column is being used and if not used remove column
  IF (NOT EXISTS(SELECT 1 FROM cohead
             WHERE cohead_type IS NOT NULL)) THEN

    ALTER TABLE public.cohead DROP COLUMN IF EXISTS cohead_type;
  END IF;

END;
$$ language plpgsql;
