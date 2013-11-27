select xt.create_view('xt.toheadinfo', $$

select tohead.*, 
  xt.to_schedule_date(tohead) as schedule_date,
  xt.to_freight_weight(tohead) as freight_weight,
  xt.to_subtotal(tohead) as freight_subtotal,
  xt.to_tax_total(tohead) as tax_total,
  xt.to_total(tohead) as total
from tohead

$$, false);

create or replace rule "_INSERT" as on insert to xt.toheadinfo do instead

insert into tohead (
  tohead_id,
  tohead_number,
  tohead_status,
  tohead_orderdate,
  tohead_src_warehous_id,
  tohead_srcname,
  tohead_srcaddress1,
  tohead_srcaddress2,
  tohead_srcaddress3,
  tohead_srccity,
  tohead_srcstate,
  tohead_srcpostalcode,
  tohead_srccountry,
  tohead_srccntct_id,
  tohead_srccntct_name,
  tohead_srcphone,
  tohead_trns_warehous_id,
  tohead_trnsname,
  tohead_dest_warehous_id,
  tohead_destname,
  tohead_destaddress1,
  tohead_destaddress2,
  tohead_destaddress3,
  tohead_destcity,
  tohead_deststate,
  tohead_destpostalcode,
  tohead_destcountry,
  tohead_destcntct_id,
  tohead_destcntct_name,
  tohead_destphone,
  tohead_agent_username,
  tohead_shipvia,
  tohead_shipchrg_id,
  tohead_freight,
  tohead_freight_curr_id,
  tohead_shipcomplete,
  tohead_ordercomments,
  tohead_shipcomments,
  tohead_packdate,
  tohead_prj_id,
  tohead_lastupdated,
  tohead_created,
  tohead_creator,
  tohead_taxzone_id
) values (
  new.tohead_id,
  new.tohead_number,
  new.tohead_status,
  new.tohead_orderdate,
  new.tohead_src_warehous_id,
  new.tohead_srcname,
  new.tohead_srcaddress1,
  new.tohead_srcaddress2,
  new.tohead_srcaddress3,
  new.tohead_srccity,
  new.tohead_srcstate,
  new.tohead_srcpostalcode,
  new.tohead_srccountry,
  new.tohead_srccntct_id,
  new.tohead_srccntct_name,
  new.tohead_srcphone,
  new.tohead_trns_warehous_id,
  new.tohead_trnsname,
  new.tohead_dest_warehous_id,
  new.tohead_destname,
  new.tohead_destaddress1,
  new.tohead_destaddress2,
  new.tohead_destaddress3,
  new.tohead_destcity,
  new.tohead_deststate,
  new.tohead_destpostalcode,
  new.tohead_destcountry,
  new.tohead_destcntct_id,
  new.tohead_destcntct_name,
  new.tohead_destphone,
  new.tohead_agent_username,
  new.tohead_shipvia,
  new.tohead_shipchrg_id,
  0,
  new.tohead_freight_curr_id,
  new.tohead_shipcomplete,
  new.tohead_ordercomments,
  new.tohead_shipcomments,
  new.tohead_packdate,
  new.tohead_prj_id,
  now(),
  now(),
  geteffectivextuser(),
  new.tohead_taxzone_id
);

create or replace rule "_UPDATE" as on update to xt.toheadinfo do instead

update tohead set
  tohead_status=new.tohead_status,
  tohead_orderdate=new.tohead_orderdate,
  tohead_src_warehous_id=new.tohead_src_warehous_id,
  tohead_srcname=new.tohead_srcname,
  tohead_srcaddress1=new.tohead_srcaddress1,
  tohead_srcaddress2=new.tohead_srcaddress2,
  tohead_srcaddress3=new.tohead_srcaddress3,
  tohead_srccity=new.tohead_srccity,
  tohead_srcstate=new.tohead_srcstate,
  tohead_srcpostalcode=new.tohead_srcpostalcode,
  tohead_srccountry=new.tohead_srccountry,
  tohead_srccntct_id=new.tohead_srccntct_id,
  tohead_srccntct_name=new.tohead_srccntct_name,
  tohead_srcphone=new.tohead_srcphone,
  tohead_trns_warehous_id=new.tohead_trns_warehous_id,
  tohead_trnsname=new.tohead_trnsname,
  tohead_dest_warehous_id=new.tohead_dest_warehous_id,
  tohead_destname=new.tohead_destname,
  tohead_destaddress1=new.tohead_destaddress1,
  tohead_destaddress2=new.tohead_destaddress2,
  tohead_destaddress3=new.tohead_destaddress3,
  tohead_destcity=new.tohead_destcity,
  tohead_deststate=new.tohead_deststate,
  tohead_destpostalcode=new.tohead_destpostalcode,
  tohead_destcountry=new.tohead_destcountry,
  tohead_destcntct_id=new.tohead_destcntct_id,
  tohead_destcntct_name=new.tohead_destcntct_name,
  tohead_destphone=new.tohead_destphone,
  tohead_agent_username=new.tohead_agent_username,
  tohead_shipvia=new.tohead_shipvia,
  tohead_shipchrg_id=new.tohead_shipchrg_id,
  tohead_freight_curr_id=new.tohead_freight_curr_id,
  tohead_shipcomplete=new.tohead_shipcomplete,
  tohead_ordercomments=new.tohead_ordercomments,
  tohead_shipcomments=new.tohead_shipcomments,
  tohead_packdate=new.tohead_packdate,
  tohead_prj_id=new.tohead_prj_id,
  tohead_taxzone_id=new.tohead_taxzone_id
where tohead_id = old.tohead_id;

create or replace rule "_DELETE" as on delete to xt.toheadinfo do instead

select deleteto(old.tohead_id);
