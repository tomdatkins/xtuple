drop function if exists xt.add_column(text, text, text, text, text);

create or replace function xt.add_column(table_name text, column_name text, type_name text, constraint_text text default null, schema_name text default 'xt', column_comment text default null) returns boolean volatile as $$
declare
  count integer;
  query text;
  comment_query text;
begin

  perform *
  from pg_class c, pg_namespace n, pg_attribute a, pg_type t
  where c.relname = table_name
   and n.nspname = schema_name
   and a.attname = column_name
   and n.oid = c.relnamespace
   and a.attnum > 0
   and a.attrelid = c.oid
   and a.atttypid = t.oid;

  get diagnostics count = row_count;

  if (count > 0) then
    query = 'alter table ' || schema_name || '.' || table_name || ' alter column ' || column_name || ' set data type ' || type_name;

    execute query;
    if (substring(lower(coalesce(constraint_text, '')) from 'not null') is not null) then
      query = 'alter table ' || schema_name || '.' || table_name || ' alter column ' || column_name || ' set not null';

      execute query;
      constraint_text = regexp_replace(constraint_text, 'not null', '', 'i');
    else
      query = 'alter table ' || schema_name || '.' || table_name || ' alter column ' || column_name || ' drop not null';

      execute query;
      constraint_text = regexp_replace(constraint_text, 'null', '', 'i');
    end if;
    if (substring(lower(coalesce(constraint_text, '')) from 'default') is not null) then
      query = 'alter table ' || schema_name || '.' || table_name || ' alter column ' || column_name || ' set default ' || regexp_replace(constraint_text, 'default', '', 'i');

      execute query;
    else
      query = 'alter table ' || schema_name || '.' || table_name || ' alter column ' || column_name || ' drop default';

      execute query;
    end if;
  else
    query = 'alter table ' || schema_name || '.' || table_name || ' add column ' || column_name || ' ' || type_name || ' ' || coalesce(constraint_text, '');

    execute query;
  end if;

  if (column_comment is not null) then
    comment_query = 'comment on column ' || schema_name || '.' || table_name || '.' || column_name || ' is ' || quote_literal(column_comment);
    execute comment_query;
  end if;

  return true;

end;
$$ language 'plpgsql';
