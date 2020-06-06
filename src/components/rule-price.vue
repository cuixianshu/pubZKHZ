<template>
  <div class="father">
    <h5>当前位置:基础数据/计价规则</h5>
    <div id="clientDepartment" class="container-fluid">
      <div class="form-group form-inline searchBar">
          <div class="col-lg">
            <span for="schKeyWds">关键词:</span>
            <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、简称、">
            <button @click="getListOfRulePrice"class="btn btn-primary" type="button">搜索数据</button>
            <button @click="clearListOfRulePrice"class="btn btn-secondary" type="button" v-if="listOfRulePrice.length>0">清空</button>
          
          </div>
          <div class="col-lg createnewrule">
            <button @click="newCreate"class="btn btn-primary" type="button">新建计价</button>
          </div>
      </div>
      <div class="listShower" v-if="listOfRulePrice.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in titleOfList" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody @click="clickedARecorderToModify">
            <tr v-for="row in listOfRulePrice">
              <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
            </tr>
          </tbody>
        </table>
      </div>      
    </div>
    <div class="modal fade shower-rule-price" id="mdfRecorder" role="dialog" aria-labelledby="showRulePriceModifyer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipForMdfRecorder">计价器ID:{{theRuleOfPrice.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputName">计价器名:</label>
                  <input class="form-control" id="inputName" type="text" v-model="theRuleOfPrice.name" title="禁止更改,系统会自动识别" readonly>
                </div>
                <div class="col-lg form-inline">
                  <label for="inputForOgnztn">适用单位:</label>
                  <select class="form-control" id="inputForOgnztn" type="text" v-model="theRuleOfPrice.name_ognztn" title="计价器适用的单位名称">
                    <option v-for="item in clntPrntOgnztns">{{item.short_name}}</option>  
                  </select>
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputForProduct">适用产品:</label>
                  <select class="form-control" id="inputForProduct" type="text" v-model="theRuleOfPrice.name_product" title="计价器适用的产品名称">
                    <option v-for="item in products">{{item.name}}</option>  
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="inputBasePrice">套餐价格:</label>
                  <input class="form-control" id="inputBasePrice" type="number" v-model="theRuleOfPrice.price_basic" title="套餐起步价格">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputBasicDuration">套餐时长:</label>
                  <input class="form-control" id="inputBasicDuration" type="number" v-model="theRuleOfPrice.duration_basic"  title="套餐包含的时长">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputBasicScale">套餐里程:</label>
                  <input class="form-control" id="inputBasicScale" type="number" v-model="theRuleOfPrice.scale_basic" title="套餐包含的里程数">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputPriceOfExtraDuration">超时价格:</label>
                  <input class="form-control" id="inputPriceOfExtraDuration" type="number" v-model="theRuleOfPrice.price_extra_duration" title="超过套餐时长的价格:元/小时">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputPriceOfExtraScale">超里程价:</label>
                  <input class="form-control" id="inputPriceOfExtraScale" type="number" v-model="theRuleOfPrice.price_extra_mileage" title="超过套餐里程的价格:元/公里">
                </div>                
              </div>                                          
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputMissMeal">误餐单价:</label>
                  <input class="form-control" id="inputMissMeal" type="number" v-model="theRuleOfPrice.miss_meal_fee" title="如果误餐(中餐或晚餐),每餐价格:元/餐">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputRemark">备注信息:</label>
                  <input class="form-control" id="inputRemark" type="text" v-model="theRuleOfPrice.other" title="其它备注信息">                  
                </div>                
              </div>                                          

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
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
      listOfRulePrice:[],
      titleOfList:[],
      widthOfTH:['2%','25%','2%','2%','4%','4%','4%','4%','4%','2%','2%','2%','7%'],
      theRuleOfPrice:{
        id:'',
        name:'',
        id_for_ognztn:'',
        id_product_for:'',
        name_product:'',
        price_basic:'',
        duration_basic:'',
        scale_basic:'',
        price_extra_duration:'',
        price_extra_mileage:'',
        miss_meal_fee:'',
        other:'',
        name_ognztn:'',
        id_operater:this.$store.state.user.id_user
      },
      isNewCreate:false,
      clntPrntOgnztns:[],
      products:[]
    }
  },
  methods: {
    getListOfRulePrice () {
      this.listOfRulePrice=[];
      this.titleOfList=[];
      var _this = this;
      this.$axios({
          method: 'post',
          url: 'getRulesPrice.php',//
          data: qs.stringify(_this.queryContent)
      }).then(function (response) {
        if(response.data.length<1) {
            _this.$toast({
               text: '没有符合条件的记录',
               type: 'info',
               duration: 2000
            });
            return;
        } 
        var ttl='';
        for(ttl in response.data[0]) {
          _this.titleOfList.push(ttl);
        }
        _this.listOfRulePrice = response.data;
      }).catch(function (error) {
        _this.$toast({
           text: '异步通信错误!'+error,
           type: 'danger!',
           duration: 4000
        });
      });
    },
    clearListOfRulePrice() {
      this.listOfRulePrice=[];
      this.titleOfList=[];
    },
    clickedARecorderToModify:function (e) {
      var el=e.toElement.parentElement;
      this.theRuleOfPrice.id=el.children[0].innerHTML;
      this.theRuleOfPrice.name=el.children[1].innerHTML;
      this.theRuleOfPrice.id_for_ognztn=el.children[2].innerHTML;
      this.theRuleOfPrice.id_product_for=el.children[3].innerHTML;
      this.theRuleOfPrice.price_basic=el.children[4].innerHTML;
      this.theRuleOfPrice.duration_basic=el.children[5].innerHTML;
      this.theRuleOfPrice.scale_basic=el.children[6].innerHTML;
      this.theRuleOfPrice.price_extra_duration=el.children[7].innerHTML;
      this.theRuleOfPrice.price_extra_mileage=el.children[8].innerHTML;
      this.theRuleOfPrice.miss_meal_fee=el.children[9].innerHTML;
      this.theRuleOfPrice.other=el.children[11].innerHTML;
      this.theRuleOfPrice.name_ognztn=el.children[12].innerHTML;
      this.isNewCreate=false;
      $('#mdfRecorder').modal('toggle');
    },
    saveInputedData() {
      for(var prop in this.theRuleOfPrice) {
        if(prop==='name_ognztn' || prop==='name_product') {
          if(this.theRuleOfPrice[prop].length<2) {
            this.$toast({
              text: prop+'至少2个字!',
              type: 'info',
              duration: 1500
            });
            return;              
          }
        }
      }
      this.theRuleOfPrice.name=this.theRuleOfPrice.name_ognztn+'@'+this.theRuleOfPrice.name_product;

      for(var i=0;i<this.clntPrntOgnztns.length;i++) {
        if(this.theRuleOfPrice.name_ognztn===this.clntPrntOgnztns[i].short_name) {
          this.theRuleOfPrice.id_for_ognztn=this.clntPrntOgnztns[i].id;
        }
      }
      for(var i=0;i<this.products.length;i++) {
        if(this.theRuleOfPrice.name_product===this.products[i].name) {
          this.theRuleOfPrice.id_product_for=this.products[i].id;
        }
      }      
      var _this = this;
      if(this.isNewCreate) {
        for(var i=0;i<this.listOfRulePrice.length;i++) {
          if(this.theRuleOfPrice.name===this.listOfRulePrice[i].name) {
            this.$toast({
               text: '重复!系统中有此计价器:'+this.theRuleOfPrice.name,
               type: 'info',
               duration: 2000
            });
            return;            
          }          
        }
        this.$axios({
          method: 'post',
          url: 'insertNewToRulePrice.php',
          data: qs.stringify(_this.theRuleOfPrice)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            $('#mdfRecorder').modal('toggle');
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
      } else {
        this.$axios({
          method: 'post',
          url: 'updateRulePrice.php',
          data: qs.stringify(_this.theRuleOfPrice)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            //从列表中移除
            _this.listOfRulePrice.forEach(function(item, index, arr) {
              if(item.id == _this.theRuleOfPrice.id) {
                arr.splice(index, 1);
              }
            });  
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
      }
    },
    newCreate () {
      this.theRuleOfPrice.id='';
      this.theRuleOfPrice.name='';
      this.theRuleOfPrice.id_for_ognztn='';
      this.theRuleOfPrice.id_product_for='';
      this.theRuleOfPrice.price_basic='';
      this.theRuleOfPrice.duration_basic='';
      this.theRuleOfPrice.scale_basic='';
      this.theRuleOfPrice.price_extra_duration=50;
      this.theRuleOfPrice.price_extra_mileage=5;
      this.theRuleOfPrice.miss_meal_fee=50;
      this.theRuleOfPrice.other='';      
      $('#mdfRecorder').modal('toggle');
      this.isNewCreate=true;
    }    
  },
  beforeCreate:function() {
    var _this=this;
    this.clntPrntOgnztns=[];
    var queryContent={keyWord:''};
    this.$axios({
          method: 'post',
          url: 'getClntPrntOgnztn.php',
          data:qs.stringify(queryContent)
      })
      .then(function (response) {
        _this.clntPrntOgnztns=response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    this.products=[];
    this.$axios({
      method: 'post',
      url: 'getProduct.php',
    }).then(function (response) {
      _this.products=response.data;
    }).catch(function (error) {
      console.log(error);
      _this.$toast({
        text: '异步通信错误!'+error,
        type: 'danger',
        duration: 4000
      });
    });
    this.listOfRulePrice=[];
    this.titleOfList=[];
    this.$axios({
      method: 'post',
      url: 'getRulesPrice.php',
      data: qs.stringify(_this.queryContent)
    }).then(function (response) {
      if(response.data.length<1) {
          _this.$toast({
             text: '没有符合条件的记录',
             type: 'info',
              duration: 2000
          });
          return;
      } 
      var ttl='';
      for(ttl in response.data[0]) {
        _this.titleOfList.push(ttl);
      }
      _this.listOfRulePrice = response.data;
    }).catch(function (error) {
      _this.$toast({
         text: '异步通信错误!'+error,
         type: 'danger',
         duration: 4000
      });
    });            
  },
  watch: {
    'theRuleOfPrice.name': {
      handler: function() {
        var strTemp=this.theRuleOfPrice.name;
        this.theRuleOfPrice.name_product=strTemp.substr(strTemp.indexOf('@')+1);
        for(var i=0;i<this.products.length;i++) {
          if(this.theRuleOfPrice.name_product===this.products[i].name) {
            this.theRuleOfPrice.id_product_for=this.products[i].id;
          }
        }
      }
    }
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
.shower-rule-price input,.shower-rule-price select{
  width: 80%;
}
.shower-rule-price .row{
  margin-top: 5px;
}
.searchBar input,.searchBar button {
  margin-right: 10px;
}
.createnewrule {
  text-align: right;
}
</style>

