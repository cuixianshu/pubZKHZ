<template>
<div class="father">
  <h5>当前位置:基础数据/产品管理</h5>
  <div id="clientDepartment" class="container-fluid">
    <div class="form-group form-inline">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、规格型号等">
          <button @click="getListOfProduct" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfProduct"class="btn btn-secondary" type="button" v-if="listOfProduct.length>0">清空</button>
          
        </div>
        <div class="col-lg createnewproduct">
          <button @click="newCreateProduct" class="btn btn-primary" type="button">新建产品</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfProduct.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in productTitle">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="row in listOfProduct" @click="clickedARecorderToModify(row)">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade shower-product" id="mdfRecorder" role="dialog" aria-labelledby="showProductModifyer" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="tipForMdfRecorder">产品编辑器--产品ID:{{product.id}}</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputProductType">产品类别:</label>
                <select id="slctType" type="text" name="productType" class="form-control" v-model="product.id_type" title="产品所属类别">
                  <option v-for="item in typeListOfPrdct" :value="item.id">{{item.type_product}}</option>
                </select>
              </div>                
              <div class="col-lg form-inline">
                <label for="inputShortName">产品名称:</label>
                <input class="form-control" id="inputProductName" type="text" v-model="product.name">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputUnit">计量单位:</label>
                <input class="form-control" id="inputUnit" type="text" v-model="product.unit">
              </div>
              <div class="col-lg form-inline">
                <label for="inputModel">规格型号:</label>
                <input class="form-control" id="inputModel" type="text" v-model="product.model">
              </div>                
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputDetails">详细信息:</label>
                <input class="form-control" id="inputDetails" type="text" v-model="product.details">
              </div>
              <div class="col-lg form-inline">
                <label for="inputSellable">是否在售:</label>
                <input class="form-control" id="inputSellable" type="text" v-model="product.sellable">
              </div>                
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="inputOther">备注信息:</label>
                <input class="form-control" id="inputOther" type="text" v-model="product.other">
              </div>
              <div class="col-lg form-inline">
              </div>                
            </div>                                          
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" @click="saveData">保存</button>  
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
        queryContent:{
          keyWord:''
        },
        typeListOfPrdct:[],
/*
details: (...)
id: (...)
id_type: (...)
model: (...)
name: (...)
other: (...)
sellable: (...)
time_create: (...)
unit: (...)
 */
        product:{
          id:'',
          type:'',
          id_type:1,
          name:'',
          unit:'个',
          model:'',
          details:'',
          sellable:1,
          time_create:'',
          other:''
        },
        listOfProduct:[],
        productTitle:[],
        employees:[],
      }
    },
    methods: {
      getListOfProduct () {
        if(this.listOfProduct.length>0) {
          this.listOfProduct=[];
          this.productTitle=[];
        }
        var _this = this;
        this.$axios.get('getProduct.php').then(function (response) {
            _this.listOfProduct = response.data;
            var ttl='';
            for(ttl in response.data[0]) {
              _this.productTitle.push(ttl);
            }
          }).catch(function (error) {
            console.log(error);
          });
      },
      saveData () {
        if(!this.product.id_type) {
          this.$toast({
            text: '请选择产品类型',
            type: 'danger',
            duration: 2000
          });
          return;
        }
        if(this.product.name.length<2) {
          this.$toast({
            text: '产品名称不能少于2个字',
            type: 'danger',
            duration: 2000
          });
          return;
        }
        if(this.product.unit.length<1) {
          this.$toast({
            text: '请填写计价单位',
            type: 'danger',
            duration: 2000
          });
          return;
        }
        if(this.product.model.length<3) {
          this.$toast({
            text: '型号规格不能少于3个字',
            type: 'danger',
            duration: 2000
          });
          return;
        }
        //获取产品类型ID
        // for(var i=0;i<this.typeListOfPrdct.length;i++) {
        //   if(this.typeListOfPrdct[i].type_product===this.product.type) {
        //     this.product.type=this.typeListOfPrdct[i].id;
        //   }
        // }
        var _this=this;
        var url='';
        if(this.product.id!=='') {
          url='updateTblProduct.php';
        } else {
          url='insertNewToProduct.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.product)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            _this.listOfProduct=[];
            _this.productTitle=[];              
            $('#mdfRecorder').modal('toggle');
            _this.product.name='';
            _this.product.id_type='';
            _this.product.unit='个';
            _this.product.model='';
            _this.product.details='';
            _this.product.other='';
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
      clickedARecorderToModify:function (dataRow) {
// console.log(dataRow);
// return;        
        this.product=dataRow;
        // var el=e.toElement.parentElement;
        // this.product.id=el.children[0].innerHTML;
        // this.product.name=el.children[1].innerHTML;
        // this.product.unit=el.children[2].innerHTML;
        // // this.product.type=el.children[3].innerHTML;
        // for(var i=0;i<this.typeListOfPrdct.length;i++) {
        //   if(el.children[3].innerHTML===this.typeListOfPrdct[i].id) {
        //     this.product.type=this.typeListOfPrdct[i].type_product
        //   }
        // }
        // this.product.model=el.children[4].innerHTML;
        // this.product.details=el.children[5].innerHTML;
        // this.product.sellable=el.children[6].innerHTML;
        // this.product.time_create=el.children[7].innerHTML;
        // this.product.other=el.children[8].innerHTML;
        $('#mdfRecorder').modal('toggle');
      },
      clearlistOfProduct () {
        this.listOfProduct=[];
        this.productTitle=[];
      },
      newCreateProduct () {
        this.product.id='';
        this.product.name='';
        this.product.id_type=1;
        this.product.unit='个';
        this.product.model='';
        this.product.details='';
        this.product.other='';
        this.product.sellable=1;
        $('#mdfRecorder').modal('toggle');
      }
    },
    beforeCreate:function() {
      //初始化员工option
      this.employees=[];
      var _this = this;
      this.$axios({
            method: 'post',
            url: 'getEmployees.php'
        })
        .then(function (response) {
          _this.employees=response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      //初始化产品类别option
      this.typeListOfPrdct=[];

      var _this = this;
      this.$axios({
            method: 'post',
            url: 'getTypeProduct.php'
        })
        .then(function (response) {
          _this.typeListOfPrdct=response.data;
        })
        .catch(function (error) {
          console.log(error);
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
.row {
  margin-top: 10px;
}
.shower-product input,.shower-product select{
  width: 80%;
} 
.createnewproduct {
  text-align: right;
}
.saveBtn {
  width: 100px;
}
</style>

