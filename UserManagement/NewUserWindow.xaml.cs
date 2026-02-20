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
    public partial class NewUserWindow : Window
    {
        private static HttpClient _client;
        private static readonly List<int> permissions = new() { 1, 2, 3, 4};

        public NewUserWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
            cbxPermission.ItemsSource = permissions;
            cbxPermission.SelectedIndex = 0;
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            string password = pwdPassword.Password;
            string confirm = pwdPasswordAgain.Password;

            if (string.IsNullOrWhiteSpace(password))
            {
                MessageBox.Show("A jelszó kötelező.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                pwdPassword.Focus();
                return;
            }

            if (password != confirm)
            {
                MessageBox.Show("A jelszavak nem egyeznek", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                pwdPasswordAgain.Clear();
                pwdPasswordAgain.Focus();
                return;
            }

            if (string.IsNullOrWhiteSpace(tbxFName.Text) ||
                string.IsNullOrWhiteSpace(tbxLName.Text) ||
                string.IsNullOrWhiteSpace(tbxLoginName.Text) ||
                string.IsNullOrWhiteSpace(tbxEmail.Text))
            {
                MessageBox.Show("Teljes név, felhasználónév és email kötelező!",
                                "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }
            string salt = new LoginServices().GenerateSalt();
            string simpleHash = new LoginServices().CreateSHA256(password + salt);
            string finalHash = new LoginServices().CreateSHA256(simpleHash);

            var newUser = new User
            {
                FirstName = tbxFName.Text.Trim(),
                LastName = tbxLName.Text.Trim(),
                Username = tbxLoginName.Text.Trim(),
                Email = tbxEmail.Text.Trim(),
                Phone = tbxPhone.Text?.Trim() ?? "",
                PasswordHash = finalHash,
                ProfilePic = tbxImage.Text?.Trim() ?? "missing.jpg",
                IsArtist = chbArtist.IsChecked,
                Verified = chbVerified.IsChecked,
                Permission = (int)cbxPermission.SelectedItem
            };

            try
            {
                string json = JsonSerializer.Serialize(newUser);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PostAsync("User/NewUser", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("User created successfully!\n" + message,
                                    "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                    Close();
                }
                else
                {
                    MessageBox.Show("Failed to create user:\n" + message,
                                    "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Connection error:\n" + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}