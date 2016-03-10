delete from xt.ordtype where ordtype_tblname = 'plreq';
do $$
  declare
    _i    integer := 1;
    _ins  text;
    _pair text[] = array[ /* really a 2D array */
          'toitem', 'TO'
        , 'tohead', 'TO'
        , 'poitem', 'PO'
        , 'pohead', 'PO'
        , 'cmitem', 'CM'
        , 'cmhead', 'CM'
        , 'invcitem', 'IN'
        , 'invchead', 'IN'
        , 'pr',       'PR'
        , 'planord',  'PL'
        , 'planreq',  'PL'
        , 'rahead',   'RA'
    ];

  begin
    for _i in 1..array_length(_pair, 1) by 2 loop
      _ins := format($f$insert into xt.ordtype (ordtype_tblname, ordtype_code)
                        select '%s', '%s'
                         where not exists (select * from xt.ordtype where ordtype_tblname = '%s');
                     $f$, _pair[_i], _pair[_i + 1], _pair[_i]);
      execute _ins;
    end loop;
  end
$$ language plpgsql;
