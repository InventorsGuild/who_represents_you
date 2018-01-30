// @ts-check
// From the old codebase, this should be ported to react components

google.maps.event.addDomListener(window, 'load', function() {
  var places = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
  google.maps.event.addListener(places, 'place_changed', function() {
    var place = places.getPlace();
    var address = place.formatted_address;
    var latitude = place.geometry.location.A;
    var longitude = place.geometry.location.F;
    var mesg = 'Address: ' + address;
    mesg += '\nLatitude: ' + latitude;
    mesg += '\nLongitude: ' + longitude;
  });
});

var allAddyInfo;
var addressGuess;

//This section will allow the navigation of pages
function CollapseAll() {
  document.getElementById('greeting').className = 'collapse';
  document.getElementById('representativeResults').className = 'collapse';
}

$(document).keypress(function(e) {
  if (e.which == 13) {
    if (document.getElementById('txtPlaces').value != '') {
      getInfo();
      document.getElementById('txtPlaces').reset();
    }
  }
});

CollapseAll();
document.getElementById('greeting').className = '';

function navPage(pageName) {
  if (pageName === 'representativeResults') {
    document.getElementById('greeting').className = '';
  }
  CollapseAll();
  document.getElementById(pageName).className = '';
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  $.get(
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      crd.latitude +
      ',' +
      crd.longitude +
      '&sensor=false',
    function(data, status) {
      allAddyInfo = data;
      addressGuess = data.results[0].formatted_address;
      document.getElementById('dateResult').innerText = 'Welcome from: ' + addressGuess;
      document.getElementById('Confirmation').className = '';
      getGovtInfo(addressGuess);
    }
  );
}

function error(err) {
  console.log(err);
  document.getElementById('greeting').className = '';
  document.getElementById('warningMessage').className = 'row alertBoxContainer';
}

function clearResults() {
  document.getElementById('representativeResults').innerHTML = '';
}

function getInfo() {
  clearResults();
  addy = document.getElementById('txtPlaces').value;
  getGovtInfo(addy);
}

function getGovtInfo(addy) {
  //  addy = addy.replace(/,/g , "%");
  clearResults();
  addy =
    'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyCS7dd6uTeV4wfO-aBbdpln7tqJvxU546U&address=' +
    addy;
  $.get(addy, function(data, status) {
    navPage('representativeResults');
    for (var i = -1; i < data.officials.length; i++) {
      //set variables for use
      currentPres = {};

      console.log(data.officials[i]);

      function getWebsite() {
        if (data.officials[i].urls && data.officials[i].urls[0]) {
          currentPres.website = data.officials[i].urls[0];
          currentPres.website =
            `<a target="_blank" class="btn btn-primary" href="` +
            currentPres.website +
            `">Visit Website</a>`;
          return currentPres.website;
        } else {
          return '<br>';
        }
      }

      function getParty() {
        if (data.officials[i].party) {
          currentPres.party = data.officials[i].party;
          if (currentPres.party != 'undefined') {
            return currentPres.party;
          }
        } else {
          return 'Unknown Political Association';
        }
      }

      function getTitle() {
        try {
          if (data.offices[i].name) {
            currentPres.title = data.offices[i].name;
            return currentPres.title;
          }
        } catch (e) {
          return 'City Official';
        }
      }

      function getName() {
        try {
          currentPres.name = data.officials[i].name;
          return currentPres.name;
        } catch (e) {}
      }

      function getUrl() {
        try {
          if (data.officials[i].photoUrl[0]) {
            currentPres.pic = data.officials[i].photoUrl;
            currentPres.pic =
              `<a href="#">
                    <img id="0Pic" width="300" height="300"class="img-responsive" src="` +
              currentPres.pic +
              `" alt="">
                    </a>`;
            return currentPres.pic;
          }
        } catch (e) {
          currentPres.pic = `<a href="#">
                    <img id="0Pic" width="300" height="300"class="img-responsive" src="https://i0.wp.com/circuits.io/assets/circuits-default-gravatar.png?ssl=1" alt="">
                    </a>`;
          return currentPres.pic;
        }
      }

      function getCity() {
        try {
          currentPres.city = data.officials[i].address[0].city;
          if (currentPres.city != undefined) {
            return currentPres.city;
          }
        } catch (e) {
          return '<br>';
        }
      }

      function getLine1() {
        try {
          currentPres.line1 = data.officials[i].address[0].line1;
          return currentPres.line1;
        } catch (e) {
          return '<br>';
        }
      }

      function getLine2() {
        try {
          if (data.officials[i] && data.officials[i].address[0].line2) {
            currentPres.line2 = data.officials[i].address[0].line2;
            currentPres.line2 = `<h4>` + currentPres.line2 + `</h4>`;
            console.log(currentPres.line2);
            return currentPres.line2;
          } else {
            return ' ';
          }
        } catch (e) {
          return ' ';
        }
      }

      function getState() {
        try {
          currentPres.state = data.officials[i].address[0].state;
          return currentPres.state;
        } catch (e) {
          return '<br>';
        }
      }

      function getZip() {
        try {
          currentPres.zip = data.officials[i].address[0].zip;
          return currentPres.zip;
        } catch (e) {
          return '<br>';
        }
      }

      function getNumber() {
        try {
          currentPres.phone = data.officials[i].phones[0];
          return currentPres.phone;
        } catch (e) {
          return '<br>';
        }
      }

      if (getName()) {
        var thisThing =
          `
              <!-- Project One -->
        <div class="row">
            <div class="col-md-5">
                ` +
          getUrl() +
          `
            </div>
            <div class="col-md-5">
                <h3 id="0Name">` +
          getName() +
          `</h3>
                <h4 id="0Title">` +
          getTitle() +
          `</h4>
                <h4 id="0Title">` +
          getNumber() +
          `</h4>
                <h4>` +
          getParty() +
          `
                <h4>` +
          getCity() +
          `</h4>
                <h4>` +
          getLine1() +
          `</h4>
                ` +
          getLine2() +
          `
                <h4>` +
          getState() +
          `</h4>
                <h4>` +
          getZip() +
          `</h4>
                ` +
          getWebsite() +
          `             

            </div>
        </div>
        <!-- /.row -->

        <hr>

      `;

        document.getElementById('representativeResults').innerHTML =
          document.getElementById('representativeResults').innerHTML + thisThing;
      }
    }
  });
}

navigator.geolocation.getCurrentPosition(success, error, options);
