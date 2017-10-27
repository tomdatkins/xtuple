(function () {
  "use strict";

  var DEBUG = false,
    _      = require("underscore"),
    assert = require('chai').assert,
    dblib  = require('../dblib'),
    datasource = dblib.datasource,
    adminCred = dblib.generateCreds();

  // TODO - write tests for all the other versions of correctProduction()
  
  describe("correctProduction(integer, numeric, boolean, integer, timestamp with time zone, integer, boolean)", function () {
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
        options = _.extend({}, adminCred, { parameters: [ params.woId ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].result, ">", 0);
        done();
      });
    });
    
    it("releaseWo() should succeed", function (done) {
      var sql = "SELECT releaseWo($1::integer, false) AS result;",
        options = _.extend({}, adminCred, { parameters: [ params.woId ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it("should post production", function (done) {
      var sql = "SELECT postproduction($1::integer, $2::numeric, true, NULL, NOW()) AS result;",
        options = _.extend({}, adminCred, { parameters: [ params.woId, params.qty ]});

      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].result, ">", 0);
        done();
      });
    });

    it.skip("should have updated qoh", function (done) {
      var sql = "SELECT itemsite_qtyonhand AS result FROM itemsite WHERE itemsite_id=$1::integer;",
        options = _.extend({}, adminCred, { parameters: [ params.itemsiteId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal((params.qohBefore + params.qty), res.rows[0].result);

        params.qohBefore = res.rows[0].result;

        done();
      });
    });

    it.skip("should fail if itemsite missing cost category", function (done) {
      // TODO
    });

    it.skip("should fail with WO status 'I'", function (done) {
      // TODO
    });

    it.skip("should fail if Job costed item", function (done) {
      // TODO
    });

    // Note: Don't handle distribution detail here, that will be done in private-extensions/test/manufacturing

    it("correctproduction() should succeed with backflush", function (done) {
      var sql = "SELECT correctproduction($1::integer, 1, TRUE, NULL, NOW(), NULL, FALSE) AS result;",
        options = _.extend({}, adminCred, { parameters: [ params.woId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].result, ">", 0);

        done();
      });
    });

    it.skip("should have updated qoh", function (done) {
      var sql = "SELECT itemsite_qtyonhand AS result FROM itemsite WHERE itemsite_id=$1::integer;",
        options = _.extend({}, adminCred, { parameters: [ params.itemsiteId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal((+params.qohBefore - 1), res.rows[0].result);

        params.qohBefore = res.rows[0].result;

        done();
      });
    });

    it("correctproduction() should succeed without backflush", function (done) {
      var sql = "SELECT correctproduction($1::integer, 1, FALSE, NULL, NOW(), NULL, FALSE) AS result;",
        options = _.extend({}, adminCred, { parameters: [ params.woId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].result, ">", 0);

        done();
      });
    });

    it.skip("should have updated qoh", function (done) {
      var sql = "SELECT itemsite_qtyonhand AS result FROM itemsite WHERE itemsite_id=$1::integer;",
        options = _.extend({}, adminCred, { parameters: [ params.itemsiteId ]});
        
      datasource.query(sql, options, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal((+params.qohBefore - 1), res.rows[0].result);

        params.qohBefore = res.rows[0].result;

        done();
      });
    });

    it.skip("should check that the inventory posted correctly", function (done) {
      // TODO
    });
  }); 
}());

