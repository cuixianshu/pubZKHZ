-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:17:28
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
-- 表的结构 `tbl_type_product`
--

DROP TABLE IF EXISTS `tbl_type_product`;
CREATE TABLE IF NOT EXISTS `tbl_type_product` (
  `id` tinyint(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `short_en` varchar(5) NOT NULL COMMENT '英文简称',
  `short_cn` varchar(5) NOT NULL COMMENT '中文简称',
  `id_creater` smallint(6) NOT NULL,
  `time_create` datetime NOT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='产品类目';

--
-- 转存表中的数据 `tbl_type_product`
--

INSERT INTO `tbl_type_product` (`id`, `short_en`, `short_cn`, `id_creater`, `time_create`, `other`) VALUES
(001, 'CFRC', '会议相关', 1, '2019-11-16 10:31:43', NULL),
(002, 'VECL', '车辆相关', 1, '2019-11-16 10:31:43', NULL),
(003, 'TKT', '交通票务', 1, '2019-11-16 10:31:43', NULL),
(004, 'TRSM', '旅游相关', 1, '2019-11-16 10:31:43', NULL),
(005, 'HTL', '酒店相关', 1, '2019-11-16 10:31:43', NULL),
(006, 'GIFT', '礼品相关', 1, '2019-11-16 10:32:26', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
