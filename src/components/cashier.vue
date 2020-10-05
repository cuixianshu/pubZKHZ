<template>
  <div class="father">
    <h5>当前位置:收款付款/销售回款</h5>
    <div class="container-fluid query">
      <div class="row form-inline queryOfCashier">
        <datepicker id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="业务发生的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="业务发生的时间范围"></datepicker>
        <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="搜索关键词" title="客户、客户手机、客户单位、开始或举办地点、订单备注、销售金额、发票号等">
        <select class="form-control" v-model="queryContent.id_project" title="所属项目">
          <option :value="0">所有项目</option>
          <option v-for="item in projects" :value="item.id">{{item.name}}</option>
        </select>
        <select class="form-control" v-model="queryContent.id_saler" title="执行人">
          <option :value="0">所有执行人</option> 
          <option v-for="item in employees" :value="item.id">{{item.name}}</option>
        </select>
        <button class="btn btn-primary" @click="getUncollectedOrders">🔍获取数据</button>
      </div>
    </div>
    <div class="divfortable" v-if="uncollectedOrders.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
          <th title="选择"><input class="checkbox" type="checkbox" @change="selectAllClicked" v-model="allChecked" value=true></th>
        </thead>
        <tbody>
          <tr v-for="row,index in uncollectedOrders">
            <td :title="row.name_prjct">{{row.name_prjct}}</td>
            <td :title="row.id_operater">{{getEmployeeName(row)}}</td><!-- row.id_operater -->
            <td :title="row.start_time">{{row.start_time}}</td>
            <td :title="row.start_point">{{row.start_point}}</td>
            <td :title="row.c_name">{{row.c_name}}</td>
            <td :title="row.c_mobile">{{row.c_mobile}}</td>
            <td :title="row.cstmr_ognz">{{row.cstmr_ognz}}</td>
            <td :title="row.p_name">{{row.p_name}}</td>
            <td :title="row.actual_price">{{row.actual_price}}</td>
            <td title="垫付">{{Number(row.surcharge)+Number(row.park_fee)}}</td>
            <td title="订单总金额">{{Number(row.surcharge)+Number(row.park_fee)+Number(row.actual_price)}}</td>
            <td :title="row.amount_received">{{row.amount_received}}</td>
            <td :title="row.f_invoice_num">{{row.f_invoice_num}}</td>
            <td :title="row.mem">{{row.mem}}</td>
            <td :title="row.msg_for_driver">{{row.msg_for_driver}}</td>
            <td title="选择"><input class="checkbox" type="checkbox" v-model="selectedOrders" :value="row"></td>
          </tr>
        </tbody>
      </table>

    </div>
    <div v-if="uncollectedOrders.length>0" style="margin-top: 10px;">
      <span class="collectiontip">已选中：{{selectedOrders.length}}条，应收总额：{{totalAmountNeeddToClct}}元。</span>
      <button class="btn btn-primary" @click="openMdlCashier">去收款</button>
      <button class="btn btn-secondary" @click="uncollectedOrders=[];">清空</button>
    </div>

    <div class="modal fade" id="mdlCashier" role="dialog" aria-labelledby="mdlCashier" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>收款---应收总额:￥{{totalAmountNeeddToClct}}
              </h5>
            </span>
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="iptType">类型</label>
                  <input id="iptType" type="text" class="form-control" value="销售回款" title="销售回款" readonly>
                </div>
                <div class="col-lg  form-inline">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctAS">一级</label>
                  <select id="slctAS" type="text" class="form-control" v-model="cashier.id_accounting_sub" title="一级会计科目" @change="acc_subChanged()">
                    <option  value=0>一级科目</option>
                    <option v-for="item in accountingSubjects" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctNature">二级</label>
                  <select id="slctNature" type="text" class="form-control" v-model="cashier.id_detailed_accounting" title="二级会计科目">
                    <option  value=0>二级科目</option>
                    <option v-for="item in DAsAtTheAccSub" :value="item.id">{{item.code_num+item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctCashierAccount">账号</label>
                  <select id="slctCashierAccount" type="text" class="form-control" placeholder="收款账号" v-model="cashier.id_account" title="收款账号">
                    <option  value=0>收款账号</option>
                  	<option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" v-model="cashier.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option  value=0>收款方式</option>
                    <option v-for="item in waysOfPayments" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputCashiedAmount">金额</label>
                  <input id="inputCashiedAmount" type="number" class="form-control" v-model="cashier.amount" placeholder="实际收款金额" title="实际收款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputOther">备注</label>
                  <input id="inputOther" type="text" class="form-control" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button @click="checkCollectedData" class="btn btn-primary">保存</button>
          </div>           
        </div>
      </div>
    </div>
    <div class="modal fade" id="warningbox" role="dialog" aria-labelledby="warningbox" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5>收款金额少于应收金额</h5>
          </div>
          <div class="modal-body">
            <h5 class="warningbox">应收金额:{{totalAmountNeeddToClct}}</h5>
            <h5 class="warningbox">实收金额:{{cashier.amount}}</h5>
            <h5 class="warningbox">实收金额少于应收金额,您确定吗?</h5>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" data-dismiss="modal">取消</button>
            <button class="btn btn-primary" @click="confirmCollection">确定</button> 
          </div>  
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import datepicker from 'vue2-datepicker';
import qs from 'qs';
Date.prototype.format = function(fmt) { 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt; 
}	
  export default {
    data() {
      return {
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:'',
          id_project:0,
          id_saler:0,
        },
        titlesOfList:['项目','执行人','时间','地点','客户','客户手机号','客户单位','产品','售价','垫付','订单额','已收额','发票号','订单备注','操作指引'],
        widthOfTH:['5%','5%','12%','8%','5%','8%','8%','6%','6%','6%','5%','5%','6%','8%','6%'],
        uncollectedOrders:[],
        selectedOrders:[],
        allChecked:false,
        totalAmountNeeddToClct:0,
        currentUserId:this.$store.state.user.id_user,
        cashier:{
          account:'中科平安',
          id_account:0,
          way:'电汇',
          id_way_pay:0,
          amount:0,
          other:'',
          id_accounting_sub:0,
          id_detailed_accounting:0,
        },
        ourAccounts:this.$store.state.ourAccounts,
        waysOfPayments:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        employees:this.$store.state.myEmplys,
        accountingSubjects:this.$store.state.accountingSubjects,
        detailedAccountings:this.$store.state.detailedAccountings,
        DAsAtTheAccSub:[],

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getUncollectedOrders() {
        this.allChecked=false;
        this.uncollectedOrders=[];
        this.selectedOrders=[];
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }      	
        var _this = this;
        this.queryContent.conditions="CheckedAndNotCollected";
        this.$axios({
          method: 'post',
          url: 'getOrders.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.uncollectedOrders=response.data;
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
               duration: 4000
            });
          });
      },
      checkCollectedData() {
        if(!this.cashier.id_accounting_sub) {
          this.$toast({
            text: '请选择一级会计科目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.cashier.id_detailed_accounting) {
          this.$toast({
            text: '请选择二级会计科目!!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.cashier.id_way_pay) {
          this.$toast({
            text: '请选择收款方式!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(!this.cashier.id_account) {
          this.$toast({
            text: '请选择收款账户!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.cashier.amount<this.totalAmountNeeddToClct) {//需要弹出警告盒
          if(this.selectedOrders.length>1) {
            this.$toast({
              text: '多个订单收款时,收款金额不允许少于应收金额!',
              type: 'danger',
              duration: 4000
            });
            return false;
          } else {//弹出警告窗
            $('#warningbox').modal('toggle');//打开
          }
        } else {
          this.saveCollectionData();
        }                
      },
      selectAllClicked() {
        if(this.allChecked) {
          this.selectedOrders=this.uncollectedOrders;
        } else {
          this.selectedOrders=[];
        }
      },
      openMdlCashier () {
        if(this.selectedOrders.length<1) {
          this.$toast({
            text: '请至少勾选一条记录!',
            type: 'info',
            duration: 2000
          });
          return false;
        }
        if(this.cashier.id_detailed_accounting) {
          var o=this.detailedAccountings.find((ele) => ele['id'] == this.cashier.id_detailed_accounting);
          this.cashier.id_accounting_sub=typeof(o)=='undefined'?0:o['id_patent'];
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.cashier.id_accounting_sub);
        } else {
          this.cashier.id_accounting_sub=0;
          this.cashier.id_detailed_accounting=0;
          this.DAsAtTheAccSub=[];
        }
        this.cashier.amount=0;
        this.cashier.id_account=0;
        this.cashier.id_way_pay=0
        $('#mdlCashier').modal('toggle');
      },
      confirmCollection() {
        $('#warningbox').modal('toggle');//关闭
        this.saveCollectionData();
      },
      acc_subChanged() {
        if(this.cashier.id_accounting_sub) {
          this.DAsAtTheAccSub=this.detailedAccountings.filter(item=>item.id_patent==this.cashier.id_accounting_sub);
        } else {
          this.DAsAtTheAccSub=[];
        }
        this.cashier.id_detailed_accounting=0;
        // console.log(this.DAsAtTheAccSub);
      },
      saveCollectionData() {
        var queryContent={
          id_account:this.cashier.id_account,
          id_way_pay:this.cashier.id_way_pay,
          id_detailed_accounting:this.cashier.id_detailed_accounting,
          other:this.cashier.other,
          amount:this.cashier.amount,
          id_cashier:this.currentUserId,
          conditions:'withCollectionData',
          orders:this.selectedOrders,
          business_type:1,
          abstract:'销售"'+this.selectedOrders[0]['p_name']+'"等'+this.selectedOrders.length+'笔业务回款',
        };
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateCashier.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            if(response.data===true) {
              $('#mdlCashier').modal('toggle');//关闭
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.selectedOrders.length;i++) {
                var ui=_this.uncollectedOrders.findIndex((ele) => ele['id'] == _this.selectedOrders[i]['id']);
                if(ui!==-1) {
                  _this.uncollectedOrders.splice(ui,1);
                  i--;
                }
              }
              _this.selectedOrders=[];
            } else {
              console.log(response.data);
              $('#mdlCashier').modal('toggle');//关闭
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlCashier').modal('toggle');//关闭
          }); 
      },
    },
    watch:{
      'selectedOrders': {
        handler() {//handler的括号可以添加形参
          if(this.selectedOrders.length===this.uncollectedOrders.length && this.selectedOrders.length>0) {
            this.allChecked=true;
          } else {
            this.allChecked=false;
          }
          var totalAmount=0;
          if(this.selectedOrders.length>0) {
            this.selectedOrders.forEach( function(item, index, arr) {
              totalAmount+=Number(item.actual_price);
              totalAmount+=Number(item.surcharge);
              totalAmount+=Number(item.park_fee)-Number(item.amount_received);
            });
          } else {
            totalAmount=0;
          }
          this.totalAmountNeeddToClct=totalAmount;            
        },
        // deep: true,
        immediate: true
      }
    },
    computed:{
      getEmployeeName () {
        return function (r) {
          var ar=this.employees.find((ele) => ele['id'] == r.id_operater);
          return typeof(ar)=='undefined'?'':ar['name'];
        }
      }
    },
    beforeCreate:function() {
    }    
  }	
</script>

<style scoped>
.collectiontip {
  font-size: 18px;
}		
h5 {
  color: #007bff;
}
datepicker {
  margin-right: 5px;	
}
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
table {
  overflow: auto;
  font-size: 14px;
}
.modal-body input,.modal-body select {
  width: 80%;
}
.query,.row {
  margin-bottom: 5px;
}
.queryOfCashier button,.queryOfCashier input,.queryOfCashier select {
  margin-right: 5px;
}
.queryOfCashier input {
  margin-left: 5px;
}
.divfortable {
  width: 100%;
  overflow: scroll;
  max-height: 620px;
}
</style>

