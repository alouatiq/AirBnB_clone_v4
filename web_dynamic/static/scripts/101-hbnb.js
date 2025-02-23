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
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guests</div>
                                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                            </div>
                            <div class="description">${place.description}</div>
                            <section class="reviews">
                                <h2>Reviews <span class="toggle_reviews" data-id="${place.id}">show</span></h2>
                                <ul class="reviews_list" id="reviews_${place.id}"></ul>
                            </section>
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

    // Toggle Reviews
    $(document).on('click', '.toggle_reviews', function () {
        const toggleBtn = $(this);
        const placeId = toggleBtn.attr('data-id');
        const reviewsList = $(`#reviews_${placeId}`);

        if (toggleBtn.text() === 'show') {
            // Fetch and display reviews
            $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`, function (data) {
                reviewsList.empty();
                for (const review of data) {
                    const reviewHTML = `
                        <li>
                            <h3>From User ID: ${review.user_id}</h3>
                            <p>${review.text}</p>
                        </li>
                    `;
                    reviewsList.append(reviewHTML);
                }
                toggleBtn.text('hide');
            });
        } else {
            // Hide reviews
            reviewsList.empty();
            toggleBtn.text('show');
        }
    });
});
