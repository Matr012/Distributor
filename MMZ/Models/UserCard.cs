using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class UserCard
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? CardHolderName { get; set; }

    public int? CardTypeId { get; set; }

    public string? CardLast4 { get; set; }

    public int? CardExpMonth { get; set; }

    public int? CardExpYear { get; set; }

    public bool? IsPrimary { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual CardType? CardType { get; set; }

    public virtual User User { get; set; } = null!;
}
