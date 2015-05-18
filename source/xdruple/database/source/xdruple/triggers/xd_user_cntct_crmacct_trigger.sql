CREATE OR REPLACE FUNCTION xdruple._xd_user_cntct_crmacct_trigger() RETURNS TRIGGER AS $$

  var accntSql = 'SELECT * FROM crmacct WHERE crmacct_id = $1',
      address,
      contact,
      convert_p2c = false,
      create_customer = false,
      create_prospect = false,
      create_pguser = false,
      crmacct,
      crmacct_number,
      customer,
      cust_payload = {},
      deletSql = 'DELETE FROM xdruple.xd_user_contact WHERE xd_user_contact_id = $1;',
      insertSql = 'INSERT INTO xdruple.xd_user_contact ( ' +
                  '  xd_user_contact_site_id, ' +
                  '  xd_user_contact_drupal_user_uuid, ' +
                  '  xd_user_contact_cntct_id ' +
                  ') VALUES ( ' +
                  '  $1, ' +
                  '  $2, ' +
                  '  $3 ' +
                  ')',
      new_username,
      p2cSql = 'SELECT convertprospecttocustomer($1)',
      params = [],
      prospect_payload = {},
      shipto_payload = {},
      updateSql = 'UPDATE xdruple.xd_user_contact SET ' +
                  '  xd_user_contact_site_id = $1, ' +
                  '  xd_user_contact_drupal_user_uuid = $2, ' +
                  '  xd_user_contact_cntct_id = $3 ' +
                  'WHERE xd_user_contact_id = $4',
      username = plv8.execute('select current_user as username')[0].username,
      user_payload = {};

  /* Take action based on `isCustomer`, `isProspect` and `isPgUser` flags. */
  if (TG_OP === 'INSERT' || TG_OP === 'UPDATE') {
    contact = plv8.execute("select * from cntct where cntct_id = $1;", [NEW.xd_user_contact_cntct_id])[0];
    address = plv8.execute("select * from addr where addr_id = $1;", [contact.cntct_addr_id])[0];
    new_username = contact.cntct_email.toLowerCase();

    if (TG_OP === 'INSERT') {
      if (NEW.is_prospect && !NEW.is_customer) {
        create_prospect = true;
      }
      if (NEW.is_customer && !NEW.is_prospect) {
        create_customer = true;
      }
      if (NEW.is_pguser) {
        create_pguser = true;
      }
    }

    if (TG_OP === 'UPDATE') {
      if (NEW.is_prospect && !OLD.is_prospect && !NEW.is_customer && !OLD.is_customer) {
        create_prospect = true;
      }
      if (NEW.is_customer && !OLD.is_customer && !NEW.is_prospect && !OLD.is_prospect) {
        create_customer = true;
      }
      if (NEW.is_customer && !OLD.is_customer && !NEW.is_prospect && OLD.is_prospect) {
        convert_p2c = true;
      }
      if (NEW.is_pguser && !OLD.is_pguser) {
        create_pguser = true;
      }
    }

    /* Create a new Prospect. */
    if (create_prospect) {
      NEW.is_pguser = true;

      customer = XM.Customer.defaults();
      prospect_payload = {
        "username": username,
        "nameSpace":"XM",
        "type": "Prospect",
        "data": {}
      };

      /* Create the Prospect and therefore CRM Account. */
      prospect_payload.data.name = contact.cntct_first_name + " " + contact.cntct_last_name;
      prospect_payload.data.number = contact.cntct_email.toUpperCase();
      prospect_payload.data.contact = contact.cntct_number;
      prospect_payload.data.salesRep = customer.salesRep;
      prospect_payload.data.isActive = true;

      /* TODO: XM.Prospect should have a defaults() like XM.Customer and use site by nkey. */
      params = [
        'DefaultSellingWarehouseId'
      ];
      var siteSQL = "SELECT metric_value FROM metric WHERE metric_name = $1";
      if (DEBUG) {
        XT.debug('_xd_user_cntct_crmacct_trigger sql =', siteSQL);
        XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
      }
      preferredSite = plv8.execute(siteSQL, params)[0].metric_value;

      prospect_payload.data.site = preferredSite;

      /* POST the new Prospect with defaults set. */
      new_prospect = XT.Rest.post(prospect_payload);
      crmacct_number = new_prospect.id;
      new_username = new_prospect.id.toLowerCase();
    }

    /* Create a new Customer. */
    if (create_customer) {
      NEW.is_pguser = true;

      customer = XM.Customer.defaults();
      cust_payload = {
        "username": username,
        "nameSpace":"XM",
        "type": "Customer"
      };
      shipto_payload = {
        "username": username,
        "nameSpace":"XM",
        "type": "XdShipto"
      };

      /* Create the Customer and therefore CRM Account. */
      cust_payload.data = customer;
      cust_payload.data.name = contact.cntct_first_name + " " + contact.cntct_last_name;
      cust_payload.data.number = contact.cntct_email.toUpperCase();
      cust_payload.data.billingContact = contact.cntct_number;
      cust_payload.data.isFreeFormBillto = true;
      cust_payload.data.isFreeFormShipto = true;

      /* POST the new Customer with defaults set. */
      new_customer = XT.Rest.post(cust_payload);
      crmacct_number = new_customer.id;
      new_username = new_customer.id.toLowerCase();

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
    }

    /* Convert an existing Prospect to a Customer. */
    if (convert_p2c) {
      NEW.is_pguser = true;

      /* Get crmacct_prospect_id. */
      params = [
        NEW.crmacct_id
      ];

      if (DEBUG) {
        XT.debug('_xd_user_cntct_crmacct_trigger sql =', accntSql);
        XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
      }

      crmacct = plv8.execute(accntSql, params)[0];
      crmacct_number = crmacct.crmacct_number;
      new_username = crmacct.crmacct_number.toLowerCase();

      /* Convert Prospect to Customer. */
      params = [
        crmacct.crmacct_prospect_id
      ];

      if (DEBUG) {
        XT.debug('_xd_user_cntct_crmacct_trigger sql =', p2cSql);
        XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
      }

      plv8.execute(p2cSql, params);
    }

    if (TG_OP === 'INSERT') {
      if (NEW.is_pguser) {
        create_pguser = true;
      }
    }

    if (TG_OP === 'UPDATE') {
      if (NEW.is_pguser && !OLD.is_pguser) {
        create_pguser = true;
      }
    }

    /* Create a new PostgreSQL User. */
    if (create_pguser) {
      user_payload = {
        "username": username,
        "nameSpace":"XM",
        "type": "UserAccount"
      };

      /* Create a User Account. */
      user_payload.data = {
        "username": new_username,
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
      plv8.execute("update crmacct set crmacct_usr_username = $1 where crmacct_number = $2;", [new_user.id, crmacct_number]);

      /* Set role/privs and ext for this user. */
      plv8.execute("select xt.grant_user_role($1, $2)", [new_user.id, 'XDRUPLE']);
    }
  }

  /* Reset XT.username because the above calls to `XT.Rest.post()` will undefine it and the call*/
  /* to requery with data.retrieveRecord() in XT.Rest after this function finishes, will fail. */
  XT.username = username;

  /* Persist the change to the xdruple.xd_user_contact table. */
  if (TG_OP === 'INSERT') {
    params = [
      NEW.xd_user_contact_site_id,
      NEW.xd_user_contact_drupal_user_uuid,
      NEW.xd_user_contact_cntct_id,
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', insertSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(insertSql, params);
    return NEW;
  } else if (TG_OP === 'UPDATE') {
    params = [
      NEW.xd_user_contact_site_id,
      NEW.xd_user_contact_drupal_user_uuid,
      NEW.xd_user_contact_cntct_id,
      OLD.xd_user_contact_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', updateSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(updateSql, params);
    return NEW;
  } else if (TG_OP === 'DELETE') {
    params = [
      OLD.xd_user_contact_id
    ];

    if (DEBUG) {
      XT.debug('_xd_user_cntct_crmacct_trigger sql =', deletSql);
      XT.debug('_xd_user_cntct_crmacct_trigger values =', params);
    }

    plv8.execute(deletSql, params);
    return OLD;
  }

$$ LANGUAGE plv8;
