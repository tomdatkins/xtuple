-- Add uuid columns to core tables

DO $$ 
DECLARE
  _tables TEXT[] := ARRAY['cohead', 'prj', 'prjtask', 'wo', 'pohead', 'shiphead', 'quhead'];
  _table  TEXT;
  _sql    TEXT;
BEGIN
  FOREACH _table IN ARRAY _tables
  LOOP
    EXECUTE format('select xt.add_column(''%1$s'',''obj_uuid'', ''uuid'', ''default xt.uuid_generate_v4()'', ''public'');', _table);
    EXECUTE format('select xt.add_inheritance(''%1$s'', ''xt.obj'');', _table);
    EXECUTE format('select xt.add_constraint(''%1$s'', ''%1$s_obj_uui_id'',''unique(obj_uuid)'', ''public'');', _table);
  END LOOP;
END; 
$$ language plpgsql;
