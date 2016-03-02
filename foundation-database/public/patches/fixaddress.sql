do $$
declare
  ary     TEXT[];
  col     TEXT;
begin
if (compareVersion(fetchMetricText('ServerVersion'), '4.10.0') <= 0) then

  ary := ARRAY[ 'addr_line1', 'addr_line2', 'addr_line3', 'addr_city',
                'addr_state', 'addr_postalcode', 'addr_country' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update addr set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table addr alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;

  ary := ARRAY[ 'quhead_billtoaddress1', 'quhead_billtoaddress2', 'quhead_billtoaddress3',
                'quhead_billtocity', 'quhead_billtostate', 'quhead_billtozip', 'quhead_billtocountry',
                'quhead_shiptoaddress1', 'quhead_shiptoaddress2', 'quhead_shiptoaddress3',
                'quhead_shiptocity', 'quhead_shiptostate', 'quhead_shiptozipcode',
                'quhead_shiptocountry' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update quhead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table quhead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;



  ary := ARRAY[ 'cohead_billtoaddress1', 'cohead_billtoaddress2', 'cohead_billtoaddress3',
                'cohead_billtocity', 'cohead_billtostate', 'cohead_billtozipcode',
                'cohead_billtocountry', 'cohead_shiptoaddress1', 'cohead_shiptoaddress2',
                'cohead_shiptoaddress3', 'cohead_shiptoaddress4', 'cohead_shiptoaddress5',
                'cohead_shiptocity', 'cohead_shiptostate', 'cohead_shiptozipcode',
                'cohead_shiptocountry' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update cohead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table cohead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;


  ary := ARRAY[ 'cohist_billtoaddress1', 'cohist_billtoaddress2', 'cohist_billtoaddress3',
                'cohist_billtocity', 'cohist_billtostate', 'cohist_billtozip', 'cohist_shiptoaddress1',
                'cohist_shiptoaddress2', 'cohist_shiptoaddress3', 'cohist_shiptocity',
                'cohist_shiptostate', 'cohist_shiptozip' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update cohist set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table cohist alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;


  ary := ARRAY[ 'invchead_billto_address1', 'invchead_billto_address2',
                'invchead_billto_address3', 'invchead_billto_city', 'invchead_billto_state',
                'invchead_billto_zipcode', 'invchead_billto_country', 'invchead_shipto_address1',
                'invchead_shipto_address2', 'invchead_shipto_address3', 'invchead_shipto_city',
                'invchead_shipto_state', 'invchead_shipto_zipcode', 'invchead_shipto_country' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update invchead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table invchead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;


  ary := ARRAY[ 'cmhead_billtoaddress1', 'cmhead_billtoaddress2', 'cmhead_billtoaddress3',
                'cmhead_billtocity', 'cmhead_billtostate', 'cmhead_billtozip', 'cmhead_billtocountry',
                'cmhead_shipto_address1', 'cmhead_shipto_address2', 'cmhead_shipto_address3',
                'cmhead_shipto_city', 'cmhead_shipto_state', 'cmhead_shipto_zipcode',
                'cmhead_shipto_country' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update cmhead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table cmhead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;

  ary := ARRAY[ 'pohead_vendaddress1', 'pohead_vendaddress2', 'pohead_vendaddress3',
                'pohead_vendcity', 'pohead_vendstate', 'pohead_vendzipcode', 'pohead_vendcountry',
                'pohead_shiptoaddress1', 'pohead_shiptoaddress2', 'pohead_shiptoaddress3',
                'pohead_shiptocity', 'pohead_shiptostate', 'pohead_shiptozipcode',
                'pohead_shiptocountry' ];
  foreach col in ARRAY ary
  loop
    execute format($f$update pohead set %I = '' where %I is null;$f$, col, col);
    execute format($f$alter table pohead alter %I set not null, alter %I set default ' ';$f$, col, col);
  end loop;


end if;
end$$;
