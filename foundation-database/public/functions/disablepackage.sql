DROP FUNCTION IF EXISTS disablePackage(TEXT);
DROP FUNCTION IF EXISTS disablePackage(INTEGER);

CREATE OR REPLACE FUNCTION disablePackage(pName TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _i       INTEGER := 0;
  _tabs    TEXT[] := ARRAY['cmd',  'cmdarg', 'image',  'metasql',
                           'priv', 'report', 'script', 'uiform', 'dict'];
  _table   TEXT;

BEGIN
  FOR _i IN ARRAY_LOWER(_tabs,1)..ARRAY_UPPER(_tabs,1) LOOP
    IF EXISTS(SELECT 1
                FROM pg_inherits
                JOIN pg_class  child ON inhrelid           = child.oid
                JOIN pg_class parent ON inhparent          = parent.oid
                JOIN pg_namespace n  ON child.relnamespace = n.oid
               WHERE child.relname  = 'pkg' || _tabs[_i]
                 AND parent.relname = _tabs[_i]
                 AND nspname = pName) THEN
      EXECUTE format('ALTER TABLE IF EXISTS %I.%I NO INHERIT public.%I;',
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
    EXECUTE format('ALTER TABLE %I.%I DISABLE TRIGGER ALL;', pName, _table);
  END LOOP;

  RETURN 0;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION disablePackage(pId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER;

BEGIN
  SELECT disablePackage(pkghead_name) INTO _result
    FROM pkghead
   WHERE pkghead_id = pId;
  IF _result IS NULL THEN
    RAISE EXCEPTION 'disablePackage() could not find a package with id % [xtuple: disablePackage, -2, %]',
                    pId, pId;
  END IF;

  RETURN _result;
END;
$$
LANGUAGE plpgsql;
