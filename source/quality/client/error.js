/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true,
  strict:false */
/*global XT:true, _:true */

(function () {

  XT.extensions.quality.initErrors = function () {

    var errors = [    
      {
        code: "quality1001",
        messageKey: "_testTolerances"
      },
      {
        code: "quality1002",
        messageKey: "_testUnitRequired"
      },
      {
        code: "quality1003",
        messageKey: "_testInitRequired"
      },
      {
        code: "quality1004",
        messageKey: "_testFreqRequired"
      },
      {
        code: "quality1005",
        messageKey: "_testFreqNotLot"
      },
      {
        code: "quality1006",
        messageKey: "_testFreqNotSerial"
      },
      {
        code: "quality1007",
        messageKey: "_itemSiteNotValid"
      }
    ];

    _.each(errors, XT.Error.addError);
  };

}());
