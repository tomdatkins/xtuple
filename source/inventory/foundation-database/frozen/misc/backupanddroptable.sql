CREATE OR REPLACE FUNCTION backupanddroptable(pTable  TEXT,
                                              pSchema TEXT = 'public')
RETURNS INTEGER AS $$
DECLARE
  _tablename    TEXT;
BEGIN
  IF EXISTS(SELECT 1
              FROM pg_class
              JOIN pg_namespace ON (relnamespace=pg_namespace.oid)
             WHERE relname=quote_ident(pTable)
               AND nspname=quote_ident(pSchema)) THEN
    _tablename := quote_ident(pSchema) || '.' || quote_ident(pTable);

    EXECUTE 'CREATE TABLE ' || _tablename || '_bak'
         || ' AS SELECT * FROM ' || _tablename;

    RETURN dropIfExists('TABLE', pTable, pSchema);
  END IF;

  RETURN 0;
END;
$$
LANGUAGE 'plpgsql';

