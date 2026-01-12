using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MMZ.Models;

public partial class MmzContext : DbContext
{
    public MmzContext()
    {
    }

    public MmzContext(DbContextOptions<MmzContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Album> Albums { get; set; }

    public virtual DbSet<Artist> Artists { get; set; }

    public virtual DbSet<CardType> CardTypes { get; set; }

    public virtual DbSet<MusicStyle> MusicStyles { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

    public virtual DbSet<Track> Tracks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)s
    .AddJsonFile("appsettings.json")
    .Build();
        optionsBuilder.UseMySQL(configuration.GetConnectionString("MMZConnection"));

   }*/

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Album>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("albums");

            entity.HasIndex(e => e.ArtistId, "artist_id");

            entity.HasIndex(e => e.ArtistName, "idx_albums_artist_name");

            entity.HasIndex(e => e.Title, "idx_albums_title");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AppleArtistUrl)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("apple_artist_url");
            entity.Property(e => e.ArtistId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("artist_id");
            entity.Property(e => e.ArtistName).HasColumnName("artist_name");
            entity.Property(e => e.CodeRequest)
                .HasDefaultValueSql("'''nem'''")
                .HasColumnType("enum('igen','nem')")
                .HasColumnName("code_request");
            entity.Property(e => e.CoverPath)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("cover_path");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.DigitalReleaseDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("digital_release_date");
            entity.Property(e => e.EanUpc)
                .HasMaxLength(50)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("ean_upc");
            entity.Property(e => e.OriginalReleaseDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("date")
                .HasColumnName("original_release_date");
            entity.Property(e => e.Redistribution)
                .HasDefaultValueSql("'''nem'''")
                .HasColumnType("enum('igen','nem')")
                .HasColumnName("redistribution");
            entity.Property(e => e.SpotifyArtistUrl)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("spotify_artist_url");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'''draft'''")
                .HasColumnType("enum('draft','pending','published','rejected')")
                .HasColumnName("status");
            entity.Property(e => e.Style)
                .HasColumnType("enum('Trap','Rap','Pop','Pop-Punk','R&B','Other')")
                .HasColumnName("style");
            entity.Property(e => e.Subtitle)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("subtitle");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.Artist).WithMany(p => p.Albums)
                .HasForeignKey(d => d.ArtistId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("albums_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Albums)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("albums_ibfk_1");
        });

        modelBuilder.Entity<Artist>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("artists");

            entity.HasIndex(e => e.Name, "idx_artists_name");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Avatar)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("avatar");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("description");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.OtherSocials)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("other_socials");
            entity.Property(e => e.SoundcloudUrl)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("soundcloud_url");
            entity.Property(e => e.SpotifyUrl)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("spotify_url");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<CardType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("card_types");

            entity.HasIndex(e => e.CardName, "name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.CardName)
                .HasMaxLength(50)
                .HasColumnName("card_name");
        });

        modelBuilder.Entity<MusicStyle>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("music_styles");

            entity.HasIndex(e => e.GenreName, "genre_name").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.GenreName)
                .HasMaxLength(50)
                .HasColumnName("genre_name");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("subscriptions");

            entity.HasIndex(e => e.PlanId, "plan_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AutoRenew)
                .HasDefaultValueSql("'1'")
                .HasColumnName("auto_renew");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.EndDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("timestamp")
                .HasColumnName("end_date");
            entity.Property(e => e.PlanId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("plan_id");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'''inactive'''")
                .HasColumnType("enum('inactive','active','expired','cancelled')")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.Plan).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.PlanId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("subscriptions_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("subscriptions_ibfk_1");
        });

        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("subscription_plans");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.DurationMonths)
                .HasColumnType("int(2)")
                .HasColumnName("duration_months");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("int(10)")
                .HasColumnName("price");
        });

        modelBuilder.Entity<Track>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tracks");

            entity.HasIndex(e => e.StyleId, "fk_music_style");

            entity.HasIndex(e => e.AlbumId, "idx_tracks_album");

            entity.HasIndex(e => e.Title, "idx_tracks_title");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AlbumId)
                .HasColumnType("int(11)")
                .HasColumnName("album_id");
            entity.Property(e => e.AudioPath)
                .HasMaxLength(512)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("audio_path");
            entity.Property(e => e.Collaborators)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("collaborators");
            entity.Property(e => e.Composers)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("composers");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.ExplicitLyrics)
                .HasDefaultValueSql("'''nincs'''")
                .HasColumnType("enum('van','nincs')")
                .HasColumnName("explicit_lyrics");
            entity.Property(e => e.IsrcRequest)
                .HasDefaultValueSql("'''nem'''")
                .HasColumnType("enum('igen','nem')")
                .HasColumnName("isrc_request");
            entity.Property(e => e.Lyricists)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("lyricists");
            entity.Property(e => e.OriginalReleaseDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("date")
                .HasColumnName("original_release_date");
            entity.Property(e => e.StyleId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("style_id");
            entity.Property(e => e.Subtitle)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("subtitle");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.TrackNumber)
                .HasColumnType("int(11)")
                .HasColumnName("track_number");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Album).WithMany(p => p.Tracks)
                .HasForeignKey(d => d.AlbumId)
                .HasConstraintName("tracks_ibfk_1");

            entity.HasOne(d => d.Style).WithMany(p => p.Tracks)
                .HasForeignKey(d => d.StyleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_music_style");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.CardTypeId, "fk_card_type");

            entity.HasIndex(e => e.Email, "idx_users_email");

            entity.HasIndex(e => e.Username, "idx_users_username");

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.BillingAddress)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("billing_address");
            entity.Property(e => e.BillingCity)
                .HasMaxLength(100)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("billing_city");
            entity.Property(e => e.BillingCountry)
                .HasMaxLength(100)
                .HasDefaultValueSql("'''Magyarország'''")
                .HasColumnName("billing_country");
            entity.Property(e => e.BillingName)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("billing_name");
            entity.Property(e => e.BillingZip)
                .HasMaxLength(20)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("billing_zip");
            entity.Property(e => e.CardExpMonth)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(2)")
                .HasColumnName("card_exp_month");
            entity.Property(e => e.CardExpYear)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(4)")
                .HasColumnName("card_exp_year");
            entity.Property(e => e.CardHolderName)
                .HasMaxLength(64)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("card_holder_name");
            entity.Property(e => e.CardLast4)
                .HasMaxLength(4)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("card_last4");
            entity.Property(e => e.CardTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("card_type_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(255)
                .HasColumnName("first_name");
            entity.Property(e => e.IsArtist)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_artist");
            entity.Property(e => e.LastName)
                .HasMaxLength(255)
                .HasColumnName("last_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Permission)
                .HasColumnType("int(11)")
                .HasColumnName("permission");
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .HasColumnName("phone");
            entity.Property(e => e.ProfilePic)
                .HasMaxLength(512)
                .HasDefaultValueSql("'''''''https://...default.jpg/'''")
                .HasColumnName("profile_pic");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username).HasColumnName("username");
            entity.Property(e => e.Verified)
                .HasDefaultValueSql("'0'")
                .HasColumnName("verified");

            entity.HasOne(d => d.CardType).WithMany(p => p.Users)
                .HasForeignKey(d => d.CardTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_card_type");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
