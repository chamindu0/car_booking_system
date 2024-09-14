document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect the form data
    const loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    // Make a POST request to the back-end
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Send the login data as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');

            // Redirect based on the user role
            if (data.role === 'admin') {
                window.location.href = "../HTML/admin.html"; // Admin dashboard
            } else if (data.role === 'driver') {
                window.location.href = `../HTML/driverDashboard.html?driverId=${data.driverId}`; 
            } else if (data.role === 'passenger') {
                window.location.href = `../HTML/passengerDashboard.html?passengerId=${data.passengerId}`;
            
        }  else {
            alert('Login failed: ' + data.message); // Show error message
        }

        }})
    
    .catch(error => {
        console.error('Error:', error); // Log any errors
        alert('An error occurred while logging in.');
    });
});