using MMZ.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MMZClient.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public string? ProfilePic { get; set; }

        public bool? IsArtist { get; set; }

        public bool? Verified { get; set; }

        public int Permission { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<Album> Albums { get; set; } = new List<Album>();

        public virtual Privilege PermissionNavigation { get; set; } = null!;

        public virtual ICollection<UserBilling> UserBillings { get; set; } = new List<UserBilling>();

        public virtual ICollection<UserCard> UserCards { get; set; } = new List<UserCard>();

        public virtual ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
    }
}
