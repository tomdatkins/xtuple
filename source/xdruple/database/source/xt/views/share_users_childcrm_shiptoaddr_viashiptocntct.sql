/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Ship To Address based on what Child CRM Account's Contact
 * is on a Ship To.
 */

select xt.create_view('xt.share_users_childcrm_shiptoaddr_viashiptocntct', $$

-- Ship To Address through Ship To Child CRM Account's users.
  SELECT
    shipto_addr_child_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      shipto_addr.obj_uuid,
      crmacct_child.crmacct_id
    FROM crmacct AS crmacct_child
    JOIN crmacct ON crmacct.crmacct_id = crmacct_child.crmacct_parent_id
    JOIN shiptoinfo ON shipto_cust_id = crmacct.crmacct_cust_id
    JOIN cntct AS child_cntct ON child_cntct.cntct_id = shipto_cntct_id
    JOIN addr AS shipto_addr ON shipto_addr.addr_id = shiptoinfo.shipto_addr_id
    WHERE TRUE
      AND crmacct_child.crmacct_parent_id IS NOT NULL
      AND child_cntct.cntct_crmacct_id = crmacct_child.crmacct_id
  ) shipto_addr_child_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
