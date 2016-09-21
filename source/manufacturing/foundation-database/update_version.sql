UPDATE pkghead SET pkghead_version = '4.10.0' WHERE pkghead_name = 'xtmfg';
DELETE FROM xtmfg.pkgscript where script_name = 'databaseInformation';
