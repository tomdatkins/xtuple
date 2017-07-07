-- another view of of the same name but fewer UNIONs exists in xtupleserver

SELECT dropIfExists('view', 'orderhead');
CREATE VIEW orderhead AS

  SELECT pohead.pohead_id AS orderhead_id,
    'PO'::text AS orderhead_type,
    pohead.pohead_number AS orderhead_number,
    pohead.pohead_status AS orderhead_status,
    pohead.pohead_orderdate AS orderhead_orderdate,
    ( SELECT count(*) AS count
           FROM poitem
          WHERE poitem.poitem_pohead_id = pohead.pohead_id) AS orderhead_linecount,
    pohead.pohead_vend_id AS orderhead_from_id,
    ( SELECT vendinfo.vend_name
           FROM vendinfo
          WHERE pohead.pohead_vend_id = vendinfo.vend_id) AS orderhead_from,
    NULL::integer AS orderhead_to_id,
    ''::text AS orderhead_to,
    pohead.pohead_curr_id AS orderhead_curr_id,
    pohead.pohead_agent_username AS orderhead_agent_username,
    pohead.pohead_shipvia AS orderhead_shipvia
    FROM pohead
  UNION ALL
  SELECT cohead.cohead_id AS orderhead_id,
    'SO'::text AS orderhead_type,
    cohead.cohead_number AS orderhead_number,
    cohead.cohead_status AS orderhead_status,
    cohead.cohead_orderdate AS orderhead_orderdate,
    ( SELECT count(*) AS count
           FROM coitem
          WHERE coitem.coitem_cohead_id = cohead.cohead_id) AS orderhead_linecount,
    NULL::integer AS orderhead_from_id,
    ''::text AS orderhead_from,
    cohead.cohead_cust_id AS orderhead_to_id,
        CASE
            WHEN length(cohead.cohead_shiptoname) > 0 THEN cohead.cohead_shiptoname
            ELSE cohead.cohead_billtoname
        END AS orderhead_to,
    cohead.cohead_curr_id AS orderhead_curr_id,
    ''::text AS orderhead_agent_username,
    cohead.cohead_shipvia AS orderhead_shipvia
    FROM cohead
  UNION ALL
  SELECT tohead.tohead_id AS orderhead_id,
    'TO'::text AS orderhead_type,
    tohead.tohead_number AS orderhead_number,
    tohead.tohead_status AS orderhead_status,
    tohead.tohead_orderdate AS orderhead_orderdate,
    ( SELECT count(*) AS count
           FROM toitem
          WHERE toitem.toitem_tohead_id = tohead.tohead_id) AS orderhead_linecount,
    tohead.tohead_src_warehous_id AS orderhead_from_id,
    tohead.tohead_srcname AS orderhead_from,
    tohead.tohead_dest_warehous_id AS orderhead_to_id,
    tohead.tohead_destname AS orderhead_to,
    tohead.tohead_freight_curr_id AS orderhead_curr_id,
    tohead.tohead_agent_username AS orderhead_agent_username,
    tohead.tohead_shipvia AS orderhead_shipvia
    FROM tohead
  UNION ALL
  SELECT rahead.rahead_id AS orderhead_id,
    'RA'::text AS orderhead_type,
    rahead.rahead_number AS orderhead_number,
    COALESCE(( SELECT raitem.raitem_status
           FROM raitem
          WHERE raitem.raitem_rahead_id = rahead.rahead_id AND raitem.raitem_status = 'O'::bpchar
         LIMIT 1), 'C'::bpchar) AS orderhead_status,
    rahead.rahead_authdate AS orderhead_orderdate,
    ( SELECT count(*) AS count
           FROM raitem raitem_1
          WHERE raitem_1.raitem_rahead_id = rahead.rahead_id) AS orderhead_linecount,
    rahead.rahead_cust_id AS orderhead_from_id,
    ( SELECT custinfo.cust_name
           FROM custinfo
          WHERE rahead.rahead_cust_id = custinfo.cust_id) AS orderhead_from,
    NULL::integer AS orderhead_to_id,
    ''::text AS orderhead_to,
    rahead.rahead_curr_id AS orderhead_curr_id,
    ''::text AS orderhead_agent_username,
    ''::text AS orderhead_shipvia
    FROM rahead;

REVOKE ALL ON TABLE orderhead FROM PUBLIC;
GRANT  ALL ON TABLE orderhead TO GROUP xtrole;

COMMENT ON VIEW orderhead IS 'Union of all orders for use by widgets and stored procedures which process multiple types of order';
