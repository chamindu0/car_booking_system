document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude);
            try {
                // Send login request along with geolocation data
                const response = await fetch('http://localhost:3001/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude] // [lng, lat]
                        }
                    }),
                });

                const data = await response.json();
                
                if (data.success) {
                    alert('Login successful!');
                    
                    // Redirect based on the user role
                    if (data.role === 'admin') {
                        window.location.href = "../HTML/admin.html"; // Admin dashboard
                    } else if (data.role === 'driver') {
                        window.location.href = `../HTML/driverDashboard.html?driverId=${data.driverId}`; 
                    } else if (data.role === 'passenger') {
                        window.location.href = `../HTML/passengerDashboard.html?passengerId=${data.passengerId}`;
                    }
                } else {
                    alert('Login failed: ' + data.message); // Show error message
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred while logging in.');
            }
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please enable location services.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
