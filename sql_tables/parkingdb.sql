CREATE DATABASE parkingdb;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `lastname` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(99) NOT NULL,
  `role` int(2) DEFAULT '0',
  `theme_color` varchar(7) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Dumping test data for table `users`
--

INSERT INTO `users` (`name`, `lastname`, `email`, `password`, `role`, `theme_color`) VALUES
('Admin', 'Admin', 'admin@gmail.com', '$2a$07$Dq96IK6O6DAYPcAlZFXtferXZaJLIW9A5QaornihhnA3mEB4rFCyu', 99, ''),
('Mikka', 'Hakkinen', 'mikka@gmail.com', '$2a$07$DNtslP5DYcQu4aBRISGmgewgb7YKpkaSdvkWKtznsR/UjX1xSfo/O', 0, ''),
('Pekka', 'Mikkonen', 'pekka@gmail.com', '$2a$07$YvYBK38zrd0MeJZ8vzqYu.1doYyHEOLZkZqZz77IvJxsn4P3fSLeS', 0, ''),
('test', 'registration', 'test@gmail.com', '$2a$07$a1PBS8lUMGlV3nYNFEqdDudNjyEaA45IVqK9TUb9Zh3KAOEU7z8c6', NULL, NULL);

--
-- Table structure for table `parkspots`
--

CREATE TABLE IF NOT EXISTS `parkspots` (
  `id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `lat` double(10,8) DEFAULT NULL,
  `lng` double(10,8) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `duration` int(2) NOT NULL,
  `parkqty` int(2) NOT NULL,
  `electricqty` int(2) DEFAULT NULL,
  `userId` int(10) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Dumping test data for table `parkspots`
--

INSERT INTO `parkspots` (`lat`, `lng`, `address`, `duration`, `parkqty`, `electricqty`, `userId`) VALUES
(60.22132400, 24.75773700, 'Espoo, Karasvängen 7', 1, 20, 0, 5),
(60.20310600, 24.65510700, 'Espoo, Siltakuja 2', 2, 4, 0, 5),
(60.15793600, 24.95671500, 'Helsinki, Iso Puistotie 1', 5, 8, 0, 7),
(60.17440300, 24.80654500, 'Espoo, Itätuulentie 11', 2, 4, 0, 5),
(60.17229000, 24.81276400, 'Espoo, Sateenkaari 3A', 2, 4, 0, 8);

--
-- Constraints for table `parkspots`
--

ALTER TABLE `parkspots`
  ADD CONSTRAINT `parkspots_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Table structure for table `images`
--

CREATE TABLE IF NOT EXISTS `images` (
  `id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `filename` VARCHAR(100) NOT NULL,
  `parkspotId` INT(10) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Constraints for table `images`
--

ALTER TABLE `images`
  ADD CONSTRAINT `images_parkspotId` FOREIGN KEY (`parkspotId`) REFERENCES `parkspots` (`id`) ON UPDATE NO ACTION;

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `comment` VARCHAR(200) NOT NULL,
  `userId` INT(10) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Constraints for table `comments`
--

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;
