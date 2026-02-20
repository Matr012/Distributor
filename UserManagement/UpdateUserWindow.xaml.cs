using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZClient.Models;
using MMZClient.Services;

namespace MMZClient.UserManagement
{
    public partial class UpdateUserWindow : Window
    {
        private static HttpClient _client;
        private static readonly List<int> permissions = new() { 1, 2, 3, 4};
        private User? _loadedUser;

        public UpdateUserWindow(HttpClient client, int? prefillUserId = null)
        {
            _client = client;
            InitializeComponent();

            cbxPermission.ItemsSource = permissions;
            cbxPermission.SelectedIndex = 0;

            if (prefillUserId.HasValue)
            {
                tbxUserId.Text = prefillUserId.Value.ToString();
                LoadUserAsync(prefillUserId.Value).ConfigureAwait(false);
            }
        }

        private async void btnLoad_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(tbxUserId.Text, out int userId) || userId <= 0)
            {
                MessageBox.Show("Létező ID-t adj meg.", "Hibás ID", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            await LoadUserAsync(userId);
        }

        private async Task LoadUserAsync(int userId)
        {
            try
            {
                var response = await _client.GetAsync($"User/{userId}");
                if (!response.IsSuccessStatusCode)
                {
                    string err = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Felhasználó nem található:\n{err}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                string json = await response.Content.ReadAsStringAsync();
                _loadedUser = JsonSerializer.Deserialize<User>(json);

                if (_loadedUser == null) return;

                tbxUserId.Text = _loadedUser.Id.ToString();
                tbxFName.Text = _loadedUser.FirstName;
                tbxLName.Text = _loadedUser.LastName;
                tbxLoginName.Text = _loadedUser.Username;
                tbxEmail.Text = _loadedUser.Email;
                tbxPhone.Text = _loadedUser.Phone ?? "";
                tbxImage.Text = _loadedUser.ProfilePic ?? "missing.jpg";
                chbArtist.IsChecked = _loadedUser.IsArtist == true;
                chbVerified.IsChecked = _loadedUser.Verified == true;
                cbxPermission.SelectedItem = _loadedUser.Permission;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Kapcsolódási hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (_loadedUser == null)
            {
                MessageBox.Show("Tölts be egy felhasználót.", "Nincs betöltve felhasználó", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(tbxUserId.Text, out int userId) || userId != _loadedUser.Id)
            {
                MessageBox.Show("Felhasználó ID eltérés.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            string password = pwdPassword.Password;
            string confirm = pwdPasswordAgain.Password;

            bool changePassword = !string.IsNullOrWhiteSpace(password);

            if (changePassword)
            {
                if (password != confirm)
                {
                    MessageBox.Show("A jelszavak nem egyeznek.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                    pwdPasswordAgain.Clear();
                    pwdPasswordAgain.Focus();
                    return;
                }
            }

            if (string.IsNullOrWhiteSpace(tbxFName.Text) ||
                string.IsNullOrWhiteSpace(tbxLName.Text) ||
                string.IsNullOrWhiteSpace(tbxLoginName.Text) ||
                string.IsNullOrWhiteSpace(tbxEmail.Text))
            {
                MessageBox.Show("First name, Last name, User name és Email kötelező.", "Hiányzó mezők", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            string? newPasswordHash = null;
            if (changePassword)
            {
                string salt = new LoginServices().GenerateSalt();
                string simpleHash = new LoginServices().CreateSHA256(password + salt);
                newPasswordHash = new LoginServices().CreateSHA256(simpleHash);
            }

            var updatedUser = new User
            {
                Id = userId,
                FirstName = tbxFName.Text.Trim(),
                LastName = tbxLName.Text.Trim(),
                Username = tbxLoginName.Text.Trim(),
                Email = tbxEmail.Text.Trim(),
                Phone = tbxPhone.Text?.Trim() ?? "",
                PasswordHash = newPasswordHash ?? _loadedUser.PasswordHash,
                ProfilePic = tbxImage.Text?.Trim() ?? "missing.jpg",
                IsArtist = chbArtist.IsChecked,
                Verified = chbVerified.IsChecked,
                Permission = (int)(cbxPermission.SelectedItem ?? 1),
                CreatedAt = _loadedUser.CreatedAt,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                string json = JsonSerializer.Serialize(updatedUser);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"User/{userId}", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Felhasználó sikeresen módosítva!\n" + message, "Sikeres módosítás", MessageBoxButton.OK, MessageBoxImage.Information);
                    _loadedUser = updatedUser;
                }
                else
                {
                    MessageBox.Show("Módosítási hiba:\n" + message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Kapcsolódási hiba:\n" + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}