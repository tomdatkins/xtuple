var _      = require("underscore"),
    assert = require('chai').assert;

(function () {
  "use strict";
  describe('deleteplannedorder()', function () {

    var prefix     = "../../../../../xtuple/node-datasource",
        loginData  = require("../../../lib/login_data.js").data,
        datasource = require(prefix + "/lib/ext/datasource").dataSource,
        config     = require(prefix + "/config.js"),
        creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
        planord;

    it("needs planned order to delete", function (done) {
      var sql = "insert into planord (planord_number,"                  +
                "  planord_startdate, planord_itemsite_id, planord_qty" +
                ") select fetchnextnumber('PlanNumber')::integer,"      +
                "         current_date, min(itemsite_id), 100"          +
                "  from itemsite"                                       +
                "  join item on itemsite_item_id = item_id"             +
                " where itemsite_active and item_active"                +
                " group by item_type;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        if (res.rowCount >= 1) {
          planord = res.rows;
        }
        done();
      });
    });

    it("should work without deleting children", function (done) {
      var sql  = "select deletePlannedOrder($1, false) as result;",
          cred;
      if (planord && planord.length > 0) {
        cred = _.extend({}, creds, { parameters: [ planord[0].planord_id ]});
        datasource.query(sql, cred, function (err, res) {
          assert.isNull(err);
          assert.isTrue(res.rows[0].result);
          done();
        });
      } else {
        console.log("no planned order to delete");
        done();
      }
    });

    it("should work while deleting children", function (done) {
      var sql  = "select deletePlannedOrder($1, true) as result;",
          cred;
      if (planord && planord.length > 1) {
        cred = _.extend({}, creds, { parameters: [ planord[1].planord_id ]});
        datasource.query(sql, cred, function (err, res) {
          assert.isNull(err);
          assert.isTrue(res.rows[0].result);
          done();
        });
      } else {
        console.log("no planned order to delete");
        done();
      }
    });

  });
})();
