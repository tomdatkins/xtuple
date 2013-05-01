do $$
  /* Only create the schema if it hasn't been created already */
  var res, sql = "select schema_name from information_schema.schemata where schema_name = 'te'",
  res = plv8.execute(sql);
  if (!res.length) {
    sql = "create schema te; grant all on schema xm to group xtrole;"
    plv8.execute(sql);
  }
$$ language plv8;