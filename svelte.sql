-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 13 Gru 2021, 15:13
-- Wersja serwera: 10.4.22-MariaDB
-- Wersja PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `svelte`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `archives`
--

CREATE TABLE `archives` (
  `id` int(11) NOT NULL,
  `accountID` int(11) NOT NULL,
  `statusID` int(11) NOT NULL,
  `carID` int(11) NOT NULL,
  `startDay` date NOT NULL,
  `endDay` date NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `archives`
--

INSERT INTO `archives` (`id`, `accountID`, `statusID`, `carID`, `startDay`, `endDay`, `price`) VALUES
(1, 31, 4, 1, '2021-12-21', '2021-12-23', 2000),
(3, 31, 2, 1, '2021-12-24', '2021-12-26', 2000),
(19, 35, 3, 1, '2021-12-24', '2021-12-28', 4000),
(20, 35, 3, 4, '2021-12-17', '2021-12-23', 3998520),
(21, 35, 2, 1, '2021-12-29', '2021-12-31', 2000),
(22, 35, 1, 2, '2021-12-22', '2021-12-24', 4274);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `brand` varchar(45) NOT NULL,
  `model` varchar(45) NOT NULL,
  `year` varchar(45) NOT NULL,
  `price` int(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `cars`
--

INSERT INTO `cars` (`id`, `brand`, `model`, `year`, `price`) VALUES
(1, 'RENO', 'CLIO 2 Privalage', '2002', 1000),
(2, 'BMW', 'E36', '2000', 2137),
(3, 'BMW', 'M2 Competition', '2015', 1337),
(4, 'Nissan', 's13 La Budda Edition', '2021', 666420);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `reservatiaon`
--

CREATE TABLE `reservatiaon` (
  `id` int(11) NOT NULL,
  `accountID` int(11) NOT NULL,
  `statusID` int(11) NOT NULL,
  `carID` int(11) NOT NULL,
  `startDay` date NOT NULL,
  `endDay` date NOT NULL,
  `price` int(11) NOT NULL,
  `hashCode` varchar(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `reservatiaon`
--

INSERT INTO `reservatiaon` (`id`, `accountID`, `statusID`, `carID`, `startDay`, `endDay`, `price`, `hashCode`) VALUES
(63, 36, 2, 2, '2021-12-15', '2021-12-18', 6411, 't3onf0QA20f0yDRG5JOndVRtP'),
(64, 37, 3, 2, '2021-12-28', '2021-12-31', 6411, ''),
(65, 38, 4, 4, '2021-12-27', '2021-12-31', 2665680, '');

--
-- Wyzwalacze `reservatiaon`
--
DELIMITER $$
CREATE TRIGGER `before_Delete` BEFORE DELETE ON `reservatiaon` FOR EACH ROW BEGIN
    INSERT INTO archives(accountID,statusID, carID, startDay, endDay, price)
    VALUES(OLD.accountID,OLD.statusID,OLD.carID,OLD.startDay,OLD.endDay,OLD.price);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `statustype`
--

CREATE TABLE `statustype` (
  `id` int(11) NOT NULL,
  `status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `statustype`
--

INSERT INTO `statustype` (`id`, `status`) VALUES
(1, 'pending'),
(2, 'confirmed'),
(3, 'unconfirmed'),
(4, 'canceled');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userType` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `userType`, `username`, `password`, `email`, `accepted`) VALUES
(36, 1, 'maciek', 'c37d92bd113c608f296f0a65cd760e1d', 'maciek@interia.pl', 1),
(37, 3, 'maciek2', 'daead80abd44e76d2ef61330f4251708', 'maciek2@interia.pl', 1),
(38, 2, 'maciek3', '0fe248b7f55493aa15035b0944e66632', 'maciek3@interia.pl', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `usertype`
--

CREATE TABLE `usertype` (
  `id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `usertype`
--

INSERT INTO `usertype` (`id`, `type`) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'moderator');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `archives`
--
ALTER TABLE `archives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountID` (`accountID`),
  ADD KEY `carID` (`carID`),
  ADD KEY `statusID` (`statusID`) USING BTREE;

--
-- Indeksy dla tabeli `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `reservatiaon`
--
ALTER TABLE `reservatiaon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountID` (`accountID`),
  ADD KEY `carID` (`carID`),
  ADD KEY `statusID` (`statusID`) USING BTREE;

--
-- Indeksy dla tabeli `statustype`
--
ALTER TABLE `statustype`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userType` (`userType`);

--
-- Indeksy dla tabeli `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `archives`
--
ALTER TABLE `archives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT dla tabeli `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `reservatiaon`
--
ALTER TABLE `reservatiaon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT dla tabeli `statustype`
--
ALTER TABLE `statustype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT dla tabeli `usertype`
--
ALTER TABLE `usertype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `reservatiaon`
--
ALTER TABLE `reservatiaon`
  ADD CONSTRAINT `reservatiaon_ibfk_1` FOREIGN KEY (`carID`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `reservatiaon_ibfk_2` FOREIGN KEY (`accountID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservatiaon_ibfk_3` FOREIGN KEY (`statusID`) REFERENCES `statustype` (`id`);

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userType`) REFERENCES `usertype` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
