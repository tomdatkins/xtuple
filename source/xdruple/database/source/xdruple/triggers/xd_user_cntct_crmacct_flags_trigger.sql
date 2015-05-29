CREATE OR REPLACE FUNCTION xdruple._xd_user_cntct_crmacct_flags_trigger() RETURNS TRIGGER AS $$

  var accntSql = 'SELECT * FROM crmacct WHERE crmacct_id = $1',
      contact = plv8.execute('SELECT * FROM cntct WHERE cntct_id = $1;', [NEW.xd_user_contact_cntct_id])[0],
      address = plv8.execute('SELECT * FROM addr WHERE addr_id = $1;', [contact.cntct_addr_id])[0],
      convert_p2c = false,
      create_customer = false,
      create_prospect = false,
      crmacct,
      crmacct_is_customer = false,
      crmacct_is_prospect = false,
      crmacct_is_pguser = false,
      crmacct_number,
      customer,
      cust_payload = {},
      new_customer,
      new_prospect,
      new_shipto,
      new_user,
      new_username,
      p2cSql = 'SELECT convertprospecttocustomer($1)',
      params = [],
      prospect_payload = {},
      shipto_payload = {},
      username = plv8.execute('SELECT current_user AS username')[0].username,
      user_payload = {};

  /* Get crmacct if there is one for this Contact. */
  if (contact.cntct_crmacct_id) {
    params = [
      contact.cntct_crmacct_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', accntSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    crmacct = plv8.execute(accntSql, params)[0];
    crmacct_is_customer = crmacct.crmacct_cust_id;
    crmacct_is_prospect = crmacct.crmacct_prospect_id;
    crmacct_is_pguser = crmacct.crmacct_usr_username;
    crmacct_number = crmacct.crmacct_number;
    crmacct_name = crmacct.crmacct_name;
  }

  /* Take action based on `isCustomer`, `isProspect` and `isPgUser` flags. */
  if (!crmacct_is_prospect && !crmacct_is_customer && NEW.is_prospect && !NEW.is_customer) {
    create_prospect = true;
  }
  if (!crmacct_is_prospect && !crmacct_is_customer && NEW.is_customer && !NEW.is_prospect) {
    create_customer = true;
  }
  if (crmacct_is_prospect && !crmacct_is_customer && NEW.is_customer && !NEW.is_prospect) {
    convert_p2c = true;
  }

  /* Create a new Prospect. */
  if (create_prospect) {
    NEW.is_pguser = true;

    customer = XM.Customer.defaults();
    prospect_payload = {
      'username': username,
      'nameSpace':'XM',
      'type': 'Prospect',
      'data': {}
    };

    /* Create the Prospect and therefore CRM Account. */
    if (crmacct_number && crmacct_name) {
      prospect_payload.data.name = crmacct_name;
      prospect_payload.data.number = crmacct_number;
    } else {
      prospect_payload.data.name = contact.cntct_first_name + ' ' + contact.cntct_last_name;
      prospect_payload.data.number = contact.cntct_email.toUpperCase();
    }
    prospect_payload.data.contact = contact.cntct_number;
    prospect_payload.data.salesRep = customer.salesRep;
    prospect_payload.data.isActive = true;

    /* TODO: XM.Prospect should have a defaults() like XM.Customer and use site by nkey. */
    params = [
      'DefaultSellingWarehouseId'
    ];
    var siteSQL = 'SELECT fetchMetricValue($1) as metric_value';
    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', siteSQL);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }
    var preferredSite = plv8.execute(siteSQL, params)[0].metric_value;

    prospect_payload.data.site = preferredSite;

    /* POST the new Prospect with defaults set. */
    new_prospect = XT.Rest.post(prospect_payload);
    crmacct_number = new_prospect.id;
    crmacct_name = prospect_payload.data.name;
    new_username = new_prospect.id.toLowerCase();
  }

  /* Create a new Customer. */
  if (create_customer) {
    NEW.is_pguser = true;

    customer = XM.Customer.defaults();
    cust_payload = {
      'username': username,
      'nameSpace':'XM',
      'type': 'Customer'
    };
    shipto_payload = {
      'username': username,
      'nameSpace':'XM',
      'type': 'XdShipto'
    };

    /* Create the Customer and therefore CRM Account. */
    cust_payload.data = customer;
    if (crmacct_number && crmacct_name) {
      cust_payload.data.name = crmacct_name;
      cust_payload.data.number = crmacct_number;
    } else {
      cust_payload.data.name = contact.cntct_first_name + ' ' + contact.cntct_last_name;
      cust_payload.data.number = contact.cntct_email.toUpperCase();
    }
    cust_payload.data.billingContact = contact.cntct_number;
    cust_payload.data.isFreeFormBillto = true;
    cust_payload.data.isFreeFormShipto = true;

    /* POST the new Customer with defaults set. */
    new_customer = XT.Rest.post(cust_payload);
    crmacct_number = new_customer.id;
    crmacct_name = cust_payload.data.name;
    new_username = new_customer.id.toLowerCase();

    /* Create a Default Ship To for the Customer form the Contact and Address. */
    shipto_payload.data = {
      'customer': new_customer.id,
      'number': 'SHIP-TO-1',
      'name': 'Ship To 1',
      'isDefault': true,
      'contact': contact.cntct_number
    };

    if (address && address.addr_number) {
      shipto_payload.data.address = address.addr_number;
    }

    /* POST the new Ship To. */
    new_shipto = XT.Rest.post(shipto_payload);
  }

  /* Convert an existing Prospect to a Customer. */
  if (convert_p2c) {
    NEW.is_pguser = true;

    params = [
      crmacct.crmacct_prospect_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', p2cSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(p2cSql, params);
  }

  /* Create a new PostgreSQL User. */
  if (!crmacct_is_pguser && (NEW.is_pguser || crmacct_is_customer || crmacct_is_prospect) && crmacct_number && new_username) {
    user_payload = {
      'username': username,
      'nameSpace':'XM',
      'type': 'UserAccount'
    };

    /* Create a User Account. */
    user_payload.data = {
      'username': new_username,
      'properName': crmacct_name,
      'useEnhancedAuth': true,
      'disableExport': true,
      'isActive': true,
      'initials': crmacct_name.substring(0,2).toUpperCase(),
      'email': contact.cntct_email.toLowerCase(),
      'organization': XT.currentDb,
      'locale': 'Default',
      'isAgent': false
    };

    /* POST the new User Account. */
    new_user = XT.Rest.post(user_payload);
    new_username = new_user.id;

    /* Set the username on the CRM Account. */
    plv8.execute('UPDATE crmacct SET crmacct_usr_username = $1 WHERE crmacct_number = $2', [new_user.id, crmacct_number]);
  }

  /* Make sure the user has the `XDRUPLE` role no matter what action was taken above. */
  if (crmacct_is_pguser || new_username) {
    /* Set role/privs and ext for this user. */
    plv8.execute('SELECT xt.grant_user_role($1, $2)', [crmacct_is_pguser || new_username, 'XDRUPLE']);
  }

  /* Reset XT.username because the above calls to `XT.Rest.post()` will undefine it and the call*/
  /* to requery with data.retrieveRecord() in XT.Rest after this function finishes, will fail. */
  XT.username = username;

  return NEW;

$$ LANGUAGE plv8;
