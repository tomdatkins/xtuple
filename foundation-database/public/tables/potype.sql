-- Migrate POTYPE table from original xt extension into public
select xt.create_table('potype', 'public');

select xt.add_column('potype','potype_id', 'serial', 'primary key', 'public');
select xt.add_column('potype','potype_code', 'text', null, 'public') ;
select xt.add_column('potype','potype_descr', 'text', null, 'public');
select xt.add_column('potype','potype_active', 'boolean', 'NOT NULL DEFAULT TRUE', 'public');
select xt.add_column('potype','potype_default','boolean', 'NOT NULL DEFAULT FALSE', 'public');
select xt.add_column('potype','potype_emlprofile_id', 'integer', null, 'public');

select xt.add_constraint('potype', 'potype_potype_code_key', 'UNIQUE (potype_code)', 'public');

comment on table public.potype is 'Purchase Order Type table';

-- Migrate data if exists
DO $$
BEGIN
  IF EXISTS(SELECT 1
              FROM information_schema.tables 
             WHERE table_schema = 'xt'
               AND table_name = 'potype') THEN

    INSERT INTO public.potype (potype_id, potype_code, potype_descr, potype_active, potype_emlprofile_id)
      SELECT potype_id, potype_code, potype_descr, potype_active, potype_emlprofile_id
      FROM xt.potype;
      
    ALTER TABLE IF EXISTS xt.vendinfoext DROP CONSTRAINT IF EXISTS vendinfoext_potype_id_fkey;
    ALTER TABLE IF EXISTS xt.poheadext   DROP CONSTRAINT IF EXISTS poheadext_potype_id_fkey;

    DROP TABLE xt.potype;
    
  END IF;
END
$$ language plpgsql;
