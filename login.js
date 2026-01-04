document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      alert('Sikeres bejelentkezés! Átirányítás a főoldalra...');
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'base.html';
    } else {
      alert('Hibás felhasználónév vagy jelszó!');
    }
  });
});