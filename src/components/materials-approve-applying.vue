<template>
<div class="father">
  <h5>当前位置:物料管理/审核领用</h5>
  <div class="container-fluid">
    <div class="row form-inline searchbox">
      <!-- <div class="col-lg"> -->
        <!-- <span for="schKeyWds">关键词:</span> -->
<!--         <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词"> -->
        <button @click="getListOfABNA" class="btn btn-primary ">
          获取未审核数据
        </button>
        <button @click="listOfNBNAs=[]" class="btn btn-secondary" v-if="listOfNBNAs.length>0">清空列表</button>
      <!-- </div> -->
    </div>
    <div v-if="listOfNBNAs.length>0" class="divfortable">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfList" :width="width[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfNBNAs" @click="clkARqstToAprv(row)">
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span><h4>审核物料申领</h4></span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="form-inline">
              <label>项目:</label>
              <select type="text" class="form-control" v-model="notAprvdAplyMtrl.id_project" placeholder="所属项目" title="所属项目" disabled>
                <option v-for="item in projects" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class="form-inline">
              <label>名称:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.mtname" placeholder="物料名称" title="物料名称" readonly>
            </div>
            <div class="form-inline">
              <label>品牌:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
            </div>
            <div class="form-inline">
              <label>型号:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.model" placeholder="规格型号" title="规格型号" readonly>
            </div>
            <div class="form-inline">
              <label>备注:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.remark" placeholder="备注信息" title="备注信息" readonly>
            </div> 
            <div class="form-inline">
              <label>数量:</label>
              <input type="number" class="form-control" v-model="notAprvdAplyMtrl.qty" placeholder="申请领用数量" title="申请领用数量" readonly>
            </div>
            <div class="form-inline">
              <label>单位:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
            </div>              
            <div class="form-inline">
              <label>进价:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.last_price" title="上次进价" readonly>
            </div> 
            <div class="form-inline">
              <label>用途:</label>
              <input type="text" class="form-control" v-model="notAprvdAplyMtrl.use_for" title="物料用途" readonly>
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
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveApproving">保存</button> 
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
import qs from 'qs';
  export default {
    data () {
      return {
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        currentUserId:this.$store.state.user.id_user,
        queryContent:{
          keyWord:'',
          conditions:''
        },
        listOfNBNAs:[],
        titleOfList:['所属项目','名称','品牌','型号','单位','包装单位','申请数量','申请时间','申请人'],
        width:['12%','11%','11%','11%','11%','11%','11%','11%','11%'],
        // qty:0,
        notAprvdAplyMtrl:{
          id:'',
          mtname:'',
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
        employees:this.$store.state.employees,
        projects:this.$store.state.projects,
      }
    },
    methods:{
      getListOfABNA() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this = this;
        this.listOfNBNAs=[];
        this.queryContent.conditions='NotApproved';
        this.$axios({
          method: 'post',
          url: 'getAppliedMaterials.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
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
      clkARqstToAprv(dataRow) {
        this.notAprvdAplyMtrl=dataRow;
        this.approvedResult.id_applyMaterials=dataRow.id;
        this.approvedResult.result=0;
        this.approvedResult.whyDisagree='';
        $('#editerOfMaterial').modal('toggle');
      },
      saveApproving() {
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
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this=this;
        var url='updateMaterialsApplying.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.approvedResult)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
            // _this.listOfNBNAs=[];
            _this.notAprvdAplyMtrl={
              id:'',
              mtname:'',
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
          _this.showLoading=false;
          $("body").css("overflow","");
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
            return '已申请未审核';
          } else if(r==0) {//审核未过
            return '没有通过审核,';
          } else if(!m && typeof(m)!="undefined" && m!=0) {//审核通过,未发放
            return '已审核待发放';
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
    }

  }  
</script>

<style scoped>
/*#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}*/
.form-inline {
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
.form-inline input,.form-inline select {
  width: 75%;
}
</style>
