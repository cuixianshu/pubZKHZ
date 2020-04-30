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
            <th v-for="(title,index) in titleOfTable" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in rcdrSetFromDBSForModifying" @click="clickedARow(row)">
              <td :title='row.id'>{{row.id}}</td>
              <td :title='row.cstmr_ognz'>{{row.cstmr_ognz}}</td>
              <td :title='row.id_contacter'>{{row.id_contacter}}</td>
              <td :title='row.id_prjct_belongto'>{{row.id_prjct_belongto}}</td>
              <td :title='row.id_product'>{{row.id_product}}</td>
              <td :title='row.start_time'>{{row.start_time}}</td>
              <td :title='row.end_time'>{{row.end_time}}</td>
              <td :title='row.start_point'>{{row.start_point}}</td>
              <td :title='row.end_point'>{{row.end_point}}</td>
              <td :title='row.id_operater'>{{row.id_operater}}</td>
              <td :title='row.id_equipment'>{{row.id_equipment}}</td>
              <td :title='row.mileage'>{{row.mileage}}</td>
              <td :title='row.park_fee'>{{row.park_fee}}</td>
              <td :title='row.surcharge'>{{row.surcharge}}</td>
              <td :title='row.use_surcharge'>{{row.use_surcharge}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="selectUseageLabel" data-backdrop="static" data-keyboard: false ref="mdfRecorder">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipFormdfRecorder">订单号:{{slctdOrderForChecking.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="slctMdfProject">项目:</label>
                  <select id="slctMdfProject" type="text" name="prjct" class="form-control" placeholder="所属项目" v-model="slctdOrderForChecking.id_prjct_belongto" title="项目名称" >
                    <option v-for="proj in projects" :value="proj.id">{{proj.prjct}}</option>}
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="slctMdfBooker">用户:</label>
                  <select id="slctMdfBooker" type="text" name="booker" class="form-control" placeholder="用户名称" v-model="slctdOrderForChecking.id_contacter" title="用户名称" disabled>
                    <option v-for="bkr in customers" :value="bkr.id">{{bkr.mix_name}}</option>}
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="slctMdfNameOfPrdct">产品:</label>
                    <select id="slctMdfNameOfPrdct" type="text" name="product" class="form-control" placeholder="产品名称" v-model="slctdOrderForChecking.id_product" title="产品名称" disabled>
                      <option v-for="item in products" :value="item.id">{{item.name}}</option>
                    </select>            
                </div>
              </div>
              <div class="row">                  
                <div class="col-lg form-inline">
                  <label for="dtpkrMdfstartTime">开始:</label>
                  <input  class="form-control" id="dtpkrMdfStartTime" v-model="slctdOrderForChecking.start_time" type="datetime" title="开始时间" name="start_time" disabled>
                </div>
                <div id="endTimeForMdf" class="col-lg form-inline">
                  <label for="dtpkrMdfendTime">结束:</label>
                  <input  class="form-control" id="dtpkrMdfEndTime" v-model="slctdOrderForChecking.end_time" type="datetime" title="结束时间" name="endTime">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfNumOfMileage">里程:</label>
                  <input id="inputMdfNumOfMileage" type="number" name="mileage" class="form-control" placeholder="行驶里程" v-model="slctdOrderForChecking.mileage" title="实际行驶里程">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inptMdfstartPoint">起点:</label>
                  <input id="inptMdfstartPoint" type="text" name="startPoint" class="form-control" placeholder="出发地点" v-model="slctdOrderForChecking.start_point" title="预计出发地点">
                </div>
                <div class="col-lg form-inline">
                  <label for="inptMdfendPoint">终点:</label>
                  <input id="inptMdfendPoint" type="text" name="endPoint" class="form-control" placeholder="终到地点" v-model="slctdOrderForChecking.end_point" title="计划结束地点">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMsgToDriver">发送:</label>
                  <input id="inputMsgToDriver" type="text" name="msgForDriver" class="form-control" placeholder="通知信息" v-model="slctdOrderForChecking.msg_for_driver" title="发送给司机的信息">
                </div>
              </div>
              <div class="row">                                                       
                <div class="col-lg form-inline">
                  <label for="inputDriver">司机:</label>
                  <select id="driver" type="text" name="driver" class="form-control" placeholder="选择司机" v-model="slctdOrderForChecking.id_operater" title="执行任务的司机" disabled>
                    <option v-for="item in employees" :value="item.id">{{item.name}}</option>}
                  </select>                   
                </div>                                                 
                <div class="col-lg form-inline">
                  <label for="inputEquipment">车辆:</label>
                  <select id="slctPayerInMdf" type="text" name="equipment" class="form-control" placeholder="选择车辆" v-model="slctdOrderForChecking.id_equipment" title="执行任务的车辆" disabled>
                    <option v-for="item in equipments" :value="item.id">{{item.alias}}</option>}
                  </select>                  
                </div>
                <div class="col-lg form-inline">
                  <label for="slctPayerInMdf">结算:</label>
                  <select id="slctPayerInMdf" type="text" name="payer" class="form-control" placeholder="结算人" v-model="slctdOrderForChecking.id_payer" title="实际结算人" >
                    <option v-for="booker in customers" :value="booker.id">{{booker.mix_name}}</option>}
                  </select>
                </div>
              </div>
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label for="inputMdfSalePrice">金额:</label>
                  <input id="inputMdfSalePrice" type="number" name="SalePrice" class="form-control" placeholder="订单金额" v-model="slctdOrderForChecking.actual_price" title="订单金额">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfParkFee">停车:</label>
                  <input id="inputMdfParkFee" type="number" name="parkFee" class="form-control" placeholder="停车费" v-model="slctdOrderForChecking.park_fee" title="停车费">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfSurcharge">垫付:</label>
                  <input id="inputMdfSurcharge" type="number" name="surcharge" class="form-control" placeholder="垫付费用" v-model="slctdOrderForChecking.surcharge" title="代垫费用">
                </div>
              </div>    
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label for="slctRulePriceInMdf">计价:</label>
                  <select id="slctRulePriceInMdf" type="text" name="rulePrice" class="form-control" placeholder="计价器" v-model="slctdOrderForChecking.id_rule_price" title="选择此客户适用的计价器" >
                    <option v-for="rule in rulesPriceForTheClient" :value="rule.id">{{rule.name}}</option>}
                  </select>
                </div>                
                <div class="col-lg form-inline">
                  <label for="inputMdfMem">备注:</label>
                  <input id="inputMdfMem" type="text" name="mem" class="form-control" placeholder="备注信息" v-model="slctdOrderForChecking.mem" title="备注信息">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputMdfUseageOfSurcharge">说明:</label>
                  <input id="inputMdfUseageOfSurcharge" type="text" name="useSurcharge" class="form-control" placeholder="垫付用途说明" v-model="slctdOrderForChecking.use_surcharge" title="垫付用途说明">
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
        slctdOrderForChecking: {},
        projects:[],
        customers:[],
        products:[],
        rulesPrices:[],
        rulesPriceForTheClient:[],
        shortcuts:false,
        rcdrSetFromDBSForModifying:[],
        titleOfTable:['订单ID','单位','订车人','项目','产品','开始','结束','起点','终点','司机','车辆','里程','停车','垫付','垫付说明'],
        widthOfTH:['4','10','6','10','8','6','6','7','7','6','6','6','6','6','6'],
        equipments:[],
        employees:[]
      }
    },
    components: {
     datepicker
    },    
    methods: {
      getRcdrsForModifying() {
        if(this.rcdrSetFromDBSForModifying.length>0) {
          this.rcdrSetFromDBSForModifying=[];
          // this.titleOfTable=[];
        }
        if(this.queryContent.dateRange.length<2){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }
        this.queryContent.conditions="VehiclesNotChecked"
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getOrders.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
// return;
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的待核单记录',
              type: 'info',
              duration: 2000
            });
            return;
          } 
          // var ttl='';
          // for(ttl in response.data[0]) {
          //   _this.titleOfTable.push(ttl);
          // }
          _this.rcdrSetFromDBSForModifying = response.data;
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });
      },
      clearRcdrsInModifyer() {
        // this.titleOfTable=[];
        this.rcdrSetFromDBSForModifying=[];
      },
      clickedARow:function (dataRow) {
// console.log(dataRow);
        this.slctdOrderForChecking=dataRow;
        this.slctdOrderForChecking.id_payer=this.slctdOrderForChecking.id_contacter;
        this.clonedRecorder=JSON.parse(JSON.stringify(this.slctdOrderForChecking));
        this.rulesPriceForTheClient=[];
        //定义默认显示
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
          if(this.slctdOrderForChecking.id_contacter==this.customers[j]['id']) {
            // notGivenRulePrice.id_for_ognztn=this.customers[j]['id_prnt'];
            for(var i=0;i<this.rulesPrices.length;i++) {
              if(this.rulesPrices[i]['id_for_ognztn']==this.customers[j]['id_prnt']) {
                this.rulesPriceForTheClient.push(this.rulesPrices[i]);
              }
            }
            if(this.rulesPriceForTheClient.length<1) {
              this.rulesPriceForTheClient[0]=notGivenRulePrice;
            } else {
              this.rulesPriceForTheClient.push(notGivenRulePrice);                
            }
          }
        }
        for(var i=0;i<this.customers.length;i++) {
          if(this.slctdOrderForChecking.id_contacter==this.customers[i]['id']) {
            this.slctdOrderForChecking.clntDptmt=this.customers[i]['clnt_dptmt_name'];
          }
        }        
        this.slctdOrderForChecking.id_rule_price=0;
        $('#mdfRecorder').modal('toggle');
      },      
      saveModifyedRcdr:function() {
        var allowSpaceProps=['msg_for_driver','park_fee','surcharge','use_surcharge','mem','cstmr_ognz','id_cashier','id_contract','id_creater','id_fill_invoice','id_request_invoice','id_verifyer','quantity','time_create','time_verify','id_rule_price'];
        var en_zhTranslate={
        actual_price:'售价',
        cstmr_ognz:'客户',
        end_point:'终点',
        end_time:'结束',
        id:'订单ID',
        id_cashier:'收款ID',
        id_contacter:'订车人',
        id_contract:'合同号',
        id_creater:'创建人',
        id_equipment:'车辆',
        id_fill_invoice:'发票号',
        id_operater:'司机',
        id_payer:'结算',
        id_prjct_belongto:'项目',
        id_product:'产品',
        id_request_invoice:'发票申请号',
        id_rule_price:'计价',
        id_verifyer:'复核',
        mem:'备注',
        mileage:'里程',
        msg_for_driver:'信息',
        park_fee:'停车',
        quantity:'数量',
        start_point:'起点',
        start_time:'开始',
        surcharge:'附费',
        time_create:'创建时间',
        time_verify:'核单时间',
        use_surcharge:'说明'

        };
        for(var prop in this.slctdOrderForChecking){
          if((this.slctdOrderForChecking[prop]=='' ||this.slctdOrderForChecking[prop]==0) && !allowSpaceProps.includes(prop)){
            this.$toast({
              text: en_zhTranslate[prop]+' 是必填项,不允许为0或空格!',
              type: 'danger',
              duration: 2000
            });
          return;
          //this.slctdOrderForChecking.rulePrice=='Not Given' || 
          } else if((this.slctdOrderForChecking.surcharge>0 && this.slctdOrderForChecking.use_surcharge.length<2) || (this.slctdOrderForChecking.surcharge<=0 && this.slctdOrderForChecking.use_surcharge.length>2)){
              this.$toast({
                text: '垫付和说明不匹配!',
                type: 'danger',
                duration: 2000
              });
              return;
          }
        }
        var queryContent=this.slctdOrderForChecking;
        queryContent.conditions="WithCheckedData";

        //保存到数据库
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateOrders.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
// console.log(response.data);
          if(response.data===true) {
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
            $('#mdfRecorder').modal('toggle');
            //从列表中移除
            _this.rcdrSetFromDBSForModifying.forEach(function(item, index, arr) {
              if(item.id == _this.slctdOrderForChecking.id) {
                arr.splice(index, 1);
              }
            });  
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
      'slctdOrderForChecking.id_rule_price': {
        handler: function() {
// console.log('rulePrice changed!')
          if(this.slctdOrderForChecking.id_rule_price==7) {//防止影响到后续操作
            return;
          }
          var _this=this;
          var countMissMeal=0;
          this.rulesPrices.forEach(function(item, index, arr) {
            //item:数组的当前元素,这里是一个对象
            //index:当前索引号
            //arr:数组对象本身
            if(_this.slctdOrderForChecking.id_rule_price===item.id) {
              //获取用车时长
              var sttTm=new Date(_this.slctdOrderForChecking.start_time);
              var ndTm=new Date(_this.slctdOrderForChecking.end_time);
// console.log(sttTm);
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
              var overMileage=_this.slctdOrderForChecking.mileage-item.scale_basic;
              overMileage=(overMileage>0?overMileage:0).toFixed(2);
              var overMileageFee=(item.price_extra_mileage*overMileage).toFixed(2);
              //更改当前订单的价格
              _this.slctdOrderForChecking.actual_price=(parseFloat(item.price_basic)+ parseFloat(overtimeFee)+parseFloat(overMileageFee)+parseFloat(missMealFee)).toFixed(2);
            }
          })
        }
      }
    },
    beforeCreate:function() { 
      var _this = this;
      var queryContent={};

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
          type: 'danger',
          duration: 4000
        });
      });
      this.customers=[];
      this.$axios({
            method: 'post',
            url: 'getContacters.php'
        }).then(function (response) {
// console.log(response.data);
// return;
          _this.customers=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.products=[];
      this.$axios({
            method: 'post',
            url: 'getProduct.php'
        })
        .then(function (response) {
          _this.products=response.data;

        })
        .catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.rulesPrices=[];
      this.$axios({
            method: 'post',
            url: 'getRulesPrice.php'
        }).then(function (response) {
          _this.rulesPrices=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.equipments=[];
      queryContent.conditions="All";
      this.$axios({
            method: 'post',
            url: 'getEquipments.php',
            data: qs.stringify(queryContent)
        }).then(function (response) {
          _this.equipments=response.data;
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.employees=[];
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
