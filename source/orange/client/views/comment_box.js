/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  enyo.kind(/** @lends XV.CommentBoxItem# */{
    name: "XV.OrangeCommentBoxItem",
    kind: "XV.CommentBoxItem",
    edit: function () {
      this.inherited(arguments);
      this.$.commentType.hide();
      this.$.textArea.$.input.setDisabled(false);
    }
  });

  enyo.kind({
    name: "XV.OrangeCommentBox",
    kind: "XV.CommentBox",
    components: [
      {kind: "onyx.GroupboxHeader", name: "header"},
      {kind: "XV.Scroller",
        horizontal: 'hidden',
        fit: true,
        components: [
          {kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupItem",
            classes: "xv-comment-box-repeater", components: [
            {kind: "XV.OrangeCommentBoxItem", name: "repeaterItem" }
          ]}
        ]
      },
      {kind: 'FittableColumns', classes: "xv-groupbox-buttons",
        components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newItem",
          content: "_new".loc(), classes: "xv-groupbox-button-single"}
      ]}
    ],
    sort: function (a, b) {
      return a.get('id') - b.get('id');
    }
  });

  enyo.kind({
    name: "XV.LeaveCommentBox",
    kind: "XV.OrangeCommentBox",
    model: "OHRM.LeaveComment"
  });

}());

