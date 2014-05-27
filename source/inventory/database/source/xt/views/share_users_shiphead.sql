/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to an Shipment based on what CRM Account it's Sales Order belongs to.
 */

select xt.create_view('xt.share_users_shiphead', $$

  -- Shipment CRM Account's users.
  SELECT
    shiphead_cust_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      shiphead.obj_uuid,
      crmacct_id
    FROM shiphead
    LEFT JOIN cohead ON shiphead_order_id = cohead_id
    LEFT JOIN custinfo ON cohead_cust_id = cust_id
    LEFT JOIN crmacct ON cust_id = crmacct_cust_id
  ) shiphead_cust_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
