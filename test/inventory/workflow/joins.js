/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require("underscore"),
  assert = require('chai').assert,
  path = require('path');

(function () {
  "use strict";
  describe('The database', function () {
    this.timeout(10 * 1000);

    var loginData = require(path.join(__dirname, "../../lib/login_data.js")).data,
      datasource = require('../../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../../../xtuple/node-datasource/config.js")),
      creds = config.databaseServer,
      databaseName = loginData.org;

    creds.database = databaseName;

    it('should run the transfer order items fetch', function (done) {
      var sql = 'select xt.post($${"nameSpace":"XM","type":"TransferOrder","dispatch":{"functionName":"items","parameters":["XM.TransferOrderItemRelation","WH1","WH1","WH1",{"parameters":[{"attribute":"isActive","value":true},{"attribute":"number","operator":"BEGINS_WITH","value":"bt","keySearch":false}],"orderBy":[{"attribute":"number"}],"rowLimit":10}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.equal(results.length, 1);
        assert.equal(results[0].number, "BTRUCK1");
        done();
      });
    });

    it('should run the inventory availability fetch', function (done) {
      var sql = 'select xt.post($${"nameSpace":"XM","type":"InventoryAvailability","dispatch":{"functionName":"fetch","parameters":{"orderBy":[{"attribute":"item"},{"attribute":"site"}],"parameters":[{"attribute":"lookAhead","value":"byLeadTime"}],"rowOffset":0,"rowLimit":50}},"username":"admin","encryptionKey":"this is any content"}$$);';


      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });
  });
}());

