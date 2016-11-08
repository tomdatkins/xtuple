drop function if exists xt.add_column(text, text, text, text, text);

create or replace function xt.add_column(table_name text, column_name text, type_name text, constraint_text text default null, schema_name text default 'xt', column_comment text default null) returns boolean volatile as $$
declare
  count integer;
  query text;
  comment_query text;
  _current record;
begin

  select format_type(a.atttypid, a.atttypmod) as type, a.attnotnull as notnull, d.adsrc as defaultval into _current
  from pg_attribute a
  join pg_class c on a.attrelid=c.oid
  join pg_namespace n on c.relnamespace=n.oid
  left outer join pg_attrdef d on a.attrelid=d.adrelid and a.attnum=d.adnum
  where c.relname = table_name
  and n.nspname = schema_name
  and a.attname = column_name
  and a.attnum > 0;

  get diagnostics count = row_count;

  if (count > 0) then
    if(lower(_current.type)!=lower(type_name) and type_name !~* 'serial') then
      query = format('alter table %I.%I alter column %I set data type %s', schema_name, table_name, column_name, type_name);

      execute query;
    end if;

    if (substring(lower(coalesce(constraint_text, '')) from 'not null') is not null) then
      if(not _current.notnull) then
        query = format('alter table %I.%I alter column %I set not null', schema_name, table_name, column_name);

        execute query;
      end if;
      constraint_text = trim(regexp_replace(constraint_text, 'not null', '', 'i'));
    else
      if (_current.notnull and type_name !~* 'serial' and lower(constraint_text)!='primary key') then
        query = format('alter table %I.%I alter column %I drop not null', schema_name, table_name, column_name);

        execute query;
      end if;
      constraint_text = trim(regexp_replace(constraint_text, 'null', '', 'i'));
    end if;

    if (substring(lower(coalesce(constraint_text, '')) from 'default') is not null) then
      constraint_text = trim(regexp_replace(constraint_text, 'default', '', 'i'));
      if(_current.defaultval!=constraint_text) then
        query = format('alter table %I.%I alter column %I set default %s', schema_name, table_name, column_name, constraint_text);

        execute query;
      end if;
    else
      if (_current.defaultval is not null and _current.defaultval!=constraint_text and lower(constraint_text)!='primary key') then
        query = format('alter table %I.%I alter column %I drop default', schema_name, table_name, column_name);

        execute query;
      end if;
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
