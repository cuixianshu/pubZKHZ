<template>
  <div class="father">
    <ul class="nav nav-pills" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="pill" href="#turn-in">款项上缴</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="pill" href="#returnMoneyBack">归还借款</a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="turn-in" class="container-fluid tab-pane active">
        <div class="row">
            <div class="col-lg form-inline searchcontent">
              <label for="queryConditions">关键词:</label> 
              <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="发票号、用车人、客户部门、客户单位等搜索关键词">
              <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="缴款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="缴款的时间范围"></datepicker> 
              <button class="btn btn-primary" @click="getTIFs">🔍获取数据</button>
              <button class="btn btn-secondary" @click="listOfTurnInFunds=[];" v-if="listOfTurnInFunds.length>0">清除</button>            
              <button id="byhand" @click="newTurnInFunds" class="btn btn-primary" type="button">新建缴款</button>
            </div>          
        </div>
        <div class="showerOfTurnedInFunds" v-if="listOfTurnInFunds.length>0">
            <table class="table table-hover">
               <thead>
                <th v-for="title,index in titlesForTIF" :width="widthOfTH[index]">{{title}}</th>
              </thead>
              <tbody>
                <tr v-for="(row,index) in listOfTurnInFunds" @click="clickedARowInShower(row)">
                  <td title="缴款ID">{{row.id}}</td>
                  <td title="缴款人">{{getPayerName(row)}}</td>
                  <td title="缴款项目">{{getProject(row)}}</td>
                  <td title="款项性质">{{getNature(row)}}</td>
                  <td title="缴款事由">{{row.cause}}</td>
                  <td title="缴款金额">{{row.amount}}</td>
                  <td title="缴款方式">{{getWP(row)}}</td>
                  <td title="缴款时间">{{row.time_paid}}</td>
                  <td title="缴款备注">{{row.remark}}</td>
                  <td title="财务收款ID">{{row.id_tbl_cashier}}</td>
                </tr>
              </tbody>
            </table>
        </div>          
      </div>
      <div id="returnMoneyBack" class="container-fluid tab-pane">
        <div class="row">
          <div class="col-lg form-inline searchcontent">
            <label for="QC">关键词:</label> 
            <input id="QC" type="text" name="keyWord" class="form-control" v-model="NRLQC.keyWord" placeholder="请输入搜索关键词" title="请款时的用途、备注信息、请款金额、收款账号等搜索关键词">
            <datepicker class="datepicker"id="dateRange" v-model="NRLQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间,默认最近7天" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker>
            <select class="form-control" v-model="NRLQC.id_project" title="选择所属项目">
              <option value="0">所有项目</option>
              <option v-for="item in projects" :value="item.id">{{item.name}}</option>
            </select>
            <button class="btn btn-primary" @click="getNotReturnedList">🔍获取数据</button>
            <button class="btn btn-secondary" @click="notReturnedList=[];" v-if="notReturnedList.length>0">清除</button>            
          </div>          
        </div>
        <div class="showerOfReturningFunds" v-if="notReturnedList.length>0">
          <table class="table table-hover">
              <thead>
                <th v-for="title,index in titlesOfNtRtnList" :width="widthOfNtRtnTH[index]">{{title}}</th>
              </thead>
              <tbody>
<!-- ['请款人','项目','款项用途','请款金额','请款账号','实收金额','收款时间','已还金额','请款备注']                 -->
                <tr v-for="(row,index) in notReturnedList" @click="clkARToRtn(row)">
                  <td title="请款时间">{{row.time_applied}}</td>
                  <td title="请款人">{{getEmplyName(row)}}</td>
                  <td title="所属项目">{{getProject(row)}}</td>
                  <td :title="row.use_for">{{row.use_for}}</td>
                  <td title="请款金额">{{row.amount}}</td>
                  <td :title="row.account">{{row.account}}</td>
                  <td title="实收金额">{{row.p_amount}}</td>
                  <td title="收款时间">{{row.p_time_paid}}</td>
                  <td title="已还金额">{{row.amount_returned}}</td>
                  <td :title="row.remark">{{row.remark}}</td>
                </tr>
              </tbody>
          </table>
        </div> 
      </div>
    </div>
    <div class="modal fade" id="mdlTurnInFunds" role="dialog" aria-labelledby="mdlTurnInFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="turnInFundsNotice.id===''?false:true">
              <h5>缴款还款---缴款ID:{{turnInFundsNotice.id}},缴款金额:￥{{turnInFundsNotice.amount}}
              </h5>
            </span>
            <span v-else>
              <h5>缴款还款---新建缴款</h5>
            </span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div id="detailsForCashier" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctProject">项目</label>
                  <select id="slctProject" type="text" class="form-control" placeholder="所属项目" v-model="turnInFundsNotice.id_project" title="所属项目" :disabled="isCashed">
                    <option v-for="item in projects" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputCause">事由</label>
                  <input id="inputCause" type="text" class="form-control" v-model="turnInFundsNotice.cause" placeholder="缴款事由" title="缴款事由" :readonly="isCashed">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputAmount">金额</label>
                  <input id="inputAmount" type="number" class="form-control" v-model="turnInFundsNotice.amount" placeholder="实际缴款金额" title="实际缴款金额" :readonly="isCashed">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctWayOfCashier">方式</label>
                  <select id="slctWayOfCashier" type="text" class="form-control" name="wayOfCashier" v-model="turnInFundsNotice.id_way_pay" placeholder="收款方式" title="收款方式" :disabled="isCashed">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputRemark">备注</label>
                  <input id="inputRemark" type="text" class="form-control" v-model="turnInFundsNotice.remark" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" :readonly="isCashed">
                </div>
                <div class="col-lg  form-inline">
                  <label for="CID" v-if="isCashed">收ID</label>
                  <input id="CID" type="text" class="form-control" v-model="turnInFundsNotice.id_tbl_cashier" title="收款ID" placeholder="收款ID" :readonly="isCashed" v-if="isCashed">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer"> <!--  --> 
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" @click="saveTheTurnedInFundsData" class="btn btn-primary" v-if="turnInFundsNotice.id_tbl_cashier?false:true">保存</button>
          </div>           
        </div>
      </div>
    </div>    
    <div class="modal fade" id="mdlToRTN" role="dialog" aria-labelledby="mdlToRTN" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>
              <h5>归还借款</h5>
            </span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="debter">还款人员</label>
                  <select id="debter" type="text" class="form-control" v-model="id_debter" title="还款人的姓名" disabled>
                    <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="ndRTNamt">借款余额</label>
                  <input id="ndRTNamt" type="text" class="form-control" title="您的借款余额" v-model="needRTNAmt" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="actRTNAmt">本次还款</label>
                  <input id="actRTNAmt" type="number" class="form-control" v-model="actRTNAmount" placeholder="本次还款金额" title="本次还款金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="RTNWay">还款方式</label>
                  <select id="RTNWay" type="text" class="form-control" name="wayOfCashier" v-model="iWP" placeholder="还款方式" title="还款方式">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="RTNRmk">还款备注</label>
                  <input id="RTNRmk" type="text" class="form-control" v-model="RTNrmk" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
                <div class="col-lg  form-inline">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveTheRTNData">保存</button>
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
        ourAccounts:this.$store.state.ourAccounts,
        wayOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        employees:this.$store.state.employees,
        natures:[{id:1,name:'收银上缴'},{id:2,name:'归还借款'}],
        isCashed:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        titlesForTIF:['缴款ID','缴款人','缴款项目','款项性质','缴款事由','缴款金额','缴款方式','缴款时间','缴款备注','财务收款ID'],
        widthOfTH:['8%','10%','10%','10%','10%','8%','10%','12%','12%','10%'],
        listOfTurnInFunds:[],
        currentUserId:this.$store.state.user.id_user,
        turnInFundsNotice:{
          id:'',
          cause:'',
          id_project:3,
          id_way_pay:1,
          amount:0,
          remark:'',
          way:'电汇',
          id_project:'',
          id_tbl_cashier:'',
          // id_tbl_cashier
        },

        notReturnedList:[],
        titlesOfNtRtnList:['请款时间','请款人','项目','款项用途','请款金额','请款账号','实收金额','收款时间','已还金额','请款备注'],
        widthOfNtRtnTH:['12%','9%','10%','10%','8%','10%','9%','12%','10%','10%'],
        NRLQC:{
          keyWord:'',
          dateRange:[],
          id_project:0,
        },
        toRTN:{//用于还款
        },
        id_debter:this.$store.state.user.id_user,
        needRTNAmt:0,
        actRTNAmount:0,
        iWP:'',
        RTNrmk:'',
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getTIFs() {
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }       
        var _this = this;
        this.listOfTurnInFunds=[];
        // this.titlesForTIF=[];
        this.queryContent.conditions="All";
        this.queryContent.id_op=this.currentUserId;
        this.$axios({
          method: 'post',
          url: 'getTurnInFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfTurnInFunds=response.data;
              // for(var title in response.data[0]) {
              //   _this.titlesForTIF.push(title);
              // }             
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
        this.turnInFundsNotice=dataRow;
        this.isCashed=!this.turnInFundsNotice.id_tbl_cashier?false:true;
        $('#mdlTurnInFunds').modal('toggle');
      },
      saveTheTurnedInFundsData() {
        if(this.turnInFundsNotice.project=='') {
          this.$toast({
            text: '请选择项目!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        if(this.turnInFundsNotice.cause.length<4) {
          this.$toast({
            text: '事由不少于4个字!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }

        var queryContent=this.turnInFundsNotice;
        queryContent.currentUserId=this.currentUserId;

        if(this.turnInFundsNotice.id!=='') {
          var _this = this;
          if(this.turnInFundsNotice.amount<=0) {
            this.$toast({
              text: '请检查金额!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          queryContent.conditions='Update';
        } else {
          this.listOfTurnInFunds=[];
          // this.titlesForTIF=[];
          if(this.turnInFundsNotice.amount<=0) {
            this.$toast({
              text: '请检查金额!',
              type: 'info',
              duration: 2000
            });
            return false;
          }

          queryContent.conditions='InsertNew';
        }
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateTurnInFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            if(response.data===true) {
              $('#mdlTurnInFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfTurnInFunds.length;i++) {
                if(_this.listOfTurnInFunds[i]['id']==_this.turnInFundsNotice.id) {
                  _this.listOfTurnInFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlTurnInFunds').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlTurnInFunds').modal('toggle');
          });        
      },
      newTurnInFunds() {
        this.isCashed=false;
        this.listOfTurnInFunds=[];
        this.turnInFundsNotice.id='';
        this.turnInFundsNotice.id_tbl_cashier='';
        $('#mdlTurnInFunds').modal('toggle');
        this.turnInFundsNotice.id_project=1;
        this.turnInFundsNotice.id_way_pay=1;
        this.turnInFundsNotice.amount=0;
        this.turnInFundsNotice.remark='';
        this.turnInFundsNotice.cause='';        
      },
      getNotReturnedList () {
        this.notReturnedList=[];
        if(this.NRLQC.dateRange.length<2 || this.NRLQC.dateRange[0].length<10 || this.NRLQC.dateRange[1].length<10) {
        var lastMonth=this.getPreMonth();
        this.NRLQC.dateRange[0]=lastMonth.firstDay;
        this.NRLQC.dateRange[1]=lastMonth.endDay;
        }
        this.NRLQC.dateRange[0]+=(this.NRLQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.NRLQC.dateRange[1]+=(this.NRLQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        var _this=this;
        this.NRLQC.conditions='HaveNotReturned';
        this.NRLQC.id_op=this.currentUserId;
        this.$axios({
            method: 'post',
            url: 'getRequestFunds.php',
            data: qs.stringify(_this.NRLQC)
          }).then(function (response) {
          // console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
          }
          _this.notReturnedList=response.data;
          }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
          }); 
      },
      getPreMonth() {
        var n = new Date();
        var year = n.getFullYear();
        var month = n.getMonth();
        if(month==0){
          month=12;
          year=year-1;
        }
        n = new Date(year,month, 0);
        var dayCount = n.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        var firstDay = year + "-" + month + "-" + "01";//上个月的第一天
        var endDay = year + "-" + month + "-" + dayCount;//这个月的第一天
        return {'firstDay':firstDay,'endDay':endDay};
      },
      clkARToRtn (r) {
        this.toRTN=r;
        this.needRTNAmt=Number(this.toRTN.p_amount)-Number(this.toRTN.amount_returned);
        $('#mdlToRTN').modal('toggle');
      },
      saveTheRTNData () {
        this.toRTN.id_debter=this.id_debter;
        this.toRTN.actRTNAmount=this.actRTNAmount;
        this.toRTN.iWP=this.iWP;
        this.toRTN.RTNrmk=this.RTNrmk;

        if(Number(this.toRTN.actRTNAmount)<0) {
          this.$toast({
            text: '请检查本次还款!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }        
        if(this.toRTN.iWP.length<1) {
          this.$toast({
            text: '请检查还款方式!',
            type: 'info',
            duration: 2000
          });
          return false;          
        }
        this.toRTN.conditions='WithReturnMoney';
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateTurnInFunds.php',
          data: qs.stringify(_this.toRTN)
          }).then(function (response) {
// console.log(response.data);
// return;
            if(response.data===true) {
              $('#mdlToRTN').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.notReturnedList.length;i++) {
                if(_this.notReturnedList[i]['id']==_this.toRTN.id) {
                  _this.notReturnedList.splice(i,1);
                  i--;  
                }
              }
              _this.toRTN={};
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlToRTN').modal('toggle');             
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlToRTN').modal('toggle');
          });         
// console.log(this.toRTN);        
// console.log('Data Saved!');
      },
    },
    watch:{
      // 'turnInFundsNotice.project':{
      //   handler() {
      //     for(var i=0;i<this.projects.length;i++) {
      //       if(this.turnInFundsNotice.project==this.projects[i].prjct) {
      //         this.turnInFundsNotice.id_project=this.projects[i].id;
      //       }
      //     }
      //   }
      // }
    },
    computed: {
      getEmplyName() {
        return function (r) {
          var ar=this.employees.find((ele) => ele['id'] == r.id_applyer);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },
      getPayerName() {
        return function (r) {
          var ar=this.employees.find((ele) => ele['id'] == r.id_payer);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },

      getProject() {
        return function (r) {
          var ar=this.projects.find((ele) => ele['id'] == r.id_project);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },    
      getNature() {
        return function (r) {
          var ar=this.natures.find((ele) => ele['id'] == r.nature);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },    
      getWP() {
        return function (r) {
          var ar=this.wayOfPayment.find((ele) => ele['id'] == r.id);
           return typeof(ar)=='undefined'?'':ar['name'];
        }
      },    
    },
    beforeCreate:function() {
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

