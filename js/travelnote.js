var map,
    current_item = 5,
    infoWindow,
    marker_list = [], 
    travel_data = [{ title: 'Name of the Travel',
                     description: ' Fusce ullamcorper massa a lorem aliquam id tincidunt lectus mollis. Integer vel sem quis diam ultricies dapibus. Morbi ac velit sit amet erat ornare venenatis eu a metus. Integer quis justo nisi, at convallis nisl. Maecenas tincidunt erat sit amet mi volutpat blandit. Donec dapibus tristique commodo. Phasellus hendrerit, massa non condimentum consequat, lacus nisi porttitor mi, in suscipit nulla odio et turpis. Nulla cursus auctor erat id scelerisque. Vivamus rutrum tincidunt leo eget euismod.',
                     route: [{ position: { Lat: 24.0, Lng: 121.3 },
                               caption: 'A good place',
                               note: 'This a good place, a good good place' }, 
                             { position: { Lat: 25.0, Lng: 121.3 },
                               caption: 'A good place',
                               note: 'This a good place, too' },
                             { position: { Lat: 24.0, Lng: 121.0 },
                               caption: 'A good place',
                               note: 'This a good place, too, too.' },
                             { position: { Lat: 24.7, Lng: 118.1 },
                               caption: 'A good place',
                               note: 'This a good place, too, too.' }
                            ]
           }];

function initGoogleMap(map_canvas)
{


    if(map_canvas == undefined) return;
    infoWindow = new google.maps.InfoWindow();
    marker_list = [];
    var position = travel_data[map_canvas.dataset['id']].route[0].position;
    var mapOptions = 
    {
        zoom        : 7,
        center      : new google.maps.LatLng(position.Lat, position.Lng),
        mapTypeId   : google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(map_canvas, mapOptions);

    putMarkers(travel_data[map_canvas.dataset['id']].route);
}

function dummy() { showList(); } 

function loadGoogleMap()
{
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyBsrL1033FnxfNMcggyRu3eG-D1njCaFVI&sensor=false&callback=showList';
    document.body.appendChild(script);

}

function playRoute(route)
{
    for(i=0;i<marker_list.length;i++)
    {
        setTimeout((function(position, idx)
                    {
                        return function() 
                        { 
                            infoWindow.close();
                            showInfoWindow(travel_data[current_item].route[idx].caption, travel_data[current_item].route[idx].note, marker_list[idx]);
                            map.panTo(position);
                        } 
                    })(marker_list[i].position, i),
        2000*(i));
    }
}

function putMarkers(route)
{
    for(var i=0;i<route.length;i++)
    {
        if(i)
        {
            var lineCoordinates = [
              new google.maps.LatLng(route[i-1].position.Lat, route[i-1].position.Lng),
              new google.maps.LatLng(route[i].position.Lat, route[i].position.Lng)
            ];

            var lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            };

            var line = new google.maps.Polyline({
                path: lineCoordinates,
                strokeColor: '#000000',
                strokeOpacity: .5,
                icons: [{
                    icon: lineSymbol,
                    offset: '100%'
                }],
                map: map
            });

        }

        var marker = new google.maps.Marker(
        {
            position: new google.maps.LatLng(route[i].position.Lat, route[i].position.Lng),
            map: map
        });

        marker_list.push(marker);

        (function(marker, route)
        {
            google.maps.event.addListener(marker, 'click', function()
            {
                showInfoWindow(route.caption, route.note, marker);
            });
        })(marker, route[i]);
    }
}

function showInfoWindow(caption, note, marker)
{
    infoWindow.setContent('<strong>' + caption + '</strong>' +
                          '<p>' + note + '</p>');
    infoWindow.open(map, marker);
}

document.onload = loadGoogleMap();


var preScroll       = 0;
var $window         = $(window)
    $wrapper        = $('#wrapper'),
    $current_trip   = undefined;


// for test
for(var i=0;i<10;i++)
{
    travel_data.push(travel_data[0]);
}

$window.on('scroll', function(e)
{
    //console.log(e);
});

$window.on('keydown', function(e)
{
    if(e.keyCode == 39 || e.KeyCode == 40)
    {
        showNext();
    }
    else if(e.keyCode == 37 || e.keyCode == 38)
    {
        showPrev();
    }
    if(e.keyCode >= 37 && e.keyCode <= 40)
        e.preventDefault();
});

function showNext()
{
    var $map_canvas = $current_trip.find('.map-canvas');
    $map_canvas.empty();
    $map_canvas.stop().transition({ background: 'white' }, 400, function()
    {
        $current_trip.removeClass('current').addClass('pre-current').
                      prev().removeClass('pre-current').addClass('pre-pre-current').
                      prev().removeClass('pre-pre-current').addClass('pre-other');

        $current_trip.next().removeClass('post-current').addClass('current').
                      next().removeClass('post-post-current').addClass('post-current').
                      next().removeClass('post-other').addClass('post-post-current');

        $current_trip = $current_trip.next();
        current_item ++;
        initGoogleMap($current_trip.find('.map-canvas').get(0));
    });
}

function showPrev()
{
    var $map_canvas = $current_trip.find('.map-canvas');
    $map_canvas.empty();
    $map_canvas.stop().transition({ background: 'white' }, 400, function()
    {
        $current_trip.prev().removeClass('pre-current').addClass('current').
                      prev().removeClass('pre-pre-current').addClass('pre-current').
                      prev().removeClass('pre-other').addClass('pre-pre-current');

        $current_trip.removeClass('current').addClass('post-current').
                      next().removeClass('post-current').addClass('post-post-current').
                      next().removeClass('post-post-current').addClass('post-other');

        $current_trip = $current_trip.prev();
        current_item --;
        initGoogleMap($current_trip.find('.map-canvas').get(0));
    });
}

function showList()
{
    $.each(travel_data, function(idx, travel)
    {
        var unit = $('<div class="travel-unit">' +
                             '<h1>' + travel.title + '</h1>' + 
                             '<div class="description">' + travel.description + '</div>' +
                             '<div class="play-route-div"><a href="#">>> Play the trip</a></div>' + 
                             '<div class="map-canvas' + (idx === current_item ? ' current-canvas' : '') + '" data-id="' + idx + '"></div>' +
                         '</div>');

        unit.find('.play-route-div a').on('click', function(e)
        {
            e.preventDefault();
            playRoute();
        });
        $wrapper.append(unit);
    });

    $current_trip = $('.current-canvas').parent();
    $current_trip.prev().addClass('pre-current').prev().addClass('pre-pre-current').prevAll().addClass('pre-other');
    $current_trip.addClass('current');
    $current_trip.next().addClass('post-current').next().addClass('post-post-current').nextAll().addClass('post-other');
    initGoogleMap($current_trip.find('.map-canvas').get(0));
}

