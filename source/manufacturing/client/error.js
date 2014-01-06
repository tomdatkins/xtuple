/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true,
  strict:false */
/*global XT:true, _:true */

(function () {

  XT.extensions.manufacturing.initErrors = function () {

    var errors = [
      {
        code: "mfg1001",
        messageKey: "_itemsiteNotValid"
      },
      {
        code: "mfg1002",
        params: {
          item: null,
          site: null
        },
        messageKey: "_itemsiteNotManufactured"
      },
      {
        code: "mfg1003",
        messageKey: "_parentOrderRequired"
      }
    ];

    _.each(errors, XT.Error.addError);
  };

}());
