using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class UserSubscription
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PlanId { get; set; }

    public int PriceAtPurchase { get; set; }

    public string? Status { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public bool? AutoRenew { get; set; }

    public virtual SubscriptionPlan Plan { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
