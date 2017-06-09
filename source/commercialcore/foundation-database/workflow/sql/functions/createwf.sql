DROP FUNCTION IF EXISTS xt.createwf(text, anyelement);

CREATE OR REPLACE FUNCTION xt.createwf(tg_table_name text,
                                       tg_table_row  anyelement)
  RETURNS record AS $$
/* Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */
DECLARE
  _wftypecode     TEXT;
  _item_uuid      UUID;
  _parent_id      INTEGER;
  _order_id       INTEGER;
  _poStatus       TEXT;
  _wftype         RECORD; 
  _sql            TEXT;
BEGIN

  IF fetchmetricbool('TriggerWorkflow') THEN

    SELECT * INTO _wftype
    FROM xt.wftype
    WHERE wftype_table = tg_table_name;

    _wftypecode := _wftype.wftype_code;
    EXECUTE 'SELECT $1.'|| _wftype.wftype_uuid_col || ';' INTO _item_uuid USING tg_table_row;
    EXECUTE 'SELECT $1.'|| _wftype.wftype_id_col || ';' INTO _order_id USING tg_table_row;

    IF (_wftype.wftype_parentid_sql IS NOT NULL) THEN
      EXECUTE _wftype.wftype_parentid_sql || '.' || _wftype.wftype_parentid_col || ';' INTO _parent_id USING tg_table_row;
    ELSE
      EXECUTE 'SELECT $1.'|| _wftype.wftype_parentid_col || ';' INTO _parent_id USING tg_table_row;  
    END IF;

    IF _parent_id IS NULL THEN
      RAISE DEBUG 'Cannot find parentId needed to generate workflow [%, %]',
                        tg_table_name, _wftype.wftype_parentid_col;
    END IF;

-- TODO make additional/specific logic configurable as well
    IF tg_table_name = 'cohead' THEN
      -- Copy Sale Type chars to Sales Order.
      PERFORM xt.copychars('ST', _parent_id, 'S', _order_id);

      -- Currently `xt.saletypeext` is webenabled database only.
      -- TODO: Add column to `public.saletype` table.
      IF EXISTS(SELECT 1
                  FROM pg_class c
                  JOIN pg_namespace n ON n.oid = c.relnamespace
                 WHERE n.nspname = 'xt'
                   AND c.relname = 'saletypeext'
                   AND c.relkind = 'r' -- table
               ) THEN
        UPDATE cohead
           SET cohead_holdtype = saletypeext_default_hold_type
          FROM xt.saletypeext
         WHERE cohead_id = _order_id
           AND saletypeext_id = _parent_id
           AND saletypeext_default_hold_type IS NOT NULL;
      END IF;
    END IF;  

    IF tg_table_name IN ('pohead') THEN
      IF (SELECT pohead_status FROM pohead WHERE pohead_id = _order_id) <> 'O' THEN
        RETURN tg_table_row;
      END IF;
    ELSIF tg_table_name = 'wo' THEN
      IF (SELECT wo_status FROM wo WHERE wo_id = _order_id) <> 'R' THEN
        RETURN tg_table_row;
      END IF;
    end if;

    IF _wftype.wftype_src_tblname IS NOT NULL THEN
      PERFORM xt.workflow_inheritsource(_wftype.wftype_src_tblname, 
                                        _item_uuid, _parent_id, _order_id);
    ELSE
      RAISE WARNING 'Cannot find source table needed to generate workflow for type % (%)',
                    _wftypecode, tg_table_name;
    END IF;

  END IF;
  RETURN tg_table_row;
END;

$$ LANGUAGE plpgsql;
ALTER FUNCTION xt.createwf(text, anyelement) OWNER TO admin;
