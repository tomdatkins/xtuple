/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to Standard Order Items based on what Child CRM Account's Contact
 * is on a Ship To.
 */

select xt.create_view('xdruple.xd_share_users_childcrm_stdorditem_viashiptocntct', $$

-- Ship To's Standard Order Items Child CRM Account's users.
  SELECT
    stdorditem_child_crmacct_ids.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM (
    SELECT
      xd_stdorditem.obj_uuid,
      crmacct_child.crmacct_id
    FROM crmacct AS crmacct_child
    JOIN crmacct ON crmacct.crmacct_id = crmacct_child.crmacct_parent_id
    JOIN shiptoinfo ON shiptoinfo.shipto_cust_id = crmacct.crmacct_cust_id
    JOIN xdruple.xd_stdorditem ON xd_stdorditem.xd_stdorditem_shipto_id = shiptoinfo.shipto_id
    JOIN cntct ON cntct.cntct_id = shiptoinfo.shipto_cntct_id
    WHERE TRUE
      AND crmacct_child.crmacct_parent_id IS NOT NULL
      AND cntct_crmacct_id = crmacct_child.crmacct_id
  ) stdorditem_child_crmacct_ids
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);