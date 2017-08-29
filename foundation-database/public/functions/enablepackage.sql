DROP FUNCTION IF EXISTS enablePackage(TEXT);
DROP FUNCTION IF EXISTS enablePackage(INTEGER);

CREATE OR REPLACE FUNCTION enablePackage(pName TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _i      INTEGER := 0;
  _tabs   TEXT[] := ARRAY['cmd',  'cmdarg', 'image',  'metasql',
                          'priv', 'report', 'script', 'uiform', 'dict'];
  _table  TEXT;

BEGIN
  FOR _i IN ARRAY_LOWER(_tabs,1)..ARRAY_UPPER(_tabs,1) LOOP
    IF NOT EXISTS(SELECT 1
                    FROM pg_inherits   i
                    JOIN pg_class  child ON inhrelid           = child.oid
                    JOIN pg_class parent ON inhparent          = parent.oid
                    JOIN pg_namespace n  ON child.relnamespace = n.oid
                   WHERE child.relname  = 'pkg' || _tabs[_i]
                     AND parent.relname = _tabs[_i]
                     AND nspname = pName) THEN
      EXECUTE format('ALTER TABLE IF EXISTS %I.%I INHERIT public.%I;',
                     pName, 'pkg' || _tabs[_i], _tabs[_i]);
    END IF;
  END LOOP;

  FOR _table IN
     SELECT DISTINCT relname
       FROM pg_trigger   t
       JOIN pg_class     c ON tgrelid      = c.oid
       JOIN pg_namespace n ON relnamespace = n.oid
      WHERE relkind = 'r'
        AND nspname = pName
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE TRIGGER ALL;', pName, _table);
  END LOOP;

  RETURN 0;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enablePackage(pId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER;

BEGIN
  SELECT enablePackage(pkghead_name) INTO _result
    FROM pkghead
   WHERE pkghead_id = pId;
  IF _result IS NULL THEN
    RAISE EXCEPTION 'enablePackage could not find an extension with id % [xtuple: enablePackage, -2, %]',
                    pId, pId;
  END IF;

  RETURN _result;
END;
$$
LANGUAGE plpgsql;
