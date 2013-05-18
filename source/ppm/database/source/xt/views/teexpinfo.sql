select xt.create_view('xt.teexpinfo', $$
  select teexp.*,
    case when teexp_expcat_id is not null then 'E'
         when teexp_accnt_id is not null then 'A'
    end as teexp_method
  from te.teexp
$$, false);

create or replace rule "_INSERT" as on insert to xt.teexpinfo do instead

insert into te.teexp (
  teexp_id,
  teexp_expcat_id,
  teexp_accnt_id
) values (
  new.teexp_id,
  new.teexp_expcat_id,
  new.teexp_accnt_id
);

create or replace rule "_UPDATE" as on update to xt.teexpinfo do instead

update te.teexp set
  teexp_expcat_id = new.teexp_expcat_id,
  teexp_accnt_id = new.teexp_accnt_id
where teexp_id = old.teexp_id;

create or replace rule "_DELETE" as on delete to xt.teexpinfo do instead

delete from te.teexp where teexp_id = old.teexp_id;
