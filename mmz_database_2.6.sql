-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Már 05. 10:36
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
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `original_release_date` date DEFAULT NULL,
  `digital_release_date` datetime DEFAULT NULL,
  `style_id` int(11) DEFAULT NULL,
  `redistribution` enum('igen','nem') DEFAULT 'nem',
  `spotify_artist_url` varchar(512) DEFAULT NULL,
  `apple_artist_url` varchar(512) DEFAULT NULL,
  `cover_path` blob DEFAULT NULL,
  `status` enum('draft','pending','published','rejected') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `albums`
--

INSERT INTO `albums` (`id`, `user_id`, `artist_id`, `ean_upc`, `code_request`, `title`, `subtitle`, `original_release_date`, `digital_release_date`, `style_id`, `redistribution`, `spotify_artist_url`, `apple_artist_url`, `cover_path`, `status`, `created_at`, `updated_at`) VALUES
(4, 1, 3, NULL, 'nem', 'Vigyázz magadra, jó szórakozást', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/4pWRro00gdnq90CwBmSCtv?si=mcBgSiAZRxSnHWubVuJW4Q', 'https://music.apple.com/hu/artist/akc-misi/1438391242?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733663662643365656239646634346362323361383565303964, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(5, 1, 4, NULL, 'nem', 'hóangyal', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/19w3KViMCX0eq1UjNic2W9?si=ub7k5T93Sva0cPt9AXn1TA', 'https://music.apple.com/hu/artist/gyuris/1353570324?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733646439343236306336313833363633316136363737643862, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(6, 1, 4, NULL, 'nem', 'gyógyító frekvenciák', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/19w3KViMCX0eq1UjNic2W9?si=ub7k5T93Sva0cPt9AXn1TA', 'https://music.apple.com/hu/artist/gyuris/1353570324?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733633237353061663038316137386134646536356536323466, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(7, 1, 5, NULL, 'nem', 'DJV', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/5ALUgNuS421MZrrrAhM9Bv?si=5js3hGfpSxuTer2MfXSKBQ', 'https://music.apple.com/hu/artist/bruno-x-spacc/1519148459?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733323334333865383665303463613365663866333838643530, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(8, 1, 6, NULL, 'nem', 'ÉDEN', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/2onsfuh37zW0OHB3lFa3t1?si=UgibH9BCT5GDxjg9N2e-cA', 'https://music.apple.com/hu/artist/mehringer/1635950625?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733303130653039383563653636626634663839363331643463, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(9, 1, 7, NULL, 'nem', 'Orgonabokor', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/1O4dvMoyQSIClCii6DSai8?si=xi72sDfoQJCgEJt9QKheVA', 'https://music.apple.com/hu/artist/manuel/1486563086?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733316534616162376264373033656537343230356538353262, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00'),
(10, 1, 8, NULL, 'nem', 'Kimaradás', NULL, NULL, NULL, NULL, 'nem', 'https://open.spotify.com/artist/0Qld3F5Dr62sYbuivSzEMw?si=q_z6fvFyTtWecgfkXzjLGw', 'https://music.apple.com/hu/artist/m%C3%A1ri%C3%B3/479718071?l=hu', 0x68747470733a2f2f692e7363646e2e636f2f696d6167652f61623637363136643030303062323733626134356535383732346630623864383837653330613536, 'published', '2026-03-04 09:27:00', '2026-03-04 09:27:00');

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
  `avatar` blob DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `artists`
--

INSERT INTO `artists` (`id`, `name`, `description`, `spotify_url`, `soundcloud_url`, `other_socials`, `avatar`, `created_at`, `updated_at`) VALUES
(3, 'AKC Misi', 'Magyar rap és trap előadó, aki őszinte szövegekkel és erős ritmusokkal hódítja meg a hallgatóit.', 'https://open.spotify.com/artist/4pWRro00gdnq90CwBmSCtv?si=mcBgSiAZRxSnHWubVuJW4Q', NULL, 'https://music.apple.com/hu/artist/akc-misi/1438391242?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:53:25'),
(4, 'gyuris', 'Hazai pop és R&B előadó, dalait lágy melódiák és érzelemdús hangvétel jellemzi.', 'https://open.spotify.com/artist/19w3KViMCX0eq1UjNic2W9?si=ub7k5T93Sva0cPt9AXn1TA', NULL, 'https://music.apple.com/hu/artist/gyuris/1353570324?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:53:44'),
(5, 'Bruno X Spacc', 'Dinamikus magyar hip-hop duó, akik energikus flowjukkal és egyedi stílusukkal emelkednek ki a hazai szcénából.', 'https://open.spotify.com/artist/5ALUgNuS421MZrrrAhM9Bv?si=5js3hGfpSxuTer2MfXSKBQ', NULL, 'https://music.apple.com/hu/artist/bruno-x-spacc/1519148459?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:53:56'),
(6, 'Mehringer', 'Fiatal magyar zenész, aki modern elektronikus hangzást ötvöz lírai mélységű dalszövegekkel.', 'https://open.spotify.com/artist/2onsfuh37zW0OHB3lFa3t1?si=UgibH9BCT5GDxjg9N2e-cA', NULL, 'https://music.apple.com/hu/artist/mehringer/1635950625?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:54:10'),
(7, 'Manuel', 'Magyar singer-songwriter, akinek dalait meleg hangszín és romantikus, életközeli témák hatják át.', 'https://open.spotify.com/artist/1O4dvMoyQSIClCii6DSai8?si=xi72sDfoQJCgEJt9QKheVA', NULL, 'https://music.apple.com/hu/artist/manuel/1486563086?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:54:23'),
(8, 'Márió', 'Sokoldalú hazai előadó, akinek zenéje a popot és az urbánus hangzást ötvözi könnyen befogadható dallamokkal.', 'https://open.spotify.com/artist/0Qld3F5Dr62sYbuivSzEMw?si=q_z6fvFyTtWecgfkXzjLGw', NULL, 'https://music.apple.com/hu/artist/m%C3%A1ri%C3%B3/479718071?l=hu', NULL, '2026-03-04 09:27:00', '2026-03-05 08:54:37');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `music_styles`
--

CREATE TABLE `music_styles` (
  `id` int(11) NOT NULL,
  `genre_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `music_styles`
--

INSERT INTO `music_styles` (`id`, `genre_name`) VALUES
(25, 'Alternative'),
(12, 'Classical'),
(9, 'Country'),
(19, 'Disco'),
(23, 'Drum & Bass'),
(22, 'Dubstep'),
(10, 'Electronic'),
(18, 'Funk'),
(28, 'Gospel'),
(29, 'Grunge'),
(3, 'Hip-Hop'),
(20, 'House'),
(24, 'Indie'),
(7, 'Jazz'),
(27, 'K-Pop'),
(26, 'Latin'),
(11, 'Metal'),
(1, 'Pop'),
(16, 'Pop-Punk'),
(15, 'Punk'),
(6, 'R&B'),
(4, 'Rap'),
(2, 'Rock'),
(21, 'Techno'),
(5, 'Trap');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `privileges`
--

CREATE TABLE `privileges` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `privileges`
--

INSERT INTO `privileges` (`id`, `name`, `description`) VALUES
(1, 'Admin', 'Teljes hozzáférés a rendszerhez'),
(2, 'Moderator', 'Tartalomkezelési jogosultság'),
(3, 'Test', 'Tesztelési célú jogosultság'),
(4, 'User', 'Sima regisztrált felhasználó');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL,
  `tier` enum('alap','pro','ultimate') NOT NULL,
  `name` varchar(50) NOT NULL,
  `duration_months` int(2) NOT NULL,
  `price` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `tier`, `name`, `duration_months`, `price`) VALUES
(1, 'alap', 'Sima Havi', 1, 1490),
(2, 'alap', 'Sima Éves', 12, 14900),
(3, 'pro', 'Középső Havi', 1, 3490),
(4, 'pro', 'Középső Éves', 12, 34900),
(5, 'ultimate', 'Legfelső Havi', 1, 5990),
(6, 'ultimate', 'Legfelső Éves', 12, 59900);

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
  `explicit_lyrics` enum('van','nincs') DEFAULT 'nincs',
  `composers` text DEFAULT NULL,
  `lyricists` text DEFAULT NULL,
  `audio_path` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `style_id` int(11) DEFAULT NULL
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
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_pic` blob DEFAULT NULL,
  `is_artist` tinyint(1) DEFAULT 0,
  `verified` tinyint(1) DEFAULT 0,
  `permission` int(11) NOT NULL DEFAULT 4,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `email`, `phone`, `password_hash`, `profile_pic`, `is_artist`, `verified`, `permission`, `created_at`, `updated_at`) VALUES
(1, 'admin1', 'admin2', 'admin', 'admin@gmail.com', '+36123456789', '6740e6b4a4b266a3fb9a202b1faeaa928405e25522cce8d5cbc358c0ded05358', 0x2768747470733a2f2f2e2e2e64656661756c742e6a70672f, 1, 1, 1, '2026-01-12 10:52:24', '2026-02-25 10:08:55'),
(2, 'Kovács', 'János', 'janos_artist', 'janos@teszt.hu', '+36201112233', '2ea6b2b95a6fc987f088a7161d54fd2da59b448f1af1324a2e8f8ad821783199', 0x2768747470733a2f2f2e2e2e64656661756c742e6a70672f, 1, 1, 4, '2026-01-28 08:45:09', '2026-02-25 10:09:51'),
(3, 'Nagy', 'Beatrix', 'bea_user', 'bea@teszt.hu', '+36304445566', 'cb5f888651df3772a86e57e3e20d062e759384b237389f4daf34cac86843ec3b', 0x2768747470733a2f2f2e2e2e64656661756c742e6a70672f, 0, 0, 4, '2026-01-28 08:45:09', '2026-02-25 10:11:48'),
(4, 'Teszt', 'Moderátor', 'mod_pisti', 'mod@teszt.hu', '+36709998877', '76eb5544ac462f13c8f4def6bb2210053195d54f563cba3483d518536886425c', 0x2768747470733a2f2f2e2e2e64656661756c742e6a70672f, 0, 1, 2, '2026-01-28 08:45:09', '2026-02-25 10:12:17');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_billing`
--

CREATE TABLE `user_billing` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `billing_name` varchar(255) DEFAULT NULL,
  `billing_country` varchar(100) DEFAULT 'Magyarország',
  `billing_zip` varchar(20) DEFAULT NULL,
  `billing_city` varchar(100) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_billing`
--

INSERT INTO `user_billing` (`id`, `user_id`, `billing_name`, `billing_country`, `billing_zip`, `billing_city`, `billing_address`, `created_at`, `updated_at`) VALUES
(1, 2, 'Kovács János EV', 'Magyarország', '1051', 'Budapest', 'Deák Ferenc utca 5.', '2026-01-28 08:45:09', '2026-01-28 08:45:09'),
(2, 3, 'Nagy Beatrix', 'Magyarország', '4024', 'Debrecen', 'Piac utca 12.', '2026-01-28 08:45:09', '2026-01-28 08:45:09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_card`
--

CREATE TABLE `user_card` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_holder_name` varchar(64) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `card_exp_month` int(2) DEFAULT NULL,
  `card_exp_year` int(4) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_card`
--

INSERT INTO `user_card` (`id`, `user_id`, `card_holder_name`, `card_last4`, `card_exp_month`, `card_exp_year`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 2, 'Kovacs Janos', '4455', 12, 2028, 1, '2026-01-28 08:45:09', '2026-01-28 08:45:09'),
(2, 3, 'Nagy Beatrix', '1122', 5, 2027, 1, '2026-01-28 08:45:09', '2026-01-28 08:45:09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `price_at_purchase` int(10) NOT NULL,
  `status` enum('active','expired','cancelled','pending') DEFAULT 'active',
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `expiry_date` timestamp NULL DEFAULT NULL,
  `auto_renew` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_subscriptions`
--

INSERT INTO `user_subscriptions` (`id`, `user_id`, `plan_id`, `price_at_purchase`, `status`, `start_date`, `expiry_date`, `auto_renew`) VALUES
(1, 2, 3, 3490, 'active', '2026-01-28 08:45:09', '2026-02-28 22:59:59', 1),
(2, 3, 1, 1490, 'active', '2026-01-28 08:45:09', '2026-02-15 09:00:00', 1);

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
  ADD KEY `idx_album_status` (`status`),
  ADD KEY `fk_albums_style` (`style_id`);

--
-- A tábla indexei `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_artists_name` (`name`);

--
-- A tábla indexei `music_styles`
--
ALTER TABLE `music_styles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `genre_name` (`genre_name`);

--
-- A tábla indexei `privileges`
--
ALTER TABLE `privileges`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tracks_title` (`title`),
  ADD KEY `idx_tracks_album` (`album_id`),
  ADD KEY `fk_music_style` (`style_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`),
  ADD KEY `fk_user_privilege` (`permission`);

--
-- A tábla indexei `user_billing`
--
ALTER TABLE `user_billing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- A tábla indexei `user_card`
--
ALTER TABLE `user_card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_card_user` (`user_id`);

--
-- A tábla indexei `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_subscription` (`user_id`,`plan_id`),
  ADD KEY `fk_sub_plan` (`plan_id`),
  ADD KEY `idx_sub_status` (`status`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `music_styles`
--
ALTER TABLE `music_styles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `tracks`
--
ALTER TABLE `tracks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `user_billing`
--
ALTER TABLE `user_billing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `user_card`
--
ALTER TABLE `user_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `albums_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_albums_style` FOREIGN KEY (`style_id`) REFERENCES `music_styles` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `tracks`
--
ALTER TABLE `tracks`
  ADD CONSTRAINT `fk_music_style` FOREIGN KEY (`style_id`) REFERENCES `music_styles` (`id`),
  ADD CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_privilege` FOREIGN KEY (`permission`) REFERENCES `privileges` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `user_billing`
--
ALTER TABLE `user_billing`
  ADD CONSTRAINT `fk_users_billing_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `user_card`
--
ALTER TABLE `user_card`
  ADD CONSTRAINT `fk_user_cards_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
