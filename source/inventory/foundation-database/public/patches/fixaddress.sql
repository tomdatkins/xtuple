do $$
declare
  ary     TEXT[];
  col     TEXT;
begin
if (compareVersion(fetchMetricText('ServerVersion'), '4.10.0') <= 0) then

  ary := ARRAY[ 'rahead_billtoaddress1', 'rahead_billtoaddress2', 'rahead_billtoaddress3', 'rahead_billtocity',
                'rahead_billtostate', 'rahead_billtozip', 'rahead_billtocountry', 'rahead_shipto_address1',
                'rahead_shipto_address2', 'rahead_shipto_address3', 'rahead_shipto_city', 'rahead_shipto_state',
                'rahead_shipto_zipcode', 'rahead_shipto_country' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update rahead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table rahead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;

  ary := ARRAY [ 'tohead_srcaddress1', 'tohead_srcaddress2', 'tohead_srcaddress3', 'tohead_srccity',
                 'tohead_srcstate', 'tohead_srcpostalcode', 'tohead_srccountry', 'tohead_destaddress1',
                 'tohead_destaddress2', 'tohead_destaddress3', 'tohead_destcity', 'tohead_deststate',
                 'tohead_destpostalcode', 'tohead_destcountry' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update tohead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table tohead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;

end if;
end$$;
