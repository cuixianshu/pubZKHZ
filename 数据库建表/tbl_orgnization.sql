-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:16:46
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
-- 表的结构 `tbl_orgnization`
--

DROP TABLE IF EXISTS `tbl_orgnization`;
CREATE TABLE IF NOT EXISTS `tbl_orgnization` (
  `id` smallint(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `org_short_name` varchar(64) NOT NULL COMMENT '单位简称',
  `org_address` varchar(64) NOT NULL,
  `org_fixed_tel` varchar(18) DEFAULT NULL,
  `contacter` varchar(64) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `name_invoice` varchar(64) NOT NULL,
  `num_tax` varchar(24) DEFAULT NULL,
  `teladd_tax` varchar(64) DEFAULT NULL,
  `account_num` varchar(64) DEFAULT NULL,
  `id_creater` smallint(6) UNSIGNED ZEROFILL NOT NULL,
  `time_create` datetime NOT NULL,
  `id_lastmodifyer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `time_lastmodify` datetime DEFAULT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='客户单位';

--
-- 转存表中的数据 `tbl_orgnization`
--

INSERT INTO `tbl_orgnization` (`id`, `org_short_name`, `org_address`, `org_fixed_tel`, `contacter`, `tel`, `name_invoice`, `num_tax`, `teladd_tax`, `account_num`, `id_creater`, `time_create`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(000001, '化物所成果处', '研究生大厦8F', NULL, '张晨', '13889623251', '中国科学院大连化学物理研究所', NULL, NULL, NULL, 000001, '2019-11-16 10:42:37', NULL, NULL, NULL),
(000002, '大工教务处', '大工西侧楼', NULL, '吴迪', '15898180912', '大连理工大学', NULL, NULL, NULL, 000001, '2019-11-16 10:42:37', NULL, NULL, NULL),
(000003, '化物所科技处', '研究生大厦8F', NULL, '肖宇', '18640994078', '中国科学院大连化学物理研究所', NULL, NULL, NULL, 000001, '2019-11-16 12:18:48', NULL, NULL, NULL),
(000004, '海洋环境监测中心', '凌水路', NULL, '石老师', '18642820131', '国家海洋环境监测中心', NULL, NULL, NULL, 000001, '2019-11-16 12:22:57', NULL, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
