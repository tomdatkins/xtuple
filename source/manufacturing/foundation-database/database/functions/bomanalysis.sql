CREATE OR REPLACE FUNCTION xtmfg.bomanalysis(integer, integer) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  _revid  integer;
  x_parent_lt integer;
  tlt integer;
  x record;
  t record;
BEGIN
  delete from xtmfg.lt_report;
  
  SELECT getActiveRevId('BOM',pItemid) INTO _revid;

  for x in (select 0 as report_id, item_id, itemsite_id, 0 as level, 0 as seq_num, item_number, item_descrip1, item_type, itemsite_leadtime as lt,
         item_number as parent_item
         from item, itemsite  
         where itemsite_item_id = item_id       
         and item_id =  pItemid  and itemsite_warehous_id = pWarehousid
         union all 
         select nextval('xtmfg.lt_report_id_seq') as report_id, item_id, itemsite_id, bomdata_bomwork_level, bomdata_bomwork_seqnumber as seq_num, bomdata_item_number as item_number, 
         bomdata_item_descrip1 as item_descrip1,       
         item_type,itemsite_leadtime as lt,
         (select item_number
            from bomitem LEFT OUTER JOIN item ON (bomitem_parent_item_id=item_id)
           where bomitem_id = bomdata_bomitem_id) as parent_item
         from indentedbom( pItemid  , _revid  ,0 ,0 )  left outer join  item on  (bomdata_item_id = item_id) 
         left outer join  itemsite on (itemsite_item_id = bomdata_item_id and itemsite_warehous_id = pWarehousid)  
         left join bomitem on bomitem_id = bomdata_bomitem_id where (bomdata_item_id > 0)  
         )
   loop
    insert into xtmfg.lt_report(report_id, item_id, itemsite_id, lvl, seq_number, item, item_descrip1, item_type, lt, parent) 
    values(x.report_id, x.item_id, x.itemsite_id, x.level, x.seq_num, x.item_number, x.item_descrip1, x.item_type, x.lt, x.parent_item);
   end loop;
   for t in (select *
               from xtmfg.lt_report)
   loop
    if t.lvl = 0 
    then 
     select lt
       into x_parent_lt
       from xtmfg.lt_report
      where item = parent
        and lvl = 0;
        
     update xtmfg.lt_report
        set parent_lt = 0,
            total_lt = x_parent_lt
      where item = t.item
        and lvl = 0;
    --        raise notice '....item % plt % parent % %',t.item, x_parent_lt, t.parent,  t.lvl -1;
    else

     select total_lt
       into x_parent_lt
       from xtmfg.lt_report
      where item = t.parent
        and lvl = t.lvl -1;
--        raise notice 'test....% % %',parent_lt, t.lvl -1,t.parent;
    update xtmfg.lt_report
       set parent_lt = x_parent_lt,
           total_lt = x_parent_lt + lt
      where item = t.item
        and lvl = t.lvl;   
--            raise notice 'item % lt % plt % parent % %',t.item, t.lt, parent_lt, t.parent,  t.lvl -1;
    end if;
   end loop;
  RETURN 1;

END;
$$
LANGUAGE 'plpgsql' VOLATILE;

