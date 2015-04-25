create or replace function createDoctype(pEnum integer, pType text, pFull   text,
                                         pTable text,   pKey  text, pNumber text,
                                         pName  text,   pDesc text,
                                         pWidget text = '', pJoin  text = '',
                                         pParam  text = '', pUi    text = '',
                                         pPriv   text = '')
  returns integer as $$
/* Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license.

   Create a record in the "source" table corresponding to this document type
   or update an existing record if it appears incomplete. The pEnum MUST match
   the corresponding Documents::DocumentSources (qt-client/widgets/documents.h)
   if the record type is there. Otherwise pass NULL.
   See the source table comments for a description of the other arguments.
 */
declare
  _id integer;
begin
  -- http://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE
  loop
    update source
       set source_enum         = COALESCE(pEnum, 0),
           source_table        = pTable,
           source_key_field    = pKey,
           source_number_field = pNumber,
           source_name_field   = pName,
           source_desc_field   = pDesc,
           source_joins        = pJoin,
           source_widget       = pWidget,
           source_key_param    = pParam,
           source_uiform_name  = pUi,
           source_create_priv  = pPriv
     where source_name = pType
     returning source_id into _id;
    if FOUND then
      exit;
    end if;
    begin
      insert into source (source_enum, source_module,
          source_name,      source_descrip,      source_table,
          source_key_field, source_number_field, source_name_field,
          source_desc_field, source_joins,       source_widget,
          source_key_param, source_uiform_name,  source_create_priv
        ) values (COALESCE(pEnum, 0), 'System',
           pType,   pFull,   pTable,
           pKey,    pNumber, pName,
           pDesc,   pJoin,   pWidget,
           pParam,  pUi,     pPriv)
        returning source_id into _id;
      exit;
    exception when unique_violation then
      -- do nothing, loop to try the update again
    end;
  end loop;

  return _id;
end;
$$ language plpgsql;
