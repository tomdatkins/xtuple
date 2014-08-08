INSERT INTO pkghead (pkghead_name, pkghead_descrip, pkghead_version, pkghead_developer, pkghead_indev) 
SELECT 'xwd', 'xTuple Distribution Edition package.', '0.0.0', 'xTuple', false
WHERE NOT EXISTS (select c.pkghead_id from pkghead c where c.pkghead_name = 'xwd');

UPDATE pkghead SET pkghead_version = '4.7.0Beta' WHERE pkghead_name = 'xwd';
