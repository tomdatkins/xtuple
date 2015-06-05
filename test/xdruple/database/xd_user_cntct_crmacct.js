/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require('underscore'),
  assert = require('chai').assert,
  path = require('path');

(function () {
  'use strict';
  describe('Test XdUserContactAccount:', function () {
    this.timeout(10 * 1000);

    var loginData = require(path.join(__dirname, '../../lib/login_data.js')).data,
      datasource = require('../../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, '../../../../xtuple/node-datasource/config.js')),
      creds = config.databaseServer,
      databaseName = loginData.org,
      records = {},
      utils = require('../../../../xtuple/node-datasource/oauth2/utils');

/**
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * Add records to use durring tests and store reference ids in records object.
 *
 * 1. Contact 1 without CRM Account.
 * 2. Contact 2 without CRM Account.
 * 3. Contact 3 without CRM Account.
 * 4. Contact 4 without CRM Account.
 * 5. Contact 5 without CRM Account.
 * 6. Contact 6 without CRM Account.
 * 7. CRM Account with Contact 4.
 * 8. CRM Account with Contact 5 and a Prospect.
 * 9. CRM Account with Contact 6 and a Customer.
 * 10. xDruple Site.
 *
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 */

/**
 * Contact 1 without CRM Account.
 */
    // Add Contact 1.
    before(function (done) {
      var primaryEmail = "contact1" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"One", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact1 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Contact 2 without CRM Account.
 */
    // Add Contact 2.
    before(function (done) {
      var primaryEmail = "contact2" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"Two", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact2 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Contact 3 without CRM Account.
 */
    // Add Contact 3.
    before(function (done) {
      var primaryEmail = "contact3" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"Three", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact3 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Contact 4 without CRM Account.
 */
    // Add Contact 4.
    before(function (done) {
      var primaryEmail = "contact4" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"Four", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact4 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Contact 5 without CRM Account.
 */
    // Add Contact 5.
    before(function (done) {
      var primaryEmail = "contact5" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"Five", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact5 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Contact 6 without CRM Account.
 */
    // Add Contact 6.
    before(function (done) {
      var primaryEmail = "contact6" + utils.generateUUID() + "@example.com",
          postContactSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Contact", \n' +
                            '  "data":{ \n' +
                            '    "isActive":true, \n' +
                            '    "owner":"admin", \n' +
                            '    "honorific":"Mr.", \n' +
                            '    "firstName":"Contact", \n' +
                            '    "lastName":"Six", \n' +
                            '    "suffix":"Jr.", \n' +
                            '    "primaryEmail":"' + primaryEmail + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.contact6 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * CRM Account with Contact 4.
 */
    // Add CRM Account.
    before(function (done) {
      var accountNumber = utils.generateUUID().toUpperCase(), // UUID as random Prospect Number.
          postAccountSQL =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Account", \n' +
                            '  "data":{ \n' +
                            '    "number": "' + accountNumber + '", \n' +
                            '    "name": "Account4", \n' +
                            '    "isActive": true, \n' +
                            '    "primaryContact": "' + records.contact4.id + '", \n' +
                            '    "accountType": "O",  \n' +
                            '    "owner": "admin" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;

      datasource.query(postAccountSQL, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.account4 = {
          "id": results.id
        };

        done();
      });
    });

/**
 * CRM Account with Contact 5 and a Prospect.
 */
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

        records.customerDefults = results;

        done();
      });
    });

    // Add Prospect which also creates a CRM Account.
    before(function (done) {
      var prospectNumber = utils.generateUUID(), // UUID as random Prospect Number.
        data = _.clone(records.customerDefults);

      data.name = 'Prospect6';
      data.number = prospectNumber.toUpperCase();
      data.contact = records.contact5.id;
      data.salesRep = records.customerDefults.salesRep;
      data.isActive = true;

      var postProspectSql = 'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"Prospect", \n' +
                            '  "data":' + JSON.stringify(data, null, 2) + ', \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postProspectSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.prospect5 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * CRM Account with Contact 6 and a Customer.
 */
    // Add Customer which also creates a CRM Account.
    before(function (done) {
      var custNumber = utils.generateUUID(), // UUID as random Customer Number.
        data = _.clone(records.customerDefults);

      data.name = 'Customer6';
      data.number = custNumber.toUpperCase();
      data.billingContact = records.contact6.id;
      data.correspondenceContact = records.contact6.id;

      // Add Ship To.
      data.shiptos = [
        {
          "number":"shipto1",
          "name":"ship to 1",
          "isActive":true,
          "isDefault":false,
          "salesRep":records.customerDefults.salesRep,
          "shipZone":null,
          "taxZone":null,
          "shipCharge":"ADDCHARGE",
          "contact":records.contact6.id,
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

        records.customer6 = {
          'id': results.id
        };

        done();
      });
    });

    // xDruple Site.
    before(function (done) {
      var siteName = utils.generateUUID(),
          postXdSiteSql =  'select xt.post($${ \n' +
                            '  "nameSpace":"XM", \n' +
                            '  "type":"XdSite", \n' +
                            '  "data":{ \n' +
                            '    "name":"' + siteName + '", \n' +
                            '    "drupalUrl":"www.example.com' + siteName + '" \n' +
                            '  }, \n' +
                            '  "username":"admin" \n' +
                            '}$$);';

      creds.database = databaseName;
      datasource.query(postXdSiteSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdsite = {
          'id': results.id
        };

        done();
      });
    });

/**
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * Check that all the records just created exist.
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 */
    // Contact1 exists.
    it('Contact1 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact1.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact1.number = results.data.number;

        done();
      });
    });

    // Contact2 exists.
    it('Contact2 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact2.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact2.number = results.data.number;

        done();
      });
    });

    // Contact3 exists.
    it('Contact3 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact3.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact3.number = results.data.number;

        done();
      });
    });

    // Contact4 exists.
    it('Contact4 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact4.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact4.number = results.data.number;

        done();
      });
    });

    // Contact5 exists.
    it('Contact5 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact5.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact5.number = results.data.number;

        done();
      });
    });

    // Contact6 exists.
    it('Contact6 should exist', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Contact", \n' +
                          '  "id":"' + records.contact6.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);

        records.contact6.number = results.data.number;

        done();
      });
    });

    // CRM Account with Contact 4.
    it('CRM Account with Contact 4 should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.account4.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);
        assert.equal(results.data.primaryContact.number, records.contact4.number, JSON.stringify(res.rows));

        done();
      });
    });

    // CRM Account with Contact 5 and a Prospect.
    it('CRM Account with Contact 5 and a Prospect should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.prospect5.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);
        assert.equal(results.data.primaryContact.number, records.contact5.number, JSON.stringify(res.rows));
        assert.equal(results.data.prospect.number, records.prospect5.id, JSON.stringify(res.rows));

        done();
      });
    });

    // CRM Account with Contact 6 and a Customer.
    it('CRM Account with Contact 6 and a Customer should exist', function (done) {
      var getAccountSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"Account", \n' +
                          '  "id":"' + records.customer6.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.number);
        assert.equal(results.data.primaryContact.number, records.contact6.number, JSON.stringify(res.rows));
        assert.equal(results.data.customer.number, records.customer6.id, JSON.stringify(res.rows));

        done();
      });
    });

    // xDruple Site exists.
    it('xDruple Site should exist', function (done) {
      var getSiteSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdSite", \n' +
                          '  "id":"' + records.xdsite.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getSiteSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.name);

        records.xdsite.name = results.data.name;

        done();
      });
    });

/**
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * Run all xDruple XdUserContactAccount tests.
 *
 * 1. (see above) Add records to use durring tests and store reference ids in records object.
 * 2. (see above) Check that all the records just created exist.
 * 3. Create a XdUserContactAccount for Contact 1 without a CRM Account.
 * 4. Verify XdUserContactAccount was created for Contact 1 without CRM Account, Customer, Prospect or PG User.
 * 5. Create a XdUserContactAccount for Contact 2 without a CRM Account with isProspect flag set.
 * 6. Verify XdUserContactAccount was created for Contact 2 as a Prospect with CRM Account and PG User.
 * 7. Convert XdUserContactAccount for Contact 2 to a Customer.
 * 8. Verify the Contact 2 Customer exists.
 * 9. Create a XdUserContactAccount for Contact 3 without a CRM Account with isCustomer flag set.
 * 10. Verify XdUserContactAccount was created for Contact 3 as a Customer with CRM Account and PG User.
 * 11. Create a XdUserContactAccount for Contact 4 with a CRM Account with isProspect flag set.
 * 12. Verify XdUserContactAccount was created for Contact 4 as a Prospect with CRM Account and PG User.
 * 13. Convert XdUserContactAccount for Contact 4 to a Customer.
 * 14. Verify the Contact 4 Customer exists.
 * 15. Create a XdUserContactAccount for Contact 5 with a CRM Account that is a Prospect.
 * 16. Verify XdUserContactAccount was created for Contact 5 with CRM Account that is a Prospect and PG User.
 * 17. Convert XdUserContactAccount for Contact 5 to a Customer.
 * 18. Verify the Contact 5 Customer exists.
 * 19. Create a XdUserContactAccount for Contact 6 with a CRM Account that is a Customer.
 * 20. Verify XdUserContactAccount was created for Contact 6 with CRM Account that is a Customer and PG User.
 * 21. Tear down after tests.
 *
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 */

/**
 * Create a XdUserContactAccount for Contact 1 without a CRM Account.
 */
    it('Create a XdUserContactAccount for Contact 1 without a CRM Account', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact1.number + '" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount1 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 1 without CRM Account, Customer, Prospect or PG User.
 */
    it('XdUserContactAccount was created for Contact 1 without CRM Account, Customer, Prospect or PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount1.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.equal(null, results.data.account, JSON.stringify(res.rows));
        assert.equal(false, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(false, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount1.drupalUserUuid = results.data.drupalUserUuid;

        done();
      });
    });

/**
 * Create a XdUserContactAccount for Contact 2 without a CRM Account with isProspect flag set.
 */
    it('Create a XdUserContactAccount for Contact 2 without a CRM Account with isProspect flag set', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact2.number + '", \n' +
                                         '    "isProspect":"true" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount2 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 2 as a Prospect with CRM Account and PG User.
 */
    it('XdUserContactAccount was created for Contact 2 as a Prospect with CRM Account and PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount2.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(false, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(true, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount2.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount2.etag = results.etag;
        records.account2 = {
          'id': results.data.account.number
        };
        records.prospect2 = {
          'id': results.data.account.prospect.number
        };
        records.pguser2 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Convert XdUserContactAccount for Contact 2 to a Customer.
 */
    it('Convert XdUserContactAccount for Contact 2 to a Customer', function (done) {
      var patchXdUserContactAccountSql =  'select xt.patch($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount2.id + '", \n' +
                                          '  "etag":"' + records.xdUserContactAccount2.etag + '", \n' +
                                          '  "patches":[{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isProspect", \n' +
                                          '    "value":false \n' +
                                          '  },{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isCustomer", \n' +
                                          '    "value":true \n' +
                                          '  }], \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(patchXdUserContactAccountSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Verify the Contact 2 Customer exists.
 */
    it('XdUserContactAccount for Contact 2 was converted to a Customer from a Prospect', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount2.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(true, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount2.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount2.etag = results.etag;
        records.account2 = {
          'id': results.data.account.number
        };
        records.customer2 = {
          'id': results.data.account.customer.number
        };
        records.pguser2 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Create a XdUserContactAccount for Contact 3 without a CRM Account with isCustomer flag set.
 */
    it('Create a XdUserContactAccount for Contact 3 without a CRM Account with isCustomer flag set', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact3.number + '", \n' +
                                         '    "isCustomer":"true" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount3 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 3 as a Customer with CRM Account and PG User.
 */
    it('XdUserContactAccount was created for Contact 3 as a Customer with CRM Account and PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount3.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(true, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount3.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount3.etag = results.etag;
        records.account3 = {
          'id': results.data.account.number
        };
        records.customer3 = {
          'id': results.data.account.customer.number
        };
        records.pguser3 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Create a XdUserContactAccount for Contact 4 with a CRM Account with isProspect flag set.
 */
    it('Create a XdUserContactAccount for Contact 4 with a CRM Account with isProspect flag set', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact4.number + '", \n' +
                                         '    "isProspect":"true" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount4 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 4 as a Prospect with CRM Account and PG User.
 */
    it('XdUserContactAccount was created for Contact 4 as a Prospect with CRM Account and PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount4.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(false, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(true, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount4.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount4.etag = results.etag;
        records.account4 = {
          'id': results.data.account.number
        };
        records.prospect4 = {
          'id': results.data.account.prospect.number
        };
        records.pguser4 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Convert XdUserContactAccount for Contact 4 to a Customer.
 */
    it('Convert XdUserContactAccount for Contact 4 to a Customer', function (done) {
      var patchXdUserContactAccountSql =  'select xt.patch($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount4.id + '", \n' +
                                          '  "etag":"' + records.xdUserContactAccount4.etag + '", \n' +
                                          '  "patches":[{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isProspect", \n' +
                                          '    "value":false \n' +
                                          '  },{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isCustomer", \n' +
                                          '    "value":true \n' +
                                          '  }], \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(patchXdUserContactAccountSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Verify the Contact 4 Customer exists.
 */
    it('XdUserContactAccount for Contact 4 was converted to a Customer from a Prospect', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount4.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(true, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount4.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount4.etag = results.etag;
        records.account4 = {
          'id': results.data.account.number
        };
        records.customer4 = {
          'id': results.data.account.customer.number
        };
        records.pguser4 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Create a XdUserContactAccount for Contact 5 with a CRM Account that is a Prospect.
 */
    it('Create a XdUserContactAccount for Contact 5 with a CRM Account that is a Prospect', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact5.number + '" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount5 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 5 with CRM Account that is a Prospect and PG User.
 */
    it('XdUserContactAccount was created for Contact 5 with CRM Account that is a Prospect and PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount5.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(false, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(true, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount5.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount5.etag = results.etag;
        records.account5 = {
          'id': results.data.account.number
        };
        records.prospect5 = {
          'id': results.data.account.prospect.number
        };
        records.pguser5 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Convert XdUserContactAccount for Contact 5 to a Customer.
 */
    it('Convert XdUserContactAccount for Contact 5 to a Customer', function (done) {
      var patchXdUserContactAccountSql =  'select xt.patch($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount5.id + '", \n' +
                                          '  "etag":"' + records.xdUserContactAccount5.etag + '", \n' +
                                          '  "patches":[{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isProspect", \n' +
                                          '    "value":false \n' +
                                          '  },{ \n' +
                                          '    "op":"replace", \n' +
                                          '    "path":"/isCustomer", \n' +
                                          '    "value":true \n' +
                                          '  }], \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(patchXdUserContactAccountSql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));

        done();
      });
    });

/**
 * Verify the Contact 5 Customer exists.
 */
    it('XdUserContactAccount for Contact 5 was converted to a Customer from a Prospect', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount5.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(true, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount5.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount5.etag = results.etag;
        records.account5 = {
          'id': results.data.account.number
        };
        records.customer5 = {
          'id': results.data.account.customer.number
        };
        records.pguser5 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * Create a XdUserContactAccount for Contact 6 with a CRM Account that is a Customer.
 */
    it('Create a XdUserContactAccount for Contact 6 with a CRM Account that is a Customer', function (done) {
      var drupalUUID = utils.generateUUID(),
          postXdUserContactAccountSql =  'select xt.post($${ \n' +
                                         '  "nameSpace":"XM", \n' +
                                         '  "type":"XdUserContactAccount", \n' +
                                         '  "data":{ \n' +
                                         '    "drupalUserUuid":"' + drupalUUID + '", \n' +
                                         '    "xdrupleSite":"' + records.xdsite.name + '", \n' +
                                         '    "contact":"' + records.contact6.number + '" \n' +
                                         '  }, \n' +
                                         '  "username":"admin" \n' +
                                         '}$$);';

      creds.database = databaseName;
      datasource.query(postXdUserContactAccountSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].post);

        records.xdUserContactAccount6 = {
          'id': results.id
        };

        done();
      });
    });

/**
 * Verify XdUserContactAccount was created for Contact 6 with CRM Account that is a Customer and PG User.
 */
    it('XdUserContactAccount was created for Contact 6 with CRM Account that is a Customer and PG User', function (done) {
      var getContactSql = 'select xt.get($${ \n' +
                          '  "nameSpace":"XM", \n' +
                          '  "type":"XdUserContactAccount", \n' +
                          '  "id":"' + records.xdUserContactAccount6.id + '", \n' +
                          '  "username":"admin" \n' +
                          '}$$);';

      datasource.query(getContactSql, creds, function (err, res) {
        var results;

        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[0].get);
        assert.isDefined(results.data.drupalUserUuid);
        assert.isDefined(results.data.account);
        assert.equal(true, results.data.isCustomer, JSON.stringify(res.rows));
        assert.equal(false, results.data.isProspect, JSON.stringify(res.rows));
        assert.equal(true, results.data.isPgUser, JSON.stringify(res.rows));

        records.xdUserContactAccount6.drupalUserUuid = results.data.drupalUserUuid;
        records.xdUserContactAccount6.etag = results.etag;
        records.account6 = {
          'id': results.data.account.number
        };
        records.customer6 = {
          'id': results.data.account.customer.number
        };
        records.pguser6 = {
          'id': results.data.account.userAccount.username
        };

        done();
      });
    });

/**
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * Tear down after tests.
 * ############################################################################
 * ############################################################################
 * ############################################################################
 * ############################################################################
 */

    // Remove user from XdUserContactAccount6.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.account6.id + "';";

      creds.database = databaseName;
      datasource.query(associateUserSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount6.
    after(function (done) {
      var deleteXdUserContactAccountSql = 'select xt.delete($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount6.id + '", \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(deleteXdUserContactAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer6.
    after(function (done) {
      var deleteCustomerSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer6.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteCustomerSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact6's CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.customer6.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact6.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact6.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount6 User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.pguser6.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.pguser6.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.pguser6.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.pguser6.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.pguser6.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.pguser6.id + "'; \n" +
                                  'drop role "' + records.pguser6.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from XdUserContactAccount5.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.account5.id + "';";

      creds.database = databaseName;
      datasource.query(associateUserSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount5.
    after(function (done) {
      var deleteXdUserContactAccountSql = 'select xt.delete($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount5.id + '", \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(deleteXdUserContactAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer5.
    after(function (done) {
      var deleteProspectSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer5.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteProspectSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact5's CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.customer5.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact5.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact5.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount5 User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.pguser5.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.pguser5.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.pguser5.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.pguser5.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.pguser5.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.pguser5.id + "'; \n" +
                                  'drop role "' + records.pguser5.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from XdUserContactAccount4.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.account4.id + "';";

      creds.database = databaseName;
      datasource.query(associateUserSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount4.
    after(function (done) {
      var deleteXdUserContactAccountSql = 'select xt.delete($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount4.id + '", \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(deleteXdUserContactAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer4.
    after(function (done) {
      var deleteProspectSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer4.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteProspectSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact4's CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.account4.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact4.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact4.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount4 User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.pguser4.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.pguser4.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.pguser4.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.pguser4.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.pguser4.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.pguser4.id + "'; \n" +
                                  'drop role "' + records.pguser4.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from XdUserContactAccount3.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.account3.id + "';";

      creds.database = databaseName;
      datasource.query(associateUserSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount3.
    after(function (done) {
      var deleteXdUserContactAccountSql = 'select xt.delete($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount3.id + '", \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(deleteXdUserContactAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer3.
    after(function (done) {
      var deleteProspectSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteProspectSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact3's CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.account3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact3.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact3.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount3 User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.pguser3.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.pguser3.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.pguser3.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.pguser3.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.pguser3.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.pguser3.id + "'; \n" +
                                  'drop role "' + records.pguser3.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Remove user from XdUserContactAccount2.
    after(function (done) {
      var associateUserSql = "update crmacct set crmacct_usr_username = null where crmacct_number = '" + records.account2.id + "';";

      creds.database = databaseName;
      datasource.query(associateUserSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount2.
    after(function (done) {
      var deleteXdUserContactAccountSql = 'select xt.delete($${ \n' +
                                          '  "nameSpace":"XM", \n' +
                                          '  "type":"XdUserContactAccount", \n' +
                                          '  "id":"' + records.xdUserContactAccount2.id + '", \n' +
                                          '  "username":"admin" \n' +
                                          '}$$);';

      creds.database = databaseName;
      datasource.query(deleteXdUserContactAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Customer2.
    after(function (done) {
      var deleteProspectSql = 'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Customer", \n' +
                              '  "id":"' + records.customer2.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteProspectSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact2's CRM Account.
    after(function (done) {
      var deleteAccountSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Account", \n' +
                              '  "id":"' + records.account2.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact2.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact2.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

    // Delete XdUserContactAccount2 User.
    after(function (done) {
      var deleteUserAccountSql =  "delete from usrpref where usrpref_username = '" + records.pguser2.id + "'; \n" +
                                  "delete from usrpriv where usrpriv_username = '" + records.pguser2.id + "'; \n" +
                                  "delete from usrgrp where usrgrp_username = '" + records.pguser2.id + "'; \n" +
                                  "delete from xt.userpref where userpref_usr_username = '" + records.pguser2.id + "'; \n" +
                                  "delete from xt.usrext where usrext_usr_username = '" + records.pguser2.id + "'; \n" +
                                  "delete from xt.usrlite where usr_username = '" + records.pguser2.id + "'; \n" +
                                  'drop role "' + records.pguser2.id + '";';

      creds.database = databaseName;
      datasource.query(deleteUserAccountSql, creds, function (err, res) {
        done();
      });
    });

    // Delete Contact1.
    after(function (done) {
      var deleteContactSql =  'select xt.delete($${ \n' +
                              '  "nameSpace":"XM", \n' +
                              '  "type":"Contact", \n' +
                              '  "id":"' + records.contact1.id + '", \n' +
                              '  "username":"admin" \n' +
                              '}$$);';

      creds.database = databaseName;
      datasource.query(deleteContactSql, creds, function (err, res) {
        done();
      });
    });

  });
}());
