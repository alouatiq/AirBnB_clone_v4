$(document).ready(function () {
    const HOST = "http://0.0.0.0:5001";
    const amenities = {};
    const cities = {};
    const states = {};

    // Handle filters
    $('ul li input[type="checkbox"]').bind("change", (e) => {
        const el = e.target;
        let tt;
        switch (el.id) {
            case "state_filter":
                tt = states;
                break;
            case "city_filter":
                tt = cities;
                break;
            case "amenity_filter":
                tt = amenities;
                break;
        }
        const dataId = $(this).attr('data-id');
        const dataName = $(this).attr('data-name');
        if (el.checked) {
            tt[dataId] = dataName;
        } else {
            delete tt[dataId];
        }
        if (el.id === "amenity_filter") {
            $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
        } else {
            $(".locations h4").text(
                Object.keys(Object.assign({}, states, cities)).sort().join(", ")
            );
        }
    });

    // get status of API
    $.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
        if (data.status === "OK") {
            $("div#api_status").addClass("available");
        } else {
            $("div#api_status").removeClass("available");
        }
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
        const filterData = { amenities: Object.keys(amenities) };
        fetchPlaces(filterData);
    });

    // fetch data about places
    // filterData = {}
    // $.post({
    //     url: `${HOST}/api/v1/places_search`,
    //     data: JSON.stringify({ filterData }),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     success: (data) => {
    //         data.forEach((place) =>
    //             $("section.places").append(
    //                 `<article>
    //                 <div class="top_article">
    //                             <h2>${place.name}</h2>
    //                             <div class="price_by_night">
    //                                 <h3>${place.price_by_night}</h3>
    //                             </div>
    //                         </div>

    //                         <div class="information">
    //                             <div class="max_guest"><h3>${place.max_guest} Guests</h3></div>
    //                             <div class="number_rooms"><h3>${place.number_rooms} Bedrooms</h3></div>
    //                             <div class="number_bathrooms"><h3>${place.number_bathrooms} Bathrooms</h3></div>
    //                         </div>

    //                         <div class="description">
    //                             <p>${place.description}</p>
    //                         </div>
    // 			    </article>`
    //             )
    //         );
    //     },
    //     dataType: "json",
    // });

    // // search places
    // $("#filter_btn").bind("click", searchPlace);
    // filterData = { amenities: Object.keys(amenities) };
    // searchPlace(filterData);
});