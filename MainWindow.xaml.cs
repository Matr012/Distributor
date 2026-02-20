using System.Net.Http;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using MMZ.Models;
using MMZClient.AlbumManagement;
using MMZClient.ArtistManagement;
using MMZClient.TrackManagement;
using MMZClient.UserManagement;

namespace CegautokKliens
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        static HttpClient client = new HttpClient()
        {
            //BaseAddress = new("http://localhost:5000/")
            BaseAddress = new("https://localhost:7238/")
        };

        public static string token = null;
        public MainWindow()
        {
            InitializeComponent();
        }

        private void MenuLogin_Click(object sender, RoutedEventArgs e)
        {
            if (token == null)
            {
                LoginWindow loginWindow = new LoginWindow(client);
                loginWindow.ShowDialog();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                if (token != null)
                {
                    itemLogin.Header = "Logout";
                    MessageBox.Show("Sikeres bejelentkezés!");
                    
                }
                else
                {
                    MessageBox.Show("Sikertelen bejelentkezés!");
                }
            }
            else
            {
                token = null;
                MessageBox.Show("Kijelentkezett a szerverről!");
                itemLogin.Header = "Login";
            }
        }

        private void itemUserList_Click(object sender, RoutedEventArgs e)
        {
            UserListWindow ulw = new UserListWindow(client);
            ulw.ShowDialog();
        }

        private void itemNewUser_Click(object sender, RoutedEventArgs e)
        {
            NewUserWindow nuw = new NewUserWindow(client);
            nuw.ShowDialog();
        }

        private void itemUpdateUser_Click(object sender, RoutedEventArgs e)
        {
            UpdateUserWindow uuw = new UpdateUserWindow(client);
            uuw.ShowDialog();
        }

        private void itemDeleteUser_Click(object sender, RoutedEventArgs e)
        {
            DeleteUserWindow duw = new DeleteUserWindow(client);
            duw.ShowDialog();
        }

        private void itemAlbumList_Click(object sender, RoutedEventArgs e)
        {
            AlbumListWindow alw = new AlbumListWindow(client);
            alw.ShowDialog();
        }

        private void itemNewAlbum_Click(object sender, RoutedEventArgs e)
        {
            NewAlbumWindow naw = new NewAlbumWindow(client,1);
            naw.ShowDialog();
        }

        private void itemUpdateAlbum_Click(object sender, RoutedEventArgs e)
        {
            UpdateAlbumWindow uaw = new UpdateAlbumWindow(client,1);
            uaw.ShowDialog();
        }

        private void itemDeleteAlbum_Click(object sender, RoutedEventArgs e)
        {
            DeleteAlbumWindow deleteAlbumWindow = new DeleteAlbumWindow(client);
        }

        private void itemTrackList_Click(object sender, RoutedEventArgs e)
        {
            TrackListWindow tlw = new TrackListWindow(client);
            tlw.ShowDialog();
        }

        private void itemNewTrack_Click(object sender, RoutedEventArgs e)
        {
            NewTrackWindow ntw = new NewTrackWindow(client,1);
            ntw.ShowDialog();
        }

        private void itemUpdateTrack_Click(object sender, RoutedEventArgs e)
        {
            UpdateTrackWindow utw = new UpdateTrackWindow(client,1);
            utw.ShowDialog();
        }

        private void itemDeleteTrack_Click(object sender, RoutedEventArgs e)
        {
            DeleteTrackWindow dtw = new DeleteTrackWindow(client,1,"");
            dtw.ShowDialog();
        }

        private void itemArtistList_Click(object sender, RoutedEventArgs e)
        {
            ArtistListWindow allw = new ArtistListWindow(client);
            allw.ShowDialog();
        }

        private void itemNewArtist_Click(object sender, RoutedEventArgs e)
        {
            NewArtistWindow naw = new NewArtistWindow(client);
            naw.ShowDialog();
        }

        private void itemUpdateArtist_Click(object sender, RoutedEventArgs e)
        {
            UpdateArtistWindow uaw = new UpdateArtistWindow(client, new Artist());
            uaw.ShowDialog();
        }

        private void itemDeleteArtist_Click(object sender, RoutedEventArgs e)
        {
            DeleteArtistWindow daw = new DeleteArtistWindow(client,1,"");
            daw.ShowDialog();
        }
    }
}