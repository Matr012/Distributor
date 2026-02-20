using MMZ.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Xml.Linq;

namespace MMZClient.ArtistManagement
{
    public partial class NewArtistWindow : Window
    {
        private static HttpClient _client;

        public NewArtistWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(tbxName.Text))
            {
                MessageBox.Show("Zenész neve kötelező", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxName.Focus();
                return;
            }

            var newArtist = new Artist
            {
                Name = tbxName.Text.Trim(),
                Description = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
                SpotifyUrl = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
                SoundcloudUrl = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
                OtherSocials = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
                Avatar = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
            };

            try
            {
                string json = JsonSerializer.Serialize(newArtist);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PostAsync("Artist/NewArtist", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Sikeresen létrehoztad a zenészt!", "Sikeres feltöltés", MessageBoxButton.OK, MessageBoxImage.Information);
                    Close();
                }
                else
                {
                    MessageBox.Show($"Hiba: {message}", "Sikertelen feltöltés", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Kapcsolódási hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}