/*
 * This view lists all postgres usernames that are associated with a CRM
 * Account that owns a resource. That associaiton is either the main user
 * account, owner's user account, customer's sale rep's user account or
 * a shared access that has been specifically granted.
 *
 * This view can be used to determine which users have personal privilege
 * access to a Ship To's Standard Order Items based on what CRM Account it
 * belongs to.
 */

select xt.create_view('xdruple.xd_share_users_stdorditem', $$

  -- Ship To's Standard Order Items CRM Account's users.
  SELECT
    xd_stdorditem.obj_uuid::uuid AS obj_uuid,
    username::text AS username
  FROM xdruple.xd_stdorditem
  LEFT JOIN shiptoinfo ON shiptoinfo.shipto_id = xd_stdorditem.xd_stdorditem_shipto_id
  JOIN crmacct ON shiptoinfo.shipto_cust_id = crmacct.crmacct_cust_id
  LEFT JOIN xt.crmacct_users USING (crmacct_id)
  WHERE 1=1
    AND username IS NOT NULL;

$$, false);
