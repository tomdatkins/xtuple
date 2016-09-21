var _      = require('underscore'),
    assert = require('chai').assert,
    dblib  = require('../dblib');

(function () {
  'use strict';

  describe('adjustInvValue()', function () {

    var adminCred  = dblib.adminCred,
        datasource = dblib.dataSource,
        itemsite,
        bankaccnt
        ;

    it("needs an itemsite", function(done) {
      var sql = "SELECT itemsite_id FROM itemsite" +
                " LIMIT 1;"
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err);
        itemsite = res.rows[0].itemsite_id;
        done();
      });
    });

    it("needs a bankaccnt", function(done) {
      var sql = "SELECT bankaccnt_id FROM bankaccnt" +
                " LIMIT 1;"
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err);
        bankaccnt = res.rows[0].bankaccnt_id;
        done();
      });
    });

    it("should fail with an invalid itemsite", function(done) {
      var sql = "SELECT adjustInvValue(-1, 1.0, $1);"
          cred = _.extend({}, adminCred,
                          { parameters: [ bankaccnt ] });

      datasource.query(sql, cred, function (err, res) {
        dblib.assertErrorCode(err, res, "adjustInvValue", -1);
        done();
      });
    });

    it("should run without error", function (done) {
      var sql = "SELECT adjustInvValue($1, 1.0, $2);";
          cred = _.extend({}, adminCred,
                          { parameters: [ itemsite,
                                          bankaccnt ] });

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rows[0].result, 0);
        done();
      });
    });
  });
})();
