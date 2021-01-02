<template>
  <div class="father">
    <h5>当前位置:请款报销/费用报销、借款</h5>
    <div id="queryOfCashier" class="container-fluid">
      <div class="row query form-inline">
        <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="请款人,用途等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="请款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="请款的时间范围"></datepicker>
        <button class="btn btn-primary" @click="getListOfRequestFunds">🔍获取我的请款记录</button>
        <button class="btn btn-secondary" @click="clearList" v-if="listOfRequestFunds.length>0">清除</button> 
        <button id="byhand-fee" @click="newCreateRequestFunds(1)" class="btn btn-primary">新费用/报销单</button>
        <button id="byhand-borrow" @click="newCreateRequestFunds(2)" class="btn btn-primary newitem">新借款单</button>
      </div>
    </div>
    <div class="divfortable" v-if="listOfRequestFunds.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row,index in listOfRequestFunds" @click="clickedARowInShower(row)">
            <td title="款项性质">{{getNature(row)}}</td>
            <td :title="row.id_project">{{getProject(row)}}</td>
            <td :title="row.amount">{{row.amount}}</td>
            <td title="付款方式">{{getWayOfPayment(row)}}</td>
            <td :title="row.account">{{row.account}}</td>
            <td :title="row.use_for">{{row.use_for}}</td>
            <td :title="row.remark">{{row.remark}}</td>
            <td title="申请日期">{{(new Date(row.time_applied)).format('yyyy-MM-dd')}}</td>
            <td title="请款进度">{{getStatus(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlRequestFunds" role="dialog" aria-labelledby="mdlRequestFunds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="idOfRequestFunds===''?false:true">
              <h5>请款单---申请ID:{{idOfRequestFunds}}
              </h5>
            </span>
            <span v-else>
              <h5>请款单---{{natureText}}</h5>
            </span>  
            <button class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">
            <div class="container-fluid">
                <div class="form-inline mgtp10">
                  <label>项目</label>
                  <select type="text" class="form-control" placeholder="所属项目" v-model="requestFunds.id_project" title="所属项目" :disabled="requestFunds.result_approved==1">
                    <option value="0">请选择</option>}
                    option
                    <option v-for="item in projects" :value="item.id">{{item.name}}</option>}
                  </select>
                </div>
                <div class="form-inline mgtp10">
                  <label>用途</label>
                  <input type="text" class="form-control" v-model="requestFunds.use_for" title="款项用途,不超过64个字" placeholder="款项用途,不超过64个字" :disabled="requestFunds.result_approved==1">
                </div>
                <div class="form-inline mgtp10">
                  <label>金额</label>
                  <input type="number" class="form-control" v-model="requestFunds.amount" placeholder="请款金额" title="请款金额" :disabled="requestFunds.result_approved==1">
                </div>
                <div class="form-inline mgtp10">
                  <label>方式</label>
                  <select type="text" class="form-control" v-model="requestFunds.id_way_pay" placeholder="收款方式" title="收款方式" :disabled="requestFunds.result_approved==1">
                    <option v-for="item in wayOfPayment" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
                <div class="form-inline mgtp10">
                  <label>账号</label>
                  <input type="text" class="form-control" placeholder="接收款项的账号" v-model="requestFunds.account" title="账号名和账号" :disabled="requestFunds.result_approved==1">
                </div>
                <div class="form-inline mgtp10">
                  <label>发票</label><!-- ="requestFunds.result_approved==1" -->
                  <input type="text" class="form-control" v-model="requestFunds.nums_of_invoices" placeholder="点击右侧 加号 添加发票号码" readonly>
                  <button class="btn btn-link" title="点击添加发票号码" v-if="requestFunds.result_approved!=1" @click="showAddNumsBox=!showAddNumsBox;">+</button>
                </div>
                <div class="form-inline mgtp10" v-if="showAddNumsBox">
                  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                  <input type="text" class="form-control mgrt5" v-model="anInvoiceNum" title="一个发票号码" placeholder="一次只能输入一个发票号码" style="width:50%;">
                  <button class="btn btn-primary btn-sm mgrt5" @click="addAnInvoiceNumber">确定</button>
                  <button class="btn btn-secondary btn-sm mgrt5" @click="showAddNumsBox=false;">取消</button>
                </div>
                <div class="form-inline mgtp10">
                  <label>备注</label>
                  <input type="text" class="form-control" v-model="requestFunds.remark" title="备注信息,不超过64个字" placeholder="备注信息" :disabled="requestFunds.result_approved==1">
                </div>
              <div v-if="requestFunds.result_approved==0 || requestFunds.result_approved2==0">
                <div class="form-inline mgtp10 redfont">
                  <label>初审意见:</label>
                  <span>{{requestFunds.reason_reject}}</span>
                </div>
                <div class="form-inline mgtp10 redfont">
                  <label>复审意见:</label>
                  <span>{{requestFunds.reason_reject2}}</span>
                </div>
              </div>              
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button @click="saveTheRequestedData" class="btn btn-primary" v-if="requestFunds.result_approved!==1 || requestFunds.result_approved2!==1">提交</button>
          </div>           
        </div>
      </div>
    </div>    
    <div id="loading" class="loadingbox" v-show="showLoading">
      <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
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
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        showAddNumsBox:false,
        anInvoiceNum:'',
        titlesOfList:['款项性质','项目','金额','支付方式','账号名和账号','用途','备注','请款日期','请款进度'],
        widthOfTH:['6%','8%','8%','9%','19%','18%','12%','9%','11%'],
        listOfRequestFunds:[],
        idOfRequestFunds:'',
        currentUserId:this.$store.state.user.id_user,
        requestFunds:{
          id:'',
          account:'',
          way:'电汇',
          id_way_pay:1,
          amount:0,
          remark:'',
          project:'',
          id_project:0,
          use_for:'',
          reason_reject:'',
          reason_reject2:'',
          result_approved:'',
          result_approved2:'',
          nature:1,
          nums_of_invoices:'',
        },
        wayOfPayment:this.$store.state.waysOfPayment,
        projects:this.$store.state.projects,
        natureText:'借备用金'

      }
    },
    components: {
      datepicker
    },    
    methods: {
      getListOfRequestFunds() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd")+" 00:00:00";
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd")+" 23:59:59";
        }       
        var _this = this;
        this.listOfRequestFunds=[];
        this.queryContent.conditions="NotApprovedOrNotPassedApproving";
        this.queryContent.id_applyer=this.currentUserId;
        this.$axios({
          method: 'post',
          url: 'getRequestFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
            console.log(response.data);
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到符合条件的记录!',
                type: 'info',
                duration: 1000
              });              
            } else {
              _this.listOfRequestFunds=response.data;
            }

          }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
            console.log(error);
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
               duration: 4000
            });
          });
      },
      clickedARowInShower(dataRow) {
        this.idOfRequestFunds=dataRow.id;
        this.requestFunds=dataRow;
        this.showAddNumsBox=false;
        $('#mdlRequestFunds').modal('toggle');
      },
      addAnInvoiceNumber() {
        this.anInvoiceNum=this.anInvoiceNum.replace(/(^\s*)|(\s*$)/g, "");
        let reg=/^\d{8,}$/;//验证至少8位数字
        if (!reg.test(this.anInvoiceNum)) {
          this.$toast({text: '只能由纯数字组成,且不少于8位!',type:'info',duration:2000});
          return;
        }
        this.requestFunds.nums_of_invoices=(this.requestFunds.nums_of_invoices.length<1?"":(this.requestFunds.nums_of_invoices+","))+this.anInvoiceNum;
        this.anInvoiceNum="";
        this.showAddNumsBox=false;
      },
      saveTheRequestedData() {
        if(this.requestFunds.id_project==0) {
          this.$toast({text:'请选择项目!',type:'info',duration:2000});
          return false;          
        }        
        if(this.requestFunds.id_way_pay=='') {
          this.$toast({text:'请选择付款方式!',type:'info',duration:2000});
          return false;          
        }
        var queryContent=this.requestFunds;
        queryContent.id_applyer=this.currentUserId;
        queryContent.conditions='';
        if(this.idOfRequestFunds!=='') {
          var _this = this;
          if(this.requestFunds.amount<0) {
            this.$toast({
              text: '请款金额不对!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          queryContent.conditions='ModifyRequestFunds';
        } else {
          this.listOfRequestFunds=[];
          if(this.requestFunds.use_for.length<2) {
            this.$toast({
              text: '请输入用途!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          if(this.requestFunds.amount<=0) {
            this.$toast({
              text: '请款金额不对!',
              type: 'info',
              duration: 2000
            });
            return false;
          }
          queryContent.conditions='NewCreateRequestFunds';
        }
console.log(queryContent);
// return;
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
            if(response.data===true) {
              $('#mdlRequestFunds').modal('toggle'); 
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });
            //更新数据
              for(var i=0;i<_this.listOfRequestFunds.length;i++) {
                if(_this.listOfRequestFunds[i]['id']==_this.idOfRequestFunds) {
                  _this.listOfRequestFunds.splice(i,1);
                  i--;  
                }
              }
            } else {
              _this.$toast({
                text: '操作失败,请稍后再试!',
                type: 'danger',
                duration: 4000
              });
              $('#mdlRequestFunds').modal('toggle');             
            }
          }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
            console.log(error);
            _this.$toast({
              text: '异步通信错误!'+error,
              type: 'danger',
              duration: 4000
            });
            $('#mdlRequestFunds').modal('toggle');
          });        
      },
      clearList () {
        this.listOfRequestFunds=[];
      },
      newCreateRequestFunds(nature) {
        this.requestFunds.nature=nature;
        switch (nature) {
          case 1:
            this.natureText='费用/报销 申请单';
            break;
          case 2:
            this.natureText='借款 申请单';
            break;
        }
        this.clearList();
        this.idOfRequestFunds='';
        this.requestFunds.account='';
        this.requestFunds.way='';
        this.requestFunds.id_way_pay=1;
        this.requestFunds.amount=0;
        this.requestFunds.remark='';
        this.requestFunds.id_project=0;
        this.requestFunds.project='';
        this.requestFunds.use_for='';
        this.requestFunds.reason_reject='';
        this.requestFunds.result_approved='newCreate';
        this.requestFunds.reason_reject2='';
        this.requestFunds.result_approved2='newCreate';
        this.requestFunds.nums_of_invoices="";
        $('#mdlRequestFunds').modal('toggle');
      }
    },
    watch:{
      // 'requestFunds.project':{
      //   handler() {
      //     for(var i=0;i<this.projects.length;i++) {
      //       if(this.requestFunds.project==this.projects[i].prjct) {
      //         this.requestFunds.id_project=this.projects[i].id;
      //       }
      //     }
      //   }
      // }
    },
    filters:{

    },
    computed: {
      // is_paid
      getStatus() {
        return function(dataRow){
          if (!dataRow.result_approved && typeof(dataRow.result_approved)!="undefined" && dataRow.result_approved!=0){
            return '已请款,未审核';
          } else if(dataRow.result_approved==0) {
            return '请款未通过初审';
          } else if(!dataRow.result_approved2 && typeof(dataRow.result_approved2)!="undefined" && dataRow.result_approved2!=0) {
            return '已初审,待复审';
          } else if(dataRow.result_approved2==0) {
            return '请款未通过复审';
          } else {
            if(dataRow.is_paid==0) {
              return '已复审,待付款';
            } else {
              return '已支付完毕';
            }
          }
        } 
      },
      getNature () {
        return function(r) {
          switch(r.nature) {
               case 1:
                  return '报销费用';
                  break;
               case 2:
                  return '借款备用';
                  break;
               case 3:
                  return '采购请款';
                  break;
               case 4:
                  return '机票退款';
                  break;
          } 
        }
      },
      getProject () {
        return function(r) {
          var o=this.projects.find((ele) => ele['id'] == r.id_project);
          return typeof(o)=='undefined'?'':o['name'];
        }
      },
      getWayOfPayment () {
        return function(r) {
          var o=this.wayOfPayment.find((ele) => ele['id'] == r.id_way_pay);
          return typeof(o)=='undefined'?'':o['name'];          
        }
      }      
    },
    beforeCreate:function() {
    }    
  } 
</script>

<style scoped>
.modal-body input,.modal-body select {
  width: 80%;
}
.row,.mgtp10 {
  margin-top: 10px;
}
.query input,.query button,.mgrt5 {
  margin-right: 5px;
}
.query button {
  margin-left: 5px;
}
#byhand-borrow {
  position: absolute;
  right: 0;
}
#byhand-fee {
  position: absolute;
  right: 100px;  
}
.redfont {
  color: red;
  font-size: 1.2rem;
}
</style>

