-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:09:22
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
-- 表的结构 `tbl_contacter`
--

DROP TABLE IF EXISTS `tbl_contacter`;
CREATE TABLE IF NOT EXISTS `tbl_contacter` (
  `id` mediumint(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `gender` enum('男','女') NOT NULL DEFAULT '男',
  `idcard` varchar(18) DEFAULT NULL,
  `num_mobile` varchar(18) NOT NULL,
  `num_fixed` varchar(18) DEFAULT NULL,
  `id_orgnztn` smallint(6) UNSIGNED ZEROFILL NOT NULL,
  `position` varchar(16) NOT NULL COMMENT '职务',
  `address` varchar(32) DEFAULT NULL,
  `favorite` varchar(64) DEFAULT NULL COMMENT '个人喜好',
  `fvrt_work` varchar(32) DEFAULT NULL COMMENT '工作喜好',
  `id_responsible` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '责任人ID',
  `id_creater` smallint(6) UNSIGNED ZEROFILL NOT NULL,
  `time_create` datetime NOT NULL,
  `id_lastmodifyer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `time_lastmodify` datetime DEFAULT NULL,
  `other` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='客户的联系人表';

--
-- 转存表中的数据 `tbl_contacter`
--

INSERT INTO `tbl_contacter` (`id`, `name`, `gender`, `idcard`, `num_mobile`, `num_fixed`, `id_orgnztn`, `position`, `address`, `favorite`, `fvrt_work`, `id_responsible`, `id_creater`, `time_create`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(0000000001, '张晨', '男', NULL, '13889623251', NULL, 000001, '处长', '宏都筑景', '喝酒', NULL, 000002, 000001, '2019-11-16 11:00:24', NULL, NULL, NULL),
(0000000002, '吴迪', '男', NULL, '15898180912', NULL, 000002, '主管', NULL, NULL, NULL, 000002, 000001, '2019-11-16 11:00:24', NULL, NULL, NULL),
(0000000003, '石老师', '女', NULL, '18642820131', NULL, 000004, '未知', NULL, NULL, NULL, 000002, 000001, '2019-11-16 12:24:18', NULL, NULL, NULL),
(0000000004, '肖宇', '男', NULL, '18640994078', NULL, 000003, '处长', NULL, NULL, NULL, 000002, 000001, '2019-11-16 12:26:01', NULL, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
