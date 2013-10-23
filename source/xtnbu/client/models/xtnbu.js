XT.extensions.xtnbu.initModels = function () {
  XM.BackUp = XM.Document.extend({
    recordType: "XM.BackUp",
    documentKey: "name", // the natural key
    idAttribute: "name" // the natural key
  });

  XM.BackUpCollection = XM.Collection.extend({
    model: XM.BackUp
  });
};
