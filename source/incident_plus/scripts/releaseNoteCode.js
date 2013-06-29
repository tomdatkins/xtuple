var getReleaseNotes = function (projectName, versionName) {
  var project = new XM.Project();
  project.fetch({
    number: projectName,
    error: function () { console.log("Error", arguments); },
    success: function () {
      var version = _.find(project.get("versions").models, function (model) {
        return model.get("version") === versionName;
      });
      var incidents = new XM.IncidentListItemCollection();
      incidents.fetch({
        showMore: false,
        query: {
          recordType: "XM.IncidentListItem",
          orderBy: [{
            attribute: "number"
          }],
          parameters: [
            {attribute: "project", operator:"", isCharacteristic: false, value: project},
            {attribute: "fixedIn", operator:"", isCharacteristic: false, value: version}
          ]
        },
        success: function (results) {
          _.each(results.models, function (incident) {
            var incidentNumber = incident.get("number");
            var link = "http://www.xtuple.org/xtincident/view/bugs/" + incidentNumber;
            var verb = incident.getValue("resolution.name") || "Fixed";

            if (verb === "Open") {
              verb = "Fixed";
            }

            if (_.contains(["Unable To Reproduce", "Suspended", "Fixed - Unable to Verify"], verb)) {
              return;
            } else if (verb === "Fixed" && incident.getValue("category.name") !== "Bugs") {
              verb = "Implemented";
            }
            console.log("- " + verb);
            console.log("  issue #[" + incidentNumber + "](" + link + ")");
            console.log("  _" + incident.get("description") + "_");
          });
        }
      });
    }
  });
};
