select xt.create_view('xt.teheadinfo', $$

select tehead_id, tehead_number, tehead_weekending,
  tehead_status,
  xt.sheetstate(tehead_id, 'I') AS invoiced,
  xt.sheetstate(tehead_id, 'V') AS vouchered,
  xt.sheetstate(tehead_id, 'P') AS posted,
  sum(case when (teitem_type='T') then
             teitem_qty
      else 0
      end) as hours,
  sum(case when (teitem_type='E' and teitem_prepaid=false) then
             teitem_total
           when (teitem_type='T' and teemp_contractor = true) then
             coalesce(teitem_empcost, te.calcRate(emp_wage, emp_wage_period)) * teitem_qty
           else 0 
      end) as to_voucher,
  sum(case when (teitem_billable=true) then
             teitem_total
           else 0 
      end) AS to_invoice
from te.tehead
  join emp on (tehead_emp_id=emp_id)
  left outer join te.teitem on (tehead_id=teitem_tehead_id)
  left outer join te.teemp on (tehead_emp_id=teemp_emp_id)
group by
    tehead_id,
    tehead_number,
    tehead_weekending,
    tehead_status,
    emp_code,
    invoiced,
    vouchered,
    posted
order by tehead_number;

$$);