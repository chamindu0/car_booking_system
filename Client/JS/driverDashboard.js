window.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('driverId');
    try {
        if (driverId) {
            const response = await fetch(`http://localhost:3001/driver/details?driverId=${driverId}`);
            console.log(driverId);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const driverData = await response.json();

            // Update the UI with driver details
            document.getElementById('name').textContent = driverData.name;
            document.getElementById('vehicleNo').textContent = driverData.vehicleNo;
            document.getElementById('vehicleType').textContent = driverData.vehicleType;
            document.getElementById('email').textContent = driverData.email;
            document.getElementById('phone').textContent = driverData.phone;
            document.getElementById('availability').textContent = driverData.availability ? "available" : "busy";

            // Initialize the availability button text
            document.getElementById('toggleAvailability').textContent = driverData.availability ? "Set as Busy" : "Set as Available";

            // // Initialize the Google Map
            // if (driverData.location && driverData.location.lat && driverData.location.lng) {
            //     initMap(driverData.location);
            // } else {
            //     console.error('Driver location data is missing.');
            // }
        } else {
            console.error('No driverId found in the URL');
        }
    } catch (error) {
        console.error('Error fetching driver details:', error);
    }
});

// Toggle availability when the driver clicks the button
document.getElementById('toggleAvailability').addEventListener('click', async function() {
    try {
        const availabilityElement = document.getElementById('availability');
        const currentStatus = availabilityElement.textContent.trim() === "available";
        const newStatus = !currentStatus; // Toggle status

        // Update availability on the backend
        const response = await fetch('http://localhost:3001/driver/availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability: newStatus }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();
        if (result.success) {
            // Update UI with the new availability status
            availabilityElement.textContent = newStatus ? "available" : "busy";
            document.getElementById('toggleAvailability').textContent = newStatus ? "Set as Busy" : "Set as Available";
        } else {
            alert('Failed to update availability.');
        }
    } catch (error) {
        console.error('Error updating availability:', error);
    }
});

// Fetch available hires and display them in the UI
document.getElementById('pickHire').addEventListener('click', async function() {
    try {
        const response = await fetch('http://localhost:3001/driver/hires');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const hires = await response.json();

        const hireList = document.getElementById('hireList');
        hireList.innerHTML = ''; // Clear the list

        hires.forEach(hire => {
            const listItem = document.createElement('li');
            listItem.textContent = `Passenger: ${hire.passenger.name}, Pickup: ${hire.pickupLocation}, Drop-off: ${hire.dropoffLocation}`;
            hireList.appendChild(listItem);

            // Option to accept hire
            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.addEventListener('click', async function() {
                await acceptHire(hire._id);
            });
            listItem.appendChild(acceptButton);
        });
    } catch (error) {
        console.error('Error fetching available hires:', error);
    }
});

// Function to accept a hire
async function acceptHire(hireId) {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('driverId');  // Get driverId from the URL

    try {
        // Correct the query parameters in the fetch URL
        const response = await fetch(`http://localhost:3001/driver/hires/accept?hireId=${hireId}&driverId=${driverId}`,
         {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const result = await response.json();

        if (result.success) {
            alert('Hire accepted successfully!');
        } else {
            alert('Failed to accept hire.');
        }
    } catch (error) {
        console.error('Error accepting hire:', error);
    }
}



function initMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        console.log('Latitude:', latitude, 'Longitude:', longitude);
                        
                        const map = new google.maps.Map(document.getElementById('map'), {
                            center: { lat: latitude, lng: longitude },
                            zoom: 12,
                        });

                        new google.maps.Marker({
                            position: { lat: latitude, lng: longitude },
                            map: map,
                            title: 'Your Location',
                        });
                    },
                    error => {
                        console.error('Error getting location:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        }