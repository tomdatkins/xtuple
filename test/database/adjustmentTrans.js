/* 
  Inventory Adjustment diffs, per control type and qty:

  Lot + Location controlled item:
    (+):
      - source: 
      - itemlocdist_source_type = 'O'

      - child(ren): 
      (lot records)
      - itemlocdist_source_type = 'O'
      - itemlocdist_source_id = parent.itemlocdist_id
      - itemlocdist_series = NEXTVAL('itemloc_series_seq')
      - itemlocdist_itemlocdist_id = NULL
      
      (location records)
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = location_id
      - itemlocdist_series = NULL
      - itemlocdist_itemlocdist_id = lot record's itemlocdist_id
    (-):
      - source:

      - child(ren):
      - itemlocdist_source_type = 'I'
      - itemlocdist_source_id = location_id
      - itemlocdist_series = NULL
      - itemlocdist_itemlocdist_id = parent.itemlocdist_id

  Location controlled item:
    (+):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren):
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = location_id
      - itemlocdist_series = NULL
      - itemlocdist_itemlocdist_id = parent.itemlocdist_id
    (-):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren)
      - itemlocdist_source_type = 'I'
      - itemlocdist_source_id = itemloc_id
      - itemlocdist_series = NULL
      - itemlocdist_itemlocdist_id = parent.itemlocdist_id

  Lot/Serial controlled item:
    (+):
      - source: 
      - itemlocdist_source_type = 'O'

      - child(ren): 
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = -1
      - itemlocdist_itemlocdist_id = NULL
      - itemlocdist_series = NEXTVAL('itemloc_series_seq')
    (-):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren): 
      - itemlocdist_source_type = 'I'
      - itemlocdist_source_id = itemloc_id
      - itemlocdist_itemlocdist_id = parent.itemlocdist_id
      - itemlocdist_series = NULL

*/

var _ = require("underscore"),
  assert = require('chai').assert,
  invAdjustment = function (itemNumber, qty, distCount) {
    "use strict";
    assert.isNotNull(itemNumber);
    assert.isNotNull(qty);
    
    describe('Inventory Adjustment transaction', function () {
      var loginData = require("../lib/login_data.js").data,
        datasource = require('../../node-datasource/lib/ext/datasource').dataSource,
        config     = require("../../node-datasource/config.js"),
        creds = _.extend({}, config.databaseServer, {database: loginData.org}),
        itemsiteId,
        itemlocSeries,
        invhistId, 
        lotCntrld, 
        locCntrld,
        sourceType = qty < 0 ? 'I' : 'L',
        sourceIds;
      this.timeout(10*1000);

      before(function(done) {
        var sql = "SELECT itemsite_id, itemsite_loccntrl, itemsite_controlmethod "                                   +
                  "FROM itemsite "                                        +
                  " JOIN item ON itemsite_item_id = item_id "             +
                  " JOIN warehous ON itemsite_warehous_id = warehous_id " +
                  "WHERE item_number = $1 AND warehous_code = 'WH1'",
          options = _.extend({}, creds,
              { parameters: [ itemNumber ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          assert.operator(res.rows[0].itemsite_id.valueOf(), ">", 0);
          itemsiteId = res.rows[0].itemsite_id.valueOf();
          locCntrld = res.rows[0].itemsite_loccntrl.valueOf();
          lotCntrld = (res.rows[0].itemsite_controlmethod.valueOf() != "R") 
            && (res.rows[0].itemsite_controlmethod.valueOf() != "N");
          console.log("locCntrld: ", locCntrld, " lotCntrld: ", lotCntrld);
          done();
        });
      });

      it('sets the source id for the transaction', function (done) {
        if (!locCntrld) { return done(); }
        var sql;
        if (qty < 0) {
          sql = "SELECT itemloc_id AS id FROM itemloc WHERE itemloc_itemsite_id = $1 " +
                "ORDER BY itemloc_qty DESC LIMIT $2";
        }
        else if (qty > 0) {
          sql = "SELECT location_id AS id FROM location " +
                "WHERE validlocation(location_id, $1) LIMIT $2";
        }

        var options = _.extend({}, creds,
          { parameters: [ itemsiteId, distCount ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, distCount);
          _.each(res.rows, function (row) {
            assert.operator(row.id.valueOf(), ">", 0);
          });
          console.log("res.rows: ", res.rows);
          sourceIds = res.rows;
          done();
        });
      });

      it('should create an itemlocdist record', function (done) {
        var sql = "SELECT createitemlocdistseries($1, $2, 'AD', '') AS result;",
          options = _.extend({}, creds,
            { parameters: [ itemsiteId, qty ] });
        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          assert.operator(res.rows[0].result.valueOf(), ">", 0);
          itemlocSeries = res.rows[0].result.valueOf();
          console.log("itemlocSeries in first test: ", itemlocSeries);
          done();
        });
      });

      it('cycle through the source ids to assign lot serial inventory to each', function (done) {
        if (!lotCntrld) { return done(); }
        var sql = "SELECT createlotserial($1::integer, $2::text, nextval('itemloc_series_seq')::integer, " +
                  " 'I'::text, NULL::integer, itemlocdist_id::integer, $3::numeric, endOfTime()::date, NULL::date) AS id " + 
                  "FROM itemlocdist WHERE (itemlocdist_series=$4);";
        _.each(sourceIds, function (distDetail) {
          var options = _.extend({}, creds,
            { parameters: [ itemsiteId, 'AAA', qty / distCount, itemlocSeries ] });
          datasource.query(sql, options, function (err, res) {
            console.log("res.rows[0]", res.rows[0]);
            assert.isNull(err);
            assert.equal(res.rowCount, 1);
            assert.operator(res.rows[0].itemlocdist_id.valueOf(), ">", 0);
            var newItemlocdistId = res.rows[0].itemlocdist_id.valueOf();
            console.log("newItemlocdistId ", newItemlocdistId);
          });
        })
        done();
      });

      it('cycle through the source ids to distribute inventory to each', function (done) {
        if (!locCntrld) { return done(); }
        var sql = "INSERT INTO itemlocdist " +
                  "( itemlocdist_itemlocdist_id, " +
                  "  itemlocdist_source_type, itemlocdist_source_id, " +
                  "  itemlocdist_qty, itemlocdist_ls_id, itemlocdist_expiration ) " +
                  "SELECT itemlocdist_id, " +
                  " $1, $2, $3, itemlocdist_ls_id, endOfTime() " +
                  "FROM itemlocdist " +
                  "WHERE itemlocdist_series=$4 " +
                  "RETURNING itemlocdist_id, itemlocdist_qty;";

        _.each(sourceIds, function (distDetail) {
          var options = _.extend({}, creds,
            { parameters: [ sourceType, distDetail.id, qty / distCount, itemlocSeries ] });
          datasource.query(sql, options, function (err, res) {
            console.log("res.rows[0]", res.rows[0]);
            assert.isNull(err);
            assert.equal(res.rowCount, 1);
            assert.operator(res.rows[0].itemlocdist_id.valueOf(), ">", 0);
            var newItemlocdistId = res.rows[0].itemlocdist_id.valueOf();
            console.log("newItemlocdistId ", newItemlocdistId);
          });
        })
        done();
      });

      // For location (+) trans, child records, itemlocdist_series is null. 
      // Update the parent record to have itself as itemlocdist_series.
      it('update itemlocdist with new child series', function (done) {
        if (!locCntrld && !lotCntrld) { return done(); }
        var sql = "UPDATE itemlocdist " +
                  "SET itemlocdist_child_series = COALESCE(itemlocdist_child_series, $1::integer) " +
                  "WHERE itemlocdist_series = $1::integer AND $1::integer IS NOT NULL " +
                  "RETURNING itemlocdist_id;",
          options = _.extend({}, creds,
            { parameters: [ itemlocSeries ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          assert.operator(res.rows[0].itemlocdist_id.valueOf(), ">", 0);
          done();
        });
      });

      it('call invadjustment function, save invhist_id', function (done) {
        var sql = "SELECT invAdjustment($1, $2, NULL::text, NULL::TEXT, " +
                  "current_date, 0, NULL::INTEGER, $3::integer) AS result;",
          options = _.extend({}, creds,
            { parameters: [ itemsiteId, qty, itemlocSeries ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          assert.operator(res.rows[0].result.valueOf(), ">", 0);
          invhistId = res.rows[0].result.valueOf();
          console.log("invhistId %", invhistId);
          done();
        });
      });

      it('post distribution detail using itemlocSeries and invhistId', function (done) {
        console.log("itemlocSeries, invhistId, lotCntrld, locCntrld", 
          itemlocSeries, invhistId, lotCntrld, locCntrld);
        var sql = "SELECT postdistdetail($1, $2, $3, $4) AS result;",
          options = _.extend({}, creds,
            { parameters: [ itemlocSeries, invhistId, lotCntrld, locCntrld ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          assert.operator(res.rows[0].result.valueOf(), ">", 0);
          done();
        });
      });

      it('verify that the itemlocdist records were deleted through postitemlocseries.sql function',
        function (done) {
        var sql = "SELECT * FROM getAllItemlocdist($1);",
          options = _.extend({}, creds,
            { parameters: [ itemlocSeries ] });

        datasource.query(sql, options, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 0);
          done();
        });
      });
    });
  };

/* 
  invAdjustment(itemNumber, qty, distCount)
  (-)2, 2 because math above (qty / # of dist. records) must result in an 
  integer that is passed as qty for each distribution.
*/
// non-controlled item
describe('create + transaction for non-controlled BTRUCK1', function () {
  invAdjustment('BTRUCK1', 1);
});

describe('create - transaction for non-controlled BTRUCK1', function () {
  invAdjustment('BTRUCK1', -1);
});

// location controlled item
describe('create + transaction for location controlled WTRUCK1', function () {
  invAdjustment('WTRUCK1', 2, 2);
});

describe('create - transaction for location controlled WTRUCK1', function () {
  invAdjustment('WTRUCK1', -2, 2);
});

// Lot controlled item
describe('create + transaction for location & lot controlled RPAINT1', function () {
  invAdjustment('RPAINT1', 2, 2);
});

describe('create + transaction for location & lot controlled RPAINT1', function () {
  invAdjustment('RPAINT1', -2, 2);
});

// location and serial controlled item
describe('create + transaction for location controlled STRUCK1', function () {
  invAdjustment('STRUCK1', 2, 2);
});

// location and serial controlled item
describe('create + transaction for location controlled STRUCK1', function () {
  invAdjustment('STRUCK1', -2, 2);
});
