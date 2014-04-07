/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, */

(function () {
  "use strict";
  
  /*
   * olapMetaData is not really a Backbone Collection yet but could become one.
   * Could move some of the metadata to a route using xmla4js.  Currently we just 
   * make use of the extend method from Backbone.
   */
  
  XM.olapMetadata = Backbone.Collection.extend({
    schema: [],
    /*
     * Get measures for this cube.
     */
    getMeasures: function (cube) {
      var measures = [],
        cubeSchema = {};
      _.each(this.schema, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.measures, function (item) {
        measures.push(item.title);
      });
      return measures;
    },
    /*
     *  Get measure name for measure title in a cube.
     */
    getMeasureName: function (cube, title) {
      var cubeSchema = {},
        measure = "";
      _.each(this.schema, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.measures, function (item) {
        if (item.title === title) {
          measure = item.name;
        }
      });
      return measure;
    }
      
  });

  XM.SalesMetadata = XM.olapMetadata.extend({
    schema: [
        {name: "SOByPeriod",  //Backlog
          measures: [{title: "balanceBacklog", name: "Balance, Orders Unfulfilled"},
                     {title: "daysBookingToShipment", name: "Days, Order to Delivery"},
                     {title: "interestB2SImpact", name: "Interest, O2D Impact"},
                     {title: "amountShipment", name: "Amount, Delivery Gross"},
                     {title: "amountBooking", name: "Amount, Order Gross"},
                     {title: "amountCost", name: "Amount, Cost Gross"},
                     {title: "countBookings", name: "Count, Orders"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        },
        
        {name: "SODelivery", //Shipment
          measures: [{title: "amountShipment", name: "Amount, Delivery Gross"},
                     {title: "amountCost", name: "Amount, Cost Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "countShipments", name: "Count, Deliveries"},
                     {title: "amountProfit", name: "Amount, Profit Gross"},
                     {title: "amountShipmentDiscount", name: "Amount, Delivery Discount"},
                     {title: "percentageMargin", name: "Percentage, Gross Margin"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        },
        {name: "SOOrder", //Booking
          measures: [{title: "amountBooking", name: "Amount, Order Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "amountBookingDiscount", name: "Amount, Order Discount"},
                     {title: "averageBooking", name: "Average, Order Gross"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        }
      ]
    });
  
  XM.CRMMetadata = XM.olapMetadata.extend({
    schema: [
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amountOpportunity", name: "Amount, Opportunity Gross"},
                     {title: "countOpportunities", name: "Count, Opportunities"},
                     {title: "percentProbabilityOpportunity", name: "Percent, Probability Opportunity"},
                     {title: "amountOpportunityWeighted", name: "Amount, Opportunity Weighted"},
                     {title: "averageOpportunity", name: "Average, Opportunity Gross"},
                     {title: "averageOpportunityWeighted", name: "Average, Opportunity Weighted"},
                     {title: "daysStartToAssigned", name: "Days, Start to Assigned"},
                     {title: "daysStartToTarget", name: "Days, Start to Target"},
                     {title: "daysStartToActual", name: "Days, Start to Actual"}],

          dimensions: [{title: "crmAccount", name: "CRM Account", nameProperty: "CRM Account Name"},
                     {title: "user", name: "User", nameProperty: "User Name"}],
        },
        {name: "CRQuote", //Quote
          measures: [{title: "amountQuote", name: "Amount, Quote Gross"},
                     {title: "countQuotes", name: "Count, Quotes"},
                     {title: "amountQuoteDiscount", name: "Amount, Quote Discount"},
                     {title: "averageQuote", name: "Average, Quote Gross"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        },
        {name: "CROpportunityAndOrder",
          measures: [{title: "amountBooking", name: "Amount, Order Gross"},
                     {title: "amountOpportunity", name: "Amount, Opportunity Gross"},
                     {title: "countOpportunities", name: "Count, Opportunities"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "percentProbabilityOpportunity", name: "Percent, Probability Opportunity"},
                     {title: "amountOpportunityWeighted", name: "Amount, Opportunity Weighted"},
                     {title: "averageBooking", name: "Average, Order Gross"},
                     {title: "averageOpportunity", name: "Average, Opportunity Gross"},
                     {title: "averageOpportunityWeighted", name: "Average, Opportunity Weighted"},
                     {title: "ratioConversion", name: "Ratio, Conversion"},
                     {title: "ratioConversionWeighted", name: "Ratio, Conversion Weighted"}],
        },
        {name: "CROpportunityForecast",  //OpportunityForecast
          measures: [{title: "amountOpportunityForecast", name: "Amount, Opportunity Forecast"},
                     {title: "amountOpportunityForecastWeighted", name: "Amount, Forecast Weighted"},
                     {title: "percentForecastProbability", name: "Percent, Forecast Probability"},
                     {title: "countOpportunities", name: "Count, Opportunities"}],

          dimensions: [],
        },
      ],
    });
  
  XM.CRMOppFunnelMetadata = XM.olapMetadata.extend({
    schema: [
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amountOpportunity", name: "Amount, Opportunity Gross"},
                     {title: "countOpportunities", name: "Count, Opportunities"},
                     {title: "amountOpportunityWeighted", name: "Amount, Opportunity Weighted"},
                     {title: "averageOpportunity", name: "Average, Opportunity Gross"},
                     {title: "averageOpportunityWeighted", name: "Average, Opportunity Weighted"}],
          dimensions: [{title: "crmAccount", name: "CRM Account", nameProperty: "CRM Account Name"},
                     {title: "user", name: "User", nameProperty: "User Name"}],
        },
      ],
    });
  
  XM.CRMFunnelMetadata = XM.olapMetadata.extend({
    schema: [
        {name: "SOOrder", //Booking
          measures: [{title: "amount", name: "Amount, Order Gross"},
                     {title: "count", name: "Count, Orders"},
                     {title: "average", name: "Average, Order Gross"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        },
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amount", name: "Amount, Opportunity Gross"},
                     {title: "count", name: "Count, Opportunities"},
                     {title: "average", name: "Average, Opportunity Gross"}],
          dimensions: [{title: "crmAccount", name: "CRM Account", nameProperty: "CRM Account Name"},
                     {title: "user", name: "User", nameProperty: "User Name"}],
        },
        {name: "CRQuote", //Quote
          measures: [{title: "amount", name: "Amount, Quote Gross"},
                     {title: "count", name: "Count, Quotes"},
                     {title: "average", name: "Average, Quote Gross"}],
          dimensions: [{title: "accountRep", name: "Account Rep", nameProperty: "Account Rep Name"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name"},
                     {title: "product", name: "Product", nameProperty: "Product Name"},
                     {title: "productCategory", name: "Product.Product by Category by Code", nameProperty: "Category Name"},
                     {title: "productClass", name: "Product.Product by Class by Code", nameProperty: "Class Name"},
                     {title: "productType", name: "Product.Product by Type by Code", nameProperty: "Type Name"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region"}],
        },

      ],
    });
  
}());
