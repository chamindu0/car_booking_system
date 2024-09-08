// Dropdown Menu Logic
const userIcon = document.getElementById('user-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

userIcon.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
    if (!e.target.matches('#user-icon') && !e.target.closest('.navbar-user')) {
        dropdownMenu.style.display = 'none';
    }
});

// Profile Popup Logic
const viewProfile = document.getElementById('view-profile');
const profilePopup = document.getElementById('profile-popup');
const closePopup = document.getElementById('close-popup');

viewProfile.addEventListener('click', (e) => {
    e.preventDefault();
    profilePopup.style.display = 'block';
    dropdownMenu.style.display = 'none'; // Close dropdown
});

closePopup.addEventListener('click', () => {
    profilePopup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === profilePopup) {
        profilePopup.style.display = 'none';
    }
});
