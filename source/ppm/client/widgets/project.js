/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.ppm.initProjectWidgets = function () {
 
    // ..........................................................
    // PROJECT
    //

    enyo.kind({
      name: "XV.ProjectTaskWidget",
      published: {
        attr: null,
        value: null,
        disabled: false
      },
      events: {
        "onValueChange": ""
      },
      handlers: {
        "onValueChange": "controlValueChanged"
      },
      components: [
        {kind: "FittableRows", components: [
          {kind: "XV.ProjectWidget", name: "project", label: "_project".loc()},
          {kind: "XV.PickerWidget", name: "tasks", label: "_task".loc(),
            nameAttribute: "number", orderBy: [{ attribute: "number" }]}
        ]}
      ],
      controlValueChanged: function (inSender, inEvent) {
        var options = {},
         project = this.$.project.getValue(),
         tasksPicker = this.$.tasks,
         tasks,
         task;
        if (inEvent.originator.name === 'project') {
          if (project) {
            options.success = function () {
              tasks = project.get('tasks');
              tasksPicker._collection = tasks;
              tasksPicker.orderByChanged();
              tasksPicker._collection.sort();
              tasksPicker.buildList();
              tasksPicker.clear({silent: true});
            };
            project.fetchRelated('tasks', options);
          } else {
            tasksPicker._collection = [];
            tasksPicker.buildList();
            tasksPicker.clear({silent: true});
          }
          return true;
        } else if (inEvent.originator.name === 'tasks') {
          tasks = project.get('tasks');
          task = tasks.get(inEvent.value);
          inEvent = { originator: this, value: task.attributes };
          this.doValueChange(inEvent);
          return true;
        }
      },
      disabledChanged: function () {
        var disabled = this.getDisabled();
        this.$.project.setDisabled(disabled);
        this.$.tasks.setDisabled(disabled);
      },
      setValue: function (value, options) {
        options = options || {};
        var oldValue = this.getValue(),
          inEvent;
        if (oldValue !== value) {
          this.value = value;
          this.valueChanged(value);
          inEvent = { value: value, originator: this };
          if (!options.silent) { this.doValueChange(inEvent); }
        }
      },
      valueChanged: function (value) {
        var that = this,
          project,
          number,
          tasksPicker = this.$.tasks,
          tasks,
          processTasks = function () {
            var options = {};
            that.$.project.setValue(project, {silent: true});
            options.success = function () {
              tasks = project.get('tasks');
              tasksPicker._collection = tasks;
              tasksPicker.orderByChanged();
              tasksPicker._collection.sort();
              tasksPicker.buildList();
              tasksPicker.clear({silent: true});
              tasksPicker.setValue(value, {silent: true});
            };
            project.fetchRelated('tasks', options);
          };
        if (value) {
          number = value.get('project');
          if (number instanceof XM.Model) { number = number.id; }
          project = this.$.project.getValue();
          if (!project || !project.id || project.id !== number) {
            project = XM.ProjectRelation.findOrCreate({number: number});
            if (project.getStatus !== XM.Model.READY_CLEAN) {
              project.fetch({success: processTasks});
            } else {
              processTasks();
            }
          }
        } else {
          this.$.project.clear();
          this.$.tasks.clear();
        }
      }
    });
  };

}());
