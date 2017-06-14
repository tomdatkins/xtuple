SELECT xt.add_column('quitem', 'quitem_subnumber',   'INTEGER',                 'NOT NULL DEFAULT 0', 'public');
SELECT xt.add_column('quitem', 'quitem_listprice',   'NUMERIC(16,4)',            NULL,                'public');
SELECT xt.add_column('quitem', 'quitem_created',     'TIMESTAMP WITH TIME ZONE', NULL,                'public');
SELECT xt.add_column('quitem', 'quitem_lastupdated', 'TIMESTAMP WITH TIME ZONE', NULL,                'public');

COMMENT ON COLUMN public.quitem.quitem_listprice IS 'List price of Item.';
