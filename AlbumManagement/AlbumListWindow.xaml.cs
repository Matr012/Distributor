using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using MMZ.Models;

namespace MMZClient.AlbumManagement
{
    /// <summary>
    /// Interaction logic for AlbumListWindow.xaml
    /// </summary>
    public partial class AlbumListWindow : Window
    {
        private static HttpClient _client;
        private List<Album> albums = new();

        public AlbumListWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnLoad_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string url = $"{_client.BaseAddress}Album/Albums";

                var result = await _client.GetFromJsonAsync<List<Album>>(url);

                if (result == null || result.Count == 0)
                {
                    MessageBox.Show("Nem található album.", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }

                albums = result;
                dgrAlbums.ItemsSource = albums;

                Title = $"AlbumList ({albums.Count})";
            }
            catch (HttpRequestException ex)
            {
                MessageBox.Show($"Nem sikerült betölteni az albumokat.\n\n{ex.Message}", "Kapcsolódási hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Váratlan hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}