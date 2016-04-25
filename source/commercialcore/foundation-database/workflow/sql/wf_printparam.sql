SELECT xt.create_table('wf_printparam','workflow');

SELECT xt.add_column('wf_printparam','wf_printparam_id','serial',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_order','integer',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_name','text',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_value','text',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_type','text',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_parent_uuid','uuid',null,'workflow');
SELECT xt.add_column('wf_printparam','wf_printparam_send_to_batch','boolean','DEFAULT false','workflow');

SELECT xt.add_primary_key('wf_printparam','wf_printparam_id','workflow');

GRANT ALL ON TABLE workflow.wf_printparam TO xtrole;
