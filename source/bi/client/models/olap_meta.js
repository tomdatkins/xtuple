/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, */

(function () {
  "use strict";

  XM.SalesMetadata = XM.olapMetadata.extend({
    schema: [
        {name: "SOByPeriod",  //Backlog
          measures: [{title: "balanceBacklog", name: "Balance, Orders Unfulfilled"},
                     {title: "daysBookingToShipment", name: "Days, Order to Delivery"},
                     {title: "interestB2SImpact", name: "Interest, O2D Impact"},
                     {title: "countBacklog", name: "Count, Orders"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code]"},
                     {title: "booking", name: "Order", nameProperty: "Order Name", codeHier: "[Order]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region]"}],
          timeDimension: {name: "Fiscal Period.Fiscal Period CL"},
        },
        
        {name: "SODelivery", //Shipment
          measures: [{title: "amountShipment", name: "Amount, Delivery Gross"},
                     {title: "amountCost", name: "Amount, Cost Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "countShipments", name: "Count, Deliveries"},
                     {title: "amountProfit", name: "Amount, Profit Gross"},
                     {title: "amountShipmentDiscount", name: "Amount, Delivery Discount"},
                     {title: "percentageMargin", name: "Percentage, Gross Margin"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code]"},
                     {title: "shipment", name: "Delivery", nameProperty: "Delivery Name", codeHier: "[Delivery]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region]"}],
          timeDimension: {name: "Delivery Date.Calendar"}
        },
        {name: "SOOrder", //Booking
          measures: [{title: "amountBooking", name: "Amount, Order Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "amountBookingDiscount", name: "Amount, Order Discount"},
                     {title: "averageBooking", name: "Average, Order Gross"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code]"},
                     {title: "booking", name: "Order", nameProperty: "Order Name", codeHier: "[Order]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region]"}],
          timeDimension: {name: "Issue Date.Calendar"}
        }
      ]
    });
  
}());
