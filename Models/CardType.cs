using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class CardType
{
    public int Id { get; set; }

    public string CardName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
