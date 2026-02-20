using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZ.Models;

namespace MMZClient.ArtistManagement
{
    public partial class ArtistListWindow : Window
    {
        private static HttpClient _client;
        private List<Artist> artists = new();

        public ArtistListWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();

        }

        private async void btnLoad_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string url = $"{_client.BaseAddress}Artist/Artists";
                var result = await _client.GetFromJsonAsync<List<Artist>>(url);

                if (result == null || result.Count == 0)
                {
                    MessageBox.Show("No artists found.", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }

                artists = result;
                dgrArtists.ItemsSource = artists;
                Title = $"ArtistList ({artists.Count})";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading artists:\n{ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }

        }



        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}