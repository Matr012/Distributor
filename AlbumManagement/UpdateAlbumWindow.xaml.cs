using MMZ.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.AlbumManagement
{
    public partial class UpdateAlbumWindow : Window
    {
        private static HttpClient _client;
        private readonly int _albumId;

        public UpdateAlbumWindow(HttpClient client, int albumId)
        {
            _client = client;
            _albumId = albumId;
            InitializeComponent();

            tbxAlbumId.Text = albumId.ToString();
            cbxStyle.ItemsSource = new[]
            {
                "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical",
                "Metal", "R&B", "Indie", "Folk", "Other"
            };
            cbxStyle.IsEditable = true;

            LoadAlbumAsync().ConfigureAwait(false);
        }

        private async Task LoadAlbumAsync()
        {
            try
            {
                var response = await _client.GetAsync($"Album/{_albumId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var album = JsonSerializer.Deserialize<Album>(json);

                if (album != null)
                {
                    tbxTitle.Text = album.Title ?? "";
                    tbxSubtitle.Text = album.Subtitle ?? "";
                    tbxEanUpc.Text = album.EanUpc ?? "";
                    tbxCodeRequest.Text = album.CodeRequest ?? "";
                    dpOriginalRelease.SelectedDate = album.OriginalReleaseDate;
                    dpDigitalRelease.SelectedDate = album.DigitalReleaseDate;
                    tbxCoverPath.Text = album.CoverPath ?? "";
                    tbxSpotifyUrl.Text = album.SpotifyArtistUrl ?? "";
                    tbxAppleUrl.Text = album.AppleArtistUrl ?? "";
                    tbxRedistribution.Text = album.Redistribution ?? "";

                    cbxStyle.Text = album.StyleId.ToString(); 
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Nem sikerült betölteni az albumot\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                Close();
            }
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(tbxTitle.Text))
            {
                MessageBox.Show("A cím kötelező", "Érvényesítés", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxTitle.Focus();
                return;
            }

            var updatedAlbum = new Album
            {
                Id = _albumId,
                Title = tbxTitle.Text.Trim(),
                Subtitle = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                EanUpc = string.IsNullOrWhiteSpace(tbxEanUpc.Text) ? null : tbxEanUpc.Text.Trim(),
                CodeRequest = string.IsNullOrWhiteSpace(tbxCodeRequest.Text) ? null : tbxCodeRequest.Text.Trim(),
                OriginalReleaseDate = dpOriginalRelease.SelectedDate,
                DigitalReleaseDate = dpDigitalRelease.SelectedDate,
                CoverPath = string.IsNullOrWhiteSpace(tbxCoverPath.Text) ? null : tbxCoverPath.Text.Trim(),
                SpotifyArtistUrl = string.IsNullOrWhiteSpace(tbxSpotifyUrl.Text) ? null : tbxSpotifyUrl.Text.Trim(),
                AppleArtistUrl = string.IsNullOrWhiteSpace(tbxAppleUrl.Text) ? null : tbxAppleUrl.Text.Trim(),
                Redistribution = string.IsNullOrWhiteSpace(tbxRedistribution.Text) ? null : tbxRedistribution.Text.Trim(),
            };

            try
            {
                var json = JsonSerializer.Serialize(updatedAlbum);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PutAsync($"Album/{_albumId}", content);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Album sikeresen módosítva.", "Sikeres módosítás", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    var msg = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Módosítás sikertelen:\n{msg}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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