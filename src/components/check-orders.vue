<template>
  <div class="father">
    <div class="container-fluid query-body">
    <h5>当前位置:订单管理/复核订单</h5>
      
      <div id="schAndModify" class="form-group form-inline">
        <label for="schKeyWds">关键词:</label>
        <input id="schKeyWds" type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入要搜索的内容" title="订车人乘车人用车单位项目附加信息等">
         <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="时间区间,默认最近7天" :shortcuts="shortcuts" placeholder="发生业务的时间范围"></datepicker> 
        <button id="btnSearch"  @click="getRcdrsForModifying"class="btn btn-primary" type="button">搜索数据</button>
        <button id="btnClearRcdrsInModifyer"  @click="clearRcdrsInModifyer"class="btn btn-secondary" type="button" v-if="rcdrSetFromDBSForModifying.length>0">清空</button>
      </div>
      <div class="rcdrsForMdfying" v-if="rcdrSetFromDBSForModifying.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in recordersTitle" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in rcdrSetFromDBSForModifying" @click="clickedARecorderToModify(row)">
              <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="selectUseageLabel" data-backdrop="static" data-keyboard: false ref="mdfRecorder">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipFormdfRecorder">订单号:{{slctdRcdrForChecking.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="slctMdfProject">项目:</label>
                  <select id="slctMdfProject" type="text" name="prjct" class="form-control" placeholder="所属项目" v-model="slctdRcdrForChecking.prjct" title="项目名称" >
                    <option v-for="proj in projects">{{proj.prjct}}</option>}
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="slctMdfBooker">用户:</label>
                  <select id="slctMdfBooker" type="text" name="booker" class="form-control" placeholder="用户名称" v-model="slctdRcdrForChecking.booker" title="用户名称" >
                    <option v-for="bkr in customers">{{bkr.mix_name}}</option>}
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="slctMdfNameOfPrdct">产品:</label>
                    <select id="slctMdfNameOfPrdct" type="text" name="product" class="form-control" placeholder="产品名称" v-model="slctdRcdrForChecking.product" title="产品名称" >
                      <option v-for="item in namesOfPrdctInSelect">{{item.name}}</option>
                    </select>            
                </div>
              </div>
              <div class="row">                  
                <div class="col-lg form-inline">
                  <label for="dtpkrMdfStartTime">开始:</label>
                  <datepicker id="dtpkrMdfStartTime" v-model="slctdRcdrForChecking.startTime" type="datetime"  format="YYYY-MM-DD HH:mm" title="开始时间" :minute-step="5" width="160" name="startTime"></datepicker>
                </div><!-- confirm confirm --> 
                <div id="endTimeForMdf" class="col-lg form-inline">
                  <label for="dtpkrMdfEndTime">结束:</label>
                  <datepicker id="dtpkrMdfEndTime" v-model="slctdRcdrForChecking.endTime" type="datetime"  format="YYYY-MM-DD HH:mm" title="结束时间" :minute-step="5" width="160" name="endTime"></datepicker>
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfNumOfMileage">里程:</label>
                  <input id="inputMdfNumOfMileage" type="number" name="mileage" class="form-control" placeholder="行驶里程" v-model="slctdRcdrForChecking.mileage" title="实际行驶里程">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inptMdfstartPoint">起点:</label>
                  <input id="inptMdfstartPoint" type="text" name="startPoint" class="form-control" placeholder="出发地点" v-model="slctdRcdrForChecking.startPoint" title="预计出发地点">
                </div>
                <div class="col-lg form-inline">
                  <label for="inptMdfendPoint">终点:</label>
                  <input id="inptMdfendPoint" type="text" name="endPoint" class="form-control" placeholder="终到地点" v-model="slctdRcdrForChecking.endPoint" title="计划结束地点">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMsgToDriver">发送:</label>
                  <input id="inputMsgToDriver" type="text" name="msg_to_driver" class="form-control" placeholder="通知信息" v-model="slctdRcdrForChecking.msg_to_driver" title="发送给司机的信息">
                </div>
              </div>
              <div class="row">                                                       
                <div class="col-lg form-inline">
                  <label for="inputDriver">司机:</label>
                  <input id="inputDriver" type="text" name="driver" class="form-control" placeholder="驾驶员" v-model="slctdRcdrForChecking.driver" title="执行任务的驾驶员">
                </div>                                                 
                <div class="col-lg form-inline">
                  <label for="inputEquipment">车辆:</label>
                  <input id="inputEquipment" type="text" name="equipment" class="form-control" placeholder="选择车辆" v-model="slctdRcdrForChecking.equipment" title="执行任务的车辆">
                </div>
                <div class="col-lg form-inline">
                  <label for="slctPayerInMdf">结算:</label>
                  <select id="slctPayerInMdf" type="text" name="payer" class="form-control" placeholder="结算人" v-model="slctdRcdrForChecking.payer" title="实际结算人" >
                    <option v-for="booker in customers">{{booker.mix_name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label for="inputMdfSalePrice">售价:</label>
                  <input id="inputMdfSalePrice" type="number" name="salePrice" class="form-control" placeholder="结算价格" v-model="slctdRcdrForChecking.salePrice" title="结算价格">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfParkFee">停车:</label>
                  <input id="inputMdfParkFee" type="number" name="park_fee" class="form-control" placeholder="停车费" v-model="slctdRcdrForChecking.park_fee" title="停车费">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfSurcharge">垫付:</label>
                  <input id="inputMdfSurcharge" type="number" name="surcharge" class="form-control" placeholder="垫付费用" v-model="slctdRcdrForChecking.surcharge" title="代垫费用">
                </div>
              </div>    
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label for="slctRulePriceInMdf">计价:</label>
                  <select id="slctRulePriceInMdf" type="text" name="rulePrice" class="form-control" placeholder="计价器" v-model="slctdRcdrForChecking.rulePrice" title="选择此客户适用的计价器" >
                    <option v-for="rule in rulesPriceForTheClient">{{rule.name}}</option>}
                  </select>
                </div>                
                <div class="col-lg form-inline">
                  <label for="inputMdfMem">备注:</label>
                  <input id="inputMdfMem" type="text" name="mem" class="form-control" placeholder="备注信息" v-model="slctdRcdrForChecking.mem" title="备注信息">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfUseageOfSurcharge">说明:</label>
                  <input id="inputMdfUseageOfSurcharge" type="text" name="usage_surcharge" class="form-control" placeholder="垫付用途说明" v-model="slctdRcdrForChecking.usage_surcharge" title="垫付用途说明">
                </div>                                  
              </div>    
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button class="btn btn-primary saveBtn" @click="saveModifyedRcdr">保存</button>  
          </div>
        </div>
      </div>
    </div>      
  </div>
</template>

<script>
import datepicker from 'vue2-datepicker';
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
  export default {
    data () {
      return {
        queryContent:{
          keyWord:'',
          dateRange:[],
        },      	
        slctdRcdrForChecking: {
          id:'',
          prjct:'',
          booker:'',
          product:'',
          startTime:'',
          endTime:'', 
          mileage:0,         
          startPoint:'',
          endPoint:'',
          msg_to_driver:'',
          driver:'',
          equipment:'',          
          salePrice:0,
          park_fee:0,
          surcharge:0,
          usage_surcharge:'',
          payer:'',
          mem:'',
          rulePrice:'Not Given'
        },
        projects:[],
        customers:[],
        namesOfPrdctInSelect:[],
        rulesPriceAll:[],
        rulesPriceForTheClient:[],
        shortcuts:false,
        rcdrSetFromDBSForModifying:[],
        recordersTitle:[],
        widthOfTH:[15,90,130,100,120,120,60,80,80,80,70,70,60,60,60,90,30,60]
      }
    },
    components: {
     datepicker
    },    
    methods: {
      getRcdrsForModifying() {
        if(this.rcdrSetFromDBSForModifying.length>0) {
          this.rcdrSetFromDBSForModifying=[];
          this.recordersTitle=[];
        }
        if(this.queryContent.dateRange.length<2){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getRcdrsFromOrdersToVerify.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(response.data.length<1) {
              _this.$toast({
                 text: '没有符合条件的待核单记录',
                 type: 'info',
                  duration: 2000
              });
              return;
          } 
          var ttl='';
          for(ttl in response.data[0]) {
            _this.recordersTitle.push(ttl);
          }
          _this.rcdrSetFromDBSForModifying = response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      },
      clearRcdrsInModifyer() {
        this.recordersTitle=[];
        this.rcdrSetFromDBSForModifying=[];
      },
      clickedARecorderToModify:function (dataRow) {
        this.slctdRcdrForChecking.id=dataRow.ID;
        this.slctdRcdrForChecking.prjct=dataRow.项目;
        this.slctdRcdrForChecking.booker=dataRow.订车人;
        this.slctdRcdrForChecking.product=dataRow.产品;
        this.slctdRcdrForChecking.startTime=dataRow.开始时间;
        this.slctdRcdrForChecking.endTime=dataRow.结束时间;
        this.slctdRcdrForChecking.mileage=dataRow.里程;
        this.slctdRcdrForChecking.startPoint=dataRow.起点;
        this.slctdRcdrForChecking.endPoint=dataRow.终点;
        this.slctdRcdrForChecking.msg_to_driver=dataRow.通知信息;
        this.slctdRcdrForChecking.driver=dataRow.司机;
        this.slctdRcdrForChecking.equipment=dataRow.车辆;
        this.slctdRcdrForChecking.salePrice=dataRow.金额;
        this.slctdRcdrForChecking.park_fee=dataRow.停车;
        this.slctdRcdrForChecking.surcharge=dataRow.垫付;
        this.slctdRcdrForChecking.usage_surcharge=dataRow.垫付说明;
        this.slctdRcdrForChecking.mem=dataRow.备注;
        this.slctdRcdrForChecking.payer=this.slctdRcdrForChecking.booker;
        this.slctdRcdrForChecking.rulePrice='Not Given';
        this.clonedRecorder=JSON.parse(JSON.stringify(this.slctdRcdrForChecking));
        $('#mdfRecorder').modal('toggle');
        // this.$refs.mdfRecorder.modal('toggle');
      },      
      saveModifyedRcdr:function() {
        var allowSpaceProps=['msg_to_driver','park_fee','surcharge','usage_surcharge','mem'];
        var en_zhTranslate={
          prjct:'项目',
          booker:'用户',
          product:'产品',
          startTime:'开始',
          endTime:'结束',
          startPoint:'起点',
          endPoint:'终点',
          driver:'司机',
          equipment:'车辆',
          salePrice:'售价',
          payer:'结算',
          rulePrice:'计价',
          mileage:'里程'
        };
        // if(JSON.stringify(this.clonedRecorder)===JSON.stringify(this.slctdRcdrForChecking)) {
        //   this.$toast({
        //      text: '没有改动',
        //      type: 'warning',
        //       duration: 500
        //   });
        // }        
        for(var prop in this.slctdRcdrForChecking){
          if((this.slctdRcdrForChecking[prop]=='' ||this.slctdRcdrForChecking[prop]=='0.00') && !allowSpaceProps.includes(prop)){
            this.$toast({
               text: en_zhTranslate[prop]+' 是必填项,不允许为0或空格!',
               type: 'danger',
                duration: 2000
            });
          return;
          //this.slctdRcdrForChecking.rulePrice=='Not Given' || 
          } else if(this.slctdRcdrForChecking.rulePrice=='' || this.slctdRcdrForChecking.rulePrice=='undefined'){
            this.$toast({
              text: '请选择计价!',
              type: 'danger',
               duration: 2000
            });
            return;
            } else if((this.slctdRcdrForChecking.surcharge>0 && this.slctdRcdrForChecking.usage_surcharge.length<2) || (this.slctdRcdrForChecking.surcharge<=0 && this.slctdRcdrForChecking.usage_surcharge.length>2)){
              this.$toast({
                 text: '垫付和说明不匹配!',
                 type: 'danger',
                  duration: 2000
              });
              return;
          }
        }
        //转换日期格式
        this.slctdRcdrForChecking.endTime=(new Date(this.slctdRcdrForChecking.endTime));
        this.slctdRcdrForChecking.startTime=(new Date(this.slctdRcdrForChecking.startTime));
        //保存到数据库
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateTblOrders.php',
          data: qs.stringify(_this.slctdRcdrForChecking)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                  duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            //从列表中移除
            _this.rcdrSetFromDBSForModifying.forEach(function(item, index, arr) {
              if(item.ID == _this.slctdRcdrForChecking.id) {
                arr.splice(index, 1);
              }
            });  
          } else {
console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger!',
                duration: 4000
            });
            $('#mdfRecorder').modal('toggle');                
          } 
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
          $('#mdfRecorder').modal('toggle');
        });
      },
      deleteItem:function(e) {
        this.rcdrSetFromDBSForModifying.forEach(function(item, index, arr) {
          if(item.ID === e.toElement.parentElement.parentElement.children[0].innerHTML) {
              arr.splice(index, 1);
          }
        });                
      }          	
    },
    watch: {
      'slctdRcdrForChecking.rulePrice': {
        handler: function() {
          if(this.slctdRcdrForChecking.rulePrice==='Not Given') {//防止影响到后续操作
            return;
          }
          var _this=this;
          var countMissMeal=0;
          this.rulesPriceAll.forEach(function(item, index, arr) {
            //item:数组的当前元素,这里是一个对象
            //index:当前索引号
            //arr:数组对象本身
            if(_this.slctdRcdrForChecking.rulePrice===item.name) {
              //获取用车时长
              var sttTm=new Date(_this.slctdRcdrForChecking.startTime);
              var ndTm=new Date(_this.slctdRcdrForChecking.endTime);
              var rentDuration=(ndTm-sttTm)/1000/60;
              var overtime=rentDuration-item.duration_basic*60;//分钟
              overtime=overtime>0?overtime:0;
              var overtimeFee=(overtime/60*item.price_extra_duration).toFixed(2);
              var thatDate=sttTm.getFullYear()+'-'+(sttTm.getMonth()+1)+'-'+sttTm.getDate();
              var clock11OnThatDate=new Date(thatDate+' 11:00:00');
              var clock17OnThatDate=new Date(thatDate+' 17:00:00');
              //是否误餐
              //午餐
              if(sttTm<=clock11OnThatDate) {
                countMissMeal=(ndTm-clock11OnThatDate)/1000/3600>=1?countMissMeal+1:countMissMeal;
              }
              //晚餐
              if(sttTm<=clock17OnThatDate) {
                countMissMeal=(ndTm-clock17OnThatDate)/1000/3600>=1?countMissMeal+1:countMissMeal;
              }
              var missMealFee=parseFloat(item.miss_meal_fee)*countMissMeal;
              //超里程费
              var overMileage=_this.slctdRcdrForChecking.mileage-item.scale_basic;
              overMileage=(overMileage>0?overMileage:0).toFixed(2);
              var overMileageFee=(item.price_extra_mileage*overMileage).toFixed(2);
              //更改当前订单的价格
              _this.slctdRcdrForChecking.salePrice=(parseFloat(item.price_basic)+ parseFloat(overtimeFee)+parseFloat(overMileageFee)+parseFloat(missMealFee)).toFixed(2);
            }
          })
        }
      },
      'slctdRcdrForChecking.booker': {
        handler: function() {
          this.slctdRcdrForChecking.payer=this.slctdRcdrForChecking.booker;
          this.rulesPriceForTheClient=[];
          var notGivenRulePrice = {
            duration_basic: 0,
            id: 0,
            id_creater: 1,
            id_for_ognztn:7,
            id_modifyer: null,
            id_product_for: 0,
            miss_meal_fee: 0,
            name: "Not Given",
            other:'',
            price_basic: 0,
            price_extra_duration:0,
            price_extra_mileage:0,
            scale_basic: 0,
            usable: 1 
          };
          for(var j=0;j<this.customers.length;j++) {
            if(this.slctdRcdrForChecking.booker===this.customers[j]['mix_name']) {
              notGivenRulePrice.id_for_ognztn=this.customers[j]['id_prnt'];
              for(var i=0;i<this.rulesPriceAll.length;i++) {
                if(this.rulesPriceAll[i]['id_for_ognztn']===this.customers[j]['id_prnt']) {
                  this.rulesPriceForTheClient.push(this.rulesPriceAll[i]);
                }
              }
              if(this.rulesPriceForTheClient.length<1) {
                this.rulesPriceForTheClient[0]=notGivenRulePrice;
              } else {
                this.rulesPriceForTheClient.push(notGivenRulePrice);                
              }
            }
          }
        }
      },

    },
    beforeCreate:function() { 
      var _this = this;

      //初始化项目的option
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
      this.customers=[];
      this.$axios({
            method: 'post',
            url: 'getCntctrOgnztn.php'
        }).then(function (response) {
// console.log(response.data);
// return;
          _this.customers=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      this.namesOfPrdctInSelect=[];
      this.$axios({
            method: 'post',
            url: 'getProduct.php'
        })
        .then(function (response) {
          _this.namesOfPrdctInSelect=response.data;

        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger!',
              duration: 4000
          });
        });
      this.rulesPriceAll=[];
      this.$axios({
            method: 'post',
            url: 'getRulesPrice.php'
        })
        .then(function (response) {
          _this.rulesPriceAll=response.data;
        })
        .catch(function (error) {
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

.clearBtn {
	margin-right: 20px;
}
.saveBtn, .clearBtn {
	width: 100px;
}
table {
  overflow: auto;
  font-size: 12px;
}
.query-body button {
  margin-right: 10px;
}
.mx-input-wrapper {
  width: 100%;
}
#mdfRecorder input,#mdfRecorder select {
  width:80%;
}
#mdfRecorder .row {
  margin-bottom: 5px;
}
.table table-hover {
  font-size: 12px;
}
.datepicker {
  margin-left: 10px;
}
#btnSearch {
  margin-left: 10px;
}
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
.tipFormdfRecorder {
  color: red;
}
h5 {
  color: #007bff;
}
</style>
