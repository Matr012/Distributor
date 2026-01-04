document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Köszönjük az üzenetet! Hamarosan válaszolunk.');
    e.target.reset();
});