const modal = document.getElementById('ticketModal');
    const selectedProdSpan = document.getElementById('selectedProd');
    const closeBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.prod-ticket-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.prod-card');
        const prodName = card.querySelector('.prod-name').textContent;
        selectedProdSpan.textContent = prodName;
        modal.style.display = 'flex';
      });
    });
    
    closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
    document.getElementById('ticketForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Köszönjük! A ticket elküldve ' + selectedProdSpan.textContent + ' részére.');
      modal.style.display = 'none';
      e.target.reset();
    });