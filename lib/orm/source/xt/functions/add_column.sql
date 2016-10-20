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
    query = format('alter table %I.%I alter column %I set data type %s', schema_name, table_name, column_name, type_name);

    execute query;
    if (substring(lower(coalesce(constraint_text, '')) from 'not null') is not null) then
      query = format('alter table %I.%I alter column %I set not null', schema_name, table_name, column_name);

      execute query;
      constraint_text = regexp_replace(constraint_text, 'not null', '', 'i');
    else
      query = format('alter table %I.%I alter column %I drop not null', schema_name, table_name, column_name);

      execute query;
      constraint_text = regexp_replace(constraint_text, 'null', '', 'i');
    end if;
    if (substring(lower(coalesce(constraint_text, '')) from 'default') is not null) then
      query = format('alter table %I.%I alter column %I set default %s', schema_name, table_name, column_name, regexp_replace(constraint_text, 'default', '', 'i'));

      execute query;
    else
      query = format('alter table %I.%I alter column %I drop default', schema_name, table_name, column_name);

      execute query;
    end if;
  else
    query = format('alter table %I.%I add column %I %s %s', schema_name, table_name, column_name, type_name, coalesce(constraint_text, ''));

    execute query;
  end if;

  if (column_comment is not null) then
    comment_query = format('comment on column %I.%I.%I is %s', schema_name, table_name, column_name, quote_literal(column_comment));
    execute comment_query;
  end if;

  return true;

end;
$$ language 'plpgsql';
