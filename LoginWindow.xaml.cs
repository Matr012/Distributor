using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Net.Http;
using MMZClient.Services;

namespace CegautokKliens
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        private static HttpClient _client;

        public LoginWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            MainWindow.token = null;
            string salt = await _client.GetStringAsync($"Login/GetSalt?loginName={tbxLoginNev.Text}");
            if (!string.IsNullOrEmpty(salt))
            {
                string hashedPwd = new LoginServices().CreateSHA256(pwxPassword.Password + salt);
                var response = await _client.PostAsync("Login/Login", new StringContent($"{{\"LoginName\": \"{tbxLoginNev.Text}\",\"SentHash\": \"{hashedPwd}\"}}", Encoding.UTF8, "application/json"));
                if (response.IsSuccessStatusCode)
                {
                    string res = response.Content.ReadAsStringAsync().Result;
                    MainWindow.token = res;
                    MessageBox.Show("Sikeres bejelentkezés");
                }
                else
                {
                    MessageBox.Show("Sikertelen");
                }
            }
            Close();
        }
    }
}
