using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;

namespace MMZClient.UserManagement
{
    public partial class DeleteUserWindow : Window
    {
        private static HttpClient _client;

        public DeleteUserWindow(HttpClient client, int? prefillUserId = null)
        {
            _client = client;
            InitializeComponent();

            if (prefillUserId.HasValue)
            {
                tbxUserId.Text = prefillUserId.Value.ToString();
            }
        }

        private async void btnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(tbxUserId.Text, out int userId) || userId <= 0)
            {
                MessageBox.Show("Egy létező ID-t adj meg.", "Hibás ID", MessageBoxButton.OK, MessageBoxImage.Warning);
                tbxUserId.Focus();
                return;
            }

            var result = MessageBox.Show(
                $"Biztosan törölni szeretnéd a felhasználót? : {userId}?\nEz a művelet nem vonható vissza.",
                "Megerősítés",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning,
                MessageBoxResult.No);

            if (result != MessageBoxResult.Yes) return;

            try
            {
                var response = await _client.DeleteAsync($"User/{userId}");

                string message = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Felhasználó sikeresen törölve.\n" + message, "Sikeres törlés", MessageBoxButton.OK, MessageBoxImage.Information);
                    Close();
                }
                else
                {
                    MessageBox.Show("Törlés sikertelen:\n" + message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Kapcsolódási hiba:\n" + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}