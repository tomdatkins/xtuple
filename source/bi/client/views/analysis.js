/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {
  /**
    This iFrame is to show the Sales Analysis.  On creation, it uses the analysis route 
    to generate a signed, encoded JWT which it sends to Pentaho to display Saiku 
    in an iFrame.
  */
  enyo.kind({
    name: "XV.AnalysisFrame",
    label: "_analysis".loc(),
    tag: "iframe",
    style: "border: none;",
    attributes: {src: ""},
    events: {
      onMessage: ""
    },
    published: {
      source: ""
    },

    create: function () {
      this.inherited(arguments);
      if (XT.session.config.freeDemo) {
        this.doMessage({message: "_staleAnalysisWarning".loc()});
      }
      // generate the web token and render
      // the iFrame
      var url, ajax = new enyo.Ajax({
        url: XT.getOrganizationPath() + "/analysis",
        handleAs: "text"
      });
      ajax.response(this, function (inSender, inResponse) {
        this.setSource(inResponse);
      });
      // uh oh. HTTP error
      ajax.error(this, function (inSender, inResponse) {
        // TODO: trigger some kind of error here
        console.log("There was a problem generating the iFrame");
      });
      // param for the report name
      ajax.go({reportUrl: "content/saiku-ui/index.html?biplugin=true"});
    },
    /**
      When the published source value is set, this sets the src
      attribute on the iFrame.
    */
    sourceChanged: function () {
      this.inherited(arguments);
      this.setAttributes({src: this.getSource()});
    }
  });

}());
