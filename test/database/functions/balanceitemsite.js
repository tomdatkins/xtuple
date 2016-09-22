var _      = require('underscore'),
    assert = require('chai').assert,
    dblib  = require('../dblib');

(function () {
  'use strict';

  describe('balanceItemsite()', function () {

    var adminCred  = dblib.adminCred,
        datasource = dblib.dataSource,
        itemsitefail,
        itemsitesucceed
        ;

    it("needs a failing itemsite record", function(done) {
      var sql = "SELECT itemsite_id FROM itemsite" +
                " WHERE itemsite_freeze" +
                " LIMIT 1;"
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err);
        itemsitefail = res.rows[0].itemsite_id;
        done();
      });
    });

    it("needs a succeeding itemsite record", function(done) {
      var sql = "SELECT itemsite_id FROM itemsite" +
                " WHERE NOT itemsite_freeze" +
                " LIMIT 1;"
      datasource.query(sql, adminCred, function (err, res) {
        assert.isNull(err);
        itemsitesucceed = res.rows[0].itemsite_id;
        done();
      });
    });

    it("should fail with a frozen itemsite", function(done) {
      var sql = "SELECT balanceItemsite($1);"
          cred = _.extend({}, adminCred,
                          { parameters: [ itemsitefail ] });

      datasource.query(sql, cred, function (err, res) {
        dblib.assertErrorCode(err, res, "balanceItemsite", -1);
        done();
      });
    });

    it("should run without error", function (done) {
      var sql = "SELECT balanceItemsite($1);";
          cred = _.extend({}, adminCred,
                          { parameters: [ itemsitesucceed ] });

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rows[0].result, 1);
        done();
      });
    });
  });
})();
