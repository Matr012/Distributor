document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
        alert('Köszönjük az üzenetet! Hamarosan válaszolunk.');
    e.target.reset();
    });