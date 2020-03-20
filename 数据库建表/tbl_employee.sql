-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:14:07
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
-- 表的结构 `tbl_employee`
--

DROP TABLE IF EXISTS `tbl_employee`;
CREATE TABLE IF NOT EXISTS `tbl_employee` (
  `id` smallint(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `gender` char(1) NOT NULL DEFAULT '男',
  `datebirth` date NOT NULL,
  `idcard` varchar(18) NOT NULL,
  `education` varchar(8) NOT NULL,
  `graduate_from` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `tel_private` varchar(18) NOT NULL,
  `tel_work` varchar(18) NOT NULL,
  `emergency_contacter` varchar(32) NOT NULL,
  `tel_emergency` varchar(18) NOT NULL,
  `date_join` date NOT NULL,
  `id_department` tinyint(3) UNSIGNED ZEROFILL NOT NULL,
  `position` varchar(24) NOT NULL,
  `certificate&rank` varchar(24) DEFAULT NULL,
  `date_leave` date DEFAULT NULL,
  `why_leave` varchar(24) DEFAULT NULL,
  `id_creater` smallint(6) NOT NULL,
  `time_create` datetime NOT NULL,
  `id_last_modifyer` smallint(6) DEFAULT NULL,
  `time_last_modify` datetime DEFAULT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `tbl_employee`
--

INSERT INTO `tbl_employee` (`id`, `name`, `gender`, `datebirth`, `idcard`, `education`, `graduate_from`, `address`, `tel_private`, `tel_work`, `emergency_contacter`, `tel_emergency`, `date_join`, `id_department`, `position`, `certificate&rank`, `date_leave`, `why_leave`, `id_creater`, `time_create`, `id_last_modifyer`, `time_last_modify`, `other`) VALUES
(000001, '崔先庶', '男', '1973-01-24', '231002197301242811', '本科', '黑龙江商学院机械系包装工程', '大连市沙河口区龙江路24号', '13322216568', '13322216568', '马晶', '13941129558', '2018-04-01', 003, '调度', 'C1', NULL, NULL, 1, '2019-11-10 10:37:06', NULL, NULL, NULL),
(000002, '马晶', '女', '1972-09-10', '231025197209100620', '本科', '东北农业大学农学专业', '龙江路24号', '13941129558', '13941129558', '崔先庶', '13322216568', '2018-04-01', 002, '财务总监', NULL, NULL, NULL, 1, '2019-11-10 10:44:57', NULL, NULL, NULL),
(000003, '马锐', '男', '1974-07-11', '23102519740711031X', '高中', '林口二中', '大华锦绣博雅园20#2201', '15046386666', '13390536695', '魏秀艳', '15303633001', '2018-04-01', 001, 'CEO', NULL, NULL, NULL, 1, '2019-11-10 10:44:57', NULL, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
