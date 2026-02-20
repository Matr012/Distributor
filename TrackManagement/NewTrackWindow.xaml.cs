using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZ.Models;

namespace MMZClient.TrackManagement
{
    public partial class NewTrackWindow : Window
    {
        private static HttpClient _client;
        private readonly int _albumId;

        public NewTrackWindow(HttpClient client, int albumId = 0)
        {
            _client = client;
            _albumId = albumId;
            InitializeComponent();

            if (_albumId > 0)
            {
                txtAlbumId.Text = _albumId.ToString();
                txtAlbumId.IsReadOnly = true;
            }
            cbxStyle.ItemsSource = new[] { "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Other" };
            cbxStyle.SelectedIndex = 0;
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(txtAlbumId.Text, out int albumId) || albumId <= 0)
            {
                MessageBox.Show("Megfelelő Album Id-t adj meg.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                txtAlbumId.Focus();
                return;
            }

            if (string.IsNullOrWhiteSpace(txtTitle.Text))
            {
                MessageBox.Show("Zene címe kötelező.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                txtTitle.Focus();
                return;
            }

            if (!int.TryParse(txtTrackNumber.Text, out int trackNum) || trackNum <= 0)
            {
                MessageBox.Show("Megfelelő mennyiségű számot írj be.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                txtTrackNumber.Focus();
                return;
            }

            var newTrack = new Track
            {
                AlbumId = albumId,
                TrackNumber = trackNum,
                Title = txtTitle.Text.Trim(),
                Subtitle = string.IsNullOrWhiteSpace(txtSubtitle.Text) ? null : txtSubtitle.Text.Trim(),
                IsrcRequest = string.IsNullOrWhiteSpace(txtIsrcRequest.Text) ? null : txtIsrcRequest.Text.Trim(),
                OriginalReleaseDate = dpOriginalRelease.SelectedDate,
                ExplicitLyrics = cbxExplicit.SelectedItem?.ToString(),
                Collaborators = string.IsNullOrWhiteSpace(txtCollaborators.Text) ? null : txtCollaborators.Text.Trim(),
                Composers = string.IsNullOrWhiteSpace(txtComposers.Text) ? null : txtComposers.Text.Trim(),
                Lyricists = string.IsNullOrWhiteSpace(txtLyricists.Text) ? null : txtLyricists.Text.Trim(),
                AudioPath = string.IsNullOrWhiteSpace(txtAudioPath.Text) ? null : txtAudioPath.Text.Trim(),
            };

            try
            {
                string json = JsonSerializer.Serialize(newTrack);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PostAsync("Track/NewTrack", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Sikeresen létrehoztad a zenét!", "Sikeres feltöltés", MessageBoxButton.OK, MessageBoxImage.Information);
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