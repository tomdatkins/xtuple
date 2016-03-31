select xt.add_column('cohist', 'cohist_listprice', 'NUMERIC(16,4)', NULL, 'public');

comment on column public.cohist.cohist_listprice is 'List price of Item.';
