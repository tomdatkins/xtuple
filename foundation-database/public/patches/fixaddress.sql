
do $$
begin
if (compareVersion(fetchMetricText('ServerVersion'), '4.10.0') = -1) then
  update addr set addr_line1='' where addr_line1 is null;
  update addr set addr_line2='' where addr_line2 is null;
  update addr set addr_line3='' where addr_line3 is null;
  update addr set addr_city='' where addr_city is null;
  update addr set addr_state='' where addr_state is null;
  update addr set addr_postalcode='' where addr_postalcode is null;
  update addr set addr_country='' where addr_country is null;

  update quhead set quhead_billtoaddress1='' where quhead_billtoaddress1 is null;
  update quhead set quhead_billtoaddress2='' where quhead_billtoaddress2 is null;
  update quhead set quhead_billtoaddress3='' where quhead_billtoaddress3 is null;
  update quhead set quhead_billtocity='' where quhead_billtocity is null;
  update quhead set quhead_billtostate='' where quhead_billtostate is null;
  update quhead set quhead_billtozip='' where quhead_billtozip is null;
  update quhead set quhead_billtocountry='' where quhead_billtocountry is null;
  update quhead set quhead_shiptoaddress1='' where quhead_shiptoaddress1 is null;
  update quhead set quhead_shiptoaddress2='' where quhead_shiptoaddress2 is null;
  update quhead set quhead_shiptoaddress3='' where quhead_shiptoaddress3 is null;
  update quhead set quhead_shiptocity='' where quhead_shiptocity is null;
  update quhead set quhead_shiptostate='' where quhead_shiptostate is null;
  update quhead set quhead_shiptozipcode='' where quhead_shiptozipcode is null;
  update quhead set quhead_shiptocountry='' where quhead_shiptocountry is null;

  update cohead set cohead_billtoaddress1='' where cohead_billtoaddress1 is null;
  update cohead set cohead_billtoaddress2='' where cohead_billtoaddress2 is null;
  update cohead set cohead_billtoaddress3='' where cohead_billtoaddress3 is null;
  update cohead set cohead_billtocity='' where cohead_billtocity is null;
  update cohead set cohead_billtostate='' where cohead_billtostate is null;
  update cohead set cohead_billtozipcode='' where cohead_billtozipcode is null;
  update cohead set cohead_billtocountry='' where cohead_billtocountry is null;
  update cohead set cohead_shiptoaddress1='' where cohead_shiptoaddress1 is null;
  update cohead set cohead_shiptoaddress2='' where cohead_shiptoaddress2 is null;
  update cohead set cohead_shiptoaddress3='' where cohead_shiptoaddress3 is null;
  update cohead set cohead_shiptoaddress4='' where cohead_shiptoaddress4 is null;
  update cohead set cohead_shiptoaddress5='' where cohead_shiptoaddress5 is null;
  update cohead set cohead_shiptocity='' where cohead_shiptocity is null;
  update cohead set cohead_shiptostate='' where cohead_shiptostate is null;
  update cohead set cohead_shiptozipcode='' where cohead_shiptozipcode is null;
  update cohead set cohead_shiptocountry='' where cohead_shiptocountry is null;

  update cohist set cohist_billtoaddress1='' where cohist_billtoaddress1 is null;
  update cohist set cohist_billtoaddress2='' where cohist_billtoaddress2 is null;
  update cohist set cohist_billtoaddress3='' where cohist_billtoaddress3 is null;
  update cohist set cohist_billtocity='' where cohist_billtocity is null;
  update cohist set cohist_billtostate='' where cohist_billtostate is null;
  update cohist set cohist_billtozip='' where cohist_billtozip is null;
  update cohist set cohist_shiptoaddress1='' where cohist_shiptoaddress1 is null;
  update cohist set cohist_shiptoaddress2='' where cohist_shiptoaddress2 is null;
  update cohist set cohist_shiptoaddress3='' where cohist_shiptoaddress3 is null;
  update cohist set cohist_shiptocity='' where cohist_shiptocity is null;
  update cohist set cohist_shiptostate='' where cohist_shiptostate is null;
  update cohist set cohist_shiptozip='' where cohist_shiptozip is null;

  update invchead set invchead_billto_address1='' where invchead_billto_address1 is null;
  update invchead set invchead_billto_address2='' where invchead_billto_address2 is null;
  update invchead set invchead_billto_address3='' where invchead_billto_address3 is null;
  update invchead set invchead_billto_city='' where invchead_billto_city is null;
  update invchead set invchead_billto_state='' where invchead_billto_state is null;
  update invchead set invchead_billto_zipcode='' where invchead_billto_zipcode is null;
  update invchead set invchead_billto_country='' where invchead_billto_country is null;
  update invchead set invchead_shipto_address1='' where invchead_shipto_address1 is null;
  update invchead set invchead_shipto_address2='' where invchead_shipto_address2 is null;
  update invchead set invchead_shipto_address3='' where invchead_shipto_address3 is null;
  update invchead set invchead_shipto_city='' where invchead_shipto_city is null;
  update invchead set invchead_shipto_state='' where invchead_shipto_state is null;
  update invchead set invchead_shipto_zipcode='' where invchead_shipto_zipcode is null;
  update invchead set invchead_shipto_country='' where invchead_shipto_country is null;

  update rahead set rahead_billtoaddress1='' where rahead_billtoaddress1 is null;
  update rahead set rahead_billtoaddress2='' where rahead_billtoaddress2 is null;
  update rahead set rahead_billtoaddress3='' where rahead_billtoaddress3 is null;
  update rahead set rahead_billtocity='' where rahead_billtocity is null;
  update rahead set rahead_billtostate='' where rahead_billtostate is null;
  update rahead set rahead_billtozip='' where rahead_billtozip is null;
  update rahead set rahead_billtocountry='' where rahead_billtocountry is null;
  update rahead set rahead_shipto_address1='' where rahead_shipto_address1 is null;
  update rahead set rahead_shipto_address2='' where rahead_shipto_address2 is null;
  update rahead set rahead_shipto_address3='' where rahead_shipto_address3 is null;
  update rahead set rahead_shipto_city='' where rahead_shipto_city is null;
  update rahead set rahead_shipto_state='' where rahead_shipto_state is null;
  update rahead set rahead_shipto_zipcode='' where rahead_shipto_zipcode is null;
  update rahead set rahead_shipto_country='' where rahead_shipto_country is null;

  update cmhead set cmhead_billtoaddress1='' where cmhead_billtoaddress1 is null;
  update cmhead set cmhead_billtoaddress2='' where cmhead_billtoaddress2 is null;
  update cmhead set cmhead_billtoaddress3='' where cmhead_billtoaddress3 is null;
  update cmhead set cmhead_billtocity='' where cmhead_billtocity is null;
  update cmhead set cmhead_billtostate='' where cmhead_billtostate is null;
  update cmhead set cmhead_billtozip='' where cmhead_billtozip is null;
  update cmhead set cmhead_billtocountry='' where cmhead_billtocountry is null;
  update cmhead set cmhead_shipto_address1='' where cmhead_shipto_address1 is null;
  update cmhead set cmhead_shipto_address2='' where cmhead_shipto_address2 is null;
  update cmhead set cmhead_shipto_address3='' where cmhead_shipto_address3 is null;
  update cmhead set cmhead_shipto_city='' where cmhead_shipto_city is null;
  update cmhead set cmhead_shipto_state='' where cmhead_shipto_state is null;
  update cmhead set cmhead_shipto_zipcode='' where cmhead_shipto_zipcode is null;
  update cmhead set cmhead_shipto_country='' where cmhead_shipto_country is null;

  update pohead set pohead_vendaddress1='' where pohead_vendaddress1 is null;
  update pohead set pohead_vendaddress2='' where pohead_vendaddress2 is null;
  update pohead set pohead_vendaddress3='' where pohead_vendaddress3 is null;
  update pohead set pohead_vendcity='' where pohead_vendcity is null;
  update pohead set pohead_vendstate='' where pohead_vendstate is null;
  update pohead set pohead_vendzipcode='' where pohead_vendzipcode is null;
  update pohead set pohead_vendcountry='' where pohead_vendcountry is null;
  update pohead set pohead_shiptoaddress1='' where pohead_shiptoaddress1 is null;
  update pohead set pohead_shiptoaddress2='' where pohead_shiptoaddress2 is null;
  update pohead set pohead_shiptoaddress3='' where pohead_shiptoaddress3 is null;
  update pohead set pohead_shiptocity='' where pohead_shiptocity is null;
  update pohead set pohead_shiptostate='' where pohead_shiptostate is null;
  update pohead set pohead_shiptozipcode='' where pohead_shiptozipcode is null;
  update pohead set pohead_shiptocountry='' where pohead_shiptocountry is null;

  update tohead set tohead_srcaddress1='' where tohead_srcaddress1 is null;
  update tohead set tohead_srcaddress2='' where tohead_srcaddress2 is null;
  update tohead set tohead_srcaddress3='' where tohead_srcaddress3 is null;
  update tohead set tohead_srccity='' where tohead_srccity is null;
  update tohead set tohead_srcstate='' where tohead_srcstate is null;
  update tohead set tohead_srcpostalcode='' where tohead_srcpostalcode is null;
  update tohead set tohead_srccountry='' where tohead_srccountry is null;
  update tohead set tohead_destaddress1='' where tohead_destaddress1 is null;
  update tohead set tohead_destaddress2='' where tohead_destaddress2 is null;
  update tohead set tohead_destaddress3='' where tohead_destaddress3 is null;
  update tohead set tohead_destcity='' where tohead_destcity is null;
  update tohead set tohead_deststate='' where tohead_deststate is null;
  update tohead set tohead_destpostalcode='' where tohead_destpostalcode is null;
  update tohead set tohead_destcountry='' where tohead_destcountry is null;

  alter table addr
    alter addr_line1 set not null, alter addr_line1 set default '',
    alter addr_line2 set not null, alter addr_line2 set default '',
    alter addr_line3 set not null, alter addr_line3 set default '',
    alter addr_city set not null, alter addr_city set default '',
    alter addr_state set not null, alter addr_state set default '',
    alter addr_postalcode set not null, alter addr_postalcode set default '',
    alter addr_country set not null, alter addr_country set default '';

  alter table quhead
    alter quhead_billtoaddress1 set not null, alter quhead_billtoaddress1 set default '',
    alter quhead_billtoaddress2 set not null, alter quhead_billtoaddress2 set default '',
    alter quhead_billtoaddress3 set not null, alter quhead_billtoaddress3 set default '',
    alter quhead_billtocity set not null, alter quhead_billtocity set default '',
    alter quhead_billtostate set not null, alter quhead_billtostate set default '',
    alter quhead_billtozip set not null, alter quhead_billtozip set default '',
    alter quhead_billtocountry set not null, alter quhead_billtocountry set default '',
    alter quhead_shiptoaddress1 set not null, alter quhead_shiptoaddress1 set default '',
    alter quhead_shiptoaddress2 set not null, alter quhead_shiptoaddress2 set default '',
    alter quhead_shiptoaddress3 set not null, alter quhead_shiptoaddress3 set default '',
    alter quhead_shiptocity set not null, alter quhead_shiptocity set default '',
    alter quhead_shiptostate set not null, alter quhead_shiptostate set default '',
    alter quhead_shiptozipcode set not null, alter quhead_shiptozipcode set default '',
    alter quhead_shiptocountry set not null, alter quhead_shiptocountry set default '';

  alter table cohead
    alter cohead_billtoaddress1 set not null, alter cohead_billtoaddress1 set default '',
    alter cohead_billtoaddress2 set not null, alter cohead_billtoaddress2 set default '',
    alter cohead_billtoaddress3 set not null, alter cohead_billtoaddress3 set default '',
    alter cohead_billtocity set not null, alter cohead_billtocity set default '',
    alter cohead_billtostate set not null, alter cohead_billtostate set default '',
    alter cohead_billtozipcode set not null, alter cohead_billtozipcode set default '',
    alter cohead_billtocountry set not null, alter cohead_billtocountry set default '',
    alter cohead_shiptoaddress1 set not null, alter cohead_shiptoaddress1 set default '',
    alter cohead_shiptoaddress2 set not null, alter cohead_shiptoaddress2 set default '',
    alter cohead_shiptoaddress3 set not null, alter cohead_shiptoaddress3 set default '',
    alter cohead_shiptoaddress4 set not null, alter cohead_shiptoaddress4 set default '',
    alter cohead_shiptoaddress5 set not null, alter cohead_shiptoaddress5 set default '',
    alter cohead_shiptocity set not null, alter cohead_shiptocity set default '',
    alter cohead_shiptostate set not null, alter cohead_shiptostate set default '',
    alter cohead_shiptozipcode set not null, alter cohead_shiptozipcode set default '',
    alter cohead_shiptocountry set not null, alter cohead_shiptocountry set default '';

  alter table cohist
    alter cohist_billtoaddress1 set not null, alter cohist_billtoaddress1 set default '',
    alter cohist_billtoaddress2 set not null, alter cohist_billtoaddress2 set default '',
    alter cohist_billtoaddress3 set not null, alter cohist_billtoaddress3 set default '',
    alter cohist_billtocity set not null, alter cohist_billtocity set default '',
    alter cohist_billtostate set not null, alter cohist_billtostate set default '',
    alter cohist_billtozip set not null, alter cohist_billtozip set default '',
    alter cohist_shiptoaddress1 set not null, alter cohist_shiptoaddress1 set default '',
    alter cohist_shiptoaddress2 set not null, alter cohist_shiptoaddress2 set default '',
    alter cohist_shiptoaddress3 set not null, alter cohist_shiptoaddress3 set default '',
    alter cohist_shiptocity set not null, alter cohist_shiptocity set default '',
    alter cohist_shiptostate set not null, alter cohist_shiptostate set default '',
    alter cohist_shiptozip set not null, alter cohist_shiptozip set default '';

  alter table invchead
    alter invchead_billto_address1 set not null, alter invchead_billto_address1 set default '',
    alter invchead_billto_address2 set not null, alter invchead_billto_address2 set default '',
    alter invchead_billto_address3 set not null, alter invchead_billto_address3 set default '',
    alter invchead_billto_city set not null, alter invchead_billto_city set default '',
    alter invchead_billto_state set not null, alter invchead_billto_state set default '',
    alter invchead_billto_zipcode set not null, alter invchead_billto_zipcode set default '',
    alter invchead_billto_country set not null, alter invchead_billto_country set default '',
    alter invchead_shipto_address1 set not null, alter invchead_shipto_address1 set default '',
    alter invchead_shipto_address2 set not null, alter invchead_shipto_address2 set default '',
    alter invchead_shipto_address3 set not null, alter invchead_shipto_address3 set default '',
    alter invchead_shipto_city set not null, alter invchead_shipto_city set default '',
    alter invchead_shipto_state set not null, alter invchead_shipto_state set default '',
    alter invchead_shipto_zipcode set not null, alter invchead_shipto_zipcode set default '',
    alter invchead_shipto_country set not null, alter invchead_shipto_country set default '';

  alter table rahead
    alter rahead_billtoaddress1 set not null, alter rahead_billtoaddress1 set default '',
    alter rahead_billtoaddress2 set not null, alter rahead_billtoaddress2 set default '',
    alter rahead_billtoaddress3 set not null, alter rahead_billtoaddress3 set default '',
    alter rahead_billtocity set not null, alter rahead_billtocity set default '',
    alter rahead_billtostate set not null, alter rahead_billtostate set default '',
    alter rahead_billtozip set not null, alter rahead_billtozip set default '',
    alter rahead_billtocountry set not null, alter rahead_billtocountry set default '',
    alter rahead_shipto_address1 set not null, alter rahead_shipto_address1 set default '',
    alter rahead_shipto_address2 set not null, alter rahead_shipto_address2 set default '',
    alter rahead_shipto_address3 set not null, alter rahead_shipto_address3 set default '',
    alter rahead_shipto_city set not null, alter rahead_shipto_city set default '',
    alter rahead_shipto_state set not null, alter rahead_shipto_state set default '',
    alter rahead_shipto_zipcode set not null, alter rahead_shipto_zipcode set default '',
    alter rahead_shipto_country set not null, alter rahead_shipto_country set default '';

  alter table cmhead
    alter cmhead_billtoaddress1 set not null, alter cmhead_billtoaddress1 set default '',
    alter cmhead_billtoaddress2 set not null, alter cmhead_billtoaddress2 set default '',
    alter cmhead_billtoaddress3 set not null, alter cmhead_billtoaddress3 set default '',
    alter cmhead_billtocity set not null, alter cmhead_billtocity set default '',
    alter cmhead_billtostate set not null, alter cmhead_billtostate set default '',
    alter cmhead_billtozip set not null, alter cmhead_billtozip set default '',
    alter cmhead_billtocountry set not null, alter cmhead_billtocountry set default '',
    alter cmhead_shipto_address1 set not null, alter cmhead_shipto_address1 set default '',
    alter cmhead_shipto_address2 set not null, alter cmhead_shipto_address2 set default '',
    alter cmhead_shipto_address3 set not null, alter cmhead_shipto_address3 set default '',
    alter cmhead_shipto_city set not null, alter cmhead_shipto_city set default '',
    alter cmhead_shipto_state set not null, alter cmhead_shipto_state set default '',
    alter cmhead_shipto_zipcode set not null, alter cmhead_shipto_zipcode set default '',
    alter cmhead_shipto_country set not null, alter cmhead_shipto_country set default '';

  alter table pohead
    alter pohead_vendaddress1 set not null, alter pohead_vendaddress1 set default '',
    alter pohead_vendaddress2 set not null, alter pohead_vendaddress2 set default '',
    alter pohead_vendaddress3 set not null, alter pohead_vendaddress3 set default '',
    alter pohead_vendcity set not null, alter pohead_vendcity set default '',
    alter pohead_vendstate set not null, alter pohead_vendstate set default '',
    alter pohead_vendzipcode set not null, alter pohead_vendzipcode set default '',
    alter pohead_vendcountry set not null, alter pohead_vendcountry set default '',
    alter pohead_shiptoaddress1 set not null, alter pohead_shiptoaddress1 set default '',
    alter pohead_shiptoaddress2 set not null, alter pohead_shiptoaddress2 set default '',
    alter pohead_shiptoaddress3 set not null, alter pohead_shiptoaddress3 set default '',
    alter pohead_shiptocity set not null, alter pohead_shiptocity set default '',
    alter pohead_shiptostate set not null, alter pohead_shiptostate set default '',
    alter pohead_shiptozipcode set not null, alter pohead_shiptozipcode set default '',
    alter pohead_shiptocountry set not null, alter pohead_shiptocountry set default '';

  alter table tohead
    alter tohead_srcaddress1 set not null, alter tohead_srcaddress1 set default '',
    alter tohead_srcaddress2 set not null, alter tohead_srcaddress2 set default '',
    alter tohead_srcaddress3 set not null, alter tohead_srcaddress3 set default '',
    alter tohead_srccity set not null, alter tohead_srccity set default '',
    alter tohead_srcstate set not null, alter tohead_srcstate set default '',
    alter tohead_srcpostalcode set not null, alter tohead_srcpostalcode set default '',
    alter tohead_srccountry set not null, alter tohead_srccountry set default '',
    alter tohead_destaddress1 set not null, alter tohead_destaddress1 set default '',
    alter tohead_destaddress2 set not null, alter tohead_destaddress2 set default '',
    alter tohead_destaddress3 set not null, alter tohead_destaddress3 set default '',
    alter tohead_destcity set not null, alter tohead_destcity set default '',
    alter tohead_deststate set not null, alter tohead_deststate set default '',
    alter tohead_destpostalcode set not null, alter tohead_destpostalcode set default '',
    alter tohead_destcountry set not null, alter tohead_destcountry set default '';

end if;
end$$;
