<template>
  <div class="father">
    <h5>当前位置:基础数据/计价规则</h5>
    <div id="clientDepartment" class="container-fluid">
      <div class="row form-inline query">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、简称、">
        <button @click="getListOfRulePrices"class="btn btn-primary form-control">搜索数据</button>
        <button @click="clearListOfRulePrices"class="btn btn-secondary form-control" v-if="!isNewCreate && listOfRulePrices.length>0">清空</button>
        <button @click="newCreate" class="btn btn-primary newitem form-control">新建计价</button>
      </div>
      <div class="divfortable" v-if="!isNewCreate && listOfRulePrices.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in titleOfList" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in listOfRulePrices" @click="clickedARecorderToModify(row)">
              <td :title='row.name'>{{row.name}}</td>
              <td :title='row.price_basic'>{{row.price_basic}}</td>
              <td :title='row.duration_basic'>{{row.duration_basic}}</td>
              <td :title='row.scale_basic'>{{row.scale_basic}}</td>
              <td :title='row.price_extra_duration'>{{row.price_extra_duration}}</td>
              <td :title='row.price_extra_mileage'>{{row.price_extra_mileage}}</td>
              <td :title='row.miss_meal_fee'>{{row.miss_meal_fee}}</td>
            </tr>
          </tbody>
        </table>
      </div>      
    </div>
    <div class="modal fade shower-rule-price" id="mdfRecorder" role="dialog" aria-labelledby="showRulePriceModifyer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipForMdfRecorder">计价器ID:{{theRulePrice.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputName">计价器名:</label>
                  <input class="form-control" id="inputName" type="text" v-model="theRulePrice.name" title="禁止更改,系统会自动识别" readonly>
                </div>
                <div class="col-lg form-inline">
                  <label >适用单位:</label>
                  <select class="form-control" type="text" v-model="theRulePrice.id_for_ognztn" title="计价器适用的单位名称" :disabled="!isNewCreate">
                    <option value=0>选择单位</option>
                    <option v-for="item in clntPrntOgnztns" :value="item.id">{{item.short_name}}</option>  
                  </select>
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputForProduct">适用产品:</label>
                  <select class="form-control" id="inputForProduct" type="text" v-model="theRulePrice.id_product_for" title="计价器适用的产品名称" :disabled="!isNewCreate">
                    <option value=0>选择产品</option>
                    <option v-for="item in products" :value="item.id">{{item.name}}</option>  
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="inputBasePrice">套餐价格:</label>
                  <input class="form-control" id="inputBasePrice" type="number" v-model="theRulePrice.price_basic" title="套餐起步价格">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputBasicDuration">套餐时长:</label>
                  <input class="form-control" id="inputBasicDuration" type="number" v-model="theRulePrice.duration_basic"  title="套餐包含的时长">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputBasicScale">套餐里程:</label>
                  <input class="form-control" id="inputBasicScale" type="number" v-model="theRulePrice.scale_basic" title="套餐包含的里程数">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputPriceOfExtraDuration">超时价格:</label>
                  <input class="form-control" id="inputPriceOfExtraDuration" type="number" v-model="theRulePrice.price_extra_duration" title="超过套餐时长的价格:元/小时">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputPriceOfExtraScale">超里程价:</label>
                  <input class="form-control" id="inputPriceOfExtraScale" type="number" v-model="theRulePrice.price_extra_mileage" title="超过套餐里程的价格:元/公里">
                </div>                
              </div>                                          
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputMissMeal">误餐单价:</label>
                  <input class="form-control" id="inputMissMeal" type="number" v-model="theRulePrice.miss_meal_fee" title="如果误餐(中餐或晚餐),每餐价格:元/餐">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputRemark">备注信息:</label>
                  <input class="form-control" id="inputRemark" type="text" v-model="theRulePrice.other" title="其它备注信息">                  
                </div>                
              </div>                                          

            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button class="btn btn-primary saveBtn" @click="saveInputedData">保存</button>  
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
      listOfRulePrices:[],
      titleOfList:['计价名称','基础价格(元)','包含时长(小时)','包含里程(公里)','超时长价(元/小时)','超里程价(元/公里)','误餐价(元/餐)'],
      widthOfTH:['22%','13%','13%','13%','13%','13%','13%'],
      theRulePrice:{
        id:'',
        name:'',
        id_for_ognztn:0,
        id_product_for:0,
        price_basic:'',
        duration_basic:'',
        scale_basic:'',
        price_extra_duration:'',
        price_extra_mileage:'',
        miss_meal_fee:'',
        other:'',
        // name_ognztn:'',
        id_operater:this.$store.state.user.id_user
      },
      isNewCreate:false,
      clntPrntOgnztns:this.$store.state.clntParentOgnztns,
      products:this.$store.state.products,
    }
  },
  methods: {
    getListOfRulePrices () {
      this.listOfRulePrices=[];
      this.isNewCreate=false;
      var _this = this;
      this.$axios({
          method: 'post',
          url: 'getRulesPrice.php',//
          data: qs.stringify(_this.queryContent)
      }).then(function (response) {
        console.log(response.data);
        if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的记录',
              type: 'info',
              duration: 2000
            });
            return;
        } 
        _this.listOfRulePrices = response.data;
      }).catch(function (error) {
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger!',
          duration: 4000
        });
      });
    },
    clearListOfRulePrices() {
      this.listOfRulePrices=[];
    },
    clickedARecorderToModify (r) {
      this.isNewCreate=false;
      this.theRulePrice=r;
      this.theRulePrice.id_operater=this.$store.state.user.id_user;
      console.log(this.theRulePrice);
      $('#mdfRecorder').modal('toggle');
    },
    saveInputedData() {
      if(!this.theRulePrice.id_for_ognztn) {
        this.$toast({
          text: '请选择单位!',
          type: 'info',
          duration: 1000
        });
        return;              
      }
      if(!this.theRulePrice.id_product_for) {
        this.$toast({
          text: '请选择产品!',
          type: 'info',
          duration: 1000
        });
        return;              
      }
      var o=this.clntPrntOgnztns.find((ele) => ele['id'] == this.theRulePrice.id_for_ognztn);
      var ogName=typeof(o)=='undefined'?'':o['short_name'];
      var o=this.products.find((ele) => ele['id'] == this.theRulePrice.id_product_for);
      var pName=typeof(o)=='undefined'?'':o['name'];
      this.theRulePrice.name=ogName+'@'+pName;
      var _this = this;
      if(this.isNewCreate) {
        if(this.listOfRulePrices.length<1) {
          this.getListOfRulePrices();
        }
        var indx=this.listOfRulePrices.findIndex((ele) => ele['name'] == this.theRulePrice.name);
        if(indx!==-1) {
          this.$toast({
            text: '重复!系统中有此计价器:'+this.theRulePrice.name,
            type: 'info',
            duration: 2000
          });
          return;            
        }          
        this.$axios({
          method: 'post',
          url: 'insertNewToRulePrice.php',
          data: qs.stringify(_this.theRulePrice)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#mdfRecorder').modal('toggle');
          } else {
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
      } else {

        this.$axios({
          method: 'post',
          url: 'updateRulePrice.php',
          data: qs.stringify(_this.theRulePrice)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
              _this.$toast({
                text: '成功保存数据!',
                type: 'success',
                duration: 800
              });
            $('#mdfRecorder').modal('toggle');
          } else {
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
      }
    },
    newCreate () {
      this.isNewCreate=true;
      this.theRulePrice.id='';
      this.theRulePrice.name='';
      this.theRulePrice.id_for_ognztn=0;
      this.theRulePrice.id_product_for=0;
      this.theRulePrice.price_basic=600;
      this.theRulePrice.duration_basic=8;
      this.theRulePrice.scale_basic=100;
      this.theRulePrice.price_extra_duration=50;
      this.theRulePrice.price_extra_mileage=5;
      this.theRulePrice.miss_meal_fee=50;
      this.theRulePrice.other='';      
      $('#mdfRecorder').modal('toggle');
    }    
  },
  beforeCreate:function() {
          
  },
  watch: {
    // 'theRulePrice.name': {
    //   handler: function() {
    //     var strTemp=this.theRulePrice.name;
    //     this.theRulePrice.name_product=strTemp.substr(strTemp.indexOf('@')+1);
    //     for(var i=0;i<this.products.length;i++) {
    //       if(this.theRulePrice.name_product===this.products[i].name) {
    //         this.theRulePrice.id_product_for=this.products[i].id;
    //       }
    //     }
    //   }
    // }
  }  
}
</script>

<style scoped>
.shower-rule-price input,.shower-rule-price select{
  width: 80%;
}
.row{
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

