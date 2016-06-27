SELECT xt.create_table('wfsrc_printparam','workflow');

SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_id','serial',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_wfsrc_id','integer',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_order','integer',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_name','text',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_value','text',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_type','text',null,'workflow');
SELECT xt.add_column('wfsrc_printparam','wfsrc_printparam_wfsrc_uuid','uuid',null,'workflow');

SELECT xt.add_primary_key('wfsrc_printparam','wfsrc_printparam_id','workflow');

GRANT ALL ON TABLE workflow.wfsrc_printparam TO xtrole;
GRANT ALL ON TABLE workflow.wfsrc_printparam_wfsrc_printparam_id_seq TO xtrole;
