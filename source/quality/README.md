# The xTuple Quality Extension

The xTuple ERP Quality extension can be installed in either a standard xTuple ERP database or a web-enabled xTuple ERP database.

## Installation

For standard databases, create the Updater extension package:

1. Clone the `private-extensions` repository
2. Check out the appropriate branch
3. Build the Updater package file:

```
linux-host$ cd /path/to/private-extensions/source/quality/foundation-database
linux-host$ make
```
This creates an appropriately-named Updater `.gz` file in `/path/to/private-extensions/source/quality/packages`.

For web-enabled databases, use `build_app.js` to install the extension directly:

1. Clone the `xtuple` repository
2. Check out the appropriate branch of `xtuple`
3. Clone the `private-extensions` repository
4. Check out the appropriate branch of `private-extensions`
5. Run `build_app.js`:

```
linux-host$ cd /path/to/xtuple
linux-host$ scripts/build_app.js -d nameOfDatabase -e ../private-extensions/source/quality
```

Note that the quality extension requires the `commercial-core`, `inventory`, and `manufacturing` extensions.
You can also use `build_app.js` to install in a non-web-enabled database. Just use a slightly longer path on the `build_app.js` line:

```
linux-host$ scripts/build_app.js -d nameOfDatabase -e ../private-extensions/source/quality/foundation-database
```

## Maintenance

You must modify the following files to update the version number of the quality extension:

- private-extensions/source/quality/foundation-datatabase/package.xml
- private-extensions/source/quality/foundation-database/manifest.js
- private-extensions/source/quality/database/manifest.js


