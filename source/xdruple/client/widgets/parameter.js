/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.XdrupleCommerceContactListParameters",
    kind: "XV.ParameterWidget",
    showLayout: true,
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {name: "firstName", label: "_firstName".loc(), attr: "firstName"},
      {name: "lastName", label: "_lastName".loc(), attr: "lastName"},
      {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "primaryEmail"},
      {name: "phone", label: "_phone".loc(), attr: ["phone", "alternate", "fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {name: "street", label: "_street".loc(), attr: ["address.line1", "address.line2", "address.line3"]},
      {name: "city", label: "_city".loc(), attr: "address.city"},
      {name: "state", label: "_state".loc(), attr: "address.state"},
      {name: "postalCode", label: "_postalCode".loc(), attr: "address.postalCode"},
      {name: "country", label: "_country".loc(), attr: "address.country"},
    ]
  });

}());
