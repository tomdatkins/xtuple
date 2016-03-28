(function () {
  "use strict";

  var _      = require("underscore"),
      assert = require("chai").assert,
      testDir    = "../../..",
      xtupleDir  = testDir + "/../../xtuple",
      loginData  = require(testDir + "/lib/login_data.js").data,
      datasource = require(xtupleDir + "/node-datasource/lib/ext/datasource").dataSource,
      config     = require(xtupleDir + "/node-datasource/config.js"),
      creds      = _.extend({}, config.databaseServer, {database: loginData.org})
  ;

  describe('xt.ordhead view', function () {
    var table = [
      { name: "cohead", idCol: "cohead_id", numCol: "cohead_number" },
      { name: "tohead", idCol: "tohead_id", numCol: "tohead_number" },
      { name: "pohead", idCol: "pohead_id", numCol: "pohead_number" },
      { name: "cmhead", idCol: "cmhead_id", numCol: "cmhead_number" },
      { name: "invchead", idCol: "invchead_id", numCol: "invchead_invcnumber" },
      { name: "rahead", idCol: "rahead_id", numCol: "rahead_number", where: "rahead_cust_id is not null" }
      ]
      ;

    _.each(table, function (tab) {
      describe('for ' + tab.name, function () {
        it("should have an xt.ordtype for " + tab.name, function (done) {
          var sql = ("select * from xt.ordtype where ordtype_tblname = '%name';")
                    .replace(/%name/, tab.name);
          datasource.query(sql, creds, function (err, res) {
            assert.isNull(err);
            assert.operator(res.rowCount, '>', 0);
            tab.code = res.rows[0].ordtype_code;
            done();
          });
        });

        it("should get a row from " + tab.name, function (done) {
          var sql = ("select %idCol as id, %numCol as num from %name %where limit 1;")
                    .replace(/%idCol/,  tab.idCol)
                    .replace(/%numCol/, tab.numCol)
                    .replace(/%name/,   tab.name)
                    .replace(/%where/,  tab.where ? ("where " + tab.where) : "");
          datasource.query(sql, creds, function (err, res) {
            assert.isNull(err);
            if (res.rowCount > 0) {
              tab.id  = res.rows[0].id;
              tab.num = res.rows[0].num;
            }
            done();
          });
        });

        it("should be in xt.ordhead if it's in " + tab.name, function (done) {
          var sql = ("select * from xt.ordhead"
                  + " where ordhead_number = '%num'"
                  + "   and ordhead_id     =  %id"
                  + "   and ordhead_type   = '%code';")
                  .replace(/%num/,  tab.num)
                  .replace(/%id/,   tab.id)
                  .replace(/%code/, tab.code);
          if ("id" in tab) {
            datasource.query(sql, creds, function (err, res) {
              assert.isNull(err);
              assert.equal(res.rowCount, 1);
              done();
            });
          } else done();
        });
      });
    });
  });

}());

