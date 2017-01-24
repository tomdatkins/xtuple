var _      = require("underscore"),
    assert = require('chai').assert;

(function () {
  "use strict";
  describe.skip('interwarehousetransfer()', function () {
  it.skip('needs an itemsite with qtyonhand >= 7');
  it.skip('should require("../../../../../xtuple/test/database/dblib")');
  it.skip('needs to call dblib.assertErrorCode()');

    var prefix     = "../../../../../xtuple/node-datasource",
        loginData  = require("../../../lib/login_data.js").data,
        datasource = require(prefix + "/lib/ext/datasource").dataSource,
        config     = require(prefix + "/config.js"),
        creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
        site1,
        site2,
        glres,
        invres,
        glmax,
        invmax,
        postmax,
        distmax,
        misc,
        sgl,
        tgl,
        gllast = "select max(gltrans_id) as result from gltrans;",
        invlast = "select max(invhist_id) as result from invhist;",
        postlast = "select max(itemlocpost_id) as result from itemlocpost;",
        distlast = "select max(itemlocdist_id) as result from itemlocdist;",
        setitem = "update item set item_type=$1 where item_id=$2;",
        setitemsite = "with old as (select itemsite_costmethod, itemsite_qtyonhand, "
                    + "             itemsite_value, itemsite_loccntrl, itemsite_controlmethod "
                    + "             from itemsite "
                    + "             where itemsite_id=$6) "
                    + "update itemsite "
                    + "set itemsite_costmethod=coalesce($1, old.itemsite_costmethod), "
                    + "itemsite_qtyonhand=coalesce($2, old.itemsite_qtyonhand), "
                    + "itemsite_value=coalesce($3, old.itemsite_value), "
                    + "itemsite_loccntrl=coalesce($4, old.itemsite_loccntrl), "
                    + "itemsite_controlmethod=coalesce($5, old.itemsite_controlmethod) "
                    + "from old "
                    + "where itemsite_id=$6;",
        callfunc = "select interWarehouseTransfer($1, $2, $3, 1.0, 'TEST', '123', 'Testing', "
                 + "                              1000, (now()+interval '1 day')::date) as result;",
        getgl = "select gltrans_journalnumber, gltrans_date::text AS date, gltrans_accnt_id, "
              + "gltrans_source, gltrans_doctype, gltrans_docnumber, gltrans_sequence, "
              + "gltrans_notes, gltrans_misc_id, gltrans_amount "
              + "from gltrans "
              + "where gltrans_id>coalesce($1, 0) "
              + "order by gltrans_sequence, gltrans_amount;",
        getinv = "select invhist_id, invhist_itemsite_id, invhist_xfer_warehous_id, "
               + "invhist_transtype, invhist_invqty, invhist_qoh_before, invhist_qoh_after, "
               + "invhist_costmethod, invhist_value_before, invhist_value_after, "
               + "invhist_ordnumber, invhist_ordtype, invhist_docnumber, "
               + "invhist_comments, invhist_invuom, invhist_unitcost, "
               + "invhist_transdate::timestamp without time zone::text as transdate, "
               + "invhist_series "
               + "from invhist "
               + "where invhist_id>coalesce($1, 0) "
               + "order by invhist_id;",
        getpost = "select itemlocpost_glseq, itemlocpost_itemlocseries "
                + "from itemlocpost "
                + "where itemlocpost_id>coalesce($1, 0) "
                + "order by itemlocpost_glseq;",
        getdist = "select itemlocdist_id, itemlocdist_itemsite_id, itemlocdist_source_id, "
                + "itemlocdist_reqlotserial, itemlocdist_distlotserial, itemlocdist_qty, "
                + "itemlocdist_series, itemlocdist_invhist_id "
                + "from itemlocdist "
                + "where itemlocdist_id>coalesce($1, 0) "
                + "order by itemlocdist_id;";

    it("needs item and site data", function (done) {
      var sql = "select item_id, item_number, item_type, stdcost(item_id) as std, uom_name, "
              + "itemsite_id, itemsite_costmethod, itemsite_qtyonhand, itemsite_value, "
              + "itemsite_loccntrl, itemsite_controlmethod, avgcost(itemsite_id) as avg, "
              + "costcat_asset_accnt_id, costcat_invcost_accnt_id, warehous_id, "
              + "(now()+interval '1 day')::date::text as date, "
              + "((now()+interval '1 day')::date)::timestamp without time zone::text as datetime "
              + "from "
              + "( "
              + " select item_id, item_number, item_type, item_inv_uom_id "
              + " from item "
              + " where "
              + " ( "
              + "  select count(itemsite_id) "
              + "  from itemsite "
              + "  where itemsite_item_id=item_id and itemsite_warehous_id is not null "
              + " )=2 "
              + " limit 1 "
              + ") sub "
              + "join uom on item_inv_uom_id=uom_id "
              + "join itemsite on item_id=itemsite_item_id "
              + "join costcat on itemsite_costcat_id=costcat_id "
              + "join whsinfo on itemsite_warehous_id=warehous_id;";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        site1 = res.rows[0];
        site2 = res.rows[1];
        glres = [{ gltrans_journalnumber: null, date: site1.date,
                   gltrans_accnt_id: site2.costcat_asset_accnt_id, gltrans_source: 'I/M',
                   gltrans_doctype: 'TEST', gltrans_docnumber: '123',
                   gltrans_notes: 'Inter-Warehouse Transfer for item ' + site1.item_number +
                    '\nTesting',
                   gltrans_misc_id: null, gltrans_amount: site1.avg * -1,
                   gltrans_sequence: null },
                 { gltrans_journalnumber: null, date: site1.date,
                   gltrans_accnt_id: site1.costcat_asset_accnt_id, gltrans_source: 'I/M',
                   gltrans_doctype: 'TEST', gltrans_docnumber: '123',
                   gltrans_notes: 'Inter-Warehouse Transfer for item ' + site1.item_number +
                    '\nTesting',
                   gltrans_misc_id: null, gltrans_amount: site1.avg,
                   gltrans_equence: null },
                 { gltrans_journalnumber: null, date: site1.date,
                   gltrans_accnt_id: site1.costcat_invcost_accnt_id, gltrans_source: 'I/M',
                   gltrans_doctype: 'TEST', gltrans_docnumber: '123',
                   gltrans_notes: 'Inter-Warehouse Transfer Variance for item ' + site1.item_number,
                   gltrans_misc_id: null, gltrans_amount: site2.std-site1.avg,
                   gltrans_sequence: null },
                 { gltrans_journalnumber: null, date: site1.date,
                   gltrans_accnt_id: site2.costcat_asset_accnt_id, gltrans_source: 'I/M',
                   gltrans_doctype: 'TEST', gltrans_docnumber: '123',
                   gltrans_notes: 'Inter-Warehouse Transfer Variance for item ' + site1.item_number,
                   gltrans_misc_id: null, gltrans_amount: (site2.std-site1.avg) * -1,
                   gltrans_sequence: null }];
        invres = [{ invhist_id: null, invhist_itemsite_id: site1.itemsite_id,
                    invhist_xfer_warehous_id: site2.warehous_id, invhist_transtype: 'TW',
                    invhist_invqty: -1.0, invhist_qoh_before: site1.itemsite_qtyonhand,
                    invhist_qoh_after: site1.itemsite_qtyonhand - 1.0, invhist_costmethod: 'A',
                    invhist_value_before: site1.itemsite_value,
                    invhist_value_after: site1.itemsite_value - site1.avg,
                    invhist_ordnumber: '123', invhist_ordtype: 'TEST', invhist_docnumber: '123',
                    invhist_comments: 'Testing', invhist_invuom: site1.uom_name,
                    invhist_unitcost: site1.avg, transdate: site1.datetime, invhist_series: 1000 },
                  { invhist_id: null, invhist_itemsite_id: site2.itemsite_id,
                    invhist_xfer_warehous_id: site1.warehous_id, invhist_transtype: 'TW',
                    invhist_invqty: 1.0, invhist_qoh_before: site2.itemsite_qtyonhand,
                    invhist_qoh_after: site2.itemsite_qtyonhand + 1.0, invhist_costmethod: 'A',
                    invhist_value_before: site2.itemsite_value, 
                    invhist_value_after: site2.itemsite_value + site1.avg,
                    invhist_ordnumber: '123', invhist_ordtype: 'TEST', invhist_docnumber: '123',
                    invhist_comments: 'Testing', invhist_invuom: site1.uom_name,
                    invhist_unitcost: site1.avg, transdate: site1.datetime, invhist_series: 1000 }];
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      datasource.query(gllast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      datasource.query(invlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      datasource.query(postlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocdist table", function (done) {
      datasource.query(distlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        distmax = res.rows[0].result;
        done();
      });
    });

    it("use phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'F', site1.item_id ]});
      datasource.query(setitem, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries with phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

    it("should add no rows to gltrans with phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to invhist with phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to itemlocpost with phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add no rows to itemlocdist with phantom item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("use manufactured item", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'M', site1.item_id ]});
      datasource.query(setitem, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use average costing and no qtyonhand for source itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'A', 0.0, null, null, null,
                                                     site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should fail if a source itemsite with average costing goes negative", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, -2);
        done();
      });
    });

    it("reset qtyonhand and use regular location control for source itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ null, site1.itemsite_qtyonhand, null, false,
                                                     'R', site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use average costing and regular location control for target itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'A', null, null, false, 'R',
                                                     site2.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

    it("should create gltrans entries and use average costing for both", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(glres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, glres[i][k], 0.02);
              else
                assert.equal(v, glres[i][k]);
          });
        });
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by average costing", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        invres[0].invhist_id = misc;
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(invres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, invres[i][k], 0.02);
              else
                assert.equal(v, invres[i][k]);
          });
        });
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 1000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 1000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      datasource.query(gllast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      datasource.query(invlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      datasource.query(postlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use standard costing for source itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'S', null, null, null, null,
                                                     site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

    it("should create gltrans entries and use standard costing for both", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        glres[0].gltrans_amount = site1.std * -1;
        glres[1].gltrans_amount = site1.std;
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(glres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, glres[i][k], 0.02);
              else
                assert.equal(v, glres[i][k]);
          });
        });
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        invres[0].invhist_id = misc;
        invres[0].invhist_costmethod = 'S';
        invres[0].invhist_value_after = site1.itemsite_value-site1.std;
        invres[1].invhist_value_after = site2.itemsite_value+site1.std;
        invres[0].unitcost = site1.std;
        invres[1].unitcost = site1.std;
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(invres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, invres[i][k], 0.02);
              else
                assert.equal(v, invres[i][k]);
          });
        });
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 1000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 1000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      datasource.query(gllast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      datasource.query(invlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      datasource.query(postlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use average costing for source itemsite and change itemsite value", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'A', null, site1.itemsite_value+1.0, null, 
                                                     null, site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use standard costing for target itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'S', null, null, null, null,
                                                     site2.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

    it("should create gltrans entries with mixed costing and variance entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 4);
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(glres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, glres[i][k], 0.02);
              else
                assert.equal(v, glres[i][k]);
          });
        });
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[2].gltrans_journalnumber, res.rows[3].gltrans_journalnumber);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        assert.equal(res.rows[2].gltrans_misc_id, res.rows[3].gltrans_misc_id);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        tgl = res.rows[2].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        invres[0].invhist_id = misc;
        invres[0].invhist_costmethod = 'A';
        invres[1].invhist_costmethod = 'S';
        invres[0].invhist_value_before = site1.itemsite_value+1.0;
        invres[0].invhist_value_after = site1.itemsite_value+1.0-site1.avg;
        invres[1].invhist_value_after = site2.itemsite_value+site2.std;
        invres[0].unitcost = site1.avg;
        invres[1].unitcost = site2.std;
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(invres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, invres[i][k], 0.02);
              else
                assert.equal(v, invres[i][k]);
          });
        });
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, tgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 1000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 1000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      datasource.query(gllast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      datasource.query(invlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      datasource.query(postlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("change source itemsite value and use standard costing and no control", function (done) {
      var cred = _.extend({}, creds, { parameters: [ 'S', null, site1.itemsite_value, null, 'N',
                                                      site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("set location control to none for target itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ null, null, null, null, 'N',
                                                     site2.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

    it("should create gltrans entries and use standard costing for both", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(glres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, glres[i][k], 0.02);
              else
                assert.equal(v, glres[i][k]);
          });
        });
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should add no rows to invhist if location control for sites is none", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 1000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 1000);
        done();
      });
    });

    it("should add no rows to itemlocdist if not location controlled", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("get max id of gltrans table", function (done) {
      datasource.query(gllast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        glmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of invhist table", function (done) {
      datasource.query(invlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        invmax = res.rows[0].result;
        done();
      });
    });

    it("get max id of itemlocpost table", function (done) {
      datasource.query(postlast, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        postmax = res.rows[0].result;
        done();
      });
    });

    it("use lot location control for source itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ null, null, null, null, 'L',
                                                     site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("use lot location control for target itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ null, null, null, null, 'L',
                                                     site2.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("should return passed itemlocseries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_id, site1.warehous_id,
                                                     site2.warehous_id ]});
      datasource.query(callfunc, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].result, 1000);
        done();
      });
    });

   it("should create gltrans entries and use standard costing for both", function (done) {
      var cred = _.extend({}, creds, { parameters: [ glmax ]});
      datasource.query(getgl, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(glres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, glres[i][k], 0.02);
              else
                assert.equal(v, glres[i][k]);
          });
        });
        assert.equal(res.rows[0].gltrans_journalnumber, res.rows[1].gltrans_journalnumber);
        assert.equal(res.rows[0].gltrans_misc_id, res.rows[1].gltrans_misc_id);
        misc = res.rows[0].gltrans_misc_id;
        sgl = res.rows[0].gltrans_sequence;
        done();
      });
    });

    it("should create invhist entries with values determined by standard costing", function (done) {
      var cred = _.extend({}, creds, { parameters: [ invmax ]});
      datasource.query(getinv, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        invres[0].invhist_id = misc;
        invres[0].invhist_costmethod = 'S';
        invres[0].invhist_value_before = site1.itemsite_value;
        invres[0].invhist_value_after = site1.itemsite_value-site1.std;
        invres[0].unitcost = site1.std;
        _.each(res.rows, function (e, i) {
          _.each(e, function (v, k) {
            if(invres[i][k])
              if(_.isNumber(v))
                assert.closeTo(v, invres[i][k], 0.02);
              else
                assert.equal(v, invres[i][k]);
          });
        });
        done();
      });
    });

    it("should create itemlocpost entries based off gltrans entries", function (done) {
      var cred = _.extend({}, creds, { parameters: [ postmax ]});
      datasource.query(getpost, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocpost_glseq, sgl);
        assert.equal(res.rows[1].itemlocpost_glseq, sgl);
        assert.equal(res.rows[0].itemlocpost_itemlocseries, 1000);
        assert.equal(res.rows[1].itemlocpost_itemlocseries, 1000);
        done();
      });
    });

    it("should create itemlocdist entries if location controlled", function (done) {
      var cred = _.extend({}, creds, { parameters: [ distmax ]});
      datasource.query(getdist, cred, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2);
        assert.equal(res.rows[0].itemlocdist_itemsite_id, site1.itemsite_id);
        assert.equal(res.rows[1].itemlocdist_itemsite_id, site2.itemsite_id);
        assert.equal(res.rows[1].itemlocdist_source_id, res.rows[0].itemlocdist_id);
        assert.equal(res.rows[0].itemlocdist_distlotserial, true);
        assert.equal(res.rows[1].itemlocdist_reqlotserial, true);
        assert.equal(res.rows[0].itemlocdist_qty, -1.0);
        assert.equal(res.rows[1].itemlocdist_qty, 1.0);
        assert.equal(res.rows[0].itemlocdist_series, 1000);
        assert.equal(res.rows[1].itemlocdist_series, 1000);
        assert.equal(res.rows[0].itemlocdist_invhist_id, misc);
        assert.equal(res.rows[1].itemlocdist_invhist_id, misc+1);
        done();
      });
    });

    it("reset item type", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.item_type, site1.item_id ]});
      datasource.query(setitem, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("reset costing and location control for source itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site1.itemsite_costmethod, null, null,
                                                     site1.itemsite_loccntrl,
                                                     site1.itemsite_controlmethod,
                                                     site1.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it("reset costing and location control for target itemsite", function (done) {
      var cred = _.extend({}, creds, { parameters: [ site2.itemsite_costmethod, null, null,
                                                     site2.itemsite_loccntrl, 
                                                     site2.itemsite_controlmethod,
                                                     site2.itemsite_id ]});
      datasource.query(setitemsite, cred, function (err, res) {
        assert.isNull(err);
        done();
      });
    });
  });
})();
