document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
      alert('Felhasználónév vagy e-mail már létezik!');
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sikeres regisztráció! Átirányítás a bejelentkezéshez...');
    window.location.href = 'login.html';
  });
});