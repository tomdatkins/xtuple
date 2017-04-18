-- Migrate POTYPE table from original xt extension into public
select xt.add_column('pohead', 'pohead_potype_id',  'INTEGER', NULL, 'public');

select xt.add_constraint('pohead', 'pohead_potype_id_fkey', 'FOREIGN KEY (pohead_potype_id)
                         REFERENCES public.potype (potype_id) MATCH SIMPLE
                         ON UPDATE NO ACTION ON DELETE NO ACTION', 'public');
                         
-- Migrate data from XT schema to PUBLIC
DO $$
declare
  _tbl BOOLEAN;
begin
  IF (SELECT EXISTS (SELECT 1
                     FROM   information_schema.tables 
                     WHERE  table_schema = 'xt'
                       AND  table_name = 'poheadext')) THEN

    UPDATE pohead a SET pohead_potype_id = poheadext_potype_id
     FROM xt.poheadext b
     WHERE a.pohead_id=b.poheadext_id;
      
    DROP TABLE xt.poheadext;
    
  END IF;
end
$$ language plpgsql;

