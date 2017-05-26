select createpkgschema('xwd', 'This file is part of the xwd Package for xTuple ERP, and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It is licensed to you under the xTuple End-User License Agreement ("the EULA"), the full text of which is available at www.xtuple.com/EULA.  While the EULA gives you access to source code and encourages your involvement in the development process, this Package is not free software.  By using this software, you agree to be bound by the terms of the EULA.');

-- older createpkgschema()s don't INSERT
INSERT INTO pkghead (
      pkghead_name, pkghead_descrip,
      pkghead_developer, pkghead_version, pkghead_indev
  ) SELECT
      'xwd', 'xTuple Distribution Edition package.',
      'xTuple', '4.10.0', false
     WHERE NOT EXISTS (SELECT 1 FROM pkghead where pkghead_name = 'xwd');

UPDATE pkghead SET pkghead_descrip   = 'xTuple Distribution Edition package.',
                   pkghead_developer = 'xTuple',
                   pkghead_indev     = false,
                   pkghead_version   = '4.11.0RC'
 WHERE pkghead_name = 'xwd';
