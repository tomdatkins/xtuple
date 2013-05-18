select xt.create_view('xt.prjtaskinfo', $$

select prjtask.*, prj_number
from prjtask
  join prj on prj_id = prjtask_prj_id;

$$);