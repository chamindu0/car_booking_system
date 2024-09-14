document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const passengerId = urlParams.get('passengerId');  // Extract the passengerId from the URL
    
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

            data.bookings.forEach(booking => {
                const listItem = document.createElement('li');
                listItem.textContent = `Booking: ${booking.pickupLocation} to ${booking.dropoffLocation}`;
                bookingList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching bookings:', error));
}

// Create a new booking
document.getElementById('createBookingForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const date = document.getElementById('date').value;

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
            pickupLocation,
            dropoffLocation,
            date,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Booking created successfully');
            // Refresh bookings after creating a new one
            fetchPassengerBookings(passengerId);
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
            // Refresh bookings after canceling
            fetchPassengerBookings(passengerId);
        } else {
            alert('Error canceling booking');
        }
    })
    .catch(error => console.error('Error canceling booking:', error));
}

initMap();

async function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const passengerLocation = { lat: latitude, lng: longitude };
                const radius = 10; // Define the radius in km

                const drivers = await fetchDrivers(passengerLocation, radius);
                displayMap(passengerLocation, drivers);
                displayDriverList(drivers);  // Add this line to display the driver list
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
    const response = await fetch(`http://localhost:3001/drivers/closest?lat=${passengerLocation.lat}&lng=${passengerLocation.lng}&radius=${radius}`);
    return await response.json();
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

    drivers.forEach(driver => {
        new google.maps.Marker({
            position: { lat: driver.latitude, lng: driver.longitude },
            map: map,
            title: `Driver ${driver.id} - ${driver.distance.toFixed(2)} km`,
        });
    });
}

function displayDriverList(drivers) {
    const driverList = document.getElementById('driverList');
    driverList.innerHTML = '';

    drivers.forEach(driver => {
        const listItem = document.createElement('li');
        listItem.textContent = `Driver ID: ${driver.id}, Distance: ${driver.distance.toFixed(2)} km`;
        driverList.appendChild(listItem);
    });
}

});