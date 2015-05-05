-- tread very carefully here
-- there is a potype table in public with different columns

select xt.create_table('potype','xt');

select xt.add_column('potype','potype_id', 'serial', 'primary key');
select xt.add_column('potype','potype_code', 'text');
select xt.add_column('potype','potype_descr', 'text');
select xt.add_column('potype','potype_active', 'boolean');
select xt.add_column('potype','potype_emlprofile_id', 'integer');

comment on table xt.potype is 'Purchase Order type extension table';

do $do$
  declare
    _s bigint;
  begin
    if not exists (select 1
                     from pg_class c
                     join pg_namespace n on (c.relnamespace = n.oid)
                    where relname = 'potype_potype_id_seq'
                      and nspname = 'xt') then
      select coalesce(max(potype_id), 1) into _s from xt.potype;
      execute 'create sequence xt.potype_potype_id_seq start with ' || _s
           || ' owned by xt.potype.potype_id;';
    end if;
  end
$do$;
alter table xt.potype alter column potype_id
  set default nextval('xt.potype_potype_id_seq'::regclass);
grant all on sequence xt.potype_potype_id_seq to xtrole;
