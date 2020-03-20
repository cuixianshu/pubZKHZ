-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:17:37
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
-- 表的结构 `tbl_way_pay`
--

DROP TABLE IF EXISTS `tbl_way_pay`;
CREATE TABLE IF NOT EXISTS `tbl_way_pay` (
  `id` tinyint(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` char(4) NOT NULL COMMENT '收付方式名称',
  `time_lastmodify` datetime NOT NULL COMMENT '最后更改时间',
  `id_lastmodifyer` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '最后更改者',
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='收付款方式';

--
-- 转存表中的数据 `tbl_way_pay`
--

INSERT INTO `tbl_way_pay` (`id`, `name`, `time_lastmodify`, `id_lastmodifyer`, `other`) VALUES
(001, '支票', '2019-11-09 15:08:27', 000001, NULL),
(002, '转账', '2019-11-10 08:18:21', 000001, NULL),
(003, '微信', '2019-11-09 15:10:03', 000001, NULL),
(004, '支付宝', '2019-11-09 15:11:40', 000001, NULL),
(005, '现金', '2019-11-09 15:11:40', 000001, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
