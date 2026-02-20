using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZ.Models;

namespace MMZClient.TrackManagement
{
    public partial class UpdateTrackWindow : Window
    {
        private static HttpClient _client;
        private readonly int _trackId;
        private Track? _originalTrack;

        public UpdateTrackWindow(HttpClient client, int trackId)
        {
            _client = client;
            _trackId = trackId;
            InitializeComponent();

            cbxExplicit.ItemsSource = new[] { "No", "Yes", "Explicit" };
            cbxExplicit.SelectedIndex = 0;

            cbxStyle.ItemsSource = new[] { "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Other" };
            cbxStyle.SelectedIndex = 0;

            _ = LoadTrackAsync();
        }

        private async Task LoadTrackAsync()
        {
            try
            {
                var response = await _client.GetAsync($"Track/{_trackId}");
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Nem sikerült betölteni a zenét.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    Close();
                    return;
                }

                var json = await response.Content.ReadAsStringAsync();
                _originalTrack = JsonSerializer.Deserialize<Track>(json);

                if (_originalTrack == null) return;

                txtTrackId.Text = _originalTrack.Id.ToString();
                txtAlbumId.Text = _originalTrack.AlbumId.ToString();
                txtTrackNumber.Text = _originalTrack.TrackNumber.ToString();
                txtTitle.Text = _originalTrack.Title;
                txtSubtitle.Text = _originalTrack.Subtitle ?? "";
                txtIsrcRequest.Text = _originalTrack.IsrcRequest ?? "";
                dpOriginalRelease.SelectedDate = _originalTrack.OriginalReleaseDate;
                cbxExplicit.SelectedItem = _originalTrack.ExplicitLyrics ?? "No";
                txtCollaborators.Text = _originalTrack.Collaborators ?? "";
                txtComposers.Text = _originalTrack.Composers ?? "";
                txtLyricists.Text = _originalTrack.Lyricists ?? "";
                txtAudioPath.Text = _originalTrack.AudioPath ?? "";
                cbxStyle.SelectedItem = _originalTrack.StyleId.ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a zene betöltése közben:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                Close();
            }
        }

        private async void btnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(txtAlbumId.Text, out int albumId) || albumId <= 0)
            {
                MessageBox.Show("Létező Zene ID-t adj meg.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrWhiteSpace(txtTitle.Text))
            {
                MessageBox.Show("A cím kötelező.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                txtTitle.Focus();
                return;
            }

            if (!int.TryParse(txtTrackNumber.Text, out int trackNum) || trackNum <= 0)
            {
                MessageBox.Show("Érvényes zene szám kötelező.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var updatedTrack = new Track
            {
                Id = _trackId,
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
                string json = JsonSerializer.Serialize(updatedTrack);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"Track/{_trackId}", content);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Zene sikeresen módosítva!", "Sikeres módosítás", MessageBoxButton.OK, MessageBoxImage.Information);
                    Close();
                }
                else
                {
                    string error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba módosítás közben: {error}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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