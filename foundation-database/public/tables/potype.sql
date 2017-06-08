-- Migrate POTYPE table from original xt extension into public
DO $$
DECLARE
  _hasOldXtTable        BOOLEAN;
BEGIN
  _hasOldXtTable := EXISTS(SELECT 1
                             FROM information_schema.tables
                            WHERE table_schema = 'xt'
                              AND table_name = 'potype');
  IF EXISTS(SELECT 1
              FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name   = 'potype'
               AND column_name IN ('potype_name', 'potype_descrip')) THEN
    ALTER TABLE public.potype RENAME COLUMN potype_name    TO potype_code;
    ALTER TABLE public.potype RENAME COLUMN potype_descrip TO potype_descr;
    IF _hasOldXtTable THEN
      INSERT INTO public.potype (potype_id, potype_code, potype_descr)
                          SELECT potype_id, potype_code, potype_descr
                            FROM xt.potype;
    END IF;
  ELSIF _hasOldXtTable THEN
    ALTER TABLE xt.potype SET SCHEMA public;
  END IF;
END
$$ LANGUAGE plpgsql;

select xt.create_table('potype', 'public');

ALTER TABLE public.potype DISABLE TRIGGER ALL;

SELECT
  xt.add_column('potype','potype_id',             'SERIAL', 'PRIMARY KEY',            'public'),
  xt.add_column('potype','potype_code',             'TEXT', NULL,                     'public'),
  xt.add_column('potype','potype_descr',            'TEXT', NULL,                     'public'),
  xt.add_column('potype','potype_active',        'BOOLEAN', 'NOT NULL DEFAULT TRUE',  'public'),
  xt.add_column('potype','potype_default',       'BOOLEAN', 'NOT NULL DEFAULT FALSE', 'public'),
  xt.add_column('potype','potype_emlprofile_id', 'INTEGER', NULL,                     'public');

SELECT
  xt.add_constraint('potype', 'potype_potype_code_key', 'UNIQUE (potype_code)', 'public');

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

ALTER TABLE public.potype ENABLE TRIGGER ALL;

COMMENT ON TABLE public.potype IS 'Purchase Order Type table';
