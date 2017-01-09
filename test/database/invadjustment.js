/* 
  Inventory Adjustment diffs, per control type and qty:

  Lot + Location controlled item:
    (+):
      - source: 
      - itemlocdist_source_type = 'O'

      - child(ren): 
      - itemlocdist_source_type = 'O'
      - itemlocdist_source_id = itemlocdist_idsource
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = location_id
    (-):
      - source:

      - child(ren):
      - itemlocdist_source_id = itemloc_id

  Location controlled item:
    (+):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren):
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = location_id
      - itemlocdist_series = NULL
    (-):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren)
      - itemlocdist_source_type = 'I'
      - itemlocdist_source_id = itemloc_id

  Lot controlled item:
    (+):
      - source: 
      - itemlocdist_source_type = 'O'

      - child(ren): 
      - itemlocdist_source_type = 'L'
      - itemlocdist_source_id = -1
    (-):
      - source:
      - itemlocdist_source_type = 'O'

      - child(ren): 
      - itemlocdist_source_type = 'I'
      - itemlocdist_source_id = itemloc_id

  Serial controlled item:

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

      it.skip('cycle through the source ids to assign lot serial inventory to each', function (done) {
        if (!lotCntrld) { return done(); }
        var sql = "SELECT createlotserial($1::integer, $2::text, nextval('itemloc_series_seq')::integer, " +
                  " 'I'::text, NULL::integer, itemlocdist_id::integer, $3::numeric, endOfTime()::date, NULL::date) AS id " + 
                  "FROM itemlocdist WHERE (itemlocdist_series=$4);";
        //_.each(sourceIds, function (distDetail) {
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
        //})
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

      // For location (+) trans, child records' itemlocdist_series are null. 
      // Update the parent record to have itself as itemlocdist_series.
      it('update itemlocdist with new child series', function (done) {
        if (!locCntrld && !lotCntrld) { return done(); }
        var sql = "UPDATE itemlocdist SET itemlocdist_child_series = $1::integer " +
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
        var sql = "SELECT invAdjustment($1, $2, NULL::text, NULL::TEXT, current_date, 0, NULL::INTEGER, $3::integer) AS result;",
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
        console.log("itemlocSeries, invhistId, lotCntrld, locCntrld", itemlocSeries, invhistId, lotCntrld, locCntrld);
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
        var sql = "WITH RECURSIVE _itemlocdist(itemlocdist_id, itemlocdist_child_series,"   +
                  "   itemlocdist_series) AS ("                                             +
                  " SELECT itemlocdist_id, itemlocdist_child_series, itemlocdist_series"    +  
                  " FROM itemlocdist"                                                       +
                  " WHERE itemlocdist_series = $1"                                          +
                  "UNION"                                                                   +
                  " SELECT child.itemlocdist_id, child.itemlocdist_child_series,"           +
                  "   child.itemlocdist_series"                                             +
                  " FROM _itemlocdist, itemlocdist AS child"                                +
                  " WHERE child.itemlocdist_series = _itemlocdist.itemlocdist_child_series" +
                  "   OR child.itemlocdist_itemlocdist_id = _itemlocdist.itemlocdist_id"    +
                  ")"                                                                       +
                  "SELECT itemlocdist_id FROM _itemlocdist;",
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

describe('create + transaction for non-controlled BTRUCK1', function () {
  invAdjustment('BTRUCK1', 1);
});

describe('create - transaction for non-controlled BTRUCK1', function () {
  invAdjustment('BTRUCK1', -1);
});

// 2, 2 because math above divides qty by number of detail records
describe('create - transaction for location controlled WTRUCK1', function () {
  invAdjustment('WTRUCK1', -2, 2);
});

describe('create + transaction for location controlled WTRUCK1', function () {
  invAdjustment('WTRUCK1', 2, 2);
});

describe.skip('create + transaction for location & lot controlled DTRUCK1', function () {
  invAdjustment('DTRUCK1', 2, 2);
});



