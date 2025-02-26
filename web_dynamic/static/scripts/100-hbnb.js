$(document).ready(function () {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Function to update locations display
    function updateLocationsDisplay() {
        const locations = [
            ...Object.values(selectedStates),
            ...Object.values(selectedCities)
        ];
        $('#selected_locations').text(locations.join(', ') || '\u00A0');
    }

    // Handle state selection
    $('input#state_filter').change(function () {
        const stateId = $(this).attr('data-id');
        const stateName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedStates[stateId] = stateName;
        } else {
            delete selectedStates[stateId];
        }

        updateLocationsDisplay();
    });

    // Handle city selection
    $('input#city_filter').change(function () {
        const cityId = $(this).attr('data-id');
        const cityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedCities[cityId] = cityName;
        } else {
            delete selectedCities[cityId];
        }

        updateLocationsDisplay();
    });

    // Handle amenities selection
    $('input#amenity_filter').change(function () {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        $('#selected_amenities').text(Object.values(selectedAmenities).join(', ') || '\u00A0');
    });

    // Function to fetch and display places
    function fetchPlaces(filters = {}) {
        $('.places').empty();
        $('.places').append('<h1>Places</h1>');

        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function (data) {
                for (const place of data) {
                    const placeHTML = `
                        <article>
                            <div class="top_article">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">
                                    <h3>${place.price_by_night}</h3>
                                </div>
                            </div>

                            <div class="information">
                                <div class="max_guest"><h3>${place.max_guest} Guests</h3></div>
                                <div class="number_rooms"><h3>${place.number_rooms} Bedrooms</h3></div>
                                <div class="number_bathrooms"><h3>${place.number_bathrooms} Bathrooms</h3></div>
                            </div>

                            <div class="description">
                                <p>${place.description}</p>
                            </div>
                        </article>
                    `;
                    $('.places').append(placeHTML);
                }
            }
        });
    }

    // Initial fetch (no filters)
    fetchPlaces();

    // Fetch places when the Search button is clicked
    $('#filter_btn').click(function () {
        const filterData = {
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities)
        };
        fetchPlaces(filterData);
    });
});