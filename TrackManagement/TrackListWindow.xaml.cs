using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZ.Models;

namespace MMZClient.TrackManagement
{
    public partial class TrackListWindow : Window
    {
        private static HttpClient _client;
        private List<Track> tracks = new();

        public TrackListWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnLoad_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string url = $"{_client.BaseAddress}Track/Tracks";

                var result = await _client.GetFromJsonAsync<List<Track>>(url);

                if (result == null || result.Count == 0)
                {
                    MessageBox.Show("Nincs ilyen zene.", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }

                tracks = result;
                dgrTracks.ItemsSource = tracks;
                Title = $"Lista ({tracks.Count})";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a zenék betöltése közben:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}