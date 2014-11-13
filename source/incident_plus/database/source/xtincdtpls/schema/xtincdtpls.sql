do $$
  var schema  = 'xtincdtpls',
      descrip = 'xTuple extended incident handling',
      version = '1.4.5';

  try {
    plv8.subtransaction(function () {
      plv8.execute("select createPkgSchema('" + schema + "','" + descrip + "');");
    });
  } catch (e) { plv8.elog(NOTICE, "ignoring createPkgSchema error",
                          String(e).substring(0, 200)); }
  plv8.execute("insert into pkghead (pkghead_name, pkghead_descrip,"         +
               "  pkghead_version, pkghead_developer) select '"              +
                  schema + "','" + descrip + "','" + version + "','xTuple'"  +
               " where not exists"                                           +
               " (select 1 from pkghead where pkghead_name = '" + schema + "');");
$$ language plv8;
