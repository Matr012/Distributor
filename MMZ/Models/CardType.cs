using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class CardType
{
    public int Id { get; set; }

    public string CardName { get; set; } = null!;

    public virtual ICollection<UserCard> UserCards { get; set; } = new List<UserCard>();
}