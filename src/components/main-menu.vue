<template>
  <div class="container-fluid mainmenu">
    <div class="row menu-row" v-if="isLogined"><!--  -->
      <ul class="nav nav-tabs menu-tabs" v-if="user.orders">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">订单管理</span>
          <div class="dropdown-menu">
            <li v-if="user.orders_import_from_excel">
              <span class="dropdown-item menu-item"  @click="loadPage('/importFromExcel')">
                Excel导入
              </span>
            </li>
            <li v-if="user.orders_input_byhand">
              <span class="dropdown-item menu-item" @click="loadPage('/inputByHand')">
                手工输入
              </span>
            </li>
            <li v-if="user.orders_check_orders">
              <span class="dropdown-item menu-item" @click="loadPage('/checkOrders')">
                核单
              </span>
            </li>
            <li v-if="user.orders_tkt_inbound">
              <span class="dropdown-item menu-item" @click="loadPage('/ticket-inbound')">
                机票入库
              </span>
            </li>
            <li v-if="user.orders_tkt_outbound">
              <span class="dropdown-item menu-item" @click="loadPage('/ticket-outbound')">
                机票出库
              </span>
            </li>
            <li v-if="user.orders_tkt_change_refound">
              <span class="dropdown-item menu-item" @click="loadPage('/ticketChangeRefound')">
                机票退改
              </span>
            </li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs" v-if="user.invoices">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">
            发票业务
          </span>
          <div class="dropdown-menu">
            <li title="选择相关业务订单,申请开具发票" v-if="user.invoices_apply">
              <span class="dropdown-item menu-item" @click="loadPage('/requestInvoice')">
                申请开票
              </span>
            </li>
            <li title="更改开票申请、根据开票申请开具发票" v-if="user.invoices_modify_fill">
              <span class="dropdown-item menu-item" @click="loadPage('/modifyApplyedFilledInvoice')">
                开票、变更申请
              </span>
            </li>
            <li title="打印、查看、导出发票明细" v-if="user.invoices_details">
              <span class="dropdown-item menu-item" @click="loadPage('/selecterOfFilledInvoice')">
                发票明细
              </span>
            </li>
            <li title="作废已开出的发票" v-if="user.invoices_refill_cancel">
              <span class="dropdown-item menu-item" @click="loadPage('/refillCancelFilledInvoice')">
                作废重开
              </span>
            </li>
            <!-- <li v-if="user.orders"><span class="dropdown-item menu-item" @click="loadPage('/fillInvoice')">填开发票a</span></li> -->
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs" v-if="user.finance">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">收款付款</span>
          <div class="dropdown-menu">
            <li v-if="user.finance_cashier"><span class="dropdown-item menu-item" @click="loadPage('/cashier')">销售回款</span></li>
            <li v-if="user.finance_tkt_cashier"><span class="dropdown-item menu-item" @click="loadPage('/ticket-cashier')">机票收款</span></li>            
            <li v-if="user.finance_accept_other_funds"><span class="dropdown-item menu-item" @click="loadPage('/accept-other-funds')">其它收款</span></li>
            <li v-if="user.finance_check_receipts"><span class="dropdown-item menu-item" @click="loadPage('/check-receipts')">收款复核</span></li>
            <li v-if="user.finance_pay"><span class="dropdown-item menu-item" @click="loadPage('/pay')">支付款项</span></li>
            <li v-if="user.finance_review_payment"><span class="dropdown-item menu-item" @click="loadPage('/review-payment')">付款复核</span></li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs" v-if="user.rqstfunds">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">请款报销</span>
          <div class="dropdown-menu">
            <li v-if="user.rqstfunds_borrow_reimburse"><span class="dropdown-item menu-item" @click="loadPage('/request-funds')">请款借款</span></li>
            <li v-if="user.rqstfunds_purchasing_funds"><span class="dropdown-item menu-item" @click="loadPage('/rqst-pcsg-funds')">采购请款</span></li>
            <li v-if="user.rqstfunds_rfdtkt_paying"><span class="dropdown-item menu-item" @click="loadPage('/rqst-rfdtkt-paying')">机票退款</span></li>            
            <li v-if="user.rqstfunds_primary_audits"><span class="dropdown-item menu-item" @click="loadPage('/prmry-audits-rqst-funds')">请款初审</span></li>
<!--             <li v-if="user.orders"><span class="dropdown-item menu-item">请款初审</span></li> -->
            <li v-if="user.rqstfunds_final_audits"><span class="dropdown-item menu-item" @click="loadPage('/final-audits-rqst-funds')">请款复审</span></li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs" v-if="user.bscinfo">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">基础数据</span>
          <div class="dropdown-menu">
            <li v-if="user.bscinfo_clnt_dptmt">
              <span class="dropdown-item menu-item" @click="loadPage('/clientDepartment')">
                客户单位
              </span>
            </li>
            <li v-if="user.bscinfo_rule_price">
              <span class="dropdown-item menu-item" @click="loadPage('/rulePrice')">
                计价规则
              </span>
            </li>
            <li v-if="user.bscinfo_employee">
              <span class="dropdown-item menu-item" @click="loadPage('/employee')">
                员工信息
              </span>
            </li>
            <li v-if="user.bscinfo_authorization">
              <span class="dropdown-item menu-item" @click="loadPage('/authorizations')">
                员工权限
              </span>
            </li>
            <li v-if="user.bscinfo_product">
              <span class="dropdown-item menu-item" @click="loadPage('/product')">
                产品管理
              </span>
            </li>
            <li v-if="user.bscinfo_project">
              <span class="dropdown-item menu-item" @click="loadPage('/project')">
                项目管理
              </span>
            </li>
            <li v-if="user.bscinfo_contract">
              <span class="dropdown-item menu-item" @click="loadPage('/contract')">
                合同管理
              </span>
            </li>
            <li v-if="user.bscinfo_equipment">
              <span class="dropdown-item menu-item" @click="loadPage('/equipment')">
                设备管理
              </span>
            </li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs" v-if="user.purchasing">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">采购业务</span>
          <div class="dropdown-menu">
            <li v-if="user.purchasing_apply">
              <span class="dropdown-item menu-item" @click="loadPage('/apply-purchsing')">
                申请采购
              </span>
            </li>
            <li v-if="user.purchasing_approve_applying">
              <span class="dropdown-item menu-item" @click="loadPage('/approve-applying-purchasing')">
                审核请购
              </span>
            </li>
            <li v-if="user.purchasing_enquiry_compare">
              <span class="dropdown-item menu-item" @click="loadPage('/enquiry-compare-price')">
                询价比价
              </span>
            </li>
            <li v-if="user.purchasing_approve_enquiry">
              <span class="dropdown-item menu-item" @click="loadPage('/approve-enquiry')">
                审核比价
              </span>
            </li>
            <li v-if="user.purchasing_launch">
              <span class="dropdown-item menu-item" @click="loadPage('/launch-purchasing')">
                采购执行
              </span>
            </li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs" v-if="user.reports">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">业务报表</span>
          <div class="dropdown-menu">
            <li v-if="user.reports_sale">
              <span class="dropdown-item menu-item" @click="loadPage('/reports-sale')">销售报表
              </span>
            </li>
            <li v-if="user.reports_finance"><span class="dropdown-item menu-item" @click="loadPage('/reports-finance')">财务报表</span></li>
            <li v-if="user.reports_purchasing"><span class="dropdown-item menu-item" @click="loadPage('/reports-purchasing')">采购报表</span></li>
            <li v-if="user.reports_other"><span class="dropdown-item menu-item" @click="loadPage('/reports-other')">其它报表</span></li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs" v-if="user.materials">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">物料管理</span>
          <div class="dropdown-menu">
            <li v-if="user.materials_acceptance"><span class="dropdown-item menu-item" @click="loadPage('/acceptanceCheck')">验收入库</span></li>
            <li><span class="dropdown-item menu-item" @click="loadPage('/materialsApply')">申请领用</span></li>
            <li v-if="user.materials_approve_applying"><span class="dropdown-item menu-item" @click="loadPage('/materialsApproveApplying')">审核领用</span></li>
            <li v-if="user.materials_distribute"><span class="dropdown-item menu-item" @click="loadPage('/materialsDistribute')">发放物料</span></li>
            <li v-if="user.materials_search"><span class="dropdown-item menu-item" @click="loadPage('/materialSearchModify')">查找新建</span></li>
            <li v-if="user.materials_Inventory"><span class="dropdown-item menu-item" @click="loadPage('/materialsInventory')">库存盘点</span></li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs" v-if="user.personal">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">个人中心</span>
          <div class="dropdown-menu">
            <li v-if="user.personal_turn_in"><span class="dropdown-item menu-item" @click="loadPage('/turn-in-funds')">缴款还款</span></li>
            <li v-if="user.personal_needtoreturn"><span class="dropdown-item menu-item" @click="loadPage('/personal-needtoreturn')">需还款物</span></li>
            <li v-if="user.personal_audits"><span class="dropdown-item menu-item">我的审批</span></li>
            <li v-if="user.personal_modify_info"><span class="dropdown-item menu-item" @click="loadPage('/change-pswd')">更改密码</span></li>
            <li v-if="user.personal_logout"><span class="dropdown-item menu-item" @click="beingQuit">退出登录</span></li>
          </div>
        </li>        
      </ul> 
<!--       <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">请款报销</span>
          <div class="dropdown-menu">
            <li v-if="user.orders"><span class="dropdown-item menu-item">请款</span></li>
            <li v-if="user.orders"><span class="dropdown-item menu-item">请款初审</span></li>
            <li v-if="user.orders"><span class="dropdown-item menu-item">请款复审</span></li>
          </div>
        </li>        
      </ul>  -->                                                                             
    </div>

    <div class="content-row"><!-- row  -->
      <router-view></router-view>
    </div>
    <div class="modal fade" id="quitSys" role="dialog" aria-labelledby="quitSys" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span><h4>退出系统提示</h4></span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <h5>您确定要退出系统吗？</h5>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button type="button" class="btn btn-primary" @click="confirmQuiting">确定</button>
          </div>           
        </div>
      </div>
    </div>     
  </div>
</template>


<script>

export default {
  name: 'main-menu',
  data() {
    return {
      
    }
  },
  methods: {
    loadPage:function (pageRouter) {
    	this.$router.push(pageRouter);
      // console.log(this.$store.state.user);
    },
    beingQuit() {
      $('#quitSys').modal('toggle');
    },
    confirmQuiting() {
      $('#quitSys').modal('toggle');
      this.$store.commit('userLoginOut');
      this.$router.push('/');      
    }
  },
  computed:{
    isLogined() {
      return (Object.keys(this.$store.state.user)).length<1?false:true;
    },
    user() {
      return this.$store.state.user;
    }
  },
  beforeCreate:function () {
   // document.querySelector('body').setAttribute('style', 'background-color:#98989891');
 }
}
</script>

<style scoped>
.mainmenu {
  height: 100%;
  background-color:#F2F2F2;
/*  position: fixed;
  top:0px;
  left:0px;*/
  /*z-index: 9999;*/
/*
//#F2F2F2
 */
}
ul {
  text-decoration: none;  
}
.menu-title {
	display: block;
	margin: 2px 5px;
	font-size: 1.1rem;
 	width: 100%;
  color: #FFF;
  padding:2px;
  text-decoration: none;
  text-align: center;

}
.menu-item {
  color: #FFF;
 /* #007bff*/
  font-size: 1.1rem;
  font-family: 'Microsoft YaHei';
  padding: 0.5rem 1.25rem 0.5rem 0.5rem;
}

.menu-item:hover {
  color:#FF8C00;
  /*padding:5px;*/
}
.menu-row {
margin-top:0px;
background-color: #FF8C00;  
}
.dropdown-menu {
   background-color: #FF8C00;;
   color:#007bff; 
   min-width:20px;
/*  -webkit-font-smoothing: subpixel-antialiased;
  -webkit-transform: translateZ(0) scale(1.0, 1.0);*/ 
}
.content-row {
  margin: 3px auto;
  text-align: center;
  width: 100%;
  /*border: 1px solid #000;*/
  padding:10px;
  /*background-color: #007bff;*/
}
.title {
  width: 100%;
  text-align: center;
}
.menu-tabs {
  margin-left: 20px;
}
li span {
  cursor:pointer;
}
.modal-body {
  margin:0 auto;
}

</style>


