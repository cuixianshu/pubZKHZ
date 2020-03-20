-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:17:18
-- 服务器版本： 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cuixianshu`
--

-- --------------------------------------------------------

--
-- 表的结构 `tbl_rule_price`
--

DROP TABLE IF EXISTS `tbl_rule_price`;
CREATE TABLE IF NOT EXISTS `tbl_rule_price` (
  `id` smallint(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `price_basic` decimal(10,2) NOT NULL DEFAULT '0.00',
  `duration_basic` decimal(10,2) NOT NULL DEFAULT '1.00',
  `scale_basic` decimal(10,2) NOT NULL COMMENT '基本里程或规模',
  `price_extraduration` decimal(10,2) NOT NULL COMMENT '超时',
  `price_extrascale` decimal(10,2) NOT NULL COMMENT '超里程或超规模',
  `id_creater` smallint(6) UNSIGNED ZEROFILL NOT NULL,
  `time_create` datetime NOT NULL,
  `id_modifyer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `time_modify` datetime DEFAULT NULL,
  `usable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '可用状态',
  `other` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='产品计价规则';

--
-- 转存表中的数据 `tbl_rule_price`
--

INSERT INTO `tbl_rule_price` (`id`, `name`, `price_basic`, `duration_basic`, `scale_basic`, `price_extraduration`, `price_extrascale`, `id_creater`, `time_create`, `id_modifyer`, `time_modify`, `usable`, `other`) VALUES
(000001, 'DHSHWSSWBQT大化所化物所商务包全天', '600.00', '8.00', '100.00', '50.00', '5.00', 000001, '2019-11-16 11:37:31', NULL, NULL, 1, ''),
(000002, 'DHSHWSSWJSJ大化所化物所商务接送机', '200.00', '1.50', '30.00', '50.00', '5.00', 000001, '2019-11-16 11:40:14', NULL, NULL, 1, ''),
(000003, 'DHSHWSSWJSBZ大化所化物所商务接送北站', '300.00', '2.00', '40.00', '50.00', '5.00', 000001, '2019-11-16 11:43:29', NULL, NULL, 1, ''),
(000004, 'DHSHWSSWYY大化所化物所商务预约', '150.00', '0.50', '6.00', '50.00', '5.00', 000001, '2019-11-16 11:43:29', NULL, NULL, 1, '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
