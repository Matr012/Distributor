using System;
using System.Collections.Generic;

namespace MMZ.Models;

public partial class Album
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? ArtistId { get; set; }

    public string? EanUpc { get; set; }

    public string? CodeRequest { get; set; }

    public string ArtistName { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Subtitle { get; set; }

    public DateTime? OriginalReleaseDate { get; set; }

    public DateTime? DigitalReleaseDate { get; set; }

    public string Style { get; set; } = null!;

    public string? Redistribution { get; set; }

    public string? SpotifyArtistUrl { get; set; }

    public string? AppleArtistUrl { get; set; }

    public string? CoverPath { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Artist? Artist { get; set; }

    public virtual ICollection<Track> Tracks { get; set; } = new List<Track>();

    public virtual User User { get; set; } = null!;
}
