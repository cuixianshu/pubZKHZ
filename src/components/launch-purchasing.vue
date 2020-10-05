<template>
<div class="father">
  <h5>当前位置:采购业务/采购执行</h5>
  <div class="container-fluid">
    <div class="row form-inline query">
      <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="项目名称\物品名称\规格型号\厂家品牌等">
      <button @click="getPACAUAs" class="btn btn-primary" type="button">搜索数据</button>
      <button @click="clearPACAUAs"class="btn btn-secondary" type="button" v-if="listOfPACAUAs.length>0">清空</button>
    </div>    
    <div class="divfortable" v-if="listOfPACAUAs.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfApplyings">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfPACAUAs" @click="clickedARecorderToFinish(row)">
            <td title='项目'>{{getProject(row)}}</td>
            <td title='采购物品名'>{{row.name}}</td>
            <td title='物品计量单位'>{{row.unit}}</td>
            <td title='数量'>{{row.quantity}}</td>
            <td title='品牌'>{{row.brand}}</td>
            <td title='型号规格'>{{row.model}}</td>
            <td title='详细描述'>{{row.detail}}</td>
            <td :title='row.date_needed'>{{row.date_needed}}</td>
            <td title='采购申请人'>{{getApplyer(row)}}</td>
            <td :title='row.date_applied'>{{row.date_applied}}</td>
            <td :title='row.remark'>{{row.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="modal fade" id="infoShower" role="dialog" aria-labelledby="infoShower" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>完成采购,提请验收--申请ID:{{queryContent.id_apldPcsg}}</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row divfortable">
              <table class="table table-hover">
                <thead>
                  <th v-for="(title,index) in titleOfEnquiryInInfoShower">{{title}}</th>
                </thead>
                <tbody>
                  <tr>
                    <td>{{detailsInInfoShower.expectDate}}</td>
                    <td>{{detailsInInfoShower.seller}}</td>
                    <td>{{detailsInInfoShower.priceIncludeTax}}</td>
                    <td>{{detailsInInfoShower.actualAmount}}</td>
                    <td>{{detailsInInfoShower.wayPayment}}</td>
                    <td>{{detailsInInfoShower.promisDate}}</td>
                    <td>{{detailsInInfoShower.remarkOfEnquirying}}</td>
                  </tr>
                </tbody>
              </table>              
            </div>
            <br>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="commitForAcceptaceChecking">提请验收</button> 
        </div>  
      </div>
    </div>
  </div>  
</div>  
</template>

<script>
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
  export default ({
    data() {
      return {
        queryContent: {
          keyWord:'',
          conditions:'',
          id_apldPcsg:''
        },
        listOfPACAUAs:[],
        titleOfApplyings:['所属项目','物品名','计量单位','数量','品牌','型号','详细描述','期望日期','申请人','请购日期','备注'],

        selectedEnquiries:[],
        detailsInInfoShower:{
          seller:'',
          priceIncludeTax:'',
          actualAmount:'',
          wayPayment:'',
          promisDate:'',
          remarkOfEnquirying:'',
          expectDate:'',
          applyerName:''
        },
        titleOfEnquiryInInfoShower:['期望日期','供应商','含税价','总金额','付款方式','承诺到货日','备注'],
        employees:this.$store.state.employees,
        projects:this.$store.state.projects,
      }
    },
    methods:{
      getPACAUAs() {
        this.listOfPACAUAs=[];
        // this.titleOfApplyings=[];
        this.queryContent.conditions='PassedApprovingCompareAndUnfinished';

        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data.length>0) {
            _this.listOfPACAUAs = response.data;
            // var ttl='';
            // for(ttl in response.data[0]) {
            //   _this.titleOfApplyings.push(ttl);
            // }              
          } else {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 1000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });
        this.queryContent={};
      },
      clearPACAUAs() {
        this.listOfPACAUAs=[];
        // this.titleOfApplyings=[];
      },
      clickedARecorderToFinish(dataRow) {
        this.selectedEnquiries=[];
        this.queryContent.id_apldPcsg=dataRow.id;
        var expectDate=dataRow.date_needed;
        var idApplyer=dataRow.id_applier;
        this.queryContent.conditions='ApprovingComparePassed';

        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getEnquiries.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
        console.log(response.data);
          if(response.data.length>0) {
            _this.selectedEnquiries = response.data[0];
        //需要获取detailsInInfoShower的内容          
            _this.detailsInInfoShower.seller=_this.selectedEnquiries.seller;
            _this.detailsInInfoShower.priceIncludeTax=_this.selectedEnquiries.price_include_tax;
            _this.detailsInInfoShower.actualAmount=_this.selectedEnquiries.actual_amount;
            _this.detailsInInfoShower.wayPayment=_this.selectedEnquiries.way_payment;
            _this.detailsInInfoShower.promisDate=(new Date(_this.selectedEnquiries.promise_delivery_date)).format("yyyy-MM-dd");
            _this.detailsInInfoShower.remarkOfEnquirying=_this.selectedEnquiries.remark;
            _this.detailsInInfoShower.expectDate=expectDate;
            for(var i=0;i<_this.employees.length;i++) {
               if(idApplyer==_this.employees[i].id) {
                 _this.detailsInInfoShower.applyerName=_this.employees[i].name;
                 break;
               }
            }
            $('#infoShower').modal('toggle');
          } else {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 1000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });        
        // 点击后弹出modal,显示已经过审核的询价单,底部有完成按钮,点击此按钮后更新applings的is_finished
        // 此modal中包含请购单信息和比价结果
      },
      commitForAcceptaceChecking () {
        this.queryContent.conditions='Finished';

        var _this=this;
        var url='updateApplyPurchasing.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            $('#infoShower').modal('toggle');
            var index=_this.listOfPACAUAs.findIndex((item)=>item.id==_this.queryContent.id_apldPcsg);
            _this.listOfPACAUAs.splice(index,1);
            _this.$toast({
               text: '成功保存数据!',
               type: 'success',
               duration: 800
            });
          } else {
            console.log(response.data);
            _this.$toast({
               text: '通信错误!',
               type: 'danger',
               duration: 4000
            });
            $('#infoShower').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
          $('#infoShower').modal('toggle');
        });        
      }
    },
    computed: {
      getApplyer () {
        return function (r) {
          var em=this.employees.find((ele) => ele['id'] == r.id_applier);
          return typeof(em)=='undefined'?'':em['name'];
        }
      },
      getProject () {
        return function (r) {
          var em=this.projects.find((ele) => ele['id'] == r.id_project);
          return typeof(em)=='undefined'?'':em['name'];
        }
      },
    },
    beforeCreate() {
    }
  })
</script>

<style scoped>
.row {
  margin-top: 10px;
}
.query input,.query button {
  margin-right: 5px;
} 
</style>
