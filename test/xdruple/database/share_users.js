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

    var loginData = require(path.join(__dirname, '../../lib/login_data.js')).data,
      datasource = require('../../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, '../../../../xtuple/node-datasource/config.js')),
      creds = config.databaseServer,
      databaseName = loginData.org,
      records = {
        "rep": {},
        "owner": {},
        "share": {},
        "child": {},
        "uom": {}
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
 * 8. Add StdOrdItems for new customer for both ship tos.
 * 9. Rep, Owner and New User can access StdOrdItems for both ship tos.
 * 10. Delete StdOrdItem. No cache share user uuid remains.
 * 11. Delete Ship To. Rep, Owner and New User cannot access old StdOrdItem.
 * 12. Ship To Child CRM Account Contact cannot access parent resources.
 * 13. Set Ship To Contact to Ship To Child CRM Account Contact.
 * 14. Ship To Child CRM Account Contact can access parent ship to resources:
 *     - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 * 15. Ship To Child CRM Account Contact cannot access to Parents Ship To2.
 * 16. Change Ship To Contact back to normal Contact.
 * 17. Ship To Child CRM Account Contact cannot access parent ship to resources.
 *     - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 * 18. Reset Ship To Contact to Ship To Child CRM Account Contact.
 * 19. Ship To Child CRM Account Contact can access parent ship to resources again:
 *     - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 * 20. Delete Ship To.
 * 21. Ship To Child CRM Account Contact cannot access parent ship to resoruces:
 *     - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 *
 * TODO: Shiphead Skip shiphead tests for now. It requires full issue to shipping, ship order, etc to get tracking.
 * 22. Skip. Can access shiphead.
 * 23. Skip. Delete shiphead.
 * 23. Skip. No shiphead uuids left in cache.
 *
 * 24. Tear down after tests.
 */

/**
 * Add records to use durring tests and store reference ids in records object.
 *
 * 1. Sales Rep with CRM Account and User Account.
 * 2. Owner with CRM Account and User Account.
 * 3. Basic Share User with CRM Account, User Account, Customer, Ship To, Contact and Address.
 * 4. Limited Ship To Child CRM Account and User Account.
 * 5. Setup and expose Products.
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
      datasource.query(postSalesRepSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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

      datasource.query(postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.rep.user = {
          "id": results.id
        };

        done();
      });
    });

    // Grant Rep User privs ViewPersonalCRMAccounts.
    before(function (done) {
      var grantUserPrivSql =  "select xt.grant_user_priv('" + records.rep.username + "', 'CRM', 'ViewPersonalCRMAccounts');";

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Rep XDRUPLE role.
    before(function (done) {
      var grantUserRoleSql =  "select xt.grant_user_role('" + records.rep.username + "', 'XDRUPLE');";

      datasource.query(grantUserRoleSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_role);

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

      datasource.query(postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Owner XDRUPLE role.
    before(function (done) {
      var grantUserRoleSql =  "select xt.grant_user_role('" + records.owner.username + "', 'XDRUPLE');";

      datasource.query(grantUserRoleSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_role);

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
      datasource.query(postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);
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
      datasource.query(postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);
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
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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
      datasource.query(customerDefaultsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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
        },
        {
          "number":"shipto3",
          "name":"ship to 3",
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
      datasource.query(postCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.shiptos[0].uuid);

        records.share.shipto = {
          'id': results.data.shiptos[0].number,
          'uuid': results.data.shiptos[0].uuid
        };
        records.share.shipto2 = {
          'id': results.data.shiptos[1].number,
          'uuid': results.data.shiptos[1].uuid
        };
        records.share.shipto3 = {
          'id': results.data.shiptos[2].number,
          'uuid': results.data.shiptos[2].uuid
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

      datasource.query(postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant user XDRUPLE role.
    before(function (done) {
      var grantUserRoleSql =  "select xt.grant_user_role('" + records.share.username + "', 'XDRUPLE');";

      datasource.query(grantUserRoleSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_role);

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

      datasource.query(postUserAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserPrivSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
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

      datasource.query(grantUserExtSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_ext);

        done();
      });
    });

    // Grant Limited Ship To Child User XDRUPLE role.
    before(function (done) {
      var grantUserRoleSql =  "select xt.grant_user_role('" + records.child.username + "', 'XDRUPLE');";

      datasource.query(grantUserRoleSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[1];
        assert.isTrue(results.grant_user_role);

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
      datasource.query(postAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);
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
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

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
 * Setup and expose Products.
 */
    // Delete StdOrdItems.
    before(function (done) {
      var deleteStdOrdItemsSql = "delete from xdruple.xd_stdorditem;";

      datasource.query(deleteStdOrdItemsSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete exposed xdruple.xd_commerce_product_data table records:
    before(function (done) {
      var deleteProductsSql = "delete from xdruple.xd_commerce_product_data;";

      datasource.query(deleteProductsSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete default dimension UOM:
    before(function (done) {
      var deleteUomSql =  "delete from uom where uom_name = 'IN';";

      datasource.query(deleteUomSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Add default dimension UOM:
    before(function (done) {
      var addUomSql = "insert into uom ( \n" +
                      "  uom_name, \n" +
                      "  uom_descrip, \n" +
                      "  uom_item_dimension \n" +
                      ") values ( \n" +
                      "  'IN', \n" +
                      "  'Inch', \n" +
                      "  true \n" +
                      ") returning uom_id;";

      datasource.query(addUomSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = res.rows[0];
        assert.isDefined(results.uom_id);

        records.uom.id = results.uom_id;

        done();
      });
    });

    // Populate the xdruple.xd_commerce_product_data table:
    before(function (done) {
      var populateProductsSql = "insert into xdruple.xd_commerce_product_data (item_id) ( \n" +
                                "  select \n" +
                                "    item_id \n" +
                                "  from item \n" +
                                "  where true \n" +
                                "    and item_sold \n" +
                                "    and item_active \n" +
                                "    and item_classcode_id in ( \n" +
                                "      select classcode_id \n" +
                                "      from classcode \n" +
                                "      where true \n" +
                                "        and classcode_code not ilike ('SERVICES%') \n" +
                                "    ) \n" +
                                "    and item_id not in ( \n" +
                                "      select item_id \n" +
                                "      from xdruple.xd_commerce_product_data \n" +
                                "    ) \n" +
                                ");";

      datasource.query(populateProductsSql, creds, function (err, res) {
        assert.isNull(err);

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

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getUserAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Default dimension UOM should exists.
    it('Default dimension UOM should exists', function (done) {
      var getUnitSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Unit", \n' +
                          '  "id":"IN", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getUnitSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.name);

        done();
      });
    });

    // Products should be exposed.
    it('Products should be exposed', function (done) {
      var getProductsSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdProduct", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getProductsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data[0]);

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

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
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

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

/**
 * Add StdOrdItems for new customer for both ship tos.
 */
    // Add StdOrdItem.
    it('can add StdOrdItem', function (done) {
      var postStdOrdItemsSql =  'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"XdStdOrdProduct", \n' +
                                '  "data":{ \n' +
                                '    "product":300, \n' +
                                '    "customer":"' + records.share.customer.id + '", \n' +
                                '    "shipto":"' + records.share.shipto.uuid + '" \n' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;
      datasource.query(postStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.share.stdOrdItem = {
          'id': results.id,
          'uuid': results.id
        };

        done();
      });
    });

    // Add StdOrdItem2.
    it('can add StdOrdItem2', function (done) {
      var postStdOrdItemsSql =  'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"XdStdOrdProduct", \n' +
                                '  "data":{ \n' +
                                '    "product":300, \n' +
                                '    "customer":"' + records.share.customer.id + '", \n' +
                                '    "shipto":"' + records.share.shipto2.uuid + '" \n' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;
      datasource.query(postStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.share.stdOrdItem2 = {
          'id': results.id,
          'uuid': results.id
        };

        done();
      });
    });

    // Add StdOrdItem3.
    it('can add StdOrdItem3', function (done) {
      var postStdOrdItemsSql =  'select xt.post($${ \n' +
                                '  "nameSpace":"XM", \n' +
                                '  "type":"XdStdOrdProduct", \n' +
                                '  "data":{ \n' +
                                '    "product":301, \n' +
                                '    "customer":"' + records.share.customer.id + '", \n' +
                                '    "shipto":"' + records.share.shipto.uuid + '" \n' +
                                '  }, \n' +
                                '  "username":"admin" \n' +
                                '}$$);';

      creds.database = databaseName;
      datasource.query(postStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.share.stdOrdItem3 = {
          'id': results.id,
          'uuid': results.id
        };

        done();
      });
    });

/**
 * Rep, Owner and New User can access StdOrdItems for both ship tos.
 */
    // Rep user can access StdOrdItems.
    it('New user can access StdOrdItems', function (done) {
      var getStdOrdItemsSql = 'select xt.get($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"XdStdOrdProduct", \n' +
                              '  "username":"' + records.rep.username + '" \n' +
                              '}$$);';

      datasource.query(getStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data[0]);
        assert.isDefined(results.data[1]);

        done();
      });
    });

    // Owner user can access StdOrdItems.
    it('New user can access StdOrdItems', function (done) {
      var getStdOrdItemsSql = 'select xt.get($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"XdStdOrdProduct", \n' +
                              '  "username":"' + records.owner.username + '" \n' +
                              '}$$);';

      datasource.query(getStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data[0]);
        assert.isDefined(results.data[1]);

        done();
      });
    });

    // New user can access StdOrdItems.
    it('New user can access StdOrdItems', function (done) {
      var getStdOrdItemsSql = 'select xt.get($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"XdStdOrdProduct", \n' +
                              '  "username":"' + records.share.username + '" \n' +
                              '}$$);';

      datasource.query(getStdOrdItemsSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data[0]);
        assert.isDefined(results.data[1]);

        records.share.stdOrdItem = {
          "uuid": results.data[0].uuid
        }
        records.share.stdOrdItem2 = {
          "uuid": results.data[1].uuid
        }

        done();
      });
    });

/**
 * Delete StdOrdItem. No cache share user uuid remains.
 */
    // Delete StdOrdItem item.
    it('can delete StdOrdItem', function (done) {
      var deleteStdOrdItemSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"XdStdOrdProduct", \n' +
                              '  "id":"' + records.share.stdOrdItem.uuid + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteStdOrdItemSql, creds, function (err, res) {
        done();
      });
    });

    // Make sure StdOrdItem xt.share_users entry is gone.
    it('xt.share_users view should not have matching UUID-to-username associations', function (done) {
      var checkUserAccessSql = "select obj_uuid, username from xt.share_users where obj_uuid = '"  + records.share.stdOrdItem.uuid + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

    // Make sure StdOrdItem xt.cache_share_users entry is gone.
    it('xt.cache_share_users table should not have matching StdOrdItem association', function (done) {
      var checkUserAccessSql = "select uuid, username from xt.cache_share_users where uuid = '"  + records.share.stdOrdItem.uuid + "';";

      datasource.query(checkUserAccessSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(0, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Delete Ship To. Rep, Owner and New User cannot access old StdOrdItem.
 */
    // Delete Ship To2.
    it('can delete Ship To 2', function (done) {
      var deleteShiptoSql = "delete from shiptoinfo where obj_uuid = '" + records.share.shipto2.uuid + "';";

      creds.database = databaseName;
      datasource.query(deleteShiptoSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Rep user should not have access to StdOrdItem2.
    it('Rep user should not have access to StdOrdItem2', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem2.uuid + '", \n' +
                          '  "username":"' + records.rep.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(400, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Owner user should not have access to StdOrdItem2.
    it('Owner user should not have access to StdOrdItem2', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem2.uuid + '", \n' +
                          '  "username":"' + records.owner.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(400, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user should not have access to StdOrdItem2.
    it('New user should not have access to StdOrdItem2', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem2.uuid + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(400, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // New user should have access to StdOrdItem3.
    it('New user should have access to StdOrdItem3', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.product);

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact cannot access parent resources.
 */
    // Ship To Child CRM Account User should not have access to Parent's Address.
    it('Ship To Child CRM Account User should not have access to Parents Address', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Address2.
    it('Ship To Child CRM Account User should not have access to Parents Address2', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact.
    it('Ship To Child CRM Account User should not have access to Parents Contact', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact2.
    it('Ship To Child CRM Account User should not have access to Parents Contact2', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Ship To.
    it('Ship To Child CRM Account User should not have access to Parents Ship To', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Customer.
    it('Ship To Child CRM Account User should not have access to Parents Customer', function (done) {
      var getCustomerSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdCustomer", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getCustomerSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to StdOrdItem3.
    it('Ship To Child CRM Account User should not have access to StdOrdItem3', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should  have access its Address.
    it('Ship To Child CRM Account User should have access its Address', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Address", \n' +
                            '  "id":"' + records.child.address3.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access it's Contact.
    it('Ship To Child CRM Account User should have access its Contact', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "id":"' + records.child.contact3.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

/**
 * Set Ship To Contact to Ship To Child CRM Account Contact.
 */
    // Get Ship To's new etag.
    it('Get Ship Tos new etag', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.share.shipto.etag = results.etag;

        done();
      });
    });

    // Patch Ship To set Ship To Contact to Ship To Child CRM Account Contact.
    it('Can patch Ship To set Ship To Contact to Ship To Child CRM Account Contact', function (done) {
      var patchShiptoSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdShipto", \n' +
                            '  "id":"' + records.share.shipto.uuid + '", \n' +
                            '  "etag":"' + records.share.shipto.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/contact", \n' +
                            '    "value":"' + records.child.contact3.id + '" \n' +
                            '  }], \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(patchShiptoSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact can access parent ship to resources:
 * - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 */
    // Ship To Child CRM Account User should have access its Parent's Customer.
    it('Ship To Child CRM Account User should have access its Parents Customer', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdCustomer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Address.
    it('Ship To Child CRM Account User should have access its Parent Address', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdAddress", \n' +
                            '  "id":"' + records.share.address.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Address2.
    it('Ship To Child CRM Account User should have access its Parent Address2', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdAddress", \n' +
                            '  "id":"' + records.share.address2.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Contact.
    it('Ship To Child CRM Account User should have access its Parent Contact', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdContact", \n' +
                            '  "id":"' + records.share.contact.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Contact2.
    it('Ship To Child CRM Account User should have access its Parent Contact2', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdContact", \n' +
                            '  "id":"' + records.share.contact2.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent Ship To.
    it('Ship To Child CRM Account User should have access its Parent Ship To', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.share.shipto.etag = results.etag;

        done();
      });
    });

    // Ship To Child CRM Account User should have access to StdOrdItem3.
    it('Ship To Child CRM Account User should have access to StdOrdItem3', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.product);

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact cannot access to Parents Ship To2.
 */
    // Ship To Child CRM Account Contact cannot access to Parents Ship To2.
    it('Ship To Child CRM Account User should not have access to Parents Ship To3', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Change Ship To Contact back to normal Contact.
 */
    // Get Ship To's new etag.
    it('Get Ship Tos new etag', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.share.shipto.etag = results.etag;

        done();
      });
    });

    // Patch Ship To set Ship To Contact back to normal CRM Account Contact.
    it('Can Ship To set Ship To Contact back to normal CRM Account Contact', function (done) {
      var patchShiptoSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdShipto", \n' +
                            '  "id":"' + records.share.shipto.uuid + '", \n' +
                            '  "etag":"' + records.share.shipto.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/contact", \n' +
                            '    "value":"' + records.share.contact.id + '" \n' +
                            '  }], \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(patchShiptoSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact cannot access parent ship to resources.
 * - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 */
    // Ship To Child CRM Account User should not have access to Parent's Address again.
    it('Ship To Child CRM Account User should not have access to Parents Address again', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Address2 again.
    it('Ship To Child CRM Account User should not have access to Parents Address2 again', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact again.
    it('Ship To Child CRM Account User should not have access to Parents Contact again', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact2 again.
    it('Ship To Child CRM Account User should not have access to Parents Contact2 again', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Ship To again.
    it('Ship To Child CRM Account User should not have access to Parents Ship To again', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Customer again.
    it('Ship To Child CRM Account User should not have access to Parents Customer again', function (done) {
      var getCustomerSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdCustomer", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getCustomerSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to StdOrdItem3 again.
    it('Ship To Child CRM Account User should not have access to StdOrdItem3 again', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 * Reset Ship To Contact to Ship To Child CRM Account Contact.
 */
    // Get Ship To's new etag.
    it('Get Ship Tos new etag', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.share.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.share.shipto.etag = results.etag;

        done();
      });
    });

    // Patch Ship To set Ship To Contact to Ship To Child CRM Account Contact again.
    it('Can patch Ship To set Ship To Contact to Ship To Child CRM Account Contact again', function (done) {
      var patchShiptoSql =  'select xt.patch($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdShipto", \n' +
                            '  "id":"' + records.share.shipto.uuid + '", \n' +
                            '  "etag":"' + records.share.shipto.etag + '", \n' +
                            '  "patches":[{ \n' +
                            '    "op":"replace", \n' +
                            '    "path":"/contact", \n' +
                            '    "value":"' + records.child.contact3.id + '" \n' +
                            '  }], \n' +
                            '  "username":"' + records.share.username + '" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(patchShiptoSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact can access parent ship to resources again:
 * - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 */
    // Ship To Child CRM Account User should have access its Parent's Customer.
    it('Ship To Child CRM Account User should have access its Parents Customer again', function (done) {
      var getCustomerSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdCustomer", \n' +
                            '  "id":"' + records.share.customer.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getCustomerSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Address.
    it('Ship To Child CRM Account User should have access its Parent Address again', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdAddress", \n' +
                            '  "id":"' + records.share.address.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Address2.
    it('Ship To Child CRM Account User should have access its Parent Address2 again', function (done) {
      var getAddressSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdAddress", \n' +
                            '  "id":"' + records.share.address2.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Contact.
    it('Ship To Child CRM Account User should have access its Parent Contact again', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdContact", \n' +
                            '  "id":"' + records.share.contact.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent's Contact2 again.
    it('Ship To Child CRM Account User should have access its Parent Contact2 again', function (done) {
      var getContactSql =  'select xt.get($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdContact", \n' +
                            '  "id":"' + records.share.contact2.id + '", \n' +
                            '  "username":"' + records.child.username + '" \n' +
                            '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        done();
      });
    });

    // Ship To Child CRM Account User should have access its Parent Ship To again.
    it('Ship To Child CRM Account User should have access its Parent Ship To again', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.share.shipto.etag = results.etag;

        done();
      });
    });

    // Ship To Child CRM Account User should have access to StdOrdItem3 again.
    it('Ship To Child CRM Account User should have access to StdOrdItem3 again', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.product);

        done();
      });
    });

/**
 * Delete Ship To.
 */
    // Delete Ship To.
    it('can delete Ship To', function (done) {
      var deleteShiptoSql = "delete from shiptoinfo where obj_uuid = '" + records.share.shipto.uuid + "';";

      creds.database = databaseName;
      datasource.query(deleteShiptoSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

/**
 * Ship To Child CRM Account Contact cannot access parent ship to resoruces:
 * - Customer, Billing Contact and Address, Correspondence Contact and Address, ShipTo, Ship To address, stdOrdItems.
 */
    // Ship To Child CRM Account User should not have access to Parent's Address anymore.
    it('Ship To Child CRM Account User should not have access to Parents Address anymore', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Address2 anymore.
    it('Ship To Child CRM Account User should not have access to Parents Address2 anymore', function (done) {
      var getAddressSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Address", \n' +
                          '  "id":"' + records.share.address2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getAddressSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact anymore.
    it('Ship To Child CRM Account User should not have access to Parents Contact anymore', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Contact2 anymore.
    it('Ship To Child CRM Account User should not have access to Parents Contact2 anymore', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.share.contact2.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Ship To anymore.
    it('Ship To Child CRM Account User should not have access to Parents Ship To anymore', function (done) {
      var getShiptoSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdShipto", \n' +
                          '  "id":"' + records.share.shipto.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getShiptoSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(400, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to Parent's Customer anymore.
    it('Ship To Child CRM Account User should not have access to Parents Customer anymore', function (done) {
      var getCustomerSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdCustomer", \n' +
                          '  "id":"' + records.share.customer.id + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getCustomerSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(401, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

    // Ship To Child CRM Account User should not have access to StdOrdItem3 anymore.
    it('Ship To Child CRM Account User should not have access to StdOrdItem3 anymore', function (done) {
      var getStdOrdItemSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdStdOrdProduct", \n' +
                          '  "id":"' + records.share.stdOrdItem3.uuid + '", \n' +
                          '  "username":"' + records.child.username + '" \n' +
                          '}$$);';

      datasource.query(getStdOrdItemSql, creds, function (err, res) {
        assert.isNotNull(err);
        assert.equal(400, err.status.code, JSON.stringify(err.status.code));

        done();
      });
    });

/**
 *  Can access shiphead.
 */
    // New user can access shiphead.
    it.skip('New user can access shiphead', function (done) {
        done();
    });

/**
 *  Delete shiphead.
 */
    it.skip('Delete shiphead', function (done) {
        done();
    });

/**
 *  No shiphead uuids left in cache.
 */
    it.skip('No shiphead uuids left in cache', function (done) {
        done();
    });

/**
 * Tear down after tests.
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
      datasource.query(deleteAccountSql, creds, function (err, res) {
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
      datasource.query(deleteCustomerSql, creds, function (err, res) {
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
      datasource.query(deleteAccountSql, creds, function (err, res) {
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
      datasource.query(deleteSalesRepSql, creds, function (err, res) {
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
      datasource.query(deleteAccountSql, creds, function (err, res) {
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
      datasource.query(deleteAccountSql, creds, function (err, res) {
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
      datasource.query(deleteAccountSql, creds, function (err, res) {
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
      datasource.query(deleteContactSql, creds, function (err, res) {
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
      datasource.query(deleteContactSql, creds, function (err, res) {
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
      datasource.query(deleteContactSql, creds, function (err, res) {
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
      datasource.query(deleteAddreeeSql, creds, function (err, res) {
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
      datasource.query(deleteAddreeeSql, creds, function (err, res) {
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
      datasource.query(deleteAddreeeSql, creds, function (err, res) {
        done();
      });
    });

    // Delete StdOrdItems.
    after(function (done) {
      var deleteStdOrdItemsSql = "delete from xdruple.xd_stdorditem;";

      datasource.query(deleteStdOrdItemsSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete exposed xdruple.xd_commerce_product_data table records:
    after(function (done) {
      var deleteProductsSql = "delete from xdruple.xd_commerce_product_data;";

      datasource.query(deleteProductsSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

    // Delete default dimension UOM:
    after(function (done) {
      var deleteUomSql =  "delete from uom where uom_name = 'IN';";

      datasource.query(deleteUomSql, creds, function (err, res) {
        assert.isNull(err);

        done();
      });
    });

  });
}());