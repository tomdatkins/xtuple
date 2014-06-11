/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, after:true */

var buildAll = require('../../../xtuple/scripts/lib/build_all'),
  _ = require('underscore'),
  assert = require('chai').assert,
  path = require('path');

(function () {
  "use strict";
  describe('The database build tool', function () {
    this.timeout(100 * 60 * 1000);

    var loginData = require(path.join(__dirname, "../lib/login_data.js")).data,
      databaseName = loginData.org,
      extensions = ["inventory", "manufacturing", "distribution"],
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../../xtuple/node-datasource/config.js")),
      creds = config.databaseServer;

    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo

    it('should build without error on a brand-new database', function (done) {
      buildAll.build({
        database: databaseName,
        initialize: true,
        source: path.join(__dirname, "../../../xtuple/foundation-database/postbooks_demo_data.sql")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    _.each(extensions, function (extension) {
      it('should build the ' + extension + ' extension', function (done) {
        buildAll.build({
          database: databaseName,
          frozen: true,
          extension: path.join(__dirname, "../../source", extension)
        }, function (err, res) {
          assert.isNull(err);
          done();
        });
      });
    });

  });
}());
