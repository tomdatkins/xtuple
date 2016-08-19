SELECT xt.create_table('wf_parentinfo','workflow');

SELECT xt.add_column('wf_parentinfo','wf_parentinfo_id','serial',null,'workflow');
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wfparent_uuid','text',null,'workflow');
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wfsrc_uuid','uuid',null,'workflow');

SELECT xt.add_primary_key('wf_parentinfo','wf_parentinfo_id','workflow');

GRANT ALL ON TABLE workflow.wf_parentoinfo TO xtrole;
GRANT ALL ON TABLE workflow.wf_parentinfo_wf_parentinfo_id_seq TO xtrole;
