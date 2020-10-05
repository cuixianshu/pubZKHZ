<template>
<div class="father">
  <h5>当前位置:采购业务/请购物品</h5>
  <div class="container-fluid">
    <div class="row form-inline query">
      <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称\规格型号\厂家品牌等">
      <button @click="getListOfAppliedPurchasing" class="btn btn-primary" title="过去半年内的请购采购记录">搜索数据</button>
      <button @click="clearlistOfAppliedPurchasing"class="btn btn-secondary" v-if="listOfAppliedPurchasings.length>0">清空</button>
      <button @click="newCreateApplyPurchasing" class="btn btn-primary newitem">新建采购申请</button>
    </div>
    <div class="divfortable" v-if="listOfAppliedPurchasings.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfAppliedPurchasings" @click="clickedARecorderToModify(row)">
            <td :title='row.id'>{{row.id}}</td>
            <td title='所属项目'>{{getProcjectName(row.id_project)}}</td>
            <td :title='row.name'>{{row.name}}</td>
            <td :title='row.quantity'>{{row.quantity}}</td>
            <td :title='row.unit'>{{row.unit}}</td>
            <td :title='row.brand'>{{row.brand}}</td>
            <td :title='row.model'>{{row.model}}</td>
            <td :title='row.detail'>{{row.detail}}</td>
            <td :title='row.date_needed'>{{row.date_needed}}</td>
            <td title='申请人'>{{getApplyerName(row.id_applier)}}</td>
            <td title='当前进度'>{{getStateOfApplyingPurchasing(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="mdlPurchasing" role="dialog" aria-labelledby="mdlPurchasing" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>采购申请单<span v-show="APDetails.id==''?false:true">--ID:{{APDetails.id}}</span></h5>
        </div>
        <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="slctProject" class="require">所属项目</label>
                  <select id="slctProject" type="text" class="form-control" placeholder="所属项目" v-model="APDetails.id_project" title="选择所属项目" :readonly="applyingIsPassedApproving(APDetails.id)">
                    <option value=0>请选择项目</option>
                    <option v-for="item in projects" :value="item.id">{{item.prjct}}</option>
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="nameOfMaterial" class="require">物品名称</label>
                  <input id="nameOfMaterial" type="text" class="form-control" placeholder="物品名称" v-model="APDetails.name" title="物品名称" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
              </div>
              <div class="row">                
                <div class="col-lg form-inline">
                  <label for="inputUnit">计量单位</label>
                  <input id="inputUnit" type="text" class="form-control" placeholder="计量单位" v-model="APDetails.unit" title="计量单位" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>          
                <div class="col-lg form-inline">
                  <label for="inputQuantity" class="require">请购数量</label>
                  <input id="inputQuantity" type="number" class="form-control" placeholder="请购数量" v-model="APDetails.quantity" title="请购数量,必须大于 0" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputBrand" class="require">厂商品牌</label>
                  <input id="inputBrand" type="text" class="form-control" placeholder="厂商品牌" v-model="APDetails.brand" title="厂商品牌" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputModel" class="require">规格型号</label>
                  <input id="inputModel" type="text" class="form-control" placeholder="规格型号" v-model="APDetails.model" title="规格型号" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
              </div>
              <div class="row">    
                <div class="col-lg form-inline">
                  <label for="inputDetail" class="require">用途说明</label>
                  <input id="inputDetail" type="text" class="form-control" placeholder="用途说明" v-model="APDetails.detail" title="用途说明" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
                <div class="col-lg form-inline">
                  <label for="inptStartPoint" class="require">需要日期</label>
                  <input id="inptStartPoint" type="date" class="form-control" placeholder="需要日期" v-model="APDetails.date_needed" title="需要日期" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputMem">备注说明</label>
                  <input id="inputMem" type="text" class="form-control" placeholder="备注说明" v-model="APDetails.remark" title="其它需要说明的事项" :readonly="applyingIsPassedApproving(APDetails.id)">
                </div>
                <div class="col-lg form-inline">
                </div>
              </div>
            </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" @click="saveApplyPurchasing" v-if="!applyingIsPassedApproving(APDetails.id)">保存</button> 
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
          conditions:''
        },
        APDetails:{
          id:'',
          project:'',
          id_project:0,
          name:'',
          unit:'',
          quantity:'',
          brand:'',
          model:'',
          detail:'',
          date_needed:'',
          remark:'',
          id_applier:this.$store.state.user.id_user,
          conditions:''//用于标识后台如何操作
        },
        listOfAppliedPurchasings:[],
        titleOfList:['请购ID','项目','物品','数量','包装单位','品牌','型号','详情','需要日期','申请人','执行进度'],
        projects:this.$store.state.projects,
        employees:this.$store.state.myEmplys,
      }
    },
    methods:{
      saveApplyPurchasing() {
        if(!this.APDetails.id_project) {
          this.$toast({
            text: '请选择所属项目',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.name.length<2) {
          this.$toast({
            text: '物品名称不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.unit.length<1) {
          this.$toast({
            text: '计量单位不能为空',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.quantity<=0) {
          this.$toast({
            text: '这个数量不用申请',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.brand.length<2) {
          this.$toast({
            text: '厂商品牌不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.model.length<2) {
          this.$toast({
            text: '规格型号不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.APDetails.detail.length<4) {
          this.$toast({
            text: '用途说明不能少于4个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if((this.APDetails.date_needed < (new Date().format("yyyy-MM-dd"))) || this.APDetails.date_needed.length<8) {
          this.$toast({
            text: '需要日期不能早于今天',
            type: 'info',
            duration: 1000
          });
          return;
        }
        var _this=this;
        var url='';
        if(this.APDetails.id!=='') {
          url='updateApplyPurchasing.php';
          this.APDetails.conditions='Modified'
        } else {
          this.APDetails.conditions='InsertNew'
          url='insertNewToApplyPurchasing.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.APDetails)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#mdlPurchasing').modal('toggle');
            _this.clearlistOfAppliedPurchasing();
            _this.getListOfAppliedPurchasing();
            _this.APDetails.id='';              
            _this.APDetails.id_project=0;
            _this.APDetails.name='';
            _this.APDetails.unit='';
            _this.APDetails.quantity='';
            _this.APDetails.brand='';
            _this.APDetails.model='';
            _this.APDetails.detail='';
            _this.APDetails.date_needed='';
            _this.APDetails.remark='';
          } else {
        console.log(response.data);
            _this.$toast({
              text: '通信错误!'+response.data,
              type: 'danger',
              duration: 4000
            });
            $('#mdlPurchasing').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
          $('#mdlPurchasing').modal('toggle');
        });
      },
      clickedARecorderToModify (dataRow) {
        this.APDetails=dataRow;
        this.APDetails.id_project=0;
        $('#mdlPurchasing').modal('toggle');
      },
      getListOfAppliedPurchasing () {
        this.listOfAppliedPurchasings=[];
        // this.titleOfList=[];
        var _this = this;
        this.queryContent.conditions='Last6MonthAppliedPurchasingsWithState';

        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
            if(response.data.length>0) {
              _this.listOfAppliedPurchasings = response.data;
            } else {
              _this.$toast({
                text: '没有符合条件的记录',
                type: 'info',
                duration: 1000
              });              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      clearlistOfAppliedPurchasing() {
        this.listOfAppliedPurchasings=[];
      },
      newCreateApplyPurchasing () {
        this.listOfAppliedPurchasings=[];
        // this.titleOfList=[];              
        this.APDetails.id='';
        this.APDetails.project='';
        this.APDetails.name='';
        this.APDetails.unit='';
        this.APDetails.quantity='';
        this.APDetails.brand='';
        this.APDetails.model='';
        this.APDetails.detail='';
        this.APDetails.date_needed='';
        this.APDetails.remark='';
        $('#mdlPurchasing').modal('toggle');
      }

    },
    computed: {
      getProcjectName () {
        return function(projectID) {
          for(var i=0;i<this.projects.length;i++) {
            if(projectID==this.projects[i].id) {
              return this.projects[i].name;
            }
          }
        }
      },
      getApplyerName () {
        return function(applyedID) {
          for(var i=0;i<this.employees.length;i++) {
            if(applyedID==this.employees[i].id) {
              return this.employees[i].name;
            }
          }
        }
      },
      getStateOfApplyingPurchasing() {
        return function(dataRow) {
          if(dataRow.count_enquiries==0) {//未询价
            if(!dataRow.result_approved && typeof(dataRow.result_approved)!="undefined" && dataRow.result_approved!=0) {//请购未审核
              return '请购单待审核';
            } else if(dataRow.result_approved==0) {//未通过请购审核
              return '请购审核未通过';
            } else {//已通过请购审核
              return '请购审核已通过';
            }
          } else {//已询价
            if(!dataRow.state_of_enquiries && typeof(dataRow.state_of_enquiries)!="undefined" && dataRow.state_of_enquiries!=0) {//未提交审核null
              return '询价比价中..';
            } else if(dataRow.state_of_enquiries==0 || dataRow.state_of_enquiries==1) {//已提交,未审核
              return '正审核比价..';
            } else if(dataRow.is_finished==0) {
              return '正在采购中..';
            } else if(dataRow.id_pio) {
              return '已采购,已验收!';
            } else {
              return '已采购,待验收...';
            }
          }        
        }
      },

//id对应的请购单的result_approved如果不是null,说明已通过了请购审核,所以要只读
      applyingIsPassedApproving() {
        return function(id) {
          for(var i=0;i<this.listOfAppliedPurchasings.length;i++) {
            if(id==this.listOfAppliedPurchasings[i].id) {
              if(!(!this.listOfAppliedPurchasings[i].result_approved && typeof(this.listOfAppliedPurchasings[i].result_approved)!="undefined" && this.listOfAppliedPurchasings[i].result_approved!=0)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }      
    },
    beforeCreate() {
    }
  })
</script>
<style scopede>
.row {
  margin-top: 10px;
}
.query input,.query button {
  margin-right: 5px;
}
.newitem {
  position: absolute;
  right: 20px;
}
#mdlPurchasing input,#mdlPurchasing select {
  width: 80%;
}  
</style>
