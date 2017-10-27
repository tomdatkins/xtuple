(function () {
  "use strict";

  var DEBUG = true,
    _      = require("underscore"),
    assert = require('chai').assert,
    dblib  = require('../dblib'),
    datasource = dblib.datasource,
    adminCred = dblib.generateCreds();

  // TODO - write unit tests for the other versions of postProduction()

  describe("postProduction(integer, qty, boolean, integer, timestamp with time zone, boolean, boolean", function () {
    this.timeout(10 * 1000);

    var params = {
      itemNumber: "BTRUCK1",
      whCode: "WH1",
      qty: 10
    };

    it("should get the itemsite_id and qoh",function (done) {
      var sql = "SELECT itemsite_qtyonhand, itemsite_id FROM itemsite WHERE itemsite_id = getitemsiteid($1, $2);",
        options = _.extend({}, adminCred, { parameters: [ params.whCode, params.itemNumber ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].itemsite_id, ">", 0);

        params.itemsiteId = res.rows[0].itemsite_id;
        params.qohBefore = res.rows[0].itemsite_qtyonhand;

        done();
      });
    });

    it("should get the wo itemsite_id and qoh",function (done) {
      var sql = "SELECT itemsite_qtyonhand, itemsite_id FROM itemsite WHERE itemsite_id = getitemsiteid($1, $2);",
        options = _.extend({}, adminCred, { parameters: [ params.whCode, params.itemNumber ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].itemsite_id, ">", 0);
        
        params.itemsiteId = res.rows[0].itemsite_id;
        params.qohBefore = res.rows[0].itemsite_qtyonhand;

        done();
      });
    });

    // Create a Work Order
    it("should create a work order", function (done) {
      var callback = function (result) {
        if (DEBUG)
          console.log("createWorkOrder callback result: ", result);
        params.woId = result;
        done();
      };

      dblib.createWorkOrder(params, callback);
    });

    it("explodeWo() should succeed", function (done) {
      var sql = "SELECT explodeWo($1::integer, false) AS result;",
        options = _.extend({}, adminCred, { parameters: [ woParams.woId ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].result, ">", 0);
        done();
      });
    });

    it.skip("should fail pPreDistributed and pItemlocSeries null", function (done) {
      // TODO
    });

    it.skip("should not proceed if qty < 0", function (done) {
      // TODO
    });

    it.skip("should fail itemsite has no cost category", function (done) {
      // TODO
    });

    // Note: Don't handle distribution detail here, that will be done in private-extensions/test/manufacturing

    it("postProduction() without backflush should succeed", function (done) {
      var sql = "SELECT postProduction($1, $2, FALSE, NULL, now(), false, true) AS result;",
        options = _.extend({}, adminCred, { parameters: [ params.woId, params.qty ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.isNotNull(res.rows[0].result);

        done();
      });
    });
 
    it("should have updated qoh", function (done) {
      var sql = "SELECT itemsite_qtyonhand AS result FROM itemsite WHERE itemsite_id=$1::integer;",
        options = _.extend({}, adminCred, { parameters: [ params.itemsiteId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal((+params.qohBefore + +params.qty), res.rows[0].result);

        done();
      }); 
    });

    it.skip("should check that the inventory posted correctly", function (done) {
      // TODO
    });
  }); 
}());

