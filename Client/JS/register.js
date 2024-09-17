//show drivers addtional input feilds
document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role');
    const driverFields = document.getElementById('driverFields');

    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'driver') {
            driverFields.style.display = 'block';
        } else {
            driverFields.style.display = 'none';
        }
    });
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password:document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        vehicleNo: document.getElementById('vehicleNo').value,
        vehicleType: document.getElementById('vehicleType').value

    };

    fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! A confirmation email has been sent.');
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering.');
    });


});
