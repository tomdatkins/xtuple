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

select xt.add_column('potype','potype_id', 'serial', 'primary key', 'public');
select xt.add_column('potype','potype_code', 'text', null, 'public') ;
select xt.add_column('potype','potype_descr', 'text', null, 'public');
select xt.add_column('potype','potype_active', 'boolean', 'NOT NULL DEFAULT TRUE', 'public');
select xt.add_column('potype','potype_default','boolean', 'NOT NULL DEFAULT FALSE', 'public');
select xt.add_column('potype','potype_emlprofile_id', 'integer', null, 'public');

select xt.add_constraint('potype', 'potype_potype_code_key', 'UNIQUE (potype_code)', 'public');

comment on table public.potype is 'Purchase Order Type table';
