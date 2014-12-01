create or replace function xdruple.xd_create_b2x_user() returns trigger as $$

return (function () {

  try {
    if ((TG_OP === 'INSERT' && NEW.xd_user_contact_create_new_cust) ||
        (TG_OP === 'UPDATE' && NEW.xd_user_contact_create_new_cust && !OLD.xd_user_contact_create_new_cust)
      ) {

      var username = plv8.execute('select current_user as username')[0].username,
        contact = plv8.execute("select * from cntct where cntct_id = $1;", [NEW.xd_user_contact_cntct_id])[0],
        address = plv8.execute("select * from addr where addr_id = $1;", [contact.cntct_addr_id])[0],
        customer = XM.Customer.defaults(),
        cust_payload = {
          "username": username,
          "nameSpace":"XM",
          "type": "Customer"
        },
        shipto_payload = {
          "username": username,
          "nameSpace":"XM",
          "type": "XdShipto"
        },
        user_payload = {
          "username": username,
          "nameSpace":"XM",
          "type": "UserAccount"
        };

      /* Create the Customer and therefore CRM Account. */
      cust_payload.data = customer;
      cust_payload.data.name = contact.cntct_first_name + " " + contact.cntct_last_name;
      cust_payload.data.number = contact.cntct_email.toUpperCase();
      cust_payload.data.billingContact = contact.cntct_number;
      cust_payload.data.isFreeFormBillto = TRUE;
      cust_payload.data.isFreeFormShipto = TRUE;

      /* TODO: Set CRM Account as individual? Defaults to Organization. */

      /* POST the new Customer with defaults set. */
      new_customer = XT.Rest.post(cust_payload);

      /* Create a Default Ship To for the Customer form the Contact and Address. */
      shipto_payload.data = {
        "customer": new_customer.id,
        "number": 'SHIP-TO-1',
        "name": 'Ship To 1',
        "isDefault": true,
        "contact": contact.cntct_number,
        "address": address.addr_number
      };

      /* POST the new Ship To. */
      new_shipto = XT.Rest.post(shipto_payload);

      /* Create a User Account. */
      user_payload.data = {
        "username": contact.cntct_email.toLowerCase(),
        "properName": contact.cntct_first_name + " " + contact.cntct_last_name,
        "useEnhancedAuth": true,
        "disableExport": true,
        "isActive": true,
        "initials": contact.cntct_first_name.substring(0,1).toUpperCase() + contact.cntct_last_name.substring(0,1).toUpperCase(),
        "email": contact.cntct_email.toLowerCase(),
        "organization": XT.currentDb,
        "locale": "Default",
        "isAgent": false
      };

      /* POST the new User Account. */
      new_user = XT.Rest.post(user_payload);

      /* Set the username on the CRM Account. */
      plv8.execute("update crmacct set crmacct_usr_username = $1 where crmacct_number = $2;", [new_user.id, new_customer.id]);

      /* Set role/privs and ext for this user. */
      plv8.execute("select xt.grant_user_role($1, $2)", [new_user.id, 'XDRUPLE']);

      return NEW;
    }
  } catch (err) {
    XT.error(err);
  }

}());

$$ language plv8;
