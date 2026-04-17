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

    public virtual DbSet<MusicStyle> MusicStyles { get; set; }

    public virtual DbSet<Privilege> Privileges { get; set; }

    public virtual DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

    public virtual DbSet<Track> Tracks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBilling> UserBillings { get; set; }

    public virtual DbSet<UserCard> UserCards { get; set; }

    public virtual DbSet<UserSubscription> UserSubscriptions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("SERVER=localhost;PORT=3306;DATABASE=mmz;USER=root;PASSWORD=;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Album>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("albums");

            entity.HasIndex(e => e.ArtistId, "artist_id");

            entity.HasIndex(e => e.StyleId, "fk_albums_style");

            entity.HasIndex(e => e.Status, "idx_album_status");

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
            entity.Property(e => e.CodeRequest)
                .HasDefaultValueSql("'''nem'''")
                .HasColumnType("enum('igen','nem')")
                .HasColumnName("code_request");
            entity.Property(e => e.CoverPath)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("blob")
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
            entity.Property(e => e.StyleId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("style_id");
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

            entity.HasOne(d => d.MusicStyle).WithMany(p => p.Albums)
                .HasForeignKey(d => d.StyleId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_albums_style");

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
                .HasColumnType("blob")
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

        modelBuilder.Entity<Privilege>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("privileges");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
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
            entity.Property(e => e.Tier)
                .HasColumnType("enum('alap','pro','ultimate')")
                .HasColumnName("tier");
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
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("mediumblob")
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

            entity.HasIndex(e => e.Permission, "fk_user_privilege");

            entity.HasIndex(e => e.Email, "idx_users_email");

            entity.HasIndex(e => e.Username, "idx_users_username");

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
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
                .HasDefaultValueSql("'4'")
                .HasColumnType("int(11)")
                .HasColumnName("permission");
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .HasColumnName("phone");
            entity.Property(e => e.ProfilePic)
                .HasColumnType("blob")
                .HasDefaultValueSql("NULL'")
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

            entity.HasOne(d => d.PermissionNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.Permission)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_user_privilege");
        });

        modelBuilder.Entity<UserBilling>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_billing");

            entity.HasIndex(e => e.UserId, "idx_user_id");

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
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
        });

        modelBuilder.Entity<UserCard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_card");


            entity.HasIndex(e => e.UserId, "idx_user_card_user");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
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
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.IsPrimary)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_primary");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");  
            entity.HasOne(d => d.User).WithMany(p => p.UserCards)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_cards_user");
        });

        modelBuilder.Entity<UserSubscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_subscriptions");

            entity.HasIndex(e => e.PlanId, "fk_sub_plan");

            entity.HasIndex(e => e.Status, "idx_sub_status");

            entity.HasIndex(e => new { e.UserId, e.PlanId }, "idx_user_subscription");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AutoRenew)
                .HasDefaultValueSql("'1'")
                .HasColumnName("auto_renew");
            entity.Property(e => e.ExpiryDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("timestamp")
                .HasColumnName("expiry_date");
            entity.Property(e => e.PlanId)
                .HasColumnType("int(11)")
                .HasColumnName("plan_id");
            entity.Property(e => e.PriceAtPurchase)
                .HasColumnType("int(10)")
                .HasColumnName("price_at_purchase");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'''active'''")
                .HasColumnType("enum('active','expired','cancelled','pending')")
                .HasColumnName("status");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.HasOne(d => d.Plan).WithMany(p => p.UserSubscriptions)
                .HasForeignKey(d => d.PlanId)
                .HasConstraintName("user_subscriptions_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.UserSubscriptions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_sub_user");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
