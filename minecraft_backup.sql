/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.6.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Minecraft
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB-deb12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `whitelist`
--

DROP TABLE IF EXISTS `whitelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `whitelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `minecraft_name` varchar(255) NOT NULL,
  `discord_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=503 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whitelist`
--

LOCK TABLES `whitelist` WRITE;
/*!40000 ALTER TABLE `whitelist` DISABLE KEYS */;
INSERT INTO `whitelist` VALUES
(3,'okayfiona','okayfiona','2024-12-20 14:54:52'),
(4,'ilyfiona','okayfiona','2024-12-20 14:55:17'),
(6,'Pixel1102','Pixel1102','2024-12-18 15:42:30'),
(7,'bynoahhh','noah1to1','2024-12-18 15:48:30'),
(8,'Floweryalina','Floweryalina','2024-12-18 16:04:30'),
(9,'Doublefli','Neox2903','2024-12-18 16:07:30'),
(10,'xArda_','xArda_','2024-12-18 16:09:30'),
(11,'mggi','maggix3','2024-12-18 16:23:30'),
(12,'m1kareal','m1kareal','2024-12-18 16:25:30'),
(14,'schnizelwolke','schnizelwolke','2024-12-18 16:41:30'),
(15,'Der_S0cken','Der_S0cken','2024-12-18 16:42:30'),
(16,'letsAndrinGOTY','letsandrin14e','2024-12-18 16:51:30'),
(17,'Ueberleben_','Jona3.3','2024-12-18 16:51:30'),
(18,'riooolu','letsriooolu','2024-12-18 17:10:30'),
(19,'MagierWolfHD','magierknowsdawae','2024-12-18 17:55:30'),
(20,'panda15503','punktrick','2024-12-18 18:08:30'),
(21,'Franzi199','Franzers','2024-12-18 18:37:30'),
(22,'S4NTlI','santiix_01','2024-12-18 20:08:30'),
(23,'LaLunaTV','luna_3413','2024-12-18 20:15:30'),
(24,'Fb1an','Fb1an','2024-12-18 20:34:30'),
(25,'MatthewsMeth','meffi269','2024-12-18 20:47:30'),
(26,'JanniTuts','jannituts','2024-12-20 18:36:12'),
(27,'Cbra606','sven_664','2024-12-20 18:36:21'),
(28,'hakuu_uu','.haku_uu','2024-12-20 18:37:01'),
(29,'DieEnte3','dieentelustig','2024-12-18 21:15:30'),
(30,'pepe__21','chttinpepe','2024-12-18 21:24:30'),
(31,'Muckelhorse','Muskelhorse','2024-12-20 18:41:38'),
(32,'InkelDinkel','Ingmar9771','2024-12-18 21:30:30'),
(33,'Brauch','2ole_','2024-12-18 22:10:30'),
(34,'DerLackio','derlacki','2024-12-18 23:07:30'),
(35,'cosmosdraconis','cosmosdraconis','2024-12-18 23:22:30'),
(36,'Muha4433','Muha4433','2024-12-19 01:30:30'),
(37,'123Michi12','_michi361','2024-12-19 11:40:30'),
(38,'9voin','VoinTTV','2024-12-19 12:58:30'),
(40,'teamvlg','teamvlg','2024-12-19 15:51:30'),
(41,'kasim1r','kasim1r','2024-12-19 15:55:30'),
(42,'pqulini','pqulini','2024-12-19 17:03:30'),
(43,'Ryzes_GHG','RyzesGHG','2024-12-19 17:06:30'),
(45,'mikadft','mikadft','2024-12-19 21:11:30'),
(46,'Kanyuji','Kanyuji','2024-12-20 18:56:59'),
(47,'deexbeam','deexbeam','2024-12-19 22:42:30'),
(48,'TSRnox','noxiner','2024-12-20 18:15:30'),
(49,'Kerryisfat','Kerrysfrag','2024-12-20 19:11:52'),
(50,'jeansophie','jeqn.','2024-12-20 19:15:52'),
(51,'Hoppel800','Hoppel800','2024-12-20 20:03:06'),
(52,'spofoh','spofoh','2024-12-20 20:27:36'),
(53,'DerMaulwurf54','maulwurf_54','2024-12-20 20:34:43'),
(55,'zVipeZz','vipezz','2024-12-20 20:50:01'),
(57,'LookInMyEyes','systemlukas','2024-12-20 21:00:36'),
(58,'Yvki_','yuki6942','2024-12-20 21:07:58'),
(60,'tiiizian','tmax9175','2024-12-20 21:14:52'),
(67,'Mikaator','Mikaator','2024-12-20 22:09:38'),
(231,'rsbxdev','rsbxdev','2024-12-21 12:10:42'),
(232,'Einfachyoko','Einfachyoko','2024-12-21 12:11:18'),
(233,'LunaSIDE445','lunaside2.0','2024-12-21 12:12:02'),
(234,'Felixxxxx___','felixxxxx___','2024-12-21 12:13:18'),
(339,'annavsq','annavsq','2024-12-21 12:16:59'),
(417,'Raphibey','Raphibey','2024-12-21 12:18:34'),
(472,'2coyi','2coyi','2024-12-21 12:45:26'),
(473,'lellolidk ','lellolidk ','2024-12-21 12:53:58'),
(496,'rsbxdev','rsbxdev','2024-12-21 13:23:16'),
(497,'zickzacker1','zickzacker1','2024-12-21 13:25:03'),
(498,'BeNNix04','.bennix','2024-12-21 13:58:25'),
(499,'mac_kili','mackili','2024-12-21 13:59:17'),
(502,'louxisch ','louxisch','2024-12-21 14:43:13');
/*!40000 ALTER TABLE `whitelist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-12-21 16:22:40
