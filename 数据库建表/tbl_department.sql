-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:10:13
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
-- 表的结构 `tbl_department`
--

DROP TABLE IF EXISTS `tbl_department`;
CREATE TABLE IF NOT EXISTS `tbl_department` (
  `id` tinyint(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `address` varchar(64) NOT NULL,
  `tel_fix` varchar(18) DEFAULT NULL,
  `id_head` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '负责人',
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tbl_department`
--

INSERT INTO `tbl_department` (`id`, `name`, `address`, `tel_fix`, `id_head`, `other`) VALUES
(001, '总部', '大连市沙河口区星海三街55-1', '84804486', 000003, NULL),
(002, '财务部', '大连市星海三街55-1', '84803759', 000002, NULL),
(003, '车队', '大连市星海三街55-1', NULL, 000001, NULL),
(004, '会务会议部', '星海三街55-1', '84803759', 000003, NULL),
(005, '旅行社', '星海三街55-1', '84804486', 000003, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
