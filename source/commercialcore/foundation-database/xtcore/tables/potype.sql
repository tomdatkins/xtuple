-- Migrate POTYPE table from original xt extension into public
select xt.create_table('potype', 'public');

select xt.add_column('potype','potype_id', 'serial', 'primary key', 'public');
select xt.add_column('potype','potype_code', 'text', null, 'public') ;
select xt.add_column('potype','potype_descr', 'text', null, 'public');
select xt.add_column('potype','potype_active', 'boolean', null, 'public');
select xt.add_column('potype','potype_emlprofile_id', 'integer', null, 'public');

comment on table public.potype is 'Purchase Order Type table';

-- Migrate data if exists
DO $$
declare
  _tbl BOOLEAN;
begin
  IF (SELECT EXISTS (SELECT 1
                     FROM   information_schema.tables 
                     WHERE  table_schema = 'xt'
                       AND  table_name = 'potype')) THEN

    INSERT INTO public.potype (potype_id, potype_coed, potype_descr, potype_active, potype_emlprofile_id)
      SELECT potype_id, potype_coed, potype_descr, potype_active, potype_emlprofile_id
      FROM xt.potype;
      
    DROP TABLE xt.potype;
    
  END IF;
end
$$ language plpgsql;
    
      


