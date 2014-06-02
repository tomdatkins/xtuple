Private extensions for the xTuple Mobile/Web platform
=================

[![Build Status](https://magnum.travis-ci.com/xtuple/private-extensions.png?token=kuemJtta7VsAf1FXmUoV&branch=master)](https://magnum.travis-ci.com/xtuple/private-extensions)

Our commercial extensions are how we put food on the table.

If you haven't already, you'll want to follow our [Building an Extension Tutorial](https://github.com/xtuple/xtuple-extensions/blob/master/docs/TUTORIAL.md) to learn how to write on top of our framework.

#### Setup

To load this code onto your development machine, start by forking this repo and cloning it in an adjacent folder to the `xtuple` (and, possibly, `xtuple-extensions`) repo.

``` bash
$ cd .. # (out of the xtuple repo)
$ git clone git@github.com:your_github_usersname/private-extensions.git --recursive
$ cd private-extensions
$ sudo npm install
$ cp ../xtuple/test/lib/login_data.js test/lib/login_data.js
$ npm run-script test-build # make sure that you've closed your db connections (datasource, pgadmin, etc.)
```

These commands should look familiar, as they are very similar to the open-source version of them in the `xtuple` repo. When when you execute them from the private-extensions repo your `dev` database will have the `inventory`, `manufacturing`, and `distribution` extensions built. Note that it will not be a `masterref` database; more like a `postbooks-demo` database will all the available extensions added onto it.
