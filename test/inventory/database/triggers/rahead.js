
(function () {
  "use strict";

  var _      = require("underscore"),
      assert = require("chai").assert,
      testDir    = "../../..",
      xtupleDir  = testDir + "/../../xtuple",
      loginData  = require(testDir + "/lib/login_data.js").data,
      datasource = require(xtupleDir + "/node-datasource/lib/ext/datasource").dataSource,
      config     = require(xtupleDir + "/node-datasource/config.js"),
      creds      = _.extend({}, config.databaseServer, {database: loginData.org}),
      unprivCreds= _.extend({}, config.databaseServer,
                            { database: loginData.org,
                              user:     "underprived",
                              password: "underprived" }),
      ra;
  ;

  describe('rahead triggers', function () {

    it("should create an unprivileged user", function (done) {
      var sql = "select createUser($1, false);",
          options = _.clone(creds);
      options.parameters = [ unprivCreds.user ];
      datasource.query(sql, options, done);       // ignore errors
    });

    it("should set the unprivileged user's password", function (done) {
      var sql = "alter user " + unprivCreds.user +
                " with password '" + unprivCreds.password + "';";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err, 'expect no error changing the user password');
        done();
      });
    });

    it("should add the unprivileged user to xtrole", function (done) {
      var sql = "alter group xtrole add user " + unprivCreds.user + ";";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err, 'expect no error changing the user password');
        done();
      });
    });

    it("should fail inserting into rahead without priv", function (done) {
      var sql = ("insert into rahead ("
              +  "rahead_number"
              +  ") values ("
              +  "fetchranumber()"
              +  ") returning *;"),
          options = _.clone(unprivCreds);
      datasource.query(sql, options, function (err, res) {
        assert.isNotNull(err);
        done();
      });
    });

    it("should be able to insert into rahead", function (done) {
      var sql = ("insert into rahead ("
              +  "rahead_number"
              +  ") values ("
              +  "fetchranumber()"
              +  ") returning *;");
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        ra = res.rows[0];
        done();
      });
    });

    it("should not be able to update an rahead without priv", function (done) {
      var sql = ("update rahead"
              +  " set rahead_cust_id = cohead_cust_id"
              +  "  from cohead"
              +  " where cohead_id in (select cohead_id from cohead"
              +  "                    where cohead_status = 'C'"
              +  "                   limit 1)"
              +  "   and rahead_id = %id"
              +  " returning rahead_orig_cohead_id;")
              .replace(/%id/, ra.rahead_id),
          options = _.clone(unprivCreds);
      datasource.query(sql, options, function (err, res) {
        assert.isNotNull(err);
        done();
      });
    });

    it("should be able to update an rahead", function (done) {
      var sql = ("update rahead"
              +  " set rahead_cust_id        = cohead_cust_id"
              +  "   , rahead_orig_cohead_id = cohead_id"
              +  "   , rahead_warehous_id    = cohead_warehous_id"
              +  "   , rahead_cohead_warehous_id = cohead_warehous_id"
              +  "   , rahead_billtoname     = cohead_billtoname"
              +  "   , rahead_billtoaddress1 = cohead_billtoaddress1"
              +  "   , rahead_billtoaddress2 = cohead_billtoaddress2"
              +  "   , rahead_billtoaddress3 = cohead_billtoaddress3"
              +  "   , rahead_billtocity     = cohead_billtocity"
              +  "   , rahead_billtostate    = cohead_billtostate"
              +  "   , rahead_billtozip      = cohead_billtozipcode"
              +  "   , rahead_billtocountry  = cohead_billtoname"
              +  "  from cohead"
              +  " where cohead_id in (select cohead_id from cohead"
              +  "                    where cohead_status = 'C'"
              +  "                   limit 1)"
              +  "   and rahead_id = %id"
              +  " returning rahead_orig_cohead_id;")
              .replace(/%id/, ra.rahead_id);
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        assert.operator(res.rows[0].rahead_orig_cohead_id, '>', 0);
        done();
      });
    });

    it("should not be able to delete an rahead without priv", function (done) {
      var sql = ("delete from rahead where rahead_id = %id;")
              .replace(/%id/, ra.rahead_id),
          options = _.clone(unprivCreds);
      datasource.query(sql, options, function (err, res) {
        assert.isNotNull(err);
        done();
      });
    });

    it("should be able to delete an rahead", function (done) {
      var sql = ("delete from rahead where rahead_id = %id;")
                 .replace(/%id/, ra.rahead_id);
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it.skip("make sure rawf_after_insert trigger fires", function (done) {
      var sql = "";
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });


    // clean up //////////////////////////////////////////////////////////////
    after(function (done) {
      var sql = [ "delete from xt.usrlite where usr_username = '%user';",
                  "drop user %user;"
                ].join(" ")
                 .replace(/%user/g, unprivCreds.user);
      datasource.query(sql, creds, done);
    });

  });
}());

