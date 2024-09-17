document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const passengerId = urlParams.get('passengerId');  // Extract the passengerId from the URL
    console.log(passengerId)
    if (!passengerId) {
        console.error('Passenger ID not found in the URL');
        return;
    }
    
    // Fetch passenger profile
    fetch(`http://localhost:3001/passenger/profile/${passengerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('name').textContent = data.passenger.name;
                document.getElementById('email').textContent = data.passenger.email;
                document.getElementById('phone').textContent = data.passenger.phone;
            } else {
                alert('Error fetching profile');
            }
        })
        .catch(error => console.error('Error fetching profile:', error));

    // Fetch passenger bookings
    fetchPassengerBookings(passengerId);

    // Fetch passenger trip history
    fetch(`http://localhost:3001/passenger/history/${passengerId}`)
        .then(response => response.json())
        .then(data => {
            const tripHistoryList = document.getElementById('tripHistoryList');
            tripHistoryList.innerHTML = '';

            data.history.forEach(trip => {
                const listItem = document.createElement('li');
                listItem.textContent = `Trip: ${trip.pickupLocation} to ${trip.dropoffLocation} - ${trip.date}`;
                tripHistoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching trip history:', error));

 // Fetch passenger bookings
function fetchPassengerBookings(passengerId) {
    fetch(`http://localhost:3001/passenger/bookings/${passengerId}`)
        .then(response => response.json())
        .then(data => {
            const bookingList = document.getElementById('bookingList');
            bookingList.innerHTML = '';
            console.log(data);
            data.bookings.forEach(booking => {
                const listItem = document.createElement('li');
                listItem.textContent = `Booking: ${booking.pickupLocation} to ${booking.dropoffLocation}`;

                // Create Cancel button
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.addEventListener('click', () => cancelBooking(booking._id));

                // Append Cancel button to the list item
                listItem.appendChild(cancelButton);

                // Append the list item to the booking list
                bookingList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching bookings:', error));
}

// Cancel a booking by booking ID
function cancelBooking(bookingId) {
    fetch(`http://localhost:3001/bookings/cancel/${bookingId}`, {
        method: 'DELETE', // or 'POST' depending on how your backend handles cancellation
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Booking ${bookingId} canceled successfully`, data);
        // Optionally, refresh the bookings list after cancellation
        fetchPassengerBookings(passengerId);
    })
    .catch(error => console.error('Error canceling booking:', error));
}

    // Create a new booking
    document.getElementById('newBookingBtn').addEventListener('click', (event) => {
        event.preventDefault();

        const pickupLocation = document.getElementById('pickupLocation').value;
        const driverSelect = document.getElementById("driverSelect");
        const driverId = driverSelect.options[driverSelect.selectedIndex].value;
        const dropoffLocation = document.getElementById('dropoffLocation').value;
        const date = document.getElementById('date').value;
        const distance = distanceValue;
        const fare = fareValue;

        const urlParams = new URLSearchParams(window.location.search);
        const passengerId = urlParams.get('passengerId');

        // Make the POST request to create a new booking
        fetch(`http://localhost:3001/passenger/bookings/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                passengerId,
                driverId,
                pickupLocation,
                dropoffLocation,
                date,
                distance,
                fare,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success == true) {
                alert('Booking created successfully');
    
            } else {
                alert('Error creating booking');
            }
        })
        .catch(error => console.error('Error creating booking:', error));
    });

    // Cancel booking
    function cancelBooking(bookingId) {
        const urlParams = new URLSearchParams(window.location.search);
        const passengerId = urlParams.get('passengerId');

        fetch(`http://localhost:3001/passenger/bookings/${bookingId}/cancel`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Booking canceled successfully');
                // Refresh bookings after; canceling
                fetchPassengerBookings(passengerId);
            } else {
                alert('Error canceling booking');
            }
        })
        .catch(error => console.error('Error canceling booking:', error));
    }

    async function initMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const passengerLocation = { lat: latitude, lng: longitude };
                    const radius = 100; // Define the radius in km

                    try {
                        const response = await fetchDrivers(passengerLocation, radius);
                        const drivers = response.drivers || []; // Extract the drivers array
                        displayMap(passengerLocation, drivers);
                        displayDriverList(drivers);  // Add this line to display the driver list
                    } catch (error) {
                        console.error('Error fetching drivers:', error);
                    }
                },
                error => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    async function fetchDrivers(passengerLocation, radius) {
        try {
            const response = await fetch(`http://localhost:3001/drivers/closest?lat=${passengerLocation.lat}&lng=${passengerLocation.lng}&radius=${radius}`);
            const data = await response.json();
            console.log('Fetched drivers:', data); // Verify the response
            return data; // Return the full response object
        } catch (error) {
            console.error('Error fetching drivers:', error);
            return { drivers: [] }; // Return an empty drivers array in case of error
        }
    }

    function displayMap(passengerLocation, drivers) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: passengerLocation,
            zoom: 12,
        });

        new google.maps.Marker({
            position: passengerLocation,
            map: map,
            title: 'Your Location',
        });

        // Ensure drivers is an array
        if (Array.isArray(drivers) && drivers.length > 0) {
            drivers.forEach(driver => {
                // Check if distance is defined and is a number
                const distance = typeof driver.distance === 'number' ? driver.distance.toFixed(3) : 'N/A';
                new google.maps.Marker({
                    position: { lat: driver.location.coordinates[1], lng: driver.location.coordinates[0] }, // Latitude and Longitude from MongoDB coordinates
                    map: map,
                    title: `Driver ${driver._id} - ${distance} km`,
                });
            });
        } else {
            console.error('No drivers to display on the map');
        }
    }
function displayDriverList(drivers) {
    const driverSelect = document.getElementById('driverSelect');
    driverSelect.innerHTML = '<option value="">-- Select a Driver --</option>'; // Clear existing options

    // Ensure drivers is an array
    if (Array.isArray(drivers) && drivers.length > 0) {
        drivers.forEach(driver => {
            const distance = typeof driver.distance === 'number' ? driver.distance.toFixed(2) : 'N/A';

            // Create a new option element for each driver
            const option = document.createElement('option');
            option.value = driver._id; // Use the vehicle number as the value
            option.textContent = `Driver ID: ${driver.vehicleNo}, Distance: ${Math.floor(Math.random(1)*5)} km`; // Display driver details

            // Append the option to the select dropdown
            driverSelect.appendChild(option);
        });
    } else {
        // If no drivers are available, show a default option
        driverSelect.innerHTML = '<option value="">No drivers available nearby</option>';
    }
}
    // Initialize map
    initMap();



//calculate distance and fare
let originInput = document.getElementById('pickupLocation');
let destinationInput = document.getElementById('dropoffLocation');

originInput.addEventListener('input', calculateDistanceAndFare);
destinationInput.addEventListener('input', calculateDistanceAndFare);



let distanceValue;
let fareValue;

function calculateDistanceAndFare() {
    const origin = originInput.value;
    const destination = destinationInput.value;

    if (origin && destination) {
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC
        }, function (response, status) {
            if (status === 'OK') {
                const distance = response.rows[0].elements[0].distance.value / 1000; // Distance in km
                distanceValue = distance; // Assign to external variable
                const distanceText = response.rows[0].elements[0].distance.text;

                document.getElementById('result').textContent = `Distance: ${distanceText}`;

                // Calculate fare
                const baseFare = 300;
                const farePerKm = 100;
                const fare = baseFare + (distance * farePerKm);
                fareValue = fare; // Assign to external variable

                document.getElementById('fare').textContent = `Fare: Rs ${fare.toFixed(2)}`;
            } else {
                console.error('Error calculating distance:', status);
            }
        });
    }
}
// get TripHistory from backend

fetchTripHistory(passengerId);

function fetchTripHistory(passengerId) {

    fetch(`http://localhost:3001/history/${passengerId}`)
        .then(response => response.json())
        .then(data => {
            const tripHistoryList = document.getElementById('tripHistoryList');
            tripHistoryList.innerHTML = '';
             console.log(data);
            data.history.forEach(trip => {
                const listItem = document.createElement('li');
                listItem.textContent = `Trip: ${trip.pickupLocation} to ${trip.dropoffLocation} - Status: ${trip.status}`;
                
                // Add payment and rating options if trip is completed
                if (trip.status === 'accepted') {
                    const payButton = document.createElement('button');
                    payButton.textContent = 'Pay';
                    payButton.addEventListener('click', () => openPaymentModal(trip));

                    const rateButton = document.createElement('button');
                    rateButton.textContent = 'Rate';
                    rateButton.addEventListener('click', () => openRatingModal(trip));
                    console.log(trip)
                    listItem.appendChild(payButton);
                    listItem.appendChild(rateButton);
                }

                tripHistoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching trip history:', error));
        
}

// Open payment modal
function openPaymentModal(trip) {
    document.getElementById('fareAmount').textContent = `Rs.${trip.fare}`;
    document.getElementById('paymentModal').style.display = 'block';
    document.getElementById('payBtn').onclick = () => payForTrip(trip._id);
}

// Handle payment
function payForTrip(tripId) {
    fetch(`http://localhost:3001/pay/${tripId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment successful');
            document.getElementById('paymentModal').style.display = 'none';
            fetchTripHistory(passengerId); // Refresh history
        } else {
            alert('Error processing payment');
        }
    })
    .catch(error => console.error('Error processing payment:', error));
}

// Open rating modal
function openRatingModal(trip) {
    document.getElementById('ratingModal').style.display = 'block';
    document.getElementById('submitRatingBtn').onclick = () => submitRating(trip._id);
}

// Handle rating submission
function submitRating(tripId) {
    const rating = document.getElementById('ratingInput').value;
    
    fetch(`http://localhost:3001/rate/${tripId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Rating submitted successfully');
            document.getElementById('ratingModal').style.display = 'none';
            fetchTripHistory(passengerId); // Refresh history
        } else {
            alert('Error submitting rating');
        }
    })
    .catch(error => console.error('Error submitting rating:', error));
}

// Select the modals and close buttons
const paymentModal = document.getElementById('paymentModal');
const ratingModal = document.getElementById('ratingModal');
const closeButtons = document.querySelectorAll('.closeModalBtn');

// Add event listeners to close buttons
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide the modals when "X" is clicked
        paymentModal.style.display = 'none';
        ratingModal.style.display = 'none';
    });
});

});



