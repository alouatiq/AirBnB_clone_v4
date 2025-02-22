$(document).ready(function () {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // Function to update the selected amenities display
    const updateSelectedAmenities = () => {
        const amenityNames = Object.values(selectedAmenities).join(', ');
        $('#selected_amenities').text(amenityNames);
    };

    // Function to update the selected locations display
    const updateSelectedLocations = () => {
        const selectedLocationNames = [
            ...Object.values(selectedStates),
            ...Object.values(selectedCities)
        ].join(', ');

        $('#selected_locations').text(selectedLocationNames);
    };

    $('input[type=checkbox]').change(function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const type = $(this).data('type');

        if (this.checked) {
            if (type === 'amenity') selectedAmenities[id] = name;
            else if (type === 'state') selectedStates[id] = name;
            else if (type === 'city') selectedCities[id] = name;
        } else {
            if (type === 'amenity') delete selectedAmenities[id];
            else if (type === 'state') delete selectedStates[id];
            else if (type === 'city') delete selectedCities[id];
        }

        updateSelectedAmenities();
        updateSelectedLocations(); // Update selected locations when states or cities change
    });

    const apiUrlStatus = 'http://127.0.0.1:5001/api/v1/status/';
    const updateApiStatus = () => {
        $.ajax({
            type: 'GET',
            url: apiUrlStatus,
            success: (data) => {
                if (data.status === 'OK') {
                    $('#api_status').addClass('available');
                } else {
                    $('#api_status').removeClass('available');
                }
            },
            error: () => {
                $('#api_status').removeClass('available');
            }
        });
    };

    const apiUrlPlacesSearch = 'http://127.0.0.1:5001/api/v1/places_search/';

    const updatePlaces = () => {
        const requestData = {
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities)
        };

        $.ajax({
            type: 'POST',
            url: apiUrlPlacesSearch,
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: (data) => {
                displayPlaces(data);
            },
            error: () => {
                console.error('Error loading places.');
            }
        });
    };

    const displayPlaces = (places) => {
        const placesSection = $('.places');
        placesSection.empty();

        places.forEach((place) => {
            const article = $('<article></article>');
            article.append(`<div class="top_article">
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
                            </div>`);

            placesSection.append(article);
        });
    };

    updateApiStatus();
    updatePlaces();

    $('button').click(() => {
        updatePlaces();
    });
});