

--
-- Database: `cuixianshu`
--

-- --------------------------------------------------------

--
--  表的结构 `tbl_cashier`
--

DROP TABLE IF EXISTS `tbl_cashier`;
CREATE TABLE IF NOT EXISTS `tbl_cashier` (
  `id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `id_way_pay` tinyint(3) UNSIGNED ZEROFILL NOT NULL COMMENT '收款方式ID',
  `id_account` tinyint(3) UNSIGNED ZEROFILL NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `id_cashier` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '收款人',
  `time_receipt` datetime NOT NULL,
  `id_confirmer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '复核人',
  `time_confirm` datetime DEFAULT NULL COMMENT '复核时间',
  `ohter` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='客户的联系人表';

--
-- 转存表中的数据 `tbl_contacter`
--

INSERT INTO `tbl_contacter` (`id`, `name`, `gender`, `idcard`, `num_mobile`, `num_fixed`, `id_orgnztn`, `position`, `address`, `favorite`, `fvrt_work`, `id_responsible`, `id_creater`, `time_create`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(0000000001, '张晨', '男', NULL, '13889623251', NULL, 000001, '处长', '宏都筑景', '喝酒', NULL, 000002, 000001, '2019-11-16 11:00:24', NULL, NULL, NULL),
(0000000002, '吴迪', '男', NULL, '15898180912', NULL, 000002, '主管', NULL, NULL, NULL, 000002, 000001, '2019-11-16 11:00:24', NULL, NULL, NULL),
(0000000003, '石老师', '女', NULL, '18642820131', NULL, 000004, '未知', NULL, NULL, NULL, 000002, 000001, '2019-11-16 12:24:18', NULL, NULL, NULL),
(0000000004, '肖宇', '男', NULL, '18640994078', NULL, 000003, '处长', NULL, NULL, NULL, 000002, 000001, '2019-11-16 12:26:01', NULL, NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `tbl_department`
--

INSERT INTO `tbl_department` (`id`, `name`, `address`, `tel_fix`, `id_head`, `other`) VALUES
(001, '总部', '大连市沙河口区星海三街55-1', '84804486', 000003, NULL),
(002, '财务部', '大连市星海三街55-1', '84803759', 000002, NULL),
(003, '车队', '大连市星海三街55-1', NULL, 000001, NULL),
(004, '会务会议部', '星海三街55-1', '84803759', 000003, NULL),
(005, '旅行社', '星海三街55-1', '84804486', 000003, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `tbl_employee`
--

INSERT INTO `tbl_employee` (`id`, `name`, `gender`, `datebirth`, `idcard`, `education`, `graduate_from`, `address`, `tel_private`, `tel_work`, `emergency_contacter`, `tel_emergency`, `date_join`, `id_department`, `position`, `certificate&rank`, `date_leave`, `why_leave`, `id_creater`, `time_create`, `id_last_modifyer`, `time_last_modify`, `other`) VALUES
(000001, '崔先庶', '男', '1973-01-24', '231002197301242811', '本科', '黑龙江商学院机械系包装工程', '大连市沙河口区龙江路24号', '13322216568', '13322216568', '马晶', '13941129558', '2018-04-01', 003, '调度', 'C1', NULL, NULL, 1, '2019-11-10 10:37:06', NULL, NULL, NULL),
(000002, '马晶', '女', '1972-09-10', '231025197209100620', '本科', '东北农业大学农学专业', '龙江路24号', '13941129558', '13941129558', '崔先庶', '13322216568', '2018-04-01', 002, '财务总监', NULL, NULL, NULL, 1, '2019-11-10 10:44:57', NULL, NULL, NULL),
(000003, '马锐', '男', '1974-07-11', '23102519740711031X', '高中', '林口二中', '大华锦绣博雅园20#2201', '15046386666', '13390536695', '魏秀艳', '15303633001', '2018-04-01', 001, 'CEO', NULL, NULL, NULL, 1, '2019-11-10 10:44:57', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tbl_fill_invoice`
--

DROP TABLE IF EXISTS `tbl_fill_invoice`;
CREATE TABLE IF NOT EXISTS `tbl_fill_invoice` (
  `id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `type_invoice` enum('普票','专票','手撕') NOT NULL DEFAULT '普票',
  `num_invoice` varchar(16) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `time_fill` datetime NOT NULL,
  `id_filler` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '填开人ID',
  `id_tbl_ask` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '开发票申请单ID',
  `path_pict` varchar(64) NOT NULL COMMENT '凭证路径',
  `id_tbl_cashier` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '收款ID',
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单表';

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='客户单位';

--
-- 转存表中的数据 `tbl_orgnization`
--

INSERT INTO `tbl_orgnization` (`id`, `org_short_name`, `org_address`, `org_fixed_tel`, `contacter`, `tel`, `name_invoice`, `num_tax`, `teladd_tax`, `account_num`, `id_creater`, `time_create`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(000001, '化物所成果处', '研究生大厦8F', NULL, '张晨', '13889623251', '中国科学院大连化学物理研究所', NULL, NULL, NULL, 000001, '2019-11-16 10:42:37', NULL, NULL, NULL),
(000002, '大工教务处', '大工西侧楼', NULL, '吴迪', '15898180912', '大连理工大学', NULL, NULL, NULL, 000001, '2019-11-16 10:42:37', NULL, NULL, NULL),
(000003, '化物所科技处', '研究生大厦8F', NULL, '肖宇', '18640994078', '中国科学院大连化学物理研究所', NULL, NULL, NULL, 000001, '2019-11-16 12:18:48', NULL, NULL, NULL),
(000004, '海洋环境监测中心', '凌水路', NULL, '石老师', '18642820131', '国家海洋环境监测中心', NULL, NULL, NULL, 000001, '2019-11-16 12:22:57', NULL, NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='我方银行账户';

--
-- 转存表中的数据 `tbl_our_account`
--

INSERT INTO `tbl_our_account` (`id`, `short_name`, `name`, `bank_account`, `num_account`, `id_lastmodifyer`, `time_lastmodify`, `other`) VALUES
(001, '中科平安', '中科会展(大连)有限公司', '中国平安银行大连星海广场支行', '345475DSFSDG', 000001, '2019-11-09 15:25:44', NULL),
(002, '中科建行', '中科会展(大连)有限公司', '中国建设银行大连星海广场支行', '65532536FDHDFHEW', 000001, '2019-11-09 15:25:44', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tbl_product`
--

DROP TABLE IF EXISTS `tbl_product`;
CREATE TABLE IF NOT EXISTS `tbl_product` (
  `id` smallint(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `id_type` tinyint(3) UNSIGNED ZEROFILL NOT NULL,
  `model` varchar(16) NOT NULL COMMENT '型号',
  `scale` varchar(64) NOT NULL COMMENT '规格规模',
  `details` varchar(128) NOT NULL,
  `sellable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否可售',
  `id_creater` smallint(6) UNSIGNED ZEROFILL NOT NULL,
  `time_create` datetime NOT NULL,
  `id_modifyer` smallint(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `time_modify` datetime DEFAULT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='产品表';

--
-- 转存表中的数据 `tbl_product`
--

INSERT INTO `tbl_product` (`id`, `name`, `id_type`, `model`, `scale`, `details`, `sellable`, `id_creater`, `time_create`, `id_modifyer`, `time_modify`, `other`) VALUES
(000001, 'SWBQT商务包全天', 002, '别克GL8', '7', '含8小时100公里,超时或超里程另外计收', 1, 000001, '2019-11-16 12:07:52', NULL, NULL, NULL),
(000002, 'SWJSJ商务接送机', 002, '别克GL8', '7', '含1.5小时30公里,超时或超里程另外计收', 1, 000001, '2019-11-16 12:12:27', NULL, NULL, NULL),
(000003, 'SWJSBZ商务接送北站', 002, '别克GL8', '7', '含2小时40公里,超时或超里程另外计收', 1, 000001, '2019-11-16 12:12:27', NULL, NULL, NULL),
(000004, 'SWYY商务预约', 002, '别克GL8', '7', '含0.5小时6公里,超时超里程另外计收', 1, 000001, '2019-11-16 12:14:05', NULL, NULL, NULL),
(000005, 'SWBBT商务包半天', 002, '别克GL8', '7', '含4小时50公里,超时或超里程另外计收', 1, 000001, '2019-11-16 12:15:33', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `tbl_rqst_invoice`
--

DROP TABLE IF EXISTS `tbl_rqst_invoice`;
CREATE TABLE IF NOT EXISTS `tbl_rqst_invoice` (
  `id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `type_invoice` char(4) NOT NULL COMMENT '发票类型',
  `id_taxpayer` varchar(32) NOT NULL COMMENT '开票税号',
  `id_product` mediumint(9) UNSIGNED ZEROFILL NOT NULL COMMENT '产品ID',
  `quantity` smallint(6) NOT NULL DEFAULT '1' COMMENT '开票数量',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '开票单价',
  `id_filling_invoice` int(11) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '开票ID',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '开票金额',
  `id_asker` smallint(6) UNSIGNED ZEROFILL NOT NULL COMMENT '申请人',
  `time_ask` datetime NOT NULL,
  `other` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='产品计价规则';

--
-- 转存表中的数据 `tbl_rule_price`
--

INSERT INTO `tbl_rule_price` (`id`, `name`, `price_basic`, `duration_basic`, `scale_basic`, `price_extraduration`, `price_extrascale`, `id_creater`, `time_create`, `id_modifyer`, `time_modify`, `usable`, `other`) VALUES
(000001, 'DHSHWSSWBQT大化所化物所商务包全天', '600.00', '8.00', '100.00', '50.00', '5.00', 000001, '2019-11-16 11:37:31', NULL, NULL, 1, ''),
(000002, 'DHSHWSSWJSJ大化所化物所商务接送机', '200.00', '1.50', '30.00', '50.00', '5.00', 000001, '2019-11-16 11:40:14', NULL, NULL, 1, ''),
(000003, 'DHSHWSSWJSBZ大化所化物所商务接送北站', '300.00', '2.00', '40.00', '50.00', '5.00', 000001, '2019-11-16 11:43:29', NULL, NULL, 1, ''),
(000004, 'DHSHWSSWYY大化所化物所商务预约', '150.00', '0.50', '6.00', '50.00', '5.00', 000001, '2019-11-16 11:43:29', NULL, NULL, 1, '');

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='产品类目';

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='收付款方式';

--
-- 转存表中的数据 `tbl_way_pay`
--

INSERT INTO `tbl_way_pay` (`id`, `name`, `time_lastmodify`, `id_lastmodifyer`, `other`) VALUES
(001, '支票', '2019-11-09 15:08:27', 000001, NULL),
(002, '转账', '2019-11-10 08:18:21', 000001, NULL),
(003, '微信', '2019-11-09 15:10:03', 000001, NULL),
(004, '支付宝', '2019-11-09 15:11:40', 000001, NULL),
(005, '现金', '2019-11-09 15:11:40', 000001, NULL);