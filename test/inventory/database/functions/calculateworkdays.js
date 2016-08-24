var _      = require("underscore"),
    assert = require('chai').assert;

(function () {
  "use strict";
  describe('calculateworkdays()', function () {

    var prefix     = "../../../../../xtuple/node-datasource",
        loginData  = require("../../../lib/login_data.js").data,
        datasource = require(prefix + "/lib/ext/datasource").dataSource,
        config     = require(prefix + "/config.js"),
        creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
        forwardResult,
        whs,
        hasXtmfg   = false;

    it("needs to know if xtmfg is enabled", function (done) {
      var sql = "select packageIsEnabled('xtmfg') as result;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        hasXtmfg = res.rows[0].result;
        done();
      });
    });

    it("needs a warehouse, with work calendar if possible", function (done) {
      var sql = hasXtmfg ?
                 "select warehous_id, whsecal.*, whsewk_id"     +
                 "  from whsinfo"                               +
                 "  left outer join xtmfg.whsecal"              +
                 "       on warehous_id = whsecal_warehous_id"  +
                 "  left outer join xtmfg.whsewk"               +
                 "       on warehous_id = whsewk_warehous_id"   +
                 " where warehous_active"                       +
                 " order by whsewk_id, whsecal_id nulls last limit 1;"
               : "select min(warehous_id) as warehous_id" +
                 "  from whsinfo where warehous_active;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        whs = res.rows[0];
        done();
      });
    });

    it("should return 0 for same start and end dates", function (done) {
      var sql = "select calculateWorkDays(-1, current_date, current_date) as result;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 0);
        done();
      });
    });

    it("should return a positive value for start < end", function (done) {
      var sql  = "select calculateWorkDays($1, current_date,"   +
                 "  (current_date + interval '7 days')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ whs.warehous_id ]});
      datasource.query(sql, cred, function (err, res) {
        if (whs.whsewk_id > 0 || ! hasXtmfg) {
          assert.isNull(err);
          forwardResult = res.rows[0].result;
          if (hasXtmfg) {
            assert.operator(forwardResult, "<=", 7);
          } else {
            assert.equal(forwardResult, 7);
          }
          done();
        } else {
          assert.isNotNull(err);
          // dblib.assertErrorCode(err, res, 'calculateWorkDays', -11);
          done();
        }
      });
    });


    it("should return a negative value for end < start", function (done) {
      var sql  = "select calculateWorkDays($1,"                 +
                 "   (current_date + interval '7 days')::date," +
                 "   current_date) as result;",
          cred = _.extend({}, creds, { parameters: [ whs.warehous_id ]});
      datasource.query(sql, cred, function (err, res) {
        if (whs.whsewk_id > 0 || ! hasXtmfg) {
          assert.isNull(err);
          assert.equal(res.rows[0].result, forwardResult * -1);
          done();
        } else {
          assert.isNotNull(err);
          // dblib.assertErrorCode(err, res, 'calculateWorkDays', -11);
          done();
        }
      });
    });

  });
})();
