$(document).ready(function() {
  var selectedMap = "map-container-block";
  var selectedSegment = "all";

  $("#cluster-filter").on("change", function() {
    selectedMap = $(this).val();
    openMap(selectedMap);
  });

  $("#segments-filter").on("change", function() {
    selectedSegment = $(this).val();
    clearData();
  });

  //Back button from greater london to main map
  $("#back-main__map").on("click", function() {
    $("#london-block").fadeOut(500);
    $("#map-container-block").fadeIn(500);
    $("#cluster-filter").val("map-container");
  });

  //Back button from central london to greater London map
  $("#back-greaterLondon__map").on("click", function() {
    $("#centralLondon-block").fadeOut(500);
    $("#london-block").fadeIn(500);
    $("#cluster-filter").val("london");
  });

  //Render pins global
  function globalMap() {
    var data = mapData;
    var londonLength = 0;

    //Render all pins
    if (selectedSegment !== "all") {
      for (var key in data) {
        var allData = data[key];
        var regions = key;

        for (var city in allData) {
          var cityName = city;
          var city = allData[city];

          var length = 0;

          for (var i = 0; i < city.length; i++) {
            if (city[i].segment.indexOf(selectedSegment) > -1) {
              length++;
            }
          }

          if (length > 0 && regions !== "countryClub") {
            var template = window.pinTemplate();
            pin = template
              .replace(/{{label}}/g, cityName)
              .replace(/{{cityLabel}}/g, cityName)
              .replace(/{{id}}/g, "main-" + cityName.split(" ").join("-"))
              .replace(/{{region}}/g, regions)
              .replace(/{{hotelLength}}/g, length);

            $(pin).appendTo("#map-container-block .map-data");
          }
        }
      }

      var londonArray = londonData.greaterLondon.concat(
        londonData.centralLondon
      );

      for (var i = 0; i < londonArray.length; i++) {
        if (londonArray[i].segment.indexOf(selectedSegment) > -1) {
          londonLength++;
        }
      }

      if (londonLength > 0) {
        var template = window.pinTemplate();
        var pin = template
          .replace(/{{label}}/g, "london")
          .replace(/{{id}}/g, "main-london-map")
          .replace(/{{region}}/g, "")
          .replace(/{{hotelLength}}/g, londonLength);

        $(pin).appendTo("#map-container-block .map-data");
      }
    } else {
      for (var key in data) {
        var allCity = data[key];
        var regions = key;

        for (city in allCity) {
          var cityName = city;
          var cityLength = allCity[city].length;

          if (cityLength < 2) {
            cityLength = "";
          }

          if (regions !== "countryClub") {
            var template = window.pinTemplate();
            pin = template
              .replace(/{{id}}/g, "main-" + cityName.split(" ").join("-"))
              .replace(/{{label}}/g, cityName)
              .replace(/{{cityLabel}}/g, cityName)
              .replace(/{{region}}/g, regions)
              .replace(/{{hotelLength}}/g, cityLength);

            $(pin).appendTo("#map-container-block .map-data");
          }
        }
      }

      var londonLength =
        londonData.centralLondon.length + londonData.greaterLondon.length;
      var template = window.pinTemplate();
      pin = template
        .replace(/{{id}}/g, "main-london-map")
        .replace(/{{label}}/g, "london")
        .replace(/{{region}}/g, "")
        .replace(/{{hotelLength}}/g, londonLength);

      $(pin).appendTo("#map-container-block .map-data");
    }
  }

  //Render Greater London pins
  function londonMap() {
    var centralLondonRegion = Object.keys(londonData)[0];
    var greaterLondonRegion = Object.keys(londonData)[1];

    if (selectedSegment !== "all") {
      //Greater London Pins with filter segments
      for (var data in londonData.greaterLondon) {
        var greaterLondonHotels = londonData.greaterLondon[data];

        if (greaterLondonHotels.segment.indexOf(selectedSegment) > -1) {
          var template = window.londonPinTemplate();
          var pin = template
            .replace(/{{label}}/g, "")
            .replace(/{{cityLabel}}/g, greaterLondonHotels.title)
            .replace(
              /{{id}}/g,
              greaterLondonHotels.title
                .split(/[ ',.]+/)
                .join("-")
                .toLowerCase()
            )
            .replace(/{{region}}/g, greaterLondonRegion)
            .replace(/{{hotelName}}/g, greaterLondonHotels.title)
            .replace(/{{hotelLength}}/g, "");

          $(pin).appendTo("#london-block .map-data");
        }
      }

      //Central London Pin with filter segments
      var centralLondonData = londonData.centralLondon;
      var centralLondonLength = 0;

      for (var i = 0; i < centralLondonData.length; i++) {
        if (centralLondonData[i].segment.indexOf(selectedSegment) > -1) {
          centralLondonLength++;
        }
      }

      if (centralLondonLength > 0) {
        var template = window.pinTemplate();
        var pin = template
          .replace(/{{label}}/g, "central london")
          .replace(/{{id}}/g, "central-london")
          .replace(/{{cityLabel}}/g, "")
          .replace(/{{region}}/g, centralLondonRegion)
          .replace(/{{hotelLength}}/g, centralLondonLength);

        $(pin).appendTo("#london-block .map-data");
      }
    } else {
      //Greater London Pins without filter
      for (var data in londonData.greaterLondon) {
        var greaterLondonHotels = londonData.greaterLondon[data];
        var template = window.londonPinTemplate();
        var pin = template
          .replace(/{{label}}/g, "")
          .replace(/{{cityLabel}}/g, greaterLondonHotels.title)
          .replace(
            /{{id}}/g,
            greaterLondonHotels.title
              .split(/[ ',.]+/)
              .join("-")
              .toLowerCase()
          )
          .replace(/{{region}}/g, greaterLondonRegion)
          .replace(/{{hotelName}}/g, greaterLondonHotels.title)
          .replace(/{{hotelLength}}/g, "");

        $(pin).appendTo("#london-block .map-data");
      }

      //Central London Pin without filter
      var centralLondonLength = londonData.centralLondon.length;

      var template = window.pinTemplate();
      var pin = template
        .replace(/{{label}}/g, "central london")
        .replace(/{{id}}/g, "central-london")
        .replace(/{{cityLabel}}/g, "")
        .replace(/{{region}}/g, centralLondonRegion)
        .replace(/{{hotelLength}}/g, centralLondonLength);

      $(pin).appendTo("#london-block .map-data");
    }

    $("#central-london-pin").on("click", function() {
      $("#london-block").fadeOut(500);
      $("#centralLondon-block").fadeIn(500);
      $("#cluster-filter").val("centralLondon");
    });
  }

  //Render Central London pins
  function centralLondonMap() {
    var centralLondonRegion = Object.keys(londonData)[0];

    if (selectedSegment !== "all") {
      //Greater London Pins with filter segments
      for (var data in londonData.centralLondon) {
        var centralLondonHotels = londonData.centralLondon[data];

        if (centralLondonHotels.segment.indexOf(selectedSegment) > -1) {
          var template = window.londonPinTemplate();
          var pin = template
            .replace(/{{label}}/g, "")
            .replace(/{{cityLabel}}/g, centralLondonHotels.title)
            .replace(
              /{{id}}/g,
              centralLondonHotels.title
                .split(/[ ',.]+/)
                .join("-")
                .toLowerCase()
            )
            .replace(/{{region}}/g, centralLondonRegion)
            .replace(/{{hotelName}}/g, centralLondonHotels.title)
            .replace(/{{hotelLength}}/g, "");

          $(pin).appendTo("#centralLondon-block .map-data");
        }
      }
    } else {
      for (var data in londonData.centralLondon) {
        var centralLondonHotels = londonData.centralLondon[data];
        var template = window.londonPinTemplate();
        var pin = template
          .replace(/{{label}}/g, "")
          .replace(/{{cityLabel}}/g, centralLondonHotels.title)
          .replace(
            /{{id}}/g,
            centralLondonHotels.title
              .split(/[ ',.]+/)
              .join("-")
              .toLowerCase()
          )
          .replace(/{{region}}/g, centralLondonRegion)
          .replace(/{{hotelName}}/g, centralLondonHotels.title)
          .replace(/{{hotelLength}}/g, "");

        $(pin).appendTo("#centralLondon-block .map-data");
      }
    }
  }

  //Render Maps
  function regionMaps() {
    var maps = Object.keys(mapData);
    var allLabels = Object.keys(cityLabelsData);

    for (var i in maps) {
      map = maps[i];
      renderMap(map);
    }

    for (var j in allLabels) {
      var labelMap = allLabels[j];
      renderLabelMap(labelMap);
    }
  }

  //Change view map
  function openMap(id) {
    var $map = $("#" + id + "-block");
    $(".block-map")
      .not("#" + id + "-block")
      .fadeOut(500);
    $map.fadeIn(500);
  }

  //render city labels on each map
  function renderLabelMap(labelMap) {
    var $element = $("#" + labelMap + "-block");
    var labelsData = cityLabelsData[labelMap];

    for (var i = 0; i < labelsData.length; i++) {
      var cityLabel = labelsData[i];

      var template = window.cityLabelTemplate();
      labels = template
        .replace(
          /{{cityLabelID}}/g,
          labelMap + "-" + cityLabel.split(" ").join("-")
        )
        .replace(/{{cityLabel}}/g, cityLabel);
      $(labels).appendTo($element);
    }
  }

  // Renders each region map with pins
  function renderMap(map) {
    var $element = $("#" + map + "-block .map-data");

    var data = mapData[map];

    if (
      selectedMap !== "london" &&
      selectedMap !== "central-london" &&
      selectedMap !== "map-container" &&
      selectedSegment !== "all"
    ) {
      for (var key in data) {
        var city = data[key];
        var label = key;
        var length = 0;

        for (var i = 0; i < city.length; i++) {
          if (city[i].segment.indexOf(selectedSegment) > -1) {
            length++;
          }
        }

        if (length > 0) {
          var template = window.pinTemplate();
          pin = template
            .replace(/{{label}}/g, label)
            .replace(/{{cityLabel}}/g, label.split(" ").join("-"))
            .replace(/{{id}}/g, "region-" + label)
            .replace(/{{region}}/g, map)
            .replace(/{{hotelLength}}/g, length);

          $(pin).appendTo($element);
        }
      }
    } else {
      for (var city in data) {
        var length = data[city].length;

        if (length < 2) {
          length = "";
        }

        var template = window.pinTemplate();
        pin = template
          .replace(/{{id}}/g, "region-" + city.split(" ").join("-"))
          .replace(/{{label}}/g, city)
          .replace(/{{cityLabel}}/g, city.split(" ").join("-"))
          .replace(/{{region}}/g, map)
          .replace(/{{hotelLength}}/g, length);

        $(pin).appendTo($element);
      }
    }
  }

  //Global popup apart from London
  function openGlobalPopup(city, region) {
    var regions = mapData[region];
    var cityName = regions[city];
    elements.popupData().innerHTML = "";

    if (selectedSegment !== "all") {
      cityName.forEach(function(hotelData) {
        if (hotelData.segment.indexOf(selectedSegment) > -1) {
          var icon = "";
          for (var i = 0; i < hotelData.stars; i++) {
            icon += '<i class="fa fa-star"></i>';
          }

          var template = sliderTemplate();
          template = template
            .replace(/{{image}}/g, hotelData.image)
            .replace(/{{title}}/g, hotelData.title)
            .replace(/{{stars}}/g, icon)
            .replace(/{{address}}/g, hotelData.address)
            .replace(/{{contactInfo}}/g, hotelData.contactInfo)
            .replace(/{{bedrooms}}/g, hotelData.bedrooms)
            .replace(/{{meetings}}/g, hotelData.meetings)
            .replace(/{{suites}}/g, hotelData.suites)
            .replace(/{{delegates}}/g, hotelData.delegates)
            .replace(/{{airport}}/g, hotelData.airport)
            .replace(/{{station}}/g, hotelData.station);

          window.elements.popupData().innerHTML += template;
        }
        $(elements.popupData()).on("init", function(event, slick) {
          $(window.elements.popup()).addClass("toggled");
          $("#pagination").show();
          document.getElementById("pagination").innerHTML =
            "1/" + slick.slideCount;
        });
      });

      initSlick();
    } else {
      cityName.forEach(function(hotelData) {
        var icon = "";
        for (var i = 0; i < hotelData.stars; i++) {
          icon += '<i class="fa fa-star"></i>';
        }

        var template = sliderTemplate();
        template = template
          .replace(/{{image}}/g, hotelData.image)
          .replace(/{{title}}/g, hotelData.title)
          .replace(/{{stars}}/g, icon)
          .replace(/{{address}}/g, hotelData.address)
          .replace(/{{contactInfo}}/g, hotelData.contactInfo)
          .replace(/{{bedrooms}}/g, hotelData.bedrooms)
          .replace(/{{meetings}}/g, hotelData.meetings)
          .replace(/{{suites}}/g, hotelData.suites)
          .replace(/{{delegates}}/g, hotelData.delegates)
          .replace(/{{airport}}/g, hotelData.airport)
          .replace(/{{station}}/g, hotelData.station);

        window.elements.popupData().innerHTML += template;

        $(elements.popupData()).on("init", function(event, slick) {
          $(window.elements.popup()).addClass("toggled");
          $("#pagination").show();
          document.getElementById("pagination").innerHTML =
            "1/" + slick.slideCount;
        });
      });

      initSlick();
    }
  }

  //London Popup
  function openLondonPoup(hotelName, region) {
    var londonAllData = londonData[region];
    var hotel = hotelName;

    londonAllData.forEach(function(hotelName) {
      if (hotelName.title == hotel) {
        var icon = "";
        for (var i = 0; i < hotelName.stars; i++) {
          icon += '<i class="fa fa-star"></i>';
        }

        var template = sliderTemplate();
        template = template
          .replace(/{{image}}/g, hotelName.image)
          .replace(/{{title}}/g, hotelName.title)
          .replace(/{{stars}}/g, icon)
          .replace(/{{address}}/g, hotelName.address)
          .replace(/{{contactInfo}}/g, hotelName.contactInfo)
          .replace(/{{bedrooms}}/g, hotelName.bedrooms)
          .replace(/{{meetings}}/g, hotelName.meetings)
          .replace(/{{suites}}/g, hotelName.suites)
          .replace(/{{delegates}}/g, hotelName.delegates)
          .replace(/{{airport}}/g, hotelName.airport)
          .replace(/{{station}}/g, hotelName.station);

        $(template).appendTo("#popup-data");
        $("#popup-container").addClass("toggled");
      }
    });
  }

  //initializing Slick
  function initSlick() {
    this.popupSlider = $(elements.popupData())
      .not(".slick-initialized")
      .slick({
        dots: false,
        autoplay: false,
        infinite: false,
        arrows: true,
        draggable: true,
        swipeToSlide: true,
        prevArrow:
          '<span class="controls prev-button"><i class="fas fa-chevron-left"></i></span>',
        nextArrow:
          '<span class="controls next-button"><i class="fas fa-chevron-right"></i></span>'
      });

    //Hide the Previous button.
    $(".prev-button").hide();

    this.popupSlider.on("afterChange", function(event, slick, currentSlide) {
      document.getElementById("pagination").innerHTML =
        currentSlide + 1 + "/" + slick.slideCount;

      if (currentSlide === 0) {
        $(".prev-button").hide();
        $(".next-button").show();
      } else {
        $(".prev-button").show();
      }

      //If we're on the last slide hide the Next button.
      if (slick.slideCount === currentSlide + 1) {
        $(".next-button").hide();
      }
    });
  }

  //Click events for popup global apart from london
  window.clickHandler = function(element) {
    if (element.id == "main-london-map-pin") {
      $("#map-container-block").fadeOut(500);
      $("#london-block").fadeIn(500);
      $("#cluster-filter").val("london");
    } else {
      // open popup
      var city = $(element).attr("data-city-label");
      var region = $(element).attr("data-map-region");
      openGlobalPopup(city, region);
    }
  };

  //Click events for popup london
  window.clickHandlerLondon = function(element) {
    var hotelName = $(element).attr("data-city-label");
    var region = $(element).attr("data-map-region");
    openLondonPoup(hotelName, region);
  };
  // Clear all data and render all maps
  function clearData() {
    if (
      selectedMap !== "london-block" &&
      selectedMap !== "centralLondon-block" &&
      selectedMap !== "map-container-block"
    ) {
      $("#" + selectedMap + "-block .map-data").html("");
    }
    if (selectedMap !== "map-container-block") renderMap(selectedMap);

    $(".map-data").html("");
    globalMap();
    regionMaps();
    londonMap();
    centralLondonMap();
  }

  // Close popup function & destroy slick
  window.closePopup = function() {
    var popup = window.elements.popup();
    var popupData = window.elements.popupData();
    $(popup).removeClass("toggled");

    setTimeout(function() {
      $(".slick-initialized").slick("unslick");
      $(popupData).html("");
      $(popupData).removeClass();
      $("#pagination").hide();
    });
  };

  // Close popup
  $(elements.closePopupButton()).on("click", function(event) {
    event.preventDefault();
    window.closePopup();
  });

  globalMap();
  regionMaps();
  londonMap();
  centralLondonMap();

  //Init main map
  $("#map-container-block").fadeIn(500);
});
