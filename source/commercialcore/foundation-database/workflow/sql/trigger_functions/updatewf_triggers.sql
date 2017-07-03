DO $$
DECLARE
  _table TEXT;
  _tables TEXT[];
  _dropSql TEXT := 'DROP TRIGGER IF EXISTS %1$s_after_update ON xt.%1$s;';
  _createSql TEXT := 'CREATE TRIGGER %1$s_after_update
                            AFTER UPDATE ON xt.%1$s
                            FOR EACH ROW
                      EXECUTE PROCEDURE xt.workflow_update_successors();';
BEGIN
  -- Only add table trigger if explicit Workflow Deferral handling is *not* handled
  -- by document changes
  _tables = '{coheadwf, powf, prjwf}';
  FOREACH _table IN ARRAY _tables LOOP
    EXECUTE format(_dropSql, _table);
    EXECUTE format(_createSql, _table);
  END LOOP;
END;
$$ language plpgsql;
