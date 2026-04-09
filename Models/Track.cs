using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class Track
{
    public int Id { get; set; }

    public int AlbumId { get; set; }

    public int TrackNumber { get; set; }

    public string Title { get; set; } = null!;

    public string? Subtitle { get; set; }

    public string? IsrcRequest { get; set; }

    public DateTime? OriginalReleaseDate { get; set; }

    public string? Collaborators { get; set; }

    public string? ExplicitLyrics { get; set; }

    public string? Composers { get; set; }

    public string? Lyricists { get; set; }

    public byte[]? AudioPath { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? StyleId { get; set; }

    public virtual Album? Album { get; set; }

    public virtual MusicStyle? Style { get; set; }
}
