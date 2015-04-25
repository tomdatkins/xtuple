create or replace function createDoctype(pEnum integer, pType   text, pDocAss text,
                                         pCharAss text, pFull   text, pTable  text,
                                         pKey     text, pNumber text, pName   text,
                                         pDesc    text,
                                         pWidget  text = '', pJoin   text = '',
                                         pParam   text = '', pUi     text = '',
                                         pPriv    text = '')
  returns integer as $$
/* Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license.

   Create a record in the "source" table corresponding to this document type
   or update an existing record if it appears incomplete. The pEnum MUST match
   the corresponding Documents::DocumentSources (qt-client/widgets/documents.h)
   if the record type is there. Otherwise pass NULL.
   For other params, NULL means use the existing value on update or default on insert.
   See the source table comments for a description of the other arguments.
 */
declare
  _justAddedCols boolean;
  _id            integer := -1;
begin
  select (source_docass || source_charass = '') into _justAddedCols
      from source where source_name = pType;
  if NOT FOUND then
    insert into source (source_enum, source_module,
        source_name,      source_descrip,      source_table,
        source_docass,    source_charass,
        source_key_field, source_number_field, source_name_field,
        source_desc_field, source_joins,       source_widget,
        source_key_param, source_uiform_name,  source_create_priv
      ) values (NULL, 'System',
         pType,   pFull,   pTable,
         pDocAss, pCharAss,
         pKey,    pNumber, pName,
         pDesc,   pJoin,   pWidget,
         pParam,  pUi,     pPriv)
      returning source_id into _id;
  elsif _justAddedCols then
    update source
       set source_enum         = pEnum,
           source_docass       = pDocAss,
           source_charass      = pCharass,
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
  else
    RAISE NOTICE 'not creating document type %/%/%', pType, pDocAss, pCharAss;
  end if;

  return _id;
end;
$$ language plpgsql;
