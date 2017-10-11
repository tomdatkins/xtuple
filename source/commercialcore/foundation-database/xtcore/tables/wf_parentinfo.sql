DROP TABLE IF EXISTS workflow.wf_parentinfo;

SELECT xt.create_table('wf_parentinfo');

SELECT xt.add_column('wf_parentinfo','wf_parentinfo_id','serial', 'primary key');
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wf_uuid','text',null);
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wfparent_uuid','text',null);
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wfsrc_uuid','uuid',null);
SELECT xt.add_column('wf_parentinfo','wf_parentinfo_wftype_code','text',null);

SELECT xt.add_primary_key('wf_parentinfo','wf_parentinfo_id');

GRANT ALL ON TABLE xt.wf_parentinfo TO xtrole;
GRANT ALL ON TABLE xt.wf_parentinfo_wf_parentinfo_id_seq TO xtrole;

