<template>
<div class="father">
  <h5>当前位置:采购业务/审核比价</h5>
  <div class="container-fluid">
    <div class="row form-inline query">
      <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="项目名称\物品名称\规格型号\厂家品牌等">
      <button @click="getapldPcsgWithCmtdEqrys" class="btn btn-primary">搜索数据</button>
      <button @click="clearApldPcsgWithCmtdEqrys"class="btn btn-secondary" v-if="apldPcsgWithCmtdEqrys.length>0">清空</button>
    </div>
    <div class="divfortable" v-if="apldPcsgWithCmtdEqrys.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfAppliedList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in apldPcsgWithCmtdEqrys" @click="clickedARecorderToApprove(row)">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="mdfRecorder" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>审核比价--请购ID:{{dtlsInApldPcsg.id}}</h5>
          <h6>物品:{{dtlsInApldPcsg.name}}({{dtlsInApldPcsg.unit}})</h6>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row divfortable">
              <table class="table table-hover">
                <thead>
                  <th v-for="title,index in titleOfEnquiriedList">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in cmtdEqryWithoutAprvgs" :style="row.is_made_deal?'color:red;font-weight:bold;':''" :title="row.is_made_deal?'已选中此行':'未选中'">
                    <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
                    <td>{{row.seller}}</td>
                    <td>{{row.price_include_tax}}</td>
                    <td>{{row.actual_amount}}</td>
                    <td>{{row.way_payment}}</td>
                    <td>{{(new Date(row.promise_delivery_date)).format("yyyy-MM-dd")}}</td>
                    <td>{{row.reason_of_deal}}</td>
                  </tr>
                </tbody>
              </table>              
            </div>
            <br>
            <div class="row">
              <label class="radio-inline">
                <span><input type="radio" v-model="approvedResult.result" class="radio-group" value=1>同意</span>
              </label>                    
              <label class="radio-inline">
                <span><input type="radio" v-model="approvedResult.result" class="radio-group"  value=0 checked>拒绝</span>
              </label>
            </div>
            <div>
              <input v-if="showReasonBox" v-model="approvedResult.whyDisagree" type="text" placeholder="如果不同意,请说明理由" class="form-control">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" @click="saveApprovedData">保存</button> 
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
        queryContent:{
          keyWord:'',
          conditions:'',
          id_apldPcsg:''
        },
        dtlsInApldPcsg:{
          id:'',
          project:'',
          id_project:'',
          name:'',
          unit:'',
          quantity:'',
          brand:'',
          model:'',
          detail:'',
          neededDate:'',
          remark:'',
          id_applier:this.$store.state.user.id_user
        },
        approvedResult:{
          idApplied:'',
          result:1,
          whyDisagree:'',
          idApprover:this.$store.state.user.id_user,
          id_selected_enquiry:''
        },
        apldPcsgWithCmtdEqrys:[],
        titleOfAppliedList:[],
        titleOfAppliedListStatic:['请购ID','项目','物品','包装单位','数量','品牌','规格型号','细节','期望日期','备注','申请人','询价'],
        projects:this.$store.state.projects,
        cmtdEqryWithoutAprvgs:[],
        titleOfEnquiriedList:['商家','价格','金额','付款节点','到货日期','选定理由']
      }
    },
    methods:{
      saveApprovedData() {
        if(this.approvedResult.result==0 && this.approvedResult.whyDisagree.length<2) {
          this.$toast({
            text: '如果不同意,请说明理由,且不少于2个字!',
            type: 'info',
            duration: 1500
          });
          return;        
        }
        if(this.approvedResult.result==1) {
          this.approvedResult.whyDisagree='';
        }
        this.approvedResult.idApplied=this.dtlsInApldPcsg.id;
        var _this=this;
        var url='insertApproveEnquiryCompare.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.approvedResult)
        }).then(function (response) {
          if(response.data===true) {
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
            $('#mdfRecorder').modal('toggle');
            var idx=_this.apldPcsgWithCmtdEqrys.findIndex((item)=>item.id==_this.dtlsInApldPcsg.id);
            _this.apldPcsgWithCmtdEqrys.splice(idx,1);
            _this.dtlsInApldPcsg.id='';              
            _this.dtlsInApldPcsg.project='';
            _this.dtlsInApldPcsg.name='';
            _this.dtlsInApldPcsg.unit='';
            _this.dtlsInApldPcsg.quantity='';
            _this.dtlsInApldPcsg.brand='';
            _this.dtlsInApldPcsg.model='';
            _this.dtlsInApldPcsg.detail='';
            _this.dtlsInApldPcsg.neededDate='';
            _this.dtlsInApldPcsg.remark='';
          } else {
        console.log(response.data);
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 4000
            });
            $('#mdfRecorder').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
          $('#mdfRecorder').modal('toggle');
        });
      },
      clickedARecorderToApprove (dataRow) {
        this.dtlsInApldPcsg.id=dataRow.id;
        this.dtlsInApldPcsg.name=dataRow.name;
        this.dtlsInApldPcsg.unit=dataRow.unit;
        this.cmtdEqryWithoutAprvgs=[];

        this.queryContent.conditions='commitedEnquiryWithoutApproving';
        this.queryContent.id_apldPcsg=this.dtlsInApldPcsg.id;
        
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getEnquiries.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data.length>0) {
            _this.cmtdEqryWithoutAprvgs = response.data;
            for(var i =0;i<_this.cmtdEqryWithoutAprvgs.length;i++) {
              if(_this.cmtdEqryWithoutAprvgs[i].is_made_deal) {
                _this.approvedResult.id_selected_enquiry=_this.cmtdEqryWithoutAprvgs[i].id
              }
            }
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
        $('#mdfRecorder').modal('toggle');
      },
      getapldPcsgWithCmtdEqrys () {
        this.apldPcsgWithCmtdEqrys=[];
        this.titleOfAppliedList=[];
        this.queryContent.conditions='EnquiryCommitedNotApprovedAndComparedPrice';
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data.length>0) {
            _this.apldPcsgWithCmtdEqrys = response.data;
            var ttl='';
            for(ttl in response.data[0]) {
              _this.titleOfAppliedList.push(ttl);
            }              
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
      },
      clearApldPcsgWithCmtdEqrys() {
        this.apldPcsgWithCmtdEqrys=[];
        this.titleOfAppliedList=[];
      }
    },
    computed:{
      showReasonBox () {
        return this.approvedResult.result==0?true:false;
      }
    },
    beforeCreate() {
    },
    watch:{

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
#mdfRecorder input,#mdfRecorder select {
  width: 80%;
}
.radio-group {
/*  display:inline-block; 
  width:40px;*/
  height: 1.2em;
  vertical-align:middle;
  margin-top:-2px;
  margin-bottom:1px;
}
.radio-inline {
  /*display: inline-block;*/
  width: 50%;
  text-align: center;
}
input[type=radio] {
  width: 1.2em!important;
}
</style>
