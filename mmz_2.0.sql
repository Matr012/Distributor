-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 08. 22:22
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `mmz`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `ean_upc` varchar(50) DEFAULT NULL,
  `code_request` enum('igen','nem') DEFAULT 'nem',
  `artist_name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `original_release_date` date DEFAULT NULL,
  `digital_release_date` datetime DEFAULT NULL,
  `style` enum('Trap','Rap','Pop','Pop-Punk','R&B','Other') NOT NULL,
  `redistribution` enum('igen','nem') DEFAULT 'nem',
  `spotify_artist_url` varchar(512) DEFAULT NULL,
  `apple_artist_url` varchar(512) DEFAULT NULL,
  `cover_path` varchar(512) DEFAULT NULL,
  `status` enum('draft','pending','published','rejected') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `spotify_url` varchar(512) DEFAULT NULL,
  `soundcloud_url` varchar(512) DEFAULT NULL,
  `other_socials` text DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tracks`
--

CREATE TABLE `tracks` (
  `id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `track_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `isrc_request` enum('igen','nem') DEFAULT 'nem',
  `original_release_date` date DEFAULT NULL,
  `collaborators` text DEFAULT NULL,
  `style` enum('Trap','Rap','Pop','Pop-Punk','R&B','Other') NOT NULL,
  `explicit_lyrics` enum('van','nincs') DEFAULT 'nincs',
  `composers` text DEFAULT NULL,
  `lyricists` text DEFAULT NULL,
  `audio_path` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `card_holder_name` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `billing_name` varchar(255) DEFAULT NULL,
  `billing_country` varchar(100) DEFAULT 'Magyarország',
  `billing_zip` varchar(20) DEFAULT NULL,
  `billing_city` varchar(100) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `card_type_id` int(11) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `card_exp_month` int(2) DEFAULT NULL,
  `card_exp_year` int(4) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_pic` varchar(512) DEFAULT '''https://...default.jpg/',
  `is_artist` tinyint(1) DEFAULT 0,
  `verified` tinyint(1) DEFAULT 0,
  `permission` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `idx_albums_title` (`title`),
  ADD KEY `idx_albums_artist_name` (`artist_name`);

--
-- A tábla indexei `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_artists_name` (`name`);

--
-- A tábla indexei `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tracks_title` (`title`),
  ADD KEY `idx_tracks_album` (`album_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tracks`
--
ALTER TABLE `tracks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `albums_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `tracks`
--
ALTER TABLE `tracks`
  ADD CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
