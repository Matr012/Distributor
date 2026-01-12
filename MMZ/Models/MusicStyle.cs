using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class MusicStyle
{
    public int Id { get; set; }

    public string GenreName { get; set; } = null!;

    public virtual ICollection<Track> Tracks { get; set; } = new List<Track>();
}
