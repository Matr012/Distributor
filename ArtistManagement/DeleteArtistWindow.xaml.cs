using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.ArtistManagement
{
    public partial class DeleteArtistWindow : Window
    {
        private static HttpClient _client;
        private int _artistId;

        public DeleteArtistWindow(HttpClient client, int artistId, string artistName)
        {
            _client = client;
            InitializeComponent();

            _artistId = artistId;
            tbkId.Text = artistId.ToString();
            tbkName.Text = artistName ?? "()";
        }

        private async void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("Biztosan törli az előadót?\nEz a művelet visszavonhatatlan.",
                                "Megerősítés",
                                MessageBoxButton.YesNo,
                                MessageBoxImage.Warning,
                                MessageBoxResult.No) != MessageBoxResult.Yes)
            {
                return;
            }

            try
            {
                var response = await _client.DeleteAsync($"Artist/{_artistId}");

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Előadó sikeresen törölve.", "Sikeres törlés", MessageBoxButton.OK, MessageBoxImage.Information);
                    DialogResult = true;
                    Close();
                }
                else
                {
                    string error = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba törlés közben: {error}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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