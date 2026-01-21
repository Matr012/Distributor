using MMZ.Models;
using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class User
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

    public virtual CardType CardType { get; set; } = null!;

    public virtual ICollection<UserSubscription> Subscriptions { get; set; } = new List<UserSubscription>();
    
}