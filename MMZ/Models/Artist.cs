using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class Artist
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? SpotifyUrl { get; set; }

    public string? SoundcloudUrl { get; set; }

    public string? OtherSocials { get; set; }

    public string? Avatar { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Album> Albums { get; set; } = new List<Album>();
}
