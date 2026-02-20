using MMZClient.Models;
using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class UserBilling
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? BillingName { get; set; }

    public string? BillingCountry { get; set; }

    public string? BillingZip { get; set; }

    public string? BillingCity { get; set; }

    public string? BillingAddress { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
