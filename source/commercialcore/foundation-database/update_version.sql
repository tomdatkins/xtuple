select createpkgschema('xtcore', 'This file is part of the xtcore Package for xTuple ERP, and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It is licensed to you under the xTuple End-User License Agreement ("the EULA"), the full text of which is available at www.xtuple.com/EULA.  While the EULA gives you access to source code and encourages your involvement in the development process, this Package is not free software.  By using this software, you agree to be bound by the terms of the EULA.');

DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM pkghead WHERE pkghead_name = 'xtcore') THEN
    INSERT INTO pkghead (pkghead_name, pkghead_version, pkghead_developer, pkghead_notes)
                VALUES  ('xtcore', '4.10.0', 'xTuple', 'This file is part of the xtcore Package for xTuple ERP, and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It is licensed to you under the xTuple End-User License Agreement ("the EULA"), the full text of which is available at www.xtuple.com/EULA.  While the EULA gives you access to source code and encourages your involvement in the development process, this Package is not free software.  By using this software, you agree to be bound by the terms of the EULA.');
  END IF;
END;
$$ LANGUAGE plpgsql;

UPDATE pkghead SET pkghead_descrip   = 'xTuple Commercial Core package.',
                   pkghead_developer = 'xTuple',
                   pkghead_indev     = false,
                   pkghead_version   = '4.11.0'
 WHERE pkghead_name = 'xtcore';

