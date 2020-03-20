<template>
  <div class="container-fluid mainmenu">
    <div class="row menu-row">
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">订单管理</span>
          <div class="dropdown-menu">
            <li>
              <span class="dropdown-item menu-item"  @click="loadPage('/importFromExcel')">
                Excel导入
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/inputByHand')">
                手工输入
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/checkOrders')">
                核单
              </span>
            </li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">
            发票业务
          </span>
          <div class="dropdown-menu">
            <li title="选择相关业务订单,申请开具发票">
              <span class="dropdown-item menu-item" @click="loadPage('/requestInvoice')">
                申请开票
              </span>
            </li>
            <li title="更改开票申请、根据开票申请开具发票">
              <span class="dropdown-item menu-item" @click="loadPage('/modifyApplyedFilledInvoice')">
                开票、变更申请
              </span>
            </li>
            <li title="打印、查看、导出发票明细">
              <span class="dropdown-item menu-item" @click="loadPage('/selecterOfFilledInvoice')">
                发票明细
              </span>
            </li>
            <li title="作废已开出的发票">
              <span class="dropdown-item menu-item" @click="loadPage('/refillCancelFilledInvoice')">
                作废发票
              </span>
            </li>
            <!-- <li><span class="dropdown-item menu-item" @click="loadPage('/fillInvoice')">填开发票a</span></li> -->
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">财务业务</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item" @click="loadPage('/cashier')">收入款项</span></li>
            <li><span class="dropdown-item menu-item">收款复核</span></li>
            <li><span class="dropdown-item menu-item">支付款项</span></li>
            <li><span class="dropdown-item menu-item">付款复核</span></li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">请款报销</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item">差旅报销</span></li>
            <li><span class="dropdown-item menu-item">采购请款</span></li>
            <li><span class="dropdown-item menu-item">请款初审</span></li>
            <li><span class="dropdown-item menu-item">请款初审</span></li>
            <li><span class="dropdown-item menu-item">请款复审</span></li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">基础数据</span>
          <div class="dropdown-menu">
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/clientDepartment')">
                客户单位
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/rulePrice')">
                计价规则
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/employee')">
                员工管理
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/product')">
                产品管理
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/project')">
                项目管理
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/contract')">
                合同管理
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/equipment')">
                设备管理
              </span>
            </li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">采购业务</span>
          <div class="dropdown-menu">
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/apply-purchsing')">
                申请采购
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/approve-applying-purchasing')">
                审核请购
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/enquiry-compare-price')">
                询价比价
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/approve-enquiry')">
                审核比价
              </span>
            </li>
            <li>
              <span class="dropdown-item menu-item" @click="loadPage('/launch-purchasing')">
                采购执行
              </span>
            </li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">业务报表</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item">销售报表</span></li>
            <li><span class="dropdown-item menu-item">财务报表</span></li>
            <li><span class="dropdown-item menu-item">采购报表</span></li>
            <li><span class="dropdown-item menu-item">其它报表</span></li>
          </div>
        </li>        
      </ul>
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">物料管理</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item">验收入库</span></li>
            <li><span class="dropdown-item menu-item">发放领用</span></li>
            <li><span class="dropdown-item menu-item">查找物品</span></li>
            <li><span class="dropdown-item menu-item">库存管理</span></li>
          </div>
        </li>        
      </ul> 
      <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">个人中心</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item">修改昵称</span></li>
            <li><span class="dropdown-item menu-item">退出登录</span></li>
            <li><span class="dropdown-item menu-item">我的申请</span></li>
            <li><span class="dropdown-item menu-item">我的审批</span></li>
          </div>
        </li>        
      </ul> 
<!--       <ul class="nav nav-tabs menu-tabs">
        <li class="dropdown">
          <span data-toggle="dropdown" class="dropdown-toggle menu-title">请款报销</span>
          <div class="dropdown-menu">
            <li><span class="dropdown-item menu-item">请款</span></li>
            <li><span class="dropdown-item menu-item">请款初审</span></li>
            <li><span class="dropdown-item menu-item">请款复审</span></li>
          </div>
        </li>        
      </ul>  -->                                                                             
    </div>  
    <div class="row content-row">
      <router-view></router-view>
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
</style>


