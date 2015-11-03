/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Address based on if that Address is on a Child CRM Account
 * of a Parent CRM Account. A Parent should have access to its Children.
 */

select xt.create_view('xt.share_users_crmchild_addr', $$

-- A CRM Account should have access to all Child CRM Account Addresses.
  SELECT
    crmacct_child_crmacct_addr_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      child_addr.obj_uuid,
      crmacct.crmacct_id
    FROM crmacct
    JOIN crmacct AS crmacct_child ON crmacct.crmacct_id = crmacct_child.crmacct_parent_id
    JOIN cntct AS child_cntct ON child_cntct.cntct_crmacct_id = crmacct_child.crmacct_id
    JOIN addr AS child_addr ON child_addr.addr_id = child_cntct.cntct_addr_id
    WHERE TRUE
  ) crmacct_child_crmacct_addr_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);