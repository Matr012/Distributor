using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.AlbumManagement
{
    public partial class DeleteAlbumWindow : Window
    {
        private static HttpClient _client;

        public DeleteAlbumWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(tbxAlbumId.Text?.Trim(), out int albumId) || albumId <= 0)
            {
                MessageBox.Show("Létező Album ID-t adj meg.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxAlbumId.Focus();
                return;
            }

            var confirm = MessageBox.Show($"Biztosan törli az albumot? : {albumId}?\nEz a művelet visszavonhatatlan.",
                "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning, MessageBoxResult.No);

            if (confirm != MessageBoxResult.Yes) return;

            try
            {
                var response = await _client.DeleteAsync($"Album/{albumId}");

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Album sikeresen törölve.", "Sikeres törlés", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Törlés sikertelen:\n{error}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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