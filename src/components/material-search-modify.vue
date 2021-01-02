<template>
<div class="father">
  <h5>当前位置:物料管理/查找新建</h5>
  <div class="container-fluid">
    <div class="row form-inline query">
      <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="物品名称,规格型号,品牌,库位等关键词">
      <button @click="getMaterials" class="btn btn-primary">
        搜索物料
      </button>
      <button @click="clearlistOfMaterials" class="btn btn-secondary" v-if="materials.length>0">清空</button>
      <button @click="newCreateMaterial" class="btn btn-primary newitem">
        新建物料
      </button>
    </div>
    <div class="divfortable" v-if="materials.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titleOfList" :width="titleWidth[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in materials" @click="clkAMtrlToModify(row)">
            <td :title="row.name">{{row.name}}</td>
            <td :title="row.brand">{{row.brand}}</td>
            <td :title="row.model">{{row.model}}</td>
            <td :title="row.unit">{{row.unit}}</td>
            <td title="包装单位">{{row.min_unit_packing}}</td>
            <td title="最小包装单位的价格">{{row.last_price}}</td>
            <td :title="row.qty_stocks">{{row.qty_stocks}}</td>
            <td title="保存位置">{{row.store_place}}</td>
            <td title="是否可以领用">{{getActiveStatus(row.is_active)}}</td>
            <td :title="row.remark">{{row.remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="editerOfMaterial" role="dialog" aria-labelledby="editer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <span>物料编辑器</span><span v-if="!isNew">ID:{{material.id}}</span>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label>名称:</label>
                <input type="text" class="form-control" v-model="material.name" placeholder="物料名称,不超过64字" title="物料名称" :readonly="!isNew">
              </div>
              <div class="col-lg form-inline">
                <label>单位:</label>
                <input type="text" class="form-control" v-model="material.unit" placeholder="物料计量单位,不超过8字" title="物料计量单位" :readonly="!isNew">
              </div> 
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label>品牌:</label>
                <input type="text" class="form-control" v-model="material.brand" placeholder="厂家品牌,不超过64字" title="厂家品牌" :readonly="!isNew">
              </div>
              <div class="col-lg form-inline">
                <label>型号:</label>
                <input type="text" class="form-control" v-model="material.model" placeholder="规格型号,不超过64字" title="规格型号" :readonly="!isNew">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>包装:</label>
                <input type="text" class="form-control" v-model="material.min_unit_packing" placeholder="如:300ml/瓶,12瓶/箱等,,不超过32字" title="包装单位" :readonly="!isNew">
              </div> 
              <div class="col-lg form-inline">
                <label>进价:</label>
                <input type="number" class="form-control" v-model="material.last_price" placeholder="0.00" title="上次进价" readonly>
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>可领:</label>
                <select class="form-control" v-model="material.is_active" title="是否可以领用">
                  <option v-for="item in activeStatus" :value="item.id">{{item.name}}</option>
                </select>
              </div>              
              <div class="col-lg form-inline">
                <label>库位:</label>
                <input type="text" class="form-control" v-model="material.store_place" placeholder="如:A库/B区/C架/6层/1位,不超过64字" title="不超过64字">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>备注:</label>
                <input type="text" class="form-control" v-model="material.remark" placeholder="备注信息,不超过64字" title="备注信息">
              </div>
              <div class="col-lg form-inline">
                <label>归还:</label>
                <select class="form-control" v-model="material.is_need_return" title="使用后是否要归还">
                  <option v-for="item in whetherReturns" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary" @click="saveInputedData">保存</button> 
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
        isNew:false,
        materials:[],
        titleOfList:['名称','品牌','型号','单位','包装单位','单价','库存数','保存位置','可领用','备注'],
        titleWidth:['14%','10%','10%','6%','14%','8%','6%','11%','6%','14%'],
        activeStatus:[{id:0,name:'否'},{id:1,name:'是'}],
        whetherReturns:[{id:0,name:'使用后,不需归还'},{id:1,name:'使用后,必须归还'}],
        material:{
          id:'',
          name:'',
          unit:'',
          brand:'',
          model:'',
          min_unit_packing:'',
          last_price:0.00,
          store_place:'',
          remark:'',
          id_op:'',
          is_active:1,
          is_need_return:1,
        }
      }
    },
    methods:{
      getMaterials() {
        // this.materials=this.$store.state.materials;
        // queryContent.keyWord
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.queryContent.conditions='byKeyWordForModifying';
        let _this=this;
        _this.$axios({
          method: 'post',
          url: 'getMaterials.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.materials=response.data;
            }
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:2000});
          }
        }).catch(function (error) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });        
      },
      clearlistOfMaterials() {
        this.materials=[];
        // this.titleOfList=[];
      },
      newCreateMaterial() {
        this.materials=[];
        this.material.id='';
        this.material.name='';
        this.material.unit='';
        this.material.brand='';
        this.material.model='';
        this.material.min_unit_packing='';
        this.material.last_price=0.00;
        this.material.store_place='';
        this.material.remark='';
        this.isNew=true;
        $('#editerOfMaterial').modal('toggle');
      },
      clkAMtrlToModify(dataRow) {
        this.isNew=false;
        this.material=dataRow;
        $('#editerOfMaterial').modal('toggle');
      },
      saveInputedData() {
// console.log(this.material);
// return;
        var dict={
          name:'名称',
          unit:'单位',
          brand:'品牌',
          model:'型号',
          min_unit_packing:'包装',
          last_price:'单价',
          store_place:'库位',
          is_active:'可领用状态',
          is_need_return:'归还',
        };
        for(var prop in this.material) {
          if(prop!=='id' && prop!=='id_op' && prop!=='remark' && prop!=='unit') {
            if(this.material[prop] && this.material[prop].length<1) {
            this.$toast({
              text: dict[prop]+'至少1个字',
              type: 'info',
              duration: 2000
            });
            return;              
            }
          } else {
            if(this.material.unit.length<1) {
              this.$toast({
                text: '单位最少需1个字符',
                type: 'info',
                duration: 2000
              });
            }
          }
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        var _this=this;
        var url='';
        if(!this.isNew) {
          url='updateMaterials.php';
          this.material.conditions='ModifyTheMaterial';
        } else {
          url='insertMaterials.php';
          this.material.conditions='newCreate';
        }
        this.material.id_op=this.currentUserId;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.material)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data===true) {
              _this.$toast({text:'成功保存数据!',type:'success',duration:800});
            $('#editerOfMaterial').modal('toggle');
            _this.$store.dispatch('getMaterials',_this);
            _this.queryContent.keyWord="";
            _this.queryContent.conditions='byKeyWordForModifying';
            _this.getMaterials();
          } else {
            console.log(response.data);
            _this.$toast({text:'操作失败!',type:'danger',duration:2000});
            // $('#editerOfMaterial').modal('toggle');
          } 
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({text:'通信错误!',type:'danger',duration:2000});
          // $('#editerOfMaterial').modal('toggle');
        });
      }
    },
    beforeCreate:function() {

    },
    computed:{
      getActiveStatus() {
        return function (id) {
          var elmt=this.activeStatus.find((ele) => ele['id'] == id);
          return typeof(elmt)=='undefined'?'':elmt['name'];
        }
      }
    },
  }  
</script>

<style scoped>
#editerOfMaterial input,#editerOfMaterial select {
  width: 70%;
}
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
</style>