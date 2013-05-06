select xt.create_view('xt.tecustrateinfo', $$
  select tecustrate.*,
    case when tecustrate_curr_id is not null then true
         else false
    end as tecustrate_specified_rate
  from te.tecustrate
$$, false);

create or replace rule "_INSERT" as on insert to xt.tecustrateinfo do instead

insert into te.tecustrate (
  tecustrate_id,
  tecustrate_cust_id,
  tecustrate_rate,
  tecustrate_curr_id
) values (
  new.tecustrate_id,
  new.tecustrate_cust_id,
  new.tecustrate_rate,
  new.tecustrate_curr_id
);

create or replace rule "_UPDATE" as on update to xt.tecustrateinfo do instead

update te.tecustrate set
  tecustrate_cust_id=new.tecustrate_cust_id,
  tecustrate_rate=new.tecustrate_rate,
  tecustrate_curr_id=new.tecustrate_curr_id
where tecustrate_id = old.tecustrate_id;

create or replace rule "_DELETE" as on delete to xt.tecustrateinfo do instead

delete from te.tecustrate where tecustrate_id = old.tecustrate_id;
