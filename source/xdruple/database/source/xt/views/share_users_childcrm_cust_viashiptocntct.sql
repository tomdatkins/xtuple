/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Customer based on what Child CRM Account's Contact is on a
 * Ship To.
 */

select xt.create_view('xt.share_users_childcrm_cust_viashiptocntct', $$

-- Customer Child CRM Account's users.
  SELECT
    cust_child_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      custinfo.obj_uuid,
      crmacct_child.crmacct_id
    FROM crmacct AS crmacct_child
    JOIN crmacct ON crmacct.crmacct_id = crmacct_child.crmacct_parent_id
<<<<<<< HEAD
    JOIN custinfo ON cust_id = crmacct.crmacct_cust_id
    JOIN shiptoinfo ON shipto_cust_id = cust_id
    JOIN cntct ON cntct_id = shipto_cntct_id
    WHERE TRUE
      AND crmacct_child.crmacct_parent_id IS NOT NULL
      AND cntct_crmacct_id = crmacct_child.crmacct_id
=======
    JOIN custinfo ON custinfo.cust_id = crmacct.crmacct_cust_id
    JOIN shiptoinfo ON shiptoinfo.shipto_cust_id = custinfo.cust_id
    JOIN cntct ON cntct.cntct_id = shiptoinfo.shipto_cntct_id
    WHERE TRUE
      AND crmacct_child.crmacct_parent_id IS NOT NULL
      AND cntct.cntct_crmacct_id = crmacct_child.crmacct_id
>>>>>>> v4.5.2-xdruple
  ) cust_child_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
