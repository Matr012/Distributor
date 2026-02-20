using MMZ.Models;          
using MMZClient.Services;  
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Automation.Text;
using System.Windows.Controls;

namespace MMZClient.AlbumManagement 
{
    /// <summary>
    /// Interaction logic for NewAlbumWindow.xaml
    /// </summary>
    public partial class NewAlbumWindow : Window
    {
        private static HttpClient _client;
        private readonly int _currentUserId;

        private static readonly List<string> CommonStyles = new()
        {
        "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "Metal", "R&B", "Indie", "Folk", "Other"
        };

        public NewAlbumWindow(HttpClient client, int currentUserId)
        {
            _client = client;
            _currentUserId = currentUserId;
            InitializeComponent();
            cbxStyle.ItemsSource = CommonStyles;
            cbxStyle.IsEditable = true;
            cbxStyle.SelectedIndex = 0;
        }

        private async void btnSave_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(tbxTitle.Text))
            {
                MessageBox.Show("Az Album címe kötelező!", "Validation", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxTitle.Focus();
                return;
            }
            var newAlbum = new Album
            {
                UserId = _currentUserId,
                Title = tbxTitle.Text.Trim(),
                Subtitle = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                EanUpc = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                CodeRequest = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                OriginalReleaseDate = dpOriginalRelease.SelectedDate,
                DigitalReleaseDate = dpDigitalRelease.SelectedDate,
                CoverPath = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                SpotifyArtistUrl = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
                AppleArtistUrl = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),

                Redistribution = string.IsNullOrWhiteSpace(tbxSubtitle.Text) ? null : tbxSubtitle.Text.Trim(),
            };

            try
            {
                string json = JsonSerializer.Serialize(newAlbum, new JsonSerializerOptions { WriteIndented = true });
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _client.PostAsync("Album/NewAlbum", content);

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Album sikeresen létrehozva!\n" + message, "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    MessageBox.Show("Nem sikerült az album létrehozása:\n" + message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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