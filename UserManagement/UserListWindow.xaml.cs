using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using MMZClient.Models;

namespace MMZClient.UserManagement
{
    /// <summary>
    /// Interaction logic for UserListWindow.xaml
    /// </summary>
    public partial class UserListWindow : Window
    {
        private static HttpClient _client;
        List<User> users = new List<User>();

        public UserListWindow(HttpClient client)
        {
            _client = client;
            InitializeComponent();
        }

        private async void btnLoad_Click(object sender, RoutedEventArgs e)
        {
            string url = $"{_client.BaseAddress}User/Users";
            var eredmeny = await _client.GetFromJsonAsync<List<User>>(url);
            if (eredmeny != null)
            {
                users = eredmeny;
                dgrUsers.ItemsSource = users;
            }
        }

        private void btnExit_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}
