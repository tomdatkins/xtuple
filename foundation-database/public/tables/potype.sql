-- Migrate POTYPE table from original xt extension into public
DO $$
DECLARE
  _hasOldXtTable        BOOLEAN;
  _hasName              BOOLEAN := false;
  _hasCode              BOOLEAN := false;
  _hasDescr             BOOLEAN := false;
  _hasDescrip           BOOLEAN := false;
  _column               TEXT;
BEGIN
  _hasOldXtTable := EXISTS(SELECT 1
                             FROM information_schema.tables
                            WHERE table_schema = 'xt'
                              AND table_name   = 'potype');
  FOR _column IN SELECT column_name
              FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name   = 'potype' LOOP
    CASE _column WHEN 'potype_code'    THEN _hasCode    := true;
                 WHEN 'potype_descr'   THEN _hasDescr   := true;
                 WHEN 'potype_descrip' THEN _hasDescrip := true;
                 WHEN 'potype_name'    THEN _hasName    := true;
                 ELSE RAISE DEBUG 'Unhandled public.potype.% during upgrade',
                      _column;
    END CASE;
  END LOOP;

  IF _hasName AND _hasCode THEN
    UPDATE public.potype SET potype_code = potype_name
      WHERE COALESCE(potype_code, '') = '';
    ALTER TABLE public.potype DROP COLUMN potype_name;
  ELSIF _hasName AND NOT _hasCode THEN
    ALTER TABLE public.potype RENAME COLUMN potype_name    TO potype_code;
  END IF;

  IF _hasDescrip AND _hasDescr THEN
    UPDATE public.potype SET potype_descr = potype_descrip
      WHERE COALESCE(potype_descr, '') = '';
    ALTER TABLE public.potype DROP COLUMN potype_descrip;
  ELSIF _hasDescrip and NOT _hasDescr THEN
    ALTER TABLE public.potype RENAME COLUMN potype_descrip TO potype_descr;
  END IF;

  IF _hasOldXtTable AND _column IS NULL THEN     -- null _column => no public.potype
    ALTER TABLE xt.potype SET SCHEMA public;
  ELSIF _hasOldXtTable THEN
    INSERT INTO public.potype (potype_id, potype_code, potype_descr)
                        SELECT potype_id, potype_code, potype_descr
                          FROM xt.potype;
    DROP TABLE xt.potype;
  END IF;
END
$$ LANGUAGE plpgsql;

select xt.create_table('potype', 'public');

select xt.add_column('potype','potype_id',       'serial', 'primary key', 'public');
select xt.add_column('potype','potype_code',       'text', null, 'public') ;
select xt.add_column('potype','potype_descr',      'text', null, 'public');
select xt.add_column('potype','potype_active',  'boolean', 'NOT NULL DEFAULT TRUE', 'public');
select xt.add_column('potype','potype_default', 'boolean', 'NOT NULL DEFAULT FALSE', 'public');
select xt.add_column('potype','potype_emlprofile_id', 'integer', null, 'public');

select xt.add_constraint('potype', 'potype_potype_code_key', 'UNIQUE (potype_code)', 'public');

comment on table public.potype is 'Purchase Order Type table';
