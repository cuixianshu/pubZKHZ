-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:17:00
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
-- 表的结构 `tbl_our_account`
--

DROP TABLE IF EXISTS `tbl_our_account`;
CREATE TABLE IF NOT EXISTS `tbl_our_account` (
  `id` tinyint(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `short_name` char(8) NOT NULL COMMENT '账户简称',
  `name` varchar(64) NOT NULL COMMENT '账户名称',
  `bank_account` varchar(64) NOT NULL COMMENT '开户行',
  `num_account` varchar(32) NOT NULL COMMENT '账户号',
  `id_lastmodifyer` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '最后更新人',
  `time_lastmodify` datetime NOT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='我方银行账户';

--
-- 转存表中的数据 `tbl_our_account`
--

INSERT INTO `tbl_our_account` (`id`, `short_name`, `name`, `bank_account`, `num_account`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(001, '中科平安', '中科会展(大连)有限公司', '中国平安银行大连星海广场支行', '345475DSFSDG', 000001, '2019-11-09 15:25:44', NULL),
(002, '中科建行', '中科会展(大连)有限公司', '中国建设银行大连星海广场支行', '65532536FDHDFHEW', 000001, '2019-11-09 15:25:44', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
