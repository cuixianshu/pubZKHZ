<template>
<div class="father">
  <h5>当前位置:物料管理/库存盘点</h5>
  <div class="container-fluid">
    <div class="row form-inline searchbox">
      <!-- <div class="col-lg"> -->
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
        <button @click="getListOfMaterials" class="btn btn-primary ">
          搜索物料
        </button>
        <button @click="clearlistOfMaterials"class="btn btn-secondary" v-if="materials.length>0">清空</button>
      <!-- </div> -->
    </div>
    <div class="divfortable" v-if="materials.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfList" :width="width">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in materials" @click="clickedARecorderToModify(row)">
            <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
            <!-- <td title="物料ID">{{row.id}}</td> -->
            <td :title="row.name">{{row.name}}</td>
            <td :title="row.brand">{{row.brand}}</td>
            <td :title="row.model">{{row.model}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td title="包装单位">{{row.min_unit_packing}}</td>
            <td :title="row.qty_stocks">{{row.qty_stocks}}</td>
            <td title="保存位置">{{row.store_place}}</td>
            <td :title="row.date_last_inventory">{{row.date_last_inventory}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span><h4>库存盘点</h4></span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputNameOfMAT">名称:</label>
                <input id="inputNameOfMAT" type="text" class="form-control" v-model="material.name" placeholder="物料名称" title="物料名称" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputUnit">单位:</label>
                <input id="inputUnit" type="text" class="form-control" v-model="material.unit" placeholder="物料计量单位" title="物料计量单位" readonly>
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label for="inputBrand">品牌:</label>
                <input id="inputBrand" type="text" class="form-control" v-model="material.brand" placeholder="厂家品牌" title="厂家品牌" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">型号:</label>
                <input id="inputModel" type="text" class="form-control" v-model="material.model" placeholder="规格型号" title="规格型号" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputMin_unit_packing">包装:</label>
                <input id="inputMin_unit_packing" type="text" class="form-control" v-model="material.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等" title="包装单位" readonly>
              </div> 
              <div class="col-lg form-inline">
                <label for="inputStorePlace">库位:</label>
                <input id="inputStorePlace" type="text" class="form-control" v-model="material.store_place" placeholder="如:A库/B区/C架/6层/1位" title="库名区位架号层号位号" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputDueQty">应有:</label>
                <input id="inputDueQty" type="number" class="form-control" v-model="material.qty_stocks" placeholder="应有库存数量" title="应有库存数量" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="inputActualQty" style="color:red;">实有:</label>
                <input id="inputActualQty" type="number" class="form-control" v-model="material.qty_actual" placeholder="实有数量" title="实际盘点数量">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveInventoryData">保存</button> 
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
        materials:this.$store.state.materials,
        titleOfList:['名称','品牌','型号','单位','包装单位','库存数','保存位置','上次盘点'],
        width:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],
        qty:0,
        material:{
          // id:'',
          // name:'',
          // unit:'',
          // brand:'',
          // model:'',
          // min_unit_packing:'',
          // store_place:'',
          // remark:'',
          // id_op:'',
          // qty_stocks:0,
          // qty_actual:0
        }
      }
    },
    methods:{
      getListOfMaterials() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this = this;
        this.materials=[];
        this.queryContent.conditions='lastInventoryBefore3DaysAgo';
        this.$axios({
          method: 'post',
          url: 'getMaterials.php',
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
              _this.materials=response.data;
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
      clearlistOfMaterials() {
        this.materials=[];
      },
      clickedARecorderToModify(dataRow) {
        this.material=dataRow;
        this.material.qty_actual=this.material.qty_stocks;
// console.log(this.material);
        $('#editerOfMaterial').modal('toggle');
      },
      saveInventoryData() {
        if(this.material.qty_actual<0) {
          this.$toast({
             text: '请正确输入实有数量!',
             type: 'danger',
             duration: 2000
          });
          return;          
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.queryContent=this.material;
        this.queryContent.conditions='updateQTYWithInventoryData';
        this.queryContent.id_op=this.currentUserId;
// console.log(this.queryContent);
        var _this=this;
        var url='insertMaterialsInOutbound.php';//更新materials和materials_in_outbound
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
            if(response.data===true) {
            $('#editerOfMaterial').modal('toggle');
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            _this.materials.forEach(function(item, index, arr) {
              if(item.id == _this.material.id) {
                arr.splice(index, 1);
              }
            });                          
            _this.material={};
            _this.queryContent={
              keyWord:'',
              conditions:''
            };
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
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 2000
          });
          $('#editerOfMaterial').modal('toggle');
        });
      }
    }    
  }  
</script>

<style scoped>
#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.searchbox button {
  margin-left: 10px;
}
</style>


