do $$
  /* put xt at the front of the search path */
  var path = plv8.execute('select show_search_path() as path');
  path = path[0].path;
  plv8.execute('set search_path to xt,' + path);
$$ language plv8;
