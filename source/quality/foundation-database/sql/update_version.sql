select createpkgschema('xtquality', 'This file is part of the xtquality Package for xTuple ERP, and is Copyright (c) 1999-2017 by OpenMFG LLC, d/b/a xTuple.  It is licensed to you under the xTuple End-User License Agreement ("the EULA"), the full text of which is available at www.xtuple.com/EULA.  While the EULA gives you access to source code and encourages your involvement in the development process, this Package is not free software.  By using this software, you agree to be bound by the terms of the EULA.');

UPDATE pkghead SET pkghead_descrip   = 'xTuple Quality Desktop extension package.',
                   pkghead_developer = 'xTuple',
                   pkghead_indev     = false,
                   pkghead_version   = '0.2'
 WHERE pkghead_name = 'xtquality';