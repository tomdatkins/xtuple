select xt.create_view('xt.booiteminfo', $$

select boohead_id, booitem.*
from xtmfg.booitem
  join xtmfg.boohead on booitem_item_id=boohead_item_id
                     and booitem_rev_id=boohead_rev_id;

$$, false);

create or replace rule "_INSERT" as on insert to xt.booiteminfo do instead

insert into xtmfg.booitem (
  booitem_id,
  booitem_item_id,
  booitem_seqnumber,
  booitem_wrkcnt_id,
  booitem_stdopn_id,
  booitem_descrip1,
  booitem_descrip2,
  booitem_toolref,
  booitem_sutime,
  booitem_sucosttype,
  booitem_surpt,
  booitem_rntime,
  booitem_rncosttype,
  booitem_rnrpt,
  booitem_rnqtyper,
  booitem_produom,
  booitem_invproduomratio,
  booitem_issuecomp,
  booitem_rcvinv,
  booitem_instruc,
  booitem_effective,
  booitem_expires,
  booitem_configtype,
  booitem_configid,
  booitem_pullthrough,
  booitem_execday,
  booitem_overlap,
  booitem_configflag,
  booitem_wip_location_id,
  booitem_rev_id,
  booitem_seq_id,
  obj_uuid
) values (
  new.booitem_id,
  (select boohead_item_id
   from xtmfg.boohead
   where boohead_id=new.boohead_id),
  new.booitem_seqnumber,
  new.booitem_wrkcnt_id,
  new.booitem_stdopn_id,
  new.booitem_descrip1,
  new.booitem_descrip2,
  new.booitem_toolref,
  new.booitem_sutime,
  new.booitem_sucosttype,
  new.booitem_surpt,
  new.booitem_rntime ,
  new.booitem_rncosttype,
  new.booitem_rnrpt,
  new.booitem_rnqtyper,
  new.booitem_produom,
  new.booitem_invproduomratio,
  new.booitem_issuecomp,
  new.booitem_rcvinv,
  new.booitem_instruc,
  new.booitem_effective,
  new.booitem_expires,
  'N',
  -1,
  true,
  new.booitem_execday,
  new.booitem_overlap,
  false,
  new.booitem_wip_location_id,
  (select boohead_rev_id
   from xtmfg.boohead
   where boohead_id=new.boohead_id),
  new.booitem_seq_id,
  new.obj_uuid
);

create or replace rule "_UPDATE" as on update to xt.booiteminfo do instead

update xtmfg.booitem set
  booitem_seqnumber=new.booitem_seqnumber,
  booitem_wrkcnt_id=new.booitem_wrkcnt_id,
  booitem_stdopn_id=new.booitem_stdopn_id,
  booitem_descrip1=new.booitem_descrip1,
  booitem_descrip2=new.booitem_descrip2,
  booitem_toolref=new.booitem_toolref,
  booitem_sutime=new.booitem_sutime,
  booitem_sucosttype=new.booitem_sucosttype,
  booitem_surpt=new.booitem_surpt,
  booitem_rntime=new.booitem_rntime ,
  booitem_rncosttype=new.booitem_rncosttype,
  booitem_rnrpt=new.booitem_rnrpt,
  booitem_rnqtyper=new.booitem_rnqtyper,
  booitem_produom=new.booitem_produom,
  booitem_invproduomratio=new.booitem_invproduomratio,
  booitem_issuecomp=new.booitem_issuecomp,
  booitem_rcvinv=new.booitem_rcvinv,
  booitem_instruc=new.booitem_instruc,
  booitem_effective=new.booitem_effective,
  booitem_expires=new.booitem_expires,
  booitem_execday=new.booitem_execday,
  booitem_overlap=new.booitem_overlap,
  booitem_wip_location_id=new.booitem_wip_location_id
where booitem_id = old.booitem_id;

create or replace rule "_DELETE" as on delete to xt.booiteminfo do instead

delete from xtmfg.booitem where booitem_id=old.booitem_id;
