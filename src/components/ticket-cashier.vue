<template>
  <div class="father">
    <h5>当前位置:财务业务/机票收款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row">
        <div class="col-lg form-inline searchcontent">
          <label for="queryConditions">关键词:</label> 
          <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="票号、乘机人、客户单位等搜索关键词">
          <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="出票的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="出票的时间范围"></datepicker> 
          <button class="btn btn-primary" @click="getTickets">🔍获取数据</button>
          <button class="btn btn-secondary" @click="clearList" v-if="listOfTickets.length>0">清除</button>            
<!--           <button id="byhand" @click="collectByHand" class="btn btn-primary" type="button">手工填表</button> -->
        </div>          
      </div>

    </div>
    <div v-if="listOfTickets.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
          <!-- <th><input class="checkbox" type="checkbox" @click=""></th> -->
        </thead>
        <tbody>
          <tr v-for="(row,index) in listOfTickets" @click="clickedARowInShower(row)">
            <td :title="row.number_ticket">{{row.number_ticket}}</td>
            <td :title="row.name_psgr">{{row.name_psgr}}</td>
            <td :title="row.dptmt_client">{{row.dptmt_client}}</td>
            <td :title="row.date_departure">{{row.date_departure}}</td>
            <td :title="row.number_flight">{{row.number_flight}}</td>
            <td :title="row.trip">{{row.trip}}</td>
            <td :title="row.price">{{row.price}}</td>
            <td :title="row.tax">{{row.tax}}</td>
            <td :title="row.insurance">{{row.insurance}}</td>
            <td :title="row.amount_include_insurance">{{row.amount_include_insurance}}</td>
            <td :title="row.amount_clctd">{{row.amount_clctd}}</td>
            <td :title="row.fee_refound">{{row.fee_refound}}</td>
            <td :title="row.amount_clctd_refound">{{row.amount_clctd_refound}}</td>
            <td :title="row.fee_change_trip">{{row.fee_change_trip}}</td>
            <td :title="row.amount_clctd_changing_fee">{{row.amount_clctd_changing_fee}}</td>
            <!-- <td><input class="checkbox" type="checkbox"  name="selecter" @click=""></td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlCashier" role="dialog" aria-labelledby="mdlCashier" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>机票收款---票号:{{stateOfTheTicket.number_ticket}},乘机人:{{stateOfTheTicket.name_psgr}},应收总额:￥{{totalAmountReceivable}}
              </h5>
            </span>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCashier" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctCashierProject">项目名称</label>
                  <select id="slctCashierProject" type="text" name="cashierProject" class="form-control" placeholder="所属项目" v-model="cashier.id_project" title="所属项目">
                    <option v-for="item in projects" :value="item.id">{{item.prjct}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctCashierAccount">收款账号</label>
                  <select id="slctCashierAccount" type="text" name="cashierAccount" class="form-control" placeholder="收款账号" v-model="cashier.id_account" title="收款账号">
                    <option v-for="item in ourAccounts" :value="item.id">{{item.short_name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">收款方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="cashier.id_way_pay" placeholder="收款方式" title="收款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputAmountIncludeInsurance">收含险额</label>
                  <input id="inputAmountIncludeInsurance" type="number" class="form-control" name="amountIncludeInsurance" v-model="cashier.amountIncludeInsurance" placeholder="收取的票价、税、保险之和" title="收取的票价、税、保险之和">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputRefoundFee">收退票费</label>
                  <input id="inputRefoundFee" type="number" class="form-control" name="refoundFee" v-model="cashier.refoundFee" placeholder="收取的退票手续费金额" title="收取的退票手续费金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputChangeFee">收改签费</label>
                  <input id="inputChangeFee" type="number" class="form-control" name="changeFee" v-model="cashier.changeFee" placeholder="改签费用" title="收取的改签费用金额">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputOther">备注信息</label>
                  <input id="inputOther" type="text" class="form-control" name="otherInCashier" v-model="cashier.other" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
                <div class="col-lg  form-inline">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" id="btnSaveTheCollectedData" @click="saveTheCollectedData" class="btn btn-primary">确定</button>
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
          conditions:''
        },
        titlesOfList:['票号','乘机人','所属单位','起飞日期','航班号','航程','票价','税','保险','含险总价','已收总价','总退票费','已收退费','总改签费','已收改费'],
        widthOfTH:['11%','8%','9%','7%','6%','8%','5%','5%','5%','6%','6%','6%','6%','6','6'],
        stateOfTheTicket:{},
        listOfTickets:[],
        currentUserId:1,
        cashier:{
          id_account:1,
          id_way_pay:2,
          other:'',
          id_project:3,
          amountIncludeInsurance:0,
          refoundFee:0,
          changeFee:0,
          number_ticket:''
        },
        ourAccounts:[],
        wayOfPayment:[],
        projects:[]

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getTickets() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }       
        var _this = this;
        this.listOfTickets=[];
        // this.titlesOfList=[];
        this.queryContent.conditions="GetToCollect";
        this.$axios({
          method: 'post',
          url: 'getTickets.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfTickets=response.data;
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
      clickedARowInShower(dataRow) {
        // this.idOfFilledInvoice=dataRow.id;
        this.stateOfTheTicket=dataRow;
        this.cashier.number_ticket=dataRow.number_ticket;
        if(!this.stateOfTheTicket.date_refound && typeof(this.stateOfTheTicket.date_refound)!='undefined' && this.stateOfTheTicket.date_refound!=0) {
          this.cashier.amountIncludeInsurance=parseInt(dataRow.price)+parseInt(dataRow.tax)+parseInt(dataRow.insurance)-dataRow.amount_clctd;          
        } else {
          this.cashier.amountIncludeInsurance=dataRow.insurance;//+dataRow.amount_include_insurance-dataRow.amount_clctd;
        }
        this.cashier.refoundFee=dataRow.fee_refound-dataRow.amount_clctd_refound;
        this.cashier.changeFee=dataRow.fee_change_trip-dataRow.amount_clctd_changing_fee;

        this.cashier.other='';
// console.log(this.stateOfTheTicket);
// return;
        $('#mdlCashier').modal('toggle');
      },
      saveTheCollectedData() {
        if(this.cashier.project=='') {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }        
        var queryContent=this.cashier;
        queryContent.id_cashier=this.currentUserId;
        queryContent.conditions='SaveTktCollection';

// 需同时更新cashier表和airticket.tbl_tickets
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateCashier.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
// console.log(response.data);
            if(response.data===true) {
              $('#mdlCashier').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfTickets.length;i++) {
                if(_this.listOfTickets[i]['number_ticket']==_this.cashier.number_ticket) {
                  _this.listOfTickets.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlCashier').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlCashier').modal('toggle');
          });        
      },
      clearList () {
        this.listOfTickets=[];
        // this.titlesOfList=[];
      }
    },
    watch:{
    },
    computed:{
      totalAmountReceivable () {
        // //应收改签费
        // var cf=this.stateOfTheTicket.fee_change_trip-this.stateOfTheTicket.amount_clctd_changing_fee;
        // //应收票款和退票费
        // var pti=0;//price+tax+insurance,应收票款
        // var rf=0;//应收退票费
        // if(!this.stateOfTheTicket.date_refound && typeof(this.stateOfTheTicket.date_refound)!='undefined' && this.stateOfTheTicket.date_refound!=0) {//未退票
        //   rf=0;
        //   if(this.stateOfTheTicket.amount_clctd<this.stateOfTheTicket.amount_include_insurance) {//未足额收款,收取保险款
        //     pti=this.stateOfTheTicket.amount_include_insurance-this.stateOfTheTicket.amount_clctd;
        //   } else {//已足额收款
        //     pti=0;
        //   }
        // } else {//已退票
        //   rf=this.stateOfTheTicket.fee_refound-this.stateOfTheTicket.amount_clctd_refound;
        //   pti=this.stateOfTheTicket.insurance+this.stateOfTheTicket.amount_include_insurance-this.stateOfTheTicket.amount_clctd;
        // }
        
        // //应收总额
        // var tAR=parseInt(cf)+parseInt(pti)+parseInt(rf);
        
        return this.cashier.amountIncludeInsurance+this.cashier.refoundFee+this.cashier.changeFee;
      }
    },
    beforeCreate:function() {
      var _this=this;
      this.ourAccounts=[];
      this.$axios({
        method: 'post',
        url: 'getListOfOurAccount.php',
      }).then(function (response) {
        _this.ourAccounts=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });
      this.wayOfPayment=[];
      this.$axios({
        method: 'post',
        url: 'getListOfPayWay.php',
      }).then(function (response) {
        _this.wayOfPayment=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      });

      this.projects=[];
      this.$axios({
        method: 'post',
        url: 'getProject.php'
      }).then(function (response) {
        _this.projects=response.data;
      }).catch(function (error) {
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger!',
          duration: 4000
        });
      });            
    }    
  } 
</script>

<style scoped>
.father {
  width: 100%;
}
#searchConditions >*{
  margin:5px;
}   
h5 {
  color: #007bff;
}
datepicker {
  margin-left: 10px;  
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
.row {
  margin-top: 10px;
}
.searchcontent input {
  margin-right: 5px;
}
.searchcontent button {
  margin-left: 5px;
}
#byhand {
  /*margin-left: 100px;*/
  position: absolute;
  /*bottom: 0;*/
  right: 0;
} 
</style>

