select xt.create_view('xt.teprjtaskinfo', $$
  select teprjtask.*,
    case when teprjtask_curr_id is not null then true
         else false
    end as teprjtask_specified_rate
  from te.teprjtask
$$, false);

create or replace rule "_INSERT" as on insert to xt.teprjtaskinfo do instead

insert into te.teprjtask (
  teprjtask_id,
  teprjtask_cust_id,
  teprjtask_item_id,
  teprjtask_prjtask_id,
  teprjtask_rate,
  teprjtask_curr_id
) values (
  new.teprjtask_id,
  new.teprjtask_cust_id,
  new.teprjtask_item_id,
  new.teprjtask_prjtask_id,
  new.teprjtask_rate,
  new.teprjtask_curr_id
);

create or replace rule "_UPDATE" as on update to xt.teprjtaskinfo do instead

update te.teprjtask set
  teprjtask_cust_id=new.teprjtask_cust_id,
  teprjtask_item_id=new.teprjtask_item_id,
  teprjtask_prjtask_id=new.teprjtask_prjtask_id,
  teprjtask_rate=new.teprjtask_rate,
  teprjtask_curr_id=new.teprjtask_curr_id
where teprjtask_id = old.teprjtask_id;

create or replace rule "_DELETE" as on delete to xt.teprjtaskinfo do instead

delete from te.teprjtask where teprjtask_id = old.teprjtask_id;
