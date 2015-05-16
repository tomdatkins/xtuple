-- try creating the schema even during upgrades - we _moved_ stuff. this function is idempotent
select createpkgschema('xtcore', 'This file is part of the xtcore Package for xTuple ERP, and is Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple.  It is licensed to you under the xTuple End-User License Agreement ("the EULA"), the full text of which is available at www.xtuple.com/EULA.  While the EULA gives you access to source code and encourages your involvement in the development process, this Package is not free software.  By using this software, you agree to be bound by the terms of the EULA.');

UPDATE pkghead SET pkghead_descrip   = 'xTuple Commercial Core package.',
                   pkghead_developer = 'xTuple',
                   pkghead_indev     = false,
                   pkghead_version   = '4.9.0RC'
 WHERE pkghead_name = 'xtcore';


