// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Select all links with a hash (#) in the href
    const navLinks = document.querySelectorAll('a[href^="#"]');

    // Iterate over each link and attach the click event listener
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior

            // Get the target section's ID from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // If the target section exists, smoothly scroll to it
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, // Adjust for navbar height
                    behavior: 'smooth' // Smooth scrolling
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdownIcon = document.querySelector('.dropdown-icon');
    const navbar = document.querySelector('.navbar');

    dropdownIcon.addEventListener('click', function() {
        // Toggle active class to show or hide the dropdown menu
        navbar.classList.toggle('active');
    });
});

// home.js
document.querySelector('.dropdown-icon').addEventListener('click', function() {
    document.querySelector('.navbar').classList.toggle('active');
});
