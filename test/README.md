### Private-extensions test runner

Still in development, but when finished this should support the same API as in the xtuple repo.

`npm run-script test-build`

Installs the database in `test/lib/demo-test.backup`, which (remember that we're in
`private-extensions`, here) is assumed to be a masterref database.


TODO: travisci will need some way to get masterref into `test/lib/demo-test.backup`

TODO: some script will also need to write the `test/lib/login_data.js` file

`npm run-script test`

Will treat every file in the `test/inventory` folder as a spec, and run it using the
credentials in `test/lib/login_data.js` of `private-extensions`. If the spec is for
an extension of a core object, the spec in `private-extensions` should require the
`spec` and `additionalTests` export, possibly modify the spec, and add an `extensionTests`
export.

TODO: you still need to change the `testDatabase` option in `node-datasource/config.js`
to masterref. Long-term solution is to fix the bug in `node-datasource/main.js` that
makes this necessary.

TODO: this only supports inventory

TODO: hook this whole thing up to travisci and/or jenkins
