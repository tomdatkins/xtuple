create or replace function createDoctype(pEnum integer, pType text, pFull   text,
                                         pTable text,   pKey  text, pNumber text,
                                         pName  text,   pDesc text,
                                         pJoin  text = '', pParam text = '',
                                         pUi    text = '', pPriv  text = '')
  returns integer as $$
/* Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license.

   Create a new doctype record. The pEnum MUST match the integer value of
   Documents::DocumentSources (qt-client/widgets/documents.h) if the
   record type is there. Otherwise pass NULL.
   See the doctype table comments for a description of the other arguments.
 */
  insert into doctype (doctype_id,
    doctype_type,  doctype_type_full,
    doctype_table, doctype_key_field,
    doctype_number_field, doctype_name_field, doctype_desc_field, doctype_joins,
    doctype_key_param,    doctype_uiform_name,doctype_create_priv)
  select COALESCE(pEnum, nextval('doctype_doctype_id_seq')),
         pType,   pFull,
         pTable,  pKey,
         pNumber, pName, pDesc,  pJoin,
         pParam,  pUi, pPriv
   where not exists (select 1 from doctype where doctype_type = pType)
  returning doctype_id;
$$ language sql;
