-- another view of of the same name but fewer UNIONs exists in xtupleserver

-- You must not change the signature of this view. If you want to
-- update it at all, rewrite it using the registration system
-- familiar to the xt-schema code
CREATE OR REPLACE VIEW orderhead AS
  SELECT DISTINCT * FROM (
  SELECT pohead_id		AS orderhead_id,
	 'PO'::text		AS orderhead_type,
	 pohead_number		AS orderhead_number,
	 pohead_status		AS orderhead_status,
	 pohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM poitem
	   WHERE poitem_pohead_id=pohead_id) AS orderhead_linecount,
	 pohead_vend_id		AS orderhead_from_id,
	 vend_name		AS orderhead_from,
	 NULL::int		AS orderhead_to_id,
	 ''::text		AS orderhead_to,
	 pohead_curr_id		AS orderhead_curr_id,
	 pohead_agent_username	AS orderhead_agent_username,
	 pohead_shipvia		AS orderhead_shipvia
  FROM pohead LEFT OUTER JOIN vendinfo ON (pohead_vend_id=vend_id)
  UNION ALL
  SELECT cohead_id		AS orderhead_id,
	 'SO'::text		AS orderhead_type,
  	 cohead_number		AS orderhead_number,
	 cohead_status		AS orderhead_status,
	 cohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	  FROM coitem
	  WHERE coitem_cohead_id=cohead_id) AS orderhead_linecount,
	 NULL			AS orderhead_from_id,
	 ''::text		AS orderhead_from,
	 cohead_cust_id		AS orderhead_to_id,
	 CASE 
	   WHEN (length(cohead_shiptoname) > 0) THEN
	     cohead_shiptoname
	   ELSE cohead_billtoname
	 END     		AS orderhead_to,
	 cohead_curr_id		AS orderhead_curr_id,
	 ''::text		AS orderhead_agent_username,
	 cohead_shipvia		AS orderhead_shipvia
  FROM cohead
  UNION ALL
  SELECT tohead_id		AS orderhead_id,
	 'TO'::text		AS orderhead_type,
	 tohead_number		AS orderhead_number,
	 tohead_status		AS orderhead_status,
	 tohead_orderdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM toitem
	   WHERE toitem_tohead_id=tohead_id) AS orderhead_linecount,
	 tohead_src_warehous_id	 AS orderhead_from_id,
	 tohead_srcname		AS orderhead_from,
	 tohead_dest_warehous_id AS orderhead_to_id,
	 tohead_destname	AS orderhead_to,
	 tohead_freight_curr_id	AS orderhead_curr_id,
	 tohead_agent_username	AS orderhead_agent_username,
	 tohead_shipvia		AS orderhead_shipvia
  FROM tohead
  UNION ALL
  SELECT rahead_id		AS orderhead_id,
	 'RA'::text		AS orderhead_type,
	 rahead_number		AS orderhead_number,
	 COALESCE(raitem_status,'C') AS orderhead_status,
	 rahead_authdate	AS orderhead_orderdate,
	 (SELECT count(*)
	   FROM raitem
	   WHERE raitem_rahead_id=rahead_id) AS orderhead_linecount,
	 rahead_cust_id		AS orderhead_from_id,
	 cust_name		AS orderhead_from,
	 NULL::int		AS orderhead_to_id,
	 ''::text		AS orderhead_to,
	 rahead_curr_id		AS orderhead_curr_id,
	 ''::text		AS orderhead_agent_username,
	 ''::text		AS orderhead_shipvia
  FROM rahead LEFT OUTER JOIN custinfo ON (rahead_cust_id=cust_id)
              LEFT OUTER JOIN raitem ON ((rahead_id=raitem_rahead_id)
                                     AND (raitem_status='O'))) AS data;
REVOKE ALL ON TABLE orderhead FROM PUBLIC;
GRANT  ALL ON TABLE orderhead TO GROUP xtrole;

COMMENT ON VIEW orderhead IS 'Union of all orders for use by widgets and stored procedures which process multiple types of order';
