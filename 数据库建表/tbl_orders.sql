-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2019-11-16 12:14:31
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
-- 表的结构 `tbl_orders`
--

DROP TABLE IF EXISTS `tbl_orders`;
CREATE TABLE IF NOT EXISTS `tbl_orders` (
  `id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '标识每笔销售业务',
  `cstmr_ognz` varchar(64) NOT NULL COMMENT 'customer organization',
  `id_contacter` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '联系人ID',
  `id_prjct_belongto` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT 'which id of project belong to',
  `id_contract` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '合同ID',
  `id_product` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '产品ID',
  `id_rule_price` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '计价规则ID',
  `quantity` mediumint(9) NOT NULL DEFAULT '1' COMMENT '销售数量',
  `actual_price` decimal(10,2) NOT NULL COMMENT '实际成交价',
  `surcharge` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '附加费用',
  `use_surcharge` varchar(256) DEFAULT NULL COMMENT '附加费用途',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `start_point` varchar(64) DEFAULT NULL COMMENT '开始地点',
  `end_point` varchar(64) DEFAULT NULL COMMENT '结束地点',
  `basic_requirement` varchar(64) NOT NULL,
  `other_requirement` varchar(64) NOT NULL,
  `id_payer` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '结算人',
  `mem` varchar(128) NOT NULL COMMENT '备注信息',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `id_creater` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '创建者ID',
  `time_verify` datetime DEFAULT NULL COMMENT '核单时间',
  `id_verifyer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '核单人',
  `id_tbl_asking_invoice` int(11) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '申请发票ID',
  `id_tbl_filling_invoice` int(11) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '开票ID',
  `id_tbl_cashier` int(11) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '收款ID',
  `other1` varchar(64) DEFAULT NULL,
  `other2` varchar(64) DEFAULT NULL,
  `other3` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='销售订单表';
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
