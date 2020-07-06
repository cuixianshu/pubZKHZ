<template>
<div class="father">
  <h5>当前位置:物料管理/审核领用</h5>
  <div class="container-fluid">
    <div class="form-group form-inline searchbox">
      <!-- <div class="col-lg"> -->
        <!-- <span for="schKeyWds">关键词:</span> -->
<!--         <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词"> -->
        <button @click="getListOfABNA" class="btn btn-primary " type="button">
          获取未审核数据
        </button>
        <button @click="listOfNBNAs=[]" class="btn btn-secondary" type="button" v-if="listOfNBNAs.length>0">清空列表</button>
      <!-- </div> -->
    </div>
    <div v-if="listOfNBNAs.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList" :width="width[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfNBNAs" @click="clickedARecorderToModify(row)">
            <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
            <td title="所属项目">{{getProjectName(row)}}</td>
            <td :title="row.mtname">{{row.mtname}}</td>
            <td :title="row.brand">{{row.brand}}</td>
            <td :title="row.model">{{row.model}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td title="包装单位">{{row.min_unit_packing}}</td>
            <td title="申请数量">{{row.qty}}</td>
            <td title="申请时间">{{row.time_applied}}</td>
            <td title="申请人">{{getNameOfApplyer(row)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <span><h4>审核物料申领</h4></span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" name="name" class="form-control" v-model="notAprvdAplyMtrl.name" placeholder="物料名称" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" name="unit" class="form-control" v-model="notAprvdAplyMtrl.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" name="brand" class="form-control" v-model="notAprvdAplyMtrl.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" name="model" class="form-control" v-model="notAprvdAplyMtrl.model" placeholder="规格型号" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" name="min_unit_packing" class="form-control" v-model="notAprvdAplyMtrl.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="inputQty">数量:</label>
                <input id="inputQty" type="number" name="qty" class="form-control" v-model="notAprvdAplyMtrl.qty" placeholder="申请领用数量" title="申请领用数量" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputProject">项目:</label>
                <select id="inputProject" type="text" name="id_project" class="form-control" v-model="notAprvdAplyMtrl.id_project" placeholder="所属项目" title="所属项目" disabled>
                  <option v-for="item in projects" :value="item.id">{{item.name}}</option>
                </select>
              </div>              
              <div class="col-lg form-inline">
                <label for="inputRemark">备注:</label>
                <input id="inputRemark" type="text" name="remark" class="form-control" v-model="notAprvdAplyMtrl.remark" placeholder="备注信息" title="备注信息" readonly>
              </div>              
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
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputWhy">审核意见:</label>
                <input id="inputWhy" v-model="approvedResult.whyDisagree" type="text" placeholder="如果不同意,请说明理由(不少于4个字)" class="form-control" title="审核意见">                
              </div>

            </div>            
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" type="button" @click="saveApproving">保存</button> 
        </div>  
      </div>
    </div>
  </div>   
</div>
</template>


<script>
import qs from 'qs';
  export default {
    data () {
      return {
        currentUserId:this.$store.state.user.id_user,
        queryContent:{
          keyWord:'',
          conditions:''
        },
        employees:[],
        listOfNBNAs:[],
        titleOfList:['所属项目','名称','品牌','型号','单位','包装单位','申请数量','申请时间','申请人'],
        width:['12%','11%','11%','11%','11%','11%','11%','11%','11%'],
        // qty:0,
        notAprvdAplyMtrl:{
          id:'',
          name:'',
          unit:'',
          brand:'',
          model:'',
          min_unit_packing:'',
          store_place:'',
          remark:'',
          id_op:'',
          qty:0
        },
        approvedResult:{
          result:0,
          whyDisagree:'',
          idApprover:this.$store.state.user.id_user,
          conditions:'WithApprovedApplyingData',//用于通知后台如何操作
          id_applyMaterials:''
        },
        projects:[]
      }
    },
    methods:{
      getListOfABNA() {
        var _this = this;
        this.listOfNBNAs=[];
        this.queryContent.conditions='NotApproved';
        this.$axios({
          method: 'post',
          url: 'getAppliedMaterials.php',
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
              _this.listOfNBNAs=response.data;
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
      clickedARecorderToModify(dataRow) {
        this.notAprvdAplyMtrl=dataRow;
        this.approvedResult.id_applyMaterials=dataRow.id;
        $('#editerOfMaterial').modal('toggle');
      },
      saveApproving() {
        // this.queryContent=this.notAprvdAplyMtrl;
        // this.queryContent.qty_apply=this.qty;
        // this.queryContent.conditions='insertMaterialApplying';
        // this.queryContent.id_op=this.currentUserId;
        if(this.approvedResult.result!=1) {
          if(this.approvedResult.whyDisagree.length<4) {
            this.$toast({
              text: '必须提供拒绝原因!',
              type: 'info',
              duration: 1000
            });
            return;
          }
        }
// console.log(this.approvedResult);
// return;
        var _this=this;
        var url='updateMaterialsApplying.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.approvedResult)
        }).then(function (response) {
// console.log(response.data);
            // _this.listOfNBNAs=[];
            _this.notAprvdAplyMtrl={
              id:'',
              name:'',
              unit:'',
              brand:'',
              model:'',
              min_unit_packing:'',
              store_place:'',
              remark:'',
              id_op:'',
              qyt:0
            }
            // _this.qty=0;
            _this.queryContent={
              keyWord:'',
              conditions:''
            };
            if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#editerOfMaterial').modal('toggle');
            _this.listOfNBNAs.forEach(function(item, index, arr) {
              if(item.id == _this.approvedResult.id_applyMaterials) {
                arr.splice(index, 1);
              }
            });             
          } else {
            console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 2000
            });
            $('#editerOfMaterial').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
          $('#editerOfMaterial').modal('toggle');
        });
      }
    },
    computed: {
      getProgress () {
        return function(dataRow) {
          var r=dataRow.rslt_aprvd;
          var m=dataRow.id_mio;
          if (!r && typeof(r)!="undefined" && r!=0){//未审核
            return '申请未审核';
          } else if(r==0) {//审核未过
            return '没通过审核,';
          } else if(!m && typeof(m)!="undefined" && m!=0) {//审核通过,未发放
            return '已审核,待发放';
          } else {
            return '已发放';
          }
        }
      },
      getNameOfApplyer () {
        return function(dataRow) {
          for(var i=0;i<this.employees.length;i++) {
            if(dataRow.id_applyer==this.employees[i]['id']) {
              return this.employees[i]['name'];
              break;
            }
          }
        }
      },
      getProjectName () {
        return function(dataRow) {
          for(var i=0;i<this.projects.length;i++) {
            if(dataRow.id_project==this.projects[i].id) {
              return this.projects[i].name;
              break;
            }
          }
        }
      }
    },
    beforeCreate:function() {
      var _this = this;
      this.employees=[];
      var queryContent={};
      queryContent.conditions="All";
      this.$axios({
            method: 'post',
            url: 'getEmployees.php',
            data: qs.stringify(queryContent)
        }).then(function (response) {
          _this.employees=response.data;
        }).catch(function (error) {
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
h5 {
  color: #007bff;
}
#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.searchbox button {
  margin-left: 10px;
}
.radio-group {
/*  display:inline-block; 
  width:40px;
*/
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
