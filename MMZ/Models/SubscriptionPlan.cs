using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class SubscriptionPlan
{
    public int Id { get; set; }

    public string Tier { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int DurationMonths { get; set; }

    public int Price { get; set; }

    public virtual ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
}
