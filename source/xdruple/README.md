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

Finally, install the extension on your xTuple database. Assuming you already
have the Mobile-Web client setup and working. To install JUST this extension
stop the datasource, enter the main "xtuple" directory and run this command:

    ./scripts/build_app.js -d your-xtuple-database-name-here -e ../private-extensions/source/xdruple

You can now start the datasource.

### xTuple Drupal Integration Extension Setup:

After you have installed the xTuple Drupal Integration extension, refresh your
broswer and/or restart the datasource. Then login to the Mobile-Web client as a
privileged "admin" user. Enter the "Setup->User Accounts" workspace and select
your "admin" user. Check the "xdruple" box in the "EXTENSIONS" section. Refresh your
browser again for the new privileges to show up. Then check the
"Access xDruple Extension" in the "XDRUPLE" Privileges section. It should look
similar to this:

![xdruple extension setup](http://i.imgur.com/68DYXqN.png)

Then refresh your browser window and you should see an "xDruple" menu option on
the left hand side of the main home screen.

![xdruple extension menu](http://i.imgur.com/Bp6dK1d.png)

Select the "xDruple" workspace and add a Drupal Website. It should look
similar to this:

![xdruple site workspace](http://i.imgur.com/45nyQyt.png)

Next, add a Drupal User Contact Association for your 'admin' Drupal user. It
should look similar to this:

![xdruple user workspace](http://i.imgur.com/oKHuluQ.png)

Note: You may want to create a special 'drupal' user in xTuple that is used
for the integration.
