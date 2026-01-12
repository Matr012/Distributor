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

    public string? CardHolderName { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? BillingName { get; set; }

    public string? BillingCountry { get; set; }

    public string? BillingZip { get; set; }

    public string? BillingCity { get; set; }

    public string? BillingAddress { get; set; }

    public int CardTypeId { get; set; }

    public string? CardLast4 { get; set; }

    public int? CardExpMonth { get; set; }

    public int? CardExpYear { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string? ProfilePic { get; set; }

    public bool? IsArtist { get; set; }

    public bool? Verified { get; set; }

    public int Permission { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Album> Albums { get; set; } = new List<Album>();

    public virtual CardType CardType { get; set; } = null!;

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public virtual Privilege? PermissionNavigation { get; set; } = null!;
}
