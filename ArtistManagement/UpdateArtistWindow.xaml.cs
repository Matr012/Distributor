using MMZ.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.ArtistManagement
{
    public partial class UpdateArtistWindow : Window
    {
        private static HttpClient _client;
        private readonly int _artistId;

        public UpdateArtistWindow(HttpClient client, Artist artistToEdit)
        {
            _client = client;
            _artistId = artistToEdit.Id;
            InitializeComponent();

            if (artistToEdit == null)
            {
                MessageBox.Show("Nincs előadó kiválasztva.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                Close();
                return;
            }

            _artistId = artistToEdit.Id;

            tbxId.Text = artistToEdit.Id.ToString();
            tbxName.Text = artistToEdit.Name ?? "";
            tbxDescription.Text = artistToEdit.Description ?? "";
            tbxSpotifyUrl.Text = artistToEdit.SpotifyUrl ?? "";
            tbxSoundcloudUrl.Text = artistToEdit.SoundcloudUrl ?? "";
            tbxOtherSocials.Text = artistToEdit.OtherSocials ?? "";
            tbxAvatar.Text = artistToEdit.Avatar ?? "";
        }

        private async void btnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(tbxName.Text))
            {
                MessageBox.Show("Előadó neve kötelező", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxName.Focus();
                return;
            }

            var updatedArtist = new Artist
            {
                Id = _artistId,
                Name = tbxName.Text.Trim(),
                Description = string.IsNullOrWhiteSpace(tbxDescription.Text) ? null : tbxDescription.Text.Trim(),
                SpotifyUrl = string.IsNullOrWhiteSpace(tbxSpotifyUrl.Text) ? null : tbxSpotifyUrl.Text.Trim(),
                SoundcloudUrl = string.IsNullOrWhiteSpace(tbxSoundcloudUrl.Text) ? null : tbxSoundcloudUrl.Text.Trim(),
                OtherSocials = string.IsNullOrWhiteSpace(tbxOtherSocials.Text) ? null : tbxOtherSocials.Text.Trim(),
                Avatar = string.IsNullOrWhiteSpace(tbxAvatar.Text) ? null : tbxAvatar.Text.Trim(),
            };

            try
            {
                string json = JsonSerializer.Serialize(updatedArtist);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"Artist/{_artistId}", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Előadó sikeresen módosítva!", "Sikeres módosítás", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    MessageBox.Show($"Hiba: {message}", "Módosítás sikertelen", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Kapcsolódási hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}