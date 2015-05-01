do $$
begin
if (not exists(select calhead_id from calhead where upper(calhead_name)='12MONTHBACK')) then

  INSERT INTO calhead
    (calhead_type,calhead_name,calhead_descrip,calhead_origin)
  VALUES
    ('R','12MONTHBACK','12 Months Back for Time Phased Usage','M');

  INSERT INTO rcalitem 
    (rcalitem_calhead_id,rcalitem_offsettype,rcalitem_offsetcount,rcalitem_periodtype,rcalitem_periodcount,rcalitem_name)
  VALUES
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',0,'M',1,'Current Month'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-1,'M',1,'Last Month'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-2,'M',1,'Month Before Last'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-3,'M',1,'4 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-4,'M',1,'5 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-5,'M',1,'6 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-6,'M',1,'7 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-7,'M',1,'8 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-8,'M',1,'9 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-9,'M',1,'10 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-10,'M',1,'11 Months Back'),
    ((SELECT calhead_id from calhead where calhead_name='12MONTHBACK'),'M',-11,'M',1,'12 Months Back');

end if;
end$$;