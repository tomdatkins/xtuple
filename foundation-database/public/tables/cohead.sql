DO $$
DECLARE
  _col INTEGER;
BEGIN

  SELECT 1 INTO _col
  FROM information_schema.columns
  WHERE table_name='cohead'
  AND column_name='cohead_type';

  IF NOT FOUND THEN
     RAISE NOTICE 'cohead_type has already been removed';
     RETURN;
  END IF;

-- Check if column is being used and if not used remove column
  IF (NOT EXISTS(SELECT 1 FROM cohead
             WHERE cohead_type IS NOT NULL)) THEN

    ALTER TABLE public.cohead DROP COLUMN IF EXISTS cohead_type;
    RAISE NOTICE 'cohead_type has been removed';
    RETURN;
  END IF;

  RAISE NOTICE 'cohead_type is populated and could not be removed';
  RETURN;
END;
$$ language plpgsql;
