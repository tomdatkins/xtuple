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
      extensions = ["inventory"];

    it('should build without error on a brand-new database', function (done) {
      buildAll.build({
        database: databaseName,
        initialize: true,
        backup: path.join(__dirname, "../lib/demo-test.backup")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('temporarily needs to build purchasing as well', function (done) {
      buildAll.build({
        database: databaseName,
        extension: path.join(__dirname, "../../../xtuple/enyo-client/extensions/source/purchasing")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    _.each(extensions, function (extension) {
      it('should build the ' + extension + ' extension', function (done) {
        buildAll.build({
          database: databaseName,
          extension: path.join(__dirname, "../../source", extension)
        }, function (err, res) {
          assert.isNull(err);
          done();
        });
      });
    });
  });
}());


