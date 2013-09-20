xTuple Drupal Integration Extension
===================================

xTuple ERP Mobile-Web Client Drupal Integration Extension Extension

This extension adds and exposed xTuple ORMs to the REST API for integration
with the Drupal CMS.

### xTuple Drupal Integration Extension Installation:

To use this extension, clone this repository in the same directory your
"xtuple" Mobile-Web Client directory is located. The command is:

    git clone git@github.com:xtuple/private-extensions.git

The directory tree structure should look like this:

  * some-parent-directory
    * xtuple
      * enyo-client
      * lib
      * node-datasource
      * scripts
      * etc...
    * private-extensions
      * source
        * xdruple
          * ...
      * tools
      * etc...

Then enter the "private-extensions" directory and run these commands to
initialize it:

    git submodule update --init --recursive
    npm install

Finally, install the extension on your xTuple database. Assuming you already
have the Mobile-Web client setup and working. To install JUST this extension
stop the datasource, enter the main "xtuple" directory and run this command:

    ./scripts/build_app.js -d your-xtuple-database-name-here -e ../private-extensions/source/xdruple

You can now start the datasource.
