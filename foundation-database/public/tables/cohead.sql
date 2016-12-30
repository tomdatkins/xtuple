DO $$
BEGIN

-- Check if column is being used and if not remove
  IF (NOT EXISTS(SELECT 1 FROM cohead
             WHERE cohead_type IS NOT NULL)) THEN

    ALTER TABLE public.cohead DROP COLUMN IF EXISTS cohead_type;
  END IF;
END;
$$
