INSERT INTO pkghead (pkghead_name, pkghead_descrip, pkghead_version, pkghead_developer, pkghead_indev)
SELECT 'xtcore', 'xTuple Commercial Core package.', '0.0.0', 'xTuple', false
WHERE NOT EXISTS (select c.pkghead_id from pkghead c where c.pkghead_name = 'xtcore');

UPDATE pkghead SET pkghead_version = '4.9.0RC' WHERE pkghead_name = 'xtcore';
