using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.TrackManagement
{
    public partial class DeleteTrackWindow : Window
    {
        private static HttpClient _client;
        private readonly int _trackId;
        private readonly string _trackTitle;

        public DeleteTrackWindow(HttpClient client, int trackId, string trackTitle)
        {
            _client = client;
            _trackId = trackId;
            _trackTitle = trackTitle;
            InitializeComponent();

            Title = $"Zene törlése – {trackTitle}";
        }

        private async void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var response = await _client.DeleteAsync($"Track/{_trackId}");

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Zene sikeresen törölve.", "Sikeres törlés", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    string error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Törlés sikertelen: {error}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Kapcsolódási hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}