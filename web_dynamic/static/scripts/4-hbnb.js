$(document).ready(function () {
    const selectedAmenities = {};

    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Handle amenities selection
    $('input[type="checkbox"]').change(function () {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        $('#selected_amenities').text(Object.values(selectedAmenities).join(', '));
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
        const filterData = { amenities: Object.keys(selectedAmenities) };
        fetchPlaces(filterData);
    });
});
