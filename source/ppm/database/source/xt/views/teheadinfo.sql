select xt.create_view('xt.teheadinfo', $$

select tehead_id, tehead_number, tehead_weekending, tehead_emp_id, tehead_status, tehead_username,
  sum(case when (teitem_type='T') then teitem_qty else 0 end) as total_hours,
  sum(case when (teitem_type='E') then teitem_qty else 0 end) as total_expenses,
  sum(case when (teitem_type='E' and teitem_prepaid=false and teitem_vodist_id is null) then teitem_total
           when (teitem_type='T' and teemp_contractor=true and teitem_vodist_id is null) then
             coalesce(teitem_empcost, te.calcRate(emp_wage, emp_wage_period)) * teitem_qty
           else 0 end) as to_voucher,
  sum(case when (teitem_billable=true and teitem_invcitem_id is null) then teitem_total else 0 end) AS to_invoice,
  case te.sheetstate(tehead_id, 'I') when 1 then true when 0 then false end as invoiced,
  case te.sheetstate(tehead_id, 'V') when 1 then true when 0 then false end as vouchered,
  case te.sheetstate(tehead_id, 'P') when 1 then true when 0 then false end as posted
from te.tehead
  join emp on (tehead_emp_id=emp_id)
  left outer join te.teitem on (tehead_id=teitem_tehead_id)
  left outer join te.teemp on (tehead_emp_id=teemp_emp_id)
group by
    tehead_id,
    tehead_number,
    tehead_weekending,
    tehead_status,
    tehead_emp_id,
    tehead_username,
    invoiced,
    vouchered,
    posted
order by tehead_number;

$$);