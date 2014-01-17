/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true,
  strict:false */
/*global XT:true, _:true */

(function () {

  XT.extensions.inventory.initErrors = function () {

    var errors = [
      {
        code: "inv1001",
        params: {
          error: null
        },
        messageKey: "_transferSitesMustDiffer"
      }
    ];

    _.each(errors, XT.Error.addError);
  };

}());
