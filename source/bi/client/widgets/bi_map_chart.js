/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, L: true, window: true, enyo:true, nv:true, d3:true, RGraph:true console:true */

(function () {

  /**
    Map Chart using Leaflet.  Responsible for:
    -  update of query templates based on pickers
    -  processing multiple query results into Leaflet format
    -  plotting with Leaflet

      ProcessData changes the data from xmla4js format to Leaflet format.
      
      Input format:
      [
        {"[Account Rep.Account Reps by Code].[Account Rep Code].[MEMBER_CAPTION]":"2000",
         "[Ship City].[Country Name].[MEMBER_CAPTION]":"AUSTRIA",
         "[Ship City].[Region Code].[MEMBER_CAPTION]":"AT-AUSTRIA",
         "[Ship City].[City Name].[MEMBER_CAPTION]":"Vienna",
         "[Measures].[Latitude]":"42.12",
         "[Measures].[Longitude]":"16.22",
         "[Measures].[TheSum]":"207115.00"}
         },
      ]
      Output format:
      [
        {
          "values": [
          { 
            "dimension": "2000",
            "geoDimension": "Vienna",
            "latitude": "42.12",
            "longitude": "16.22",
            "measure": ""207115.00"
          },
         ]
        }
      ]
    */
  
  enyo.kind(
    /** @lends XV.BiMapChart # */{
    name: "XV.BiMapChart",
    kind: "XV.BiChartDimMeasure",
    published: {
      dateField: "",
      //endDate: new Date(),
      chartTag: "svg",  //rgraph requires the html5 canvas tag
      labels: [],
      updatedLabels: [],
      nextPeriods: 0, // number of periods to add to end date for forecasts
      toolTips: [],
      plotHeight: 0,
      plotWidth: 0,
      theMap: null,  // need to remember the map as it needs to be destroyed before recreated.
      geoDimension: "[Ship City].[City Name]" // todo move to a button
    },
    
    /**
      Any initialization 
    */
    create: function () {
      this.inherited(arguments);
      this.updatedLabels = [];           //we modify labels with data so we make a this object
    },
    
    /**
      Update Queries based on pickers using cube meta data.  Replace cube name, measure
      name, dimension info.  Use current year & month or next periods if nextPeriods set.
     */
    updateQueries: function () {
      var date = this.getEndDate();
      _.each(this.queryTemplates, function (template, i) {
        var measure = this.schema.getMeasureName(template.cube, this.getMeasure()),
          dimensionGeo = this.getGeoDimension(),
          dimensionHier = this.schema.getDimensionHier(template.cube, this.getDimension()),
          dimensionNameProp = this.schema.getDimensionNameProp(template.cube, this.getDimension());
        this.queryStrings[i] = template.jsonToMDX(this.getWhere());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$measure/g, measure);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$dimensionGeo/g, dimensionGeo);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$dimensionHier/g, dimensionHier);
        this.queryStrings[i] = this.queryStrings[i].replace(/\$year/g, date.getFullYear());
        this.queryStrings[i] = this.queryStrings[i].replace(/\$month/g, date.getMonth() + 1);
      }, this
      );
    },
    /*
     * Process data from input format to output format.
     */
    processData: function () {
      var formattedData = [],
        collection = this.collections[0],
        values = [],
        entry = {},
        dimensionGeo = this.getGeoDimension(),
        dimensionHier = this.schema.getDimensionHier(this.getCube(), this.getDimension());
      function getValueForPartKey(partKey, collection) {
        var theValue = null;
        _.each(collection, function (value, key) {
          if (key.indexOf(partKey) > -1) {
            theValue = value;
          }
        });
        return theValue;
      }
      if (collection.models.length > 0) {
        for (var i = 0; i < collection.models.length; i++) {
          entry = {"dimension": getValueForPartKey(dimensionHier, collection.models[i].attributes),
                    "geoDimension": getValueForPartKey(dimensionGeo, collection.models[i].attributes),
                    "latitude": getValueForPartKey("[Latitude]", collection.models[i].attributes),
                    "longitude": getValueForPartKey("[Longitude]", collection.models[i].attributes),
                    "measure": getValueForPartKey("TheSum", collection.models[i].attributes)
                   };
          values.push(entry);
        }
        formattedData.push({ values: values, measures: [ this.getMeasure()]});
      }
      this.$.chartTitle.setContent(this.makeTitle()); // Set the chart title
      this.$.chartSubTitle.setContent(this.getChartSubTitle()); // Set the chart sub title
      this.setProcessedData(formattedData); // This will drive processDataChanged which will call plot
    },
    
    clickDrill: function (event, figure) {
      var thisEnyo = figure[0].properties["chart.caller"], // We save the object reference in "caller property
        that = thisEnyo,
        indexDD = figure.index,
        itemCollectionName = thisEnyo.drillDown[indexDD].collection,
        ItemCollectionClass = itemCollectionName ? XT.getObjectByName(itemCollectionName) : false,
        itemCollection = new ItemCollectionClass(),
        recordType = itemCollection.model.prototype.recordType,
        listKind = XV.getList(recordType),
        year = thisEnyo.getEndDate().getFullYear(),
        month = thisEnyo.getEndDate().getMonth(),
        startDate = new Date(),
        endDate = new Date(),
        params = [],
        callback = function (value) {
          var id = value.get(that.drillDown[indexDD].attr);
          if (id) {
            that.doWorkspace({workspace: XV.getWorkspace(that.drillDown[indexDD].workspace), id: id});
          }
          // TODO: do anything if id is not present?
        };

      startDate.setFullYear(year, month - 11, 1);
      endDate.setFullYear(year, month + 1, 0);
      thisEnyo.drillDown[indexDD].parameters[0].value = startDate;
      thisEnyo.drillDown[indexDD].parameters[1].value = endDate;
      thisEnyo.drillDown[indexDD].parameters[2].value = startDate;
      thisEnyo.drillDown[indexDD].parameters[3].value = endDate;

      // TODO: the parameter widget sometimes has trouble finding our query requests

      listKind = XV.getList(recordType);
      
      thisEnyo.doSearch({
        list: listKind,
        searchText: "",
        callback: callback,
        parameterItemValues: thisEnyo.drillDown[indexDD].parameters,
        conditions: [],
        query: null
      });
    },
    
    hover: function (e, shape) {
      var event = e;
    },

    plot: function (type) {
      
      var divId = this.$.chart.$.svg.hasNode().id,
        chartId = this.$.chart.hasNode().id,
        that = this,
        //Custom radius and icon create function
        markers = L.markerClusterGroup({
          maxClusterRadius: 120,
          iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers(),
              n = 0;
            for (var i = 0; i < markers.length; i++) {
              n += markers[i].number;
            }
            return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
          },
          //Disable all of the defaults:
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: false
        });
           
      /* rgraph Plot */
      if (this.getProcessedData().length > 0) {
        
        if (this.getTheMap()) {
          this.getTheMap().remove();
        }
        this.setTheMap(new L.Map(chartId), {zoom: 50});
      
        // create the tile layer with correct attribution
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        //var osmAttrib='Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 100});
      
        this.getTheMap().setView(new L.LatLng(36, -76), 9);
        this.getTheMap().addLayer(osm);
        
        _.each(this.getProcessedData()[0].values, function (value) {
          L.marker([value.latitude, value.longitude])
            .addTo(that.getTheMap())
            .bindPopup("<b>" + value.dimension + "</br>" +
                       "<b>" + value.geoDimension + "</br>" +
                       "<b>" + value.measure + "</br>");
        });

        /*
        var area = this.$.chart;
        area.createComponent({
          tag: "img",
          src: "https://b.tile.openstreetmap.org/9/257/170.png",
          class: "leaflet-tile leaflet-tile-loaded",
          style: "width: 256px; height: 256px; left: 511px; top: 96px;"
        });
        this.$.chart.render();
        */
      }
    },
    /**
      Set chart plot size using max sizes from dashboard.
     */
    setPlotSize: function (maxHeight, maxWidth) {
      this.setPlotWidth(Number(maxWidth) - 100);
      this.setPlotHeight(Number(maxHeight) - 196);
    },
    /**
      Make title
     */
    makeTitle: function () {
      var date = this.getEndDate(),
        title = "";
      title = this.getPrefixChartTitle() +
        ("_" + this.getMeasure()).loc() + ", " +
        this.getChartTitle() + " " + "_ending".loc() + " " +
        date.getFullYear() + "-" + (date.getMonth() + 1);
      return title;
    },
    
  });

}());
