DO $$
DECLARE
  count INTEGER;
  tbl_exists BOOLEAN;
BEGIN

-- Check if xtmfg schema exists
  PERFORM * FROM pg_tables 
  WHERE schemaname = 'xtmfg';

  get diagnostics count = row_count;
  
  IF (count > 0) THEN 
    -- Remove TA UI Forms from xtmfg schema
    DELETE FROM xtmfg.pkguiform WHERE uiform_name IN ('configureTimeAddend', 'dspTaSummary', 'overhead', 
		'overheadList', 'overheadSelect', 'taDetail', 'taTimeEdit');
    -- Remove TA Scripts from xtmfg schema
    DELETE FROM xtmfg.pkgscript WHERE script_name IN ('dspTaSummary', 'overhead', 'overheadList', 
                'overheadSelect', 'taDetail', 'taTimeEdit');
    -- Remove TA MetaSQL from xtmfg schema
    DELETE FROM xtmfg.pkgmetasql WHERE metasql_group = 'timeattend';
    -- Remove TA Reports from xtmfg schema
    DELETE FROM xtmfg.pkgreport WHERE report_name IN ('TimeAttendSummary', 'TimeAttendDetail');
    
    -- If Time Attend Tables are not being used then drop them.
    SELECT count(*) > 0 INTO tbl_exists 
      FROM pg_tables WHERE schemaname = 'xtmfg' AND tablename = 'ovrhead';
    IF (tbl_exists) THEN
      IF (SELECT count(*) = 0 FROM xtmfg.ovrhead) THEN
        DROP TABLE IF EXISTS xtmfg.ovrhead;
      END IF;  
    END IF;
    SELECT count(*) > 0 INTO tbl_exists 
      FROM pg_tables WHERE schemaname = 'xtmfg' AND tablename = 'tashift';
    IF (tbl_exists) THEN  
      IF (SELECT count(*) = 0 FROM xtmfg.tashift) THEN    
        DROP TABLE IF EXISTS xtmfg.tashift;
      END IF;
    END IF;
    SELECT count(*) > 0 INTO tbl_exists 
      FROM pg_tables WHERE schemaname = 'xtmfg' AND tablename = 'tatc';
    IF (tbl_exists) THEN
      IF (SELECT count(*) = 0 FROM xtmfg.tatc) THEN          
        DROP TABLE IF EXISTS xtmfg.tatc;
      END IF;  
    END IF;  
    
  END IF;
END $$;
