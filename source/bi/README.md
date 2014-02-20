xTuple Business Intelligence Extension
======================================
The xTuple Business Intelligence Extension provides BI routes and views for the xTuple Web Client
to show data from the xTuple BI Server (https://github.com/xtuple/bi).

Currently, only the Sales Dashboard is implemented in the extension.  But ultimately, all BI routes
and views will be implemented in the extension.  To build the extension:

	git clone git@github.com:xtuple/private-extensions.git
	cd private-extensions
	git submodule update --init --recursive
	sudo ../xtuple/scripts/build_app.js -e source/bi

To connect to the BI Server the following must be set in your config.js:

    biServer: {

        hostname: "hostname-of-bi-server",

        port: 8080,

        catalog: "xTuple",

        tenantname: "default",

        keyFile: "./lib/rest-keys/server.key"

      }


And don't forget to enable the BI extension when you connect to the xTuple Web Client.