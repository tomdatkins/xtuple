/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require('underscore'),
  assert = require('chai').assert,
  path = require('path');

(function () {
  'use strict';
  describe('Test Share Users Access:', function () {
    this.timeout(10 * 1000);

    var initSql = 'select xt.js_init(); ',
      loginData = require(path.join(__dirname, '../../lib/login_data.js')).data,
      datasource = require('../../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, '../../../../xtuple/node-datasource/config.js')),
      creds = config.databaseServer,
      databaseName = loginData.org,
      records = {
        "rep": {},
        "owner": {},
        "share": {},
        "child": {}
      },
      utils = require('../../../../xtuple/node-datasource/oauth2/utils');

/**
 * Run all xDruple Share User Access tests.
 *
 * 1. Add records to use durring tests and store reference ids in records object.
 * 2. Check that all the records just created exist.
 * 3. Set Customer Rep which will grant Rep user share user access.
 * 4. Set CRM Account Owner which will grant Owner user share user access.
 * 5. Set CRM Account user which will grant new user share user access.
 * 6. Set Limited Ship To Child CRM Account's parent which will grant Parent share user access.
 * 7. Test Parent CRM Account user can access Child CRM Account Contact and Address.
 *
 *
 * TODO: StdOrdItem tests:
     Add StdOrdItems for new customer for both ship tos.
     New User, Rep and Owner can access StdOrdItems for both ship tos.
     Delete StdOrdItem. No cache share user uuid remains.
     Delete Ship To.
     New User, Rep and Owner cannot access old StdOrdItems.
 * TODO: Ship To Child CRM Account Contact limited user tests:
     Cannot access parent resources.
     Set ship to contact to child.
     Can access parent ship to resources:
      - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
     Cannot access other parent resources:
      - Second Ship To, Contact, Address.
     Change Ship To Contact.
     Cannot access parent ship to resources.
      - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
     Reset Ship To Contact to child CRM Account.
     Can access parent ship to resources:
      - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
     Delete Ship To.
     Cannot access parent ship to resoruces:
      - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 * TODO: Shiphead
     Skip. shiphead tests for now. It requires full issue to shipping, ship order, etc to get tracking.
     Can access shiphead.
     Delete shiphead, no uuids left in cache.
 *
 * 30. Tear down after tests.
 */

/**
 * Add records to use durring tests and store reference ids in records object.
 *
 * 1. Sales Rep with CRM Account and User Account.
 * 2. Owner with CRM Account and User Account.
 * 3. Basic Share User with CRM Account, User Account, Customer, Ship To, Contact and Address.
 * 4. Limited Ship To Child CRM Account and User Account.
 */

/**
 * Sales Rep with CRM Account and User Account.
 */
    // Add Sales Rep.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random Rep Number.
        postSalesRepSql =  'select xt.post($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesRep", \n' +
                          '  "data":{ \n' +
                          '    "isActive":true, \n' +
                          '    "commission":0.10, \n' +
                          '    "number":"' + username.toUpperCase() + '", \n' +
                          '    "postalCode":"12345", \n' +
                          '    "name":"Sales Rep" \n' +
                          '  }, \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postSalesRepSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.rep.salesRep = {
          'id': results.id
        };
        records.rep.account = {
          "id": results.id
        };
        records.rep.username = username;

        done();
      });
    });

    // Add Rep UserAccount which will also create a CRM Account.
    before(function (done) {
      var postUserAccountSQL =  'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"UserAccount", \n' +
                                '  "data":{ \n' +
                                '    "username": "' + records.rep.username + '", \n' +
                                '    "properName": "Sales Rep", \n' +
                                '    "useEnhancedAuth": true, \n' +
                                '    "disableExport": true, \n' +
                                '    "isActive": true, \n' +
                                '    "initials": "SR", \n' +
                                '    "email": "rep@example.com", \n' +
                                '    "organization": "' + creds.database + '", \n' +
                                '    "locale": "Default", \n' +
                                '    "isAgent": false ' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.rep.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant Rep User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Rep User extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.rep.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Rep User extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.rep.username + "', 'sales');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

/**
 * Owner with CRM Account and User Account.
 */
    // Add Owner UserAccount which will also create a CRM Account.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random Account Number.
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + username + '", \n' +
                              '    "properName": "Account Owner", \n' +
                              '    "useEnhancedAuth": true, \n' +
                              '    "disableExport": true, \n' +
                              '    "isActive": true, \n' +
                              '    "initials": "AO", \n' +
                              '    "email": "ownerp@example.com", \n' +
                              '    "organization": "' + creds.database + '", \n' +
                              '    "locale": "Default", \n' +
                              '    "isAgent": false ' +
                              '  }, \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.owner.user = {
          "id": results.id
        };
        records.owner.account = {
          "id": results.id.toUpperCase()
        };
        records.owner.username = username;

        done();
      });
    });

    // Grant Owner User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.owner.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Owner User extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.owner.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Owner User extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.owner.username + "', 'sales');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

/**
 * Basic Share User with CRM Account, User Account, Customer, Ship To, Contact and Address.
 */
    // Add Address.
    before(function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"1 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"12345", \n' +
                            '    "country":"United States" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.share.address = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address UUID.
    before(function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address.uuid = results.obj_uuid;

        done();
      });
    });

    // Add Address2.
    before(function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"2 Share Dr.", \n' +
                            '    "city":"Sharetown", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"22222", \n' +
                            '    "country":"United States" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.share.address2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Address2 UUID.
    before(function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.share.address2.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.address2.uuid = results.obj_uuid;

        done();
      });
    });

    // Add Contact.
    before(function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Share", \n' +
                            '    "middleName":"Access", \n' +
                            '    "lastName":"User", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"shareuser@example.com", \n' +
                            '    "address":"' + records.share.address.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.contact = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact UUID.
    before(function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.share.contact.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.contact.uuid = results.obj_uuid;

        done();
      });
    });

    // Add Contact2.
    before(function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Share2", \n' +
                            '    "lastName":"User2", \n' +
                            '    "suffix":"Sr.", \n' +
                            '    "primaryEmail":"shareuser2@example.com", \n' +
                            '    "address":"' + records.share.address2.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.contact2 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Contact2 UUID.
    before(function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.share.contact2.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.contact2.uuid = results.obj_uuid;

        done();
      });
    });

    // Get Customer defaults.
    before(function (done) {
      var customerDefaultsSql = 'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"Customer", \n' +
                                '  "dispatch":{ \n' +
                                '    "functionName":"defaults" \n' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + customerDefaultsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.customerDefults = results;

        done();
      });
    });

    // Add Customer which also creates a CRM Account.
    before(function (done) {
      var custNumber = utils.generateUUID(), // UUID as random Customer Number.
        data = _.clone(records.share.customerDefults);

      data.name = 'Share User';
      data.number = custNumber.toUpperCase();
      data.billingContact = records.share.contact.id;
      data.correspondenceContact = records.share.contact2.id;

      // Add Ship To.
      data.shiptos = [
        {
          "number":"shipto1",
          "name":"ship to 1",
          "isActive":true,
          "isDefault":false,
          "salesRep":records.rep.salesRep.id,
          "shipZone":null,
          "taxZone":null,
          "shipCharge":"ADDCHARGE",
          "contact":records.share.contact.id,
          "address":records.share.address.id,
          "commission":0.075,
          "shipVia":"UPS-GROUND-UPS Ground"
        },
        {
          "number":"shipto2",
          "name":"ship to 2",
          "isActive":true,
          "isDefault":false,
          "salesRep":records.rep.salesRep.id,
          "shipZone":null,
          "taxZone":null,
          "shipCharge":"ADDCHARGE",
          "contact":records.share.contact2.id,
          "address":records.share.address2.id,
          "commission":0.075,
          "shipVia":"UPS-GROUND-UPS Ground"
        }
      ];

      var postCustomerSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.customer = {
          'id': results.id
        };

        done();
      });
    });

    // Get Customer UUID.
    before(function (done) {
      var getCustomerSql =  "select obj_uuid from custinfo where cust_number = '" + records.share.customer.id + "';";

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.share.customer.uuid = results.obj_uuid;

        done();
      });
    });

    // Get Ship To ID and UUID.
    before(function (done) {
      var getShiptoSql =  'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Customer", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.shiptos[0].uuid);

        records.share.shipto = {
          'id': results.data.shiptos[0].number,
          'uuid': results.data.shiptos[0].uuid
        };
        records.share.shipto2 = {
          'id': results.data.shiptos[1].number,
          'uuid': results.data.shiptos[1].uuid
        };

        done();
      });
    });

    // Add user.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random username.
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + username + '", \n' +
                              '    "properName": "Share User", \n' +
                              '    "useEnhancedAuth": true, \n' +
                              '    "disableExport": true, \n' +
                              '    "isActive": true, \n' +
                              '    "initials": "SU", \n' +
                              '    "email": "shareuser@example.com", \n' +
                              '    "organization": "' + creds.database + '", \n' +
                              '    "locale": "Default", \n' +
                              '    "isAgent": false ' +
                              '  }, \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.share.username = username;
        records.share.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant user privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.share.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant user extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.share.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant user extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.share.username + "', 'sales');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

/**
 * Limited Ship To Child CRM Account and User Account.
 */
    // Add Limited Ship To Child UserAccount which will also create a CRM Account.
    before(function (done) {
      var username = utils.generateUUID(), // UUID as random Account Number.
        postUserAccountSQL =  'select xt.post($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "data":{ \n' +
                              '    "username": "' + username + '", \n' +
                              '    "properName": "Child Account", \n' +
                              '    "useEnhancedAuth": true, \n' +
                              '    "disableExport": true, \n' +
                              '    "isActive": true, \n' +
                              '    "initials": "CA", \n' +
                              '    "email": "child@example.com", \n' +
                              '    "organization": "' + creds.database + '", \n' +
                              '    "locale": "Default", \n' +
                              '    "isAgent": false ' +
                              '  }, \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;

      datasource.query(initSql + postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.child.user = {
          "id": results.id
        };
        records.child.account = {
          "id": results.id.toUpperCase()
        };
        records.child.username = username;

        done();
      });
    });

    // Grant Limited Ship To Child User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.child.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Limited Ship To Child User privs MaintainPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.child.username + "', 'CRM', 'MaintainPersonalCRMAccounts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Limited Ship To Child User privs ViewPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.child.username + "', 'CRM', 'ViewPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Limited Ship To Child User privs MaintainPersonalContacts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.child.username + "', 'CRM', 'MaintainPersonalContacts');";

      datasource.query(initSql + grantUserPrivSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_priv);

        done();
      });
    });

    // Grant Limited Ship To Child User extension crm.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.child.username + "', 'crm');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Limited Ship To Child User extension sales.
    before(function (done) {
      var grantUserExtSql =  "select xt.grant_user_ext('" + records.child.username + "', 'sales');";

      datasource.query(initSql + grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Add Limited Ship To Child Address3.
    before(function (done) {
      var postAddressSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "data":{ \n' +
                            '    "line1":"3 Child Ln.", \n' +
                            '    "city":"Childton", \n' +
                            '    "state":"VA", \n' +
                            '    "postalCode":"33333", \n' +
                            '    "country":"United States" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        records.child.address3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Limited Ship To Child Address3 UUID.
    before(function (done) {
      var getAddressSql =  "select obj_uuid from addr where addr_number = '" + records.child.address3.id + "';";

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.child.address3.uuid = results.obj_uuid;

        done();
      });
    });

    // Add Limited Ship To Child Contact3.
    before(function (done) {
      var postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "firstName":"Child", \n' +
                            '    "lastName":"Account", \n' +
                            '    "primaryEmail":"child@example.com", \n' +
                            '    "address":"' + records.child.address3.id + '", \n' +
                            '    "account":"' + records.child.account.id + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);

        records.child.contact3 = {
          'id': results.id
        };

        done();
      });
    });

    // Get Limited Ship To Child Contact3 UUID.
    before(function (done) {
      var getContactSql =  "select obj_uuid from cntct where cntct_number = '" + records.child.contact3.id + "';";

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.obj_uuid);

        records.child.contact3.uuid = results.obj_uuid;

        done();
      });
    });

/**
 * Check that all the records just created exist.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
    // Rep exists.
    it('Rep CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"SalesRep", \n' +
                          '  "id":"' + records.rep.salesRep.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Rep CRM Account exists.
    it('Rep CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.rep.account.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Owner CRM Account exists.
    it('Owner CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.owner.account.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Address exists.
    it('Address should exist', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Address2 exists.
    it('Address2 should exist', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address2.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Contact exists.
    it('Contact should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Contact2 exists.
    it('Contact2 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact2.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Customer exists.
    it('Customer should exist', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Customer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      datasource.query(initSql + getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        records.share.customer.etag = results.etag;

        done();
      });
    });

    // Ship To exists.
    it('Ship To should exist', function (done) {
      var getShiptoSql = "select shipto_num from shiptoinfo where obj_uuid = '"  + records.share.shipto.uuid + "';";

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.shipto_num);

        done();
      });
    });

    // CRM Account exists.
    it('CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // User exists.
    it('User should exist', function (done) {
      var getUserAccountSql = 'select xt.get($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"UserAccount", \n' +
                              '  "id":"' + records.share.user.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      datasource.query(initSql + getUserAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.username);

        done();
      });
    });

    // Limited Ship To Child CRM Account exists.
    it('Limited Ship To Child CRM Account should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.child.account.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Limited Ship To Child Address3 exists.
    it('Limited Ship To Child Address3 should exist', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.child.address3.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Limited Ship To Child Contact3 exists.
    it('Limited Ship To Child Contact should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.child.contact3.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

/**
 * Set Customer Rep which will grant Rep user share user access.
 */
    it('can associate Rep user with new Customer', function (done) {
      var associateUserSql = "update custinfo set \n" +
                             "  cust_salesrep_id = (select salesrep_id from salesrep where salesrep_number = '" + records.rep.salesRep.id + "') \n" +
                             "where cust_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Set CRM Account Owner which will grant Owner user share user access.
 */
    it('can associate Owner user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_owner_username = '" + records.owner.user.id + "' where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Set CRM Account user which will grant new user share user access.
 */
    it('can associate new user with new CRM Account', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = '" + records.share.user.id + "' where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Set Limited Ship To Child CRM Account's parent which will grant Parent share user access.
 */
    it('can associate Limited Ship To Child CRM Account with parent CRM Account', function (done) {
      var associateUserSql = "update crmacct set \n" +
                             "  crmacct_parent_id = (select crmacct_id from crmacct where crmacct_number = '" + records.share.customer.id + "') \n" +
                             "where crmacct_number = '" + records.child.account.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Test Parent CRM Account user can access Child CRM Account Contact and Address.
 */
    // Test Parent CRM Account access to Limited Ship To Child CRM Account's Address.
    it('Parent CRM Account should have access to Limited Ship To Child CRM Accounts Address', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.child.address3.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Test Parent CRM Account access to Limited Ship To Child CRM Account's Contact.
    it('Parent CRM Account should have access to Limited Ship To Child CRM Accounts Contact', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.child.contact3.id + '", \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      datasource.query(initSql + getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isDefined(results.data.number);

        done();
      });
    });


/**
 * Add StdOrdItems for new customer for both ship tos.
 */

 //select xt.post($${"nameSpace":"XM","type":"XdStdOrdProduct","data":{"product":7816,"customer":"BLOOSCH","shipto":"4cbfdfb1-e814-4cb1-e564-1c936a878a30"},"username":"admin","encryptionKey":"xTuple.key"}$$)

/**
 * New User, Rep and Owner can access StdOrdItems for both ship tos.
 */

 //select xt.get($${"nameSpace":"XM","type":"XdCatalogShiptoStdOrd","query":{"parameters":[{"attribute":"shipto","operator":"=","value":"4cbfdfb1-e814-4cb1-e564-1c936a878a30"}],"orderBy":[],"rowLimit":100},"username":"admin","encryptionKey":"xTuple.key"}$$)

/**
 * Delete StdOrdItem. No cache share user uuid remains.
 */
//select xt.delete($${"nameSpace":"XM","type":"XdStdOrdProduct","id":"3610df1c-7e94-4b97-b865-363a6207e87b","username":"admin","encryptionKey":"xTuple.key"}$$)


/**
 * Delete Ship To.
 */


/**
 * New User, Rep and Owner cannot access old StdOrdItems.
 */





/**
 * Tear down after tests.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
    // Remove user from Limited Ship To Child CRM Account so it can be deleted.
    it('Can remove CRM Account user', function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.child.account.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete Limited Ship To Child CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.child.account.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Limited Ship To Child CRM User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.child.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.child.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.child.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.child.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.child.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.child.user.id + "'; \n" +
                                  'drop role "' + records.child.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer.
    after(function (done) {
      var deleteCustomerSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.share.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteCustomerSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from CRM Account so it can be deleted.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.share.customer.id + "';";

      datasource.query(associateUserSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.share.customer.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete New User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.share.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.share.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.share.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.share.user.id + "'; \n" +
                                  'drop role "' + records.share.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete the Sales Rep.
    after(function (done) {
      var deleteSalesRepSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"SalesRep", \n' +
                              '  "id":"' + records.rep.salesRep.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteSalesRepSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Rep User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.rep.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.rep.user.id + "'; \n" +
                                  'drop role "' + records.rep.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Owner User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.owner.user.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.owner.user.id + "'; \n" +
                                  'drop role "' + records.owner.user.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Rep CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.rep.account.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Owner CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.owner.account.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete New User CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.share.username.toUpperCase() + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAccountSql, creds, function (err, res) {
        done();
      });
    });


    // Delete Contact.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.share.contact.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact2.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.share.contact2.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Limited Ship To Child CRM Account's Contact3.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.child.contact3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Address.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.share.address.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Address2.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.share.address2.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Limited Ship To Child CRM Account's Address3.
    after(function (done) {
      var deleteAddreeeSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Address", \n' +
                              '  "id":"' + records.child.address3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(initSql + deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

  });
}());
