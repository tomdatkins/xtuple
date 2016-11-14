var _      = require("underscore"),
    assert = require('chai').assert;

(function () {
  "use strict";
  describe('interwarehousetransfer()', function () {

    var prefix     = "../../../../../xtuple/node-datasource",
        loginData  = require("../../../lib/login_data.js").data,
        datasource = require(prefix + "/lib/ext/datasource").dataSource,
        config     = require(prefix + "/config.js"),
        creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
        item,
        warehouse1,
        warehouse2,
        glmax,
        invmax,
        postmax,
        distmax,
        credit,
        debit,
        variance,
        itemnum,
        savg,
        tavg,
        std,
        sid,
        tid,
        itemtype,
        uom,
        sitemsitecosting,
        sitemsiteqty,
        sitemsiteval,
        sitemsiteid,
        titemsitecosting,
        titemsiteqty,
        titemsiteval,
        sitemsiteloccon,
        sitemsiteconmeth,
        titemsiteloccon,
        titemsiteconmeth,
        titemsiteid,
        date,
        datetime,
        misc,
        sgl,
        tgl;

    it("needs an item", function (done) {
      var sql = "select item_id from item where (select count(itemsite_id) from itemsite where itemsite_item_id=item_id and itemsite_warehous_id is not null)>1 limit 1;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        item = res.rows[0].item_id;
        done();
      });
    });

    it("needs a warehouse", function (done) {
      var sql = "select warehous_id from whsinfo join itemsite on itemsite_warehous_id=warehous_id where itemsite_item_id=$1 limit 1;",
          cred = _.extend({}, creds, { parameters: [ item ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        warehouse1 = res.rows[0].warehous_id;
        done();
      });
    });

    it("needs another warehouse", function (done) {
      var sql = "select warehous_id from whsinfo join itemsite on itemsite_warehous_id=warehous_id where itemsite_item_id=$1 and warehous_id!=$2 limit 1;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        warehouse2 = res.rows[0].warehous_id;
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocdist table", function (done) {
      var sql = "select max(itemlocdist_id) as result from itemlocdist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        distmax = res.rows[0].result;
        done();
      });
    });

    it("get first site data", function (done) {
      var sql = "select costcat_asset_accnt_id, costcat_invcost_accnt_id, item_number, item_type, avgcost(itemsite_id) as avg, stdcost(item_id) as std, itemsite_id, item_type, uom_name, itemsite_costmethod, itemsite_qtyonhand, itemsite_value, itemsite_loccntrl, itemsite_controlmethod, (now()+interval '1 day')::date::text as date, ((now()+interval '1 day')::date)::timestamp without time zone::text as datetime from item join uom on item_inv_uom_id=uom_id join itemsite on item_id=itemsite_item_id join costcat on itemsite_costcat_id=costcat_id where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        credit = res.rows[0].costcat_asset_accnt_id;
        variance = res.rows[0].costcat_invcost_accnt_id;
        itemnum = res.rows[0].item_number;
        itemtype = res.rows[0].item_type;
        savg = res.rows[0].avg;
        std = res.rows[0].std;
        sid = res.rows[0].itemsite_id;
        sitemsitecosting = res.rows[0].itemsite_costmethod;
        sitemsiteqty = res.rows[0].itemsite_qtyonhand;
        sitemsiteval = res.rows[0].itemsite_value;
        sitemsiteloccon = res.rows[0].itemsite_loccntrl;
        sitemsiteconmeth = res.rows[0].itemsite_controlmethod;
        sitemsiteid = res.rows[0].itemsite_id;
        uom = res.rows[0].uom_name;
        date = res.rows[0].date;
        datetime = res.rows[0].datetime;
        done();
      });
    });

    it("get second site data", function (done) {
      var sql = "select costcat_asset_accnt_id, costcat_invcost_accnt_id, avgcost(itemsite_id) as avg, itemsite_id, item_type, uom_name, itemsite_costmethod, itemsite_qtyonhand, itemsite_value, itemsite_loccntrl, itemsite_controlmethod from item join uom on item_inv_uom_id=uom_id join itemsite on item_id=itemsite_item_id join costcat on itemsite_costcat_id=costcat_id where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        debit = res.rows[0].costcat_asset_accnt_id;
        tavg = res.rows[0].avg;
        tid = res.rows[0].itemsite_id;
        titemsitecosting = res.rows[0].itemsite_costmethod;
        titemsiteqty = res.rows[0].itemsite_qtyonhand;
        titemsiteval = res.rows[0].itemsite_value;
        titemsiteloccon = res.rows[0].itemsite_loccntrl;
        titemsiteconmeth = res.rows[0].itemsite_controlmethod;
        titemsiteid = res.rows[0].itemsite_id;
        done();
      });
    });

    it("use phantom item", function (done) {
      var sql = "update item set item_type='F';";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries with phantom item", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should add no rows to gltrans with phantom item", function (done) {
      var sql = "select * from gltrans where gltrans_id>$1;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to invhist with phantom item", function (done) {
      var sql = "select * from invhist where invhist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to itemlocpost with phantom item", function (done) {
      var sql = "select * from itemlocpost where itemlocpost_id>$1;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to itemlocdist with phantom item", function (done) {
      var sql = "select * from itemlocdist where itemlocdist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("use manufactured item", function (done) {
      var sql = "update item set item_type='M';";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use average costing and no qtyonhand for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='A', itemsite_qtyonhand=0.0 where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should fail if a source itemsite with average costing goes negative", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, -2);
        done();
      });
    });

    it("reset qtyonhand for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_qtyonhand=($1) where itemsite_item_id=$2 and itemsite_warehous_id=$3;",
          cred = _.extend({}, creds, { parameters: [ sitemsiteqty, item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use average costing for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='A' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use regular location control for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_loccntrl=false, itemsite_controlmethod='R' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use regular location control for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_loccntrl=false, itemsite_controlmethod='R' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should create gltrans entries and use average costing for both if both sites use average costing", function (done) {
      var sql = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans where gltrans_id>$1 order by gltrans_sequence, gltrans_amount;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].date, date);
        assert.equal(res.rows[1].date, date);
        assert.equal(res.rows[0].gltrans_accnt_id, debit);
        assert.equal(res.rows[1].gltrans_accnt_id, credit);
        assert.equal(res.rows[0].gltrans_source, 'I/M');
        assert.equal(res.rows[1].gltrans_source, 'I/M');
        assert.equal(res.rows[0].gltrans_doctype, 'TEST');
        assert.equal(res.rows[1].gltrans_doctype, 'TEST');
        assert.equal(res.rows[0].gltrans_docnumber, '123');
        assert.equal(res.rows[1].gltrans_docnumber, '123');
        assert.equal(res.rows[0].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[1].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.closeTo(res.rows[0].gltrans_amount, savg * -1, 0.02);
        assert.closeTo(res.rows[1].gltrans_amount, savg, 0.02);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by average costing if both sites use average costing", function (done) {
      var sql = "select invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id, invhist_transtype, invhist_invqty, invhist_qoh_before, invhist_qoh_after, "
              + "invhist_costmethod, invhist_value_before, invhist_value_after, invhist_ordnumber, invhist_ordtype, invhist_docnumber, "
              + "invhist_comments, invhist_invuom, invhist_unitcost, invhist_transdate::timestamp without time zone::text as transdate, invhist_series "
              + "from invhist where invhist_id>$1 order by invhist_id;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].invhist_id, misc);
        assert.equal(res.rows[0].invhist_itemsite_id, sid);
        assert.equal(res.rows[1].invhist_itemsite_id, tid);
        assert.equal(res.rows[0].invhist_xfer_warehous_id, warehouse2);
        assert.equal(res.rows[1].invhist_xfer_warehous_id, warehouse1);
        assert.equal(res.rows[0].invhist_transtype, 'TW');
        assert.equal(res.rows[1].invhist_transtype, 'TW');
        assert.closeTo(res.rows[0].invhist_invqty, -1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_invqty, 1.0, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_before, sitemsiteqty, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_before, titemsiteqty, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_after, sitemsiteqty-1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_after, titemsiteqty+1.0, 0.02);
        assert.equal(res.rows[0].invhist_costmethod, 'A');
        assert.equal(res.rows[1].invhist_costmethod, 'A');
        assert.closeTo(res.rows[0].invhist_value_before, sitemsiteval, 0.02);
        assert.closeTo(res.rows[1].invhist_value_before, titemsiteval, 0.02);
        assert.closeTo(res.rows[0].invhist_value_after, sitemsiteval-savg, 0.02);
        assert.closeTo(res.rows[1].invhist_value_after, titemsiteval+savg, 0.02);
        assert.equal(res.rows[0].invhist_ordnumber, '123');
        assert.equal(res.rows[1].invhist_ordnumber, '123');
        assert.equal(res.rows[0].invhist_ordtype, 'TEST');
        assert.equal(res.rows[1].invhist_ordtype, 'TEST');
        assert.equal(res.rows[0].invhist_docnumber, '123');
        assert.equal(res.rows[1].invhist_docnumber, '123');
        assert.equal(res.rows[0].invhist_comments, 'Testing');
        assert.equal(res.rows[1].invhist_comments, 'Testing');
        assert.equal(res.rows[0].invhist_invuom, uom);
        assert.equal(res.rows[1].invhist_invuom, uom);
        assert.closeTo(res.rows[0].invhist_unitcost, savg, 0.02);
        assert.closeTo(res.rows[1].invhist_unitcost, savg, 0.02);
        assert.equal(res.rows[0].transdate, datetime);
        assert.equal(res.rows[1].transdate, datetime);
        assert.equal(res.rows[0].invhist_series, 10000);
        assert.equal(res.rows[1].invhist_series, 10000);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var sql = "select itemlocpost_glseq, itemlocpost_itemlocseries from itemlocpost where itemlocpost_id>$1 order by itemlocpost_glseq;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 10000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 10000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var sql = "select * from itemlocdist where itemlocdist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use standard costing for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='S' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should create gltrans entries and use standard costing for both if source site uses standard costing", function (done) {
      var sql = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans where gltrans_id>$1 order by gltrans_sequence, gltrans_amount;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].date, date);
        assert.equal(res.rows[1].date, date);
        assert.equal(res.rows[0].gltrans_accnt_id, debit);
        assert.equal(res.rows[1].gltrans_accnt_id, credit);
        assert.equal(res.rows[0].gltrans_source, 'I/M');
        assert.equal(res.rows[1].gltrans_source, 'I/M');
        assert.equal(res.rows[0].gltrans_doctype, 'TEST');
        assert.equal(res.rows[1].gltrans_doctype, 'TEST');
        assert.equal(res.rows[0].gltrans_docnumber, '123');
        assert.equal(res.rows[1].gltrans_docnumber, '123');
        assert.equal(res.rows[0].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[1].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.closeTo(res.rows[0].gltrans_amount, std * -1, 0.02);
        assert.closeTo(res.rows[1].gltrans_amount, std, 0.02);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing if one site uses standard costing", function (done) {
      var sql = "select invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id, invhist_transtype, invhist_invqty, invhist_qoh_before, invhist_qoh_after, "
              + "invhist_costmethod, invhist_value_before, invhist_value_after, invhist_ordnumber, invhist_ordtype, invhist_docnumber, "
              + "invhist_comments, invhist_invuom, invhist_unitcost, invhist_transdate::timestamp without time zone::text as transdate, invhist_series "
              + "from invhist where invhist_id>$1 order by invhist_id;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].invhist_id, misc);
        assert.equal(res.rows[0].invhist_itemsite_id, sid);
        assert.equal(res.rows[1].invhist_itemsite_id, tid);
        assert.equal(res.rows[0].invhist_xfer_warehous_id, warehouse2);
        assert.equal(res.rows[1].invhist_xfer_warehous_id, warehouse1);
        assert.equal(res.rows[0].invhist_transtype, 'TW');
        assert.equal(res.rows[1].invhist_transtype, 'TW');
        assert.closeTo(res.rows[0].invhist_invqty, -1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_invqty, 1.0, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_before, sitemsiteqty, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_before, titemsiteqty, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_after, sitemsiteqty-1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_after, titemsiteqty+1.0, 0.02);
        assert.equal(res.rows[0].invhist_costmethod, 'S');
        assert.equal(res.rows[1].invhist_costmethod, 'A');
        assert.closeTo(res.rows[0].invhist_value_before, sitemsiteval, 0.02);
        assert.closeTo(res.rows[1].invhist_value_before, titemsiteval, 0.02);
        assert.closeTo(res.rows[0].invhist_value_after, sitemsiteval-std, 0.02);
        assert.closeTo(res.rows[1].invhist_value_after, titemsiteval+std, 0.02);
        assert.equal(res.rows[0].invhist_ordnumber, '123');
        assert.equal(res.rows[1].invhist_ordnumber, '123');
        assert.equal(res.rows[0].invhist_ordtype, 'TEST');
        assert.equal(res.rows[1].invhist_ordtype, 'TEST');
        assert.equal(res.rows[0].invhist_docnumber, '123');
        assert.equal(res.rows[1].invhist_docnumber, '123');
        assert.equal(res.rows[0].invhist_comments, 'Testing');
        assert.equal(res.rows[1].invhist_comments, 'Testing');
        assert.equal(res.rows[0].invhist_invuom, uom);
        assert.equal(res.rows[1].invhist_invuom, uom);
        assert.closeTo(res.rows[0].invhist_unitcost, std, 0.02);
        assert.closeTo(res.rows[1].invhist_unitcost, std, 0.02);
        assert.equal(res.rows[0].transdate, datetime);
        assert.equal(res.rows[1].transdate, datetime);
        assert.equal(res.rows[0].invhist_series, 10000);
        assert.equal(res.rows[1].invhist_series, 10000);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var sql = "select itemlocpost_glseq, itemlocpost_itemlocseries from itemlocpost where itemlocpost_id>$1 order by itemlocpost_glseq;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 10000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 10000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var sql = "select * from itemlocdist where itemlocdist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use average costing for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='A' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use standard costing for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='S' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("change source itemsite value", function (done) {
      var sql = "update itemsite set itemsite_value=(select itemsite_value+1.0 from itemsite where itemsite_item_id=$1 and itemsite_warehous_id=$2) where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should create gltrans entries with mixed costing and variance gltrans entries if source site uses average costing but target site does not", function (done) {
      var sql = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans where gltrans_id>$1 order by gltrans_sequence, gltrans_amount;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 4);
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[2].gltrans_journalnumber, res.rows[3].gltrans_journalnumber);
        assert.equal(res.rows[0].date, date);
        assert.equal(res.rows[1].date, date);
        assert.equal(res.rows[2].date, date);
        assert.equal(res.rows[3].date, date);
        assert.equal(res.rows[0].gltrans_accnt_id, debit);
        assert.equal(res.rows[1].gltrans_accnt_id, credit);
        assert.equal(res.rows[2].gltrans_accnt_id, variance);
        assert.equal(res.rows[3].gltrans_accnt_id, debit);
        assert.equal(res.rows[0].gltrans_source, 'I/M');
        assert.equal(res.rows[1].gltrans_source, 'I/M');
        assert.equal(res.rows[2].gltrans_source, 'I/M');
        assert.equal(res.rows[3].gltrans_source, 'I/M');
        assert.equal(res.rows[0].gltrans_doctype, 'TEST');
        assert.equal(res.rows[1].gltrans_doctype, 'TEST');
        assert.equal(res.rows[2].gltrans_doctype, 'TEST');
        assert.equal(res.rows[3].gltrans_doctype, 'TEST');
        assert.equal(res.rows[0].gltrans_docnumber, '123');
        assert.equal(res.rows[1].gltrans_docnumber, '123');
        assert.equal(res.rows[2].gltrans_docnumber, '123');
        assert.equal(res.rows[3].gltrans_docnumber, '123');
        assert.equal(res.rows[0].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[1].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[2].gltrans_notes, 'Inter-Warehouse Transfer Variance for item ' + itemnum);
        assert.equal(res.rows[3].gltrans_notes, 'Inter-Warehouse Transfer Variance for item ' + itemnum);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.equal(res.rows[2].gltrans_misc_id, res.rows[3].gltrans_misc_id);
        assert.closeTo(res.rows[0].gltrans_amount, std * -1, 0.02);
        assert.closeTo(res.rows[1].gltrans_amount, std, 0.02);
        assert.closeTo(res.rows[2].gltrans_amount, std-savg, 0.02);
        assert.closeTo(res.rows[3].gltrans_amount, savg-std, 0.02);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        tgl = res.rows[2].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing if one site uses standard costing", function (done) {
      var sql = "select invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id, invhist_transtype, invhist_invqty, invhist_qoh_before, invhist_qoh_after, "
              + "invhist_costmethod, invhist_value_before, invhist_value_after, invhist_ordnumber, invhist_ordtype, invhist_docnumber, "
              + "invhist_comments, invhist_invuom, invhist_unitcost, invhist_transdate::timestamp without time zone::text as transdate, invhist_series "
              + "from invhist where invhist_id>$1 order by invhist_id;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].invhist_id, misc);
        assert.equal(res.rows[0].invhist_itemsite_id, sid);
        assert.equal(res.rows[1].invhist_itemsite_id, tid);
        assert.equal(res.rows[0].invhist_xfer_warehous_id, warehouse2);
        assert.equal(res.rows[1].invhist_xfer_warehous_id, warehouse1);
        assert.equal(res.rows[0].invhist_transtype, 'TW');
        assert.equal(res.rows[1].invhist_transtype, 'TW');
        assert.closeTo(res.rows[0].invhist_invqty, -1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_invqty, 1.0, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_before, sitemsiteqty, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_before, titemsiteqty, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_after, sitemsiteqty-1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_after, titemsiteqty+1.0, 0.02);
        assert.equal(res.rows[0].invhist_costmethod, 'A');
        assert.equal(res.rows[1].invhist_costmethod, 'S');
        assert.closeTo(res.rows[0].invhist_value_before, sitemsiteval+1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_value_before, titemsiteval, 0.02);
        assert.closeTo(res.rows[0].invhist_value_after, sitemsiteval+1.0-std, 0.02);
        assert.closeTo(res.rows[1].invhist_value_after, titemsiteval+std, 0.02);
        assert.equal(res.rows[0].invhist_ordnumber, '123');
        assert.equal(res.rows[1].invhist_ordnumber, '123');
        assert.equal(res.rows[0].invhist_ordtype, 'TEST');
        assert.equal(res.rows[1].invhist_ordtype, 'TEST');
        assert.equal(res.rows[0].invhist_docnumber, '123');
        assert.equal(res.rows[1].invhist_docnumber, '123');
        assert.equal(res.rows[0].invhist_comments, 'Testing');
        assert.equal(res.rows[1].invhist_comments, 'Testing');
        assert.equal(res.rows[0].invhist_invuom, uom);
        assert.equal(res.rows[1].invhist_invuom, uom);
        assert.closeTo(res.rows[0].invhist_unitcost, std, 0.02);
        assert.closeTo(res.rows[1].invhist_unitcost, std, 0.02);
        assert.equal(res.rows[0].transdate, datetime);
        assert.equal(res.rows[1].transdate, datetime);
        assert.equal(res.rows[0].invhist_series, 10000);
        assert.equal(res.rows[1].invhist_series, 10000);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var sql = "select itemlocpost_glseq, itemlocpost_itemlocseries from itemlocpost where itemlocpost_id>$1 order by itemlocpost_glseq;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, tgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 10000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 10000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var sql = "select * from itemlocdist where itemlocdist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("change source itemsite value", function (done) {
      var sql = "update itemsite set itemsite_value=(select itemsite_value-1.0 from itemsite where itemsite_item_id=$1 and itemsite_warehous_id=$2) where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use standard costing for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod='S' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("set location control to none for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_controlmethod='N' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("set location control to none for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_controlmethod='N' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should create gltrans entries and use standard costing for both if source site uses standard costing", function (done) {
      var sql = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans where gltrans_id>$1 order by gltrans_sequence, gltrans_amount;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].date, date);
        assert.equal(res.rows[1].date, date);
        assert.equal(res.rows[0].gltrans_accnt_id, debit);
        assert.equal(res.rows[1].gltrans_accnt_id, credit);
        assert.equal(res.rows[0].gltrans_source, 'I/M');
        assert.equal(res.rows[1].gltrans_source, 'I/M');
        assert.equal(res.rows[0].gltrans_doctype, 'TEST');
        assert.equal(res.rows[1].gltrans_doctype, 'TEST');
        assert.equal(res.rows[0].gltrans_docnumber, '123');
        assert.equal(res.rows[1].gltrans_docnumber, '123');
        assert.equal(res.rows[0].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[1].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.closeTo(res.rows[0].gltrans_amount, std * -1, 0.02);
        assert.closeTo(res.rows[1].gltrans_amount, std, 0.02);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should add no rows to invhist if location control for sites is none", function (done) {
      var sql = "select * from invhist where invhist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var sql = "select itemlocpost_glseq, itemlocpost_itemlocseries from itemlocpost where itemlocpost_id>$1 order by itemlocpost_glseq;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 10000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 10000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var sql = "select * from itemlocdist where itemlocdist_id>$1;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});

      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use lot location control for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_controlmethod='L' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use lot location control for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_controlmethod='L' where itemsite_item_id=$1 and itemsite_warehous_id=$2;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var sql = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', 10000, (now()+interval '1 day')::date) as result;",
          cred = _.extend({}, creds, { parameters: [ item, warehouse1, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 10000);
        done();
      });
    });

    it("should create gltrans entries and use standard costing for both if source site uses standard costing", function (done) {
      var sql = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans where gltrans_id>$1 order by gltrans_sequence, gltrans_amount;",
          cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].date, date);
        assert.equal(res.rows[1].date, date);
        assert.equal(res.rows[0].gltrans_accnt_id, debit);
        assert.equal(res.rows[1].gltrans_accnt_id, credit);
        assert.equal(res.rows[0].gltrans_source, 'I/M');
        assert.equal(res.rows[1].gltrans_source, 'I/M');
        assert.equal(res.rows[0].gltrans_doctype, 'TEST');
        assert.equal(res.rows[1].gltrans_doctype, 'TEST');
        assert.equal(res.rows[0].gltrans_docnumber, '123');
        assert.equal(res.rows[1].gltrans_docnumber, '123');
        assert.equal(res.rows[0].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[1].gltrans_notes, 'Inter-Warehouse Transfer for item ' + itemnum + '\nTesting');
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.closeTo(res.rows[0].gltrans_amount, std * -1, 0.02);
        assert.closeTo(res.rows[1].gltrans_amount, std, 0.02);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing if one site uses standard costing", function (done) {
      var sql = "select invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id, invhist_transtype, invhist_invqty, invhist_qoh_before, invhist_qoh_after, "
              + "invhist_costmethod, invhist_value_before, invhist_value_after, invhist_ordnumber, invhist_ordtype, invhist_docnumber, "
              + "invhist_comments, invhist_invuom, invhist_unitcost, invhist_transdate::timestamp without time zone::text as transdate, invhist_series "
              + "from invhist where invhist_id>$1 order by invhist_id;",
          cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].invhist_id, misc);
        assert.equal(res.rows[0].invhist_itemsite_id, sid);
        assert.equal(res.rows[1].invhist_itemsite_id, tid);
        assert.equal(res.rows[0].invhist_xfer_warehous_id, warehouse2);
        assert.equal(res.rows[1].invhist_xfer_warehous_id, warehouse1);
        assert.equal(res.rows[0].invhist_transtype, 'TW');
        assert.equal(res.rows[1].invhist_transtype, 'TW');
        assert.closeTo(res.rows[0].invhist_invqty, -1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_invqty, 1.0, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_before, sitemsiteqty, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_before, titemsiteqty, 0.02);
        assert.closeTo(res.rows[0].invhist_qoh_after, sitemsiteqty-1.0, 0.02);
        assert.closeTo(res.rows[1].invhist_qoh_after, titemsiteqty+1.0, 0.02);
        assert.equal(res.rows[0].invhist_costmethod, 'S');
        assert.equal(res.rows[1].invhist_costmethod, 'S');
        assert.closeTo(res.rows[0].invhist_value_before, sitemsiteval, 0.02);
        assert.closeTo(res.rows[1].invhist_value_before, titemsiteval, 0.02);
        assert.closeTo(res.rows[0].invhist_value_after, sitemsiteval-std, 0.02);
        assert.closeTo(res.rows[1].invhist_value_after, titemsiteval+std, 0.02);
        assert.equal(res.rows[0].invhist_ordnumber, '123');
        assert.equal(res.rows[1].invhist_ordnumber, '123');
        assert.equal(res.rows[0].invhist_ordtype, 'TEST');
        assert.equal(res.rows[1].invhist_ordtype, 'TEST');
        assert.equal(res.rows[0].invhist_docnumber, '123');
        assert.equal(res.rows[1].invhist_docnumber, '123');
        assert.equal(res.rows[0].invhist_comments, 'Testing');
        assert.equal(res.rows[1].invhist_comments, 'Testing');
        assert.equal(res.rows[0].invhist_invuom, uom);
        assert.equal(res.rows[1].invhist_invuom, uom);
        assert.closeTo(res.rows[0].invhist_unitcost, std, 0.02);
        assert.closeTo(res.rows[1].invhist_unitcost, std, 0.02);
        assert.equal(res.rows[0].transdate, datetime);
        assert.equal(res.rows[1].transdate, datetime);
        assert.equal(res.rows[0].invhist_series, 10000);
        assert.equal(res.rows[1].invhist_series, 10000);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var sql = "select itemlocpost_glseq, itemlocpost_itemlocseries from itemlocpost where itemlocpost_id>$1 order by itemlocpost_glseq;",
          cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 10000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 10000);
        done();
      });
    });

    it("should create itemlocdist entries if location controlled", function (done) {
      var sql = "select itemlocdist_id, itemlocdist_itemsite_id, itemlocdist_source_id, itemlocdist_reqlotserial, itemlocdist_distlotserial, itemlocdist_qty, "
              + "itemlocdist_series, itemlocdist_invhist_id from itemlocdist where itemlocdist_id>$1 order by itemlocdist_id;",
          cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocdist_itemsite_id, sitemsiteid);
        assert.equal(res.rows[1].itemlocdist_itemsite_id, titemsiteid);
        assert.equal(res.rows[1].itemlocdist_source_id, res.rows[0].itemlocdist_id);
        assert.equal(res.rows[0].itemlocdist_distlotserial, true);
        assert.equal(res.rows[1].itemlocdist_reqlotserial, true);
        assert.equal(res.rows[0].itemlocdist_qty, -1.0);
        assert.equal(res.rows[1].itemlocdist_qty, 1.0);
        assert.equal(res.rows[0].itemlocdist_series, 10000);
        assert.equal(res.rows[1].itemlocdist_series, 10000);
        assert.equal(res.rows[0].itemlocdist_invhist_id, misc);
        assert.equal(res.rows[1].itemlocdist_invhist_id, misc+1);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      var sql = "select max(gltrans_id) as result from gltrans;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      var sql = "select max(invhist_id) as result from invhist;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      var sql = "select max(itemlocpost_id) as result from itemlocpost;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("reset item type", function (done) {
      var sql = "update item set item_type=$1 where item_id=$2;",
          cred = _.extend({}, creds, { parameters: [ itemtype, item ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("reset costing and location control for source itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod=$1, itemsite_loccntrl=$2, itemsite_controlmethod=$3 where itemsite_item_id=$4 and itemsite_warehous_id=$5;",
          cred = _.extend({}, creds, { parameters: [ sitemsitecosting, sitemsiteloccon, sitemsiteconmeth, item, warehouse1 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("reset costing and location control for target itemsite", function (done) {
      var sql = "update itemsite set itemsite_costmethod=$1, itemsite_loccntrl=$2, itemsite_controlmethod=$3 where itemsite_item_id=$4 and itemsite_warehous_id=$5;",
          cred = _.extend({}, creds, { parameters: [ titemsitecosting, titemsiteloccon, titemsiteconmeth, item, warehouse2 ]});
      datasource.query(sql, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });
  });
})();
