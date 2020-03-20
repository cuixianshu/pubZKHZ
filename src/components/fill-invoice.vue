<template>
  <div class="father">
    <h5>当前位置:发票业务/填开发票</h5>
    <div class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="queryConditions">关键词:</label>
        <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="用车人,单位,项目等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="申请开票时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="申请开票的时间范围"></datepicker> 
        <button class="btn btn-primary" @click="getRecordersFromDBSToFillInvoice">🔍获取数据</button>

      </div>
      <div class="listOfSelectedRecorders" v-if="rcdrsSetFromDBSForFilling.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in headerOfList" @click="allCheckboxClicked" :width="widthOfTH[index]">{{title}}</th>
            <th><input class="checkbox" type="checkbox" @click="allCheckboxClicked" v-model="allFillCheckbox"></th>

          </thead>
          <tbody @click="aRowInListClicked">
            <tr v-for="row,index in rcdrsSetFromDBSForFilling">

              <td v-for="vlu in row" :title="vlu">{{vlu}}</td>
              <td><input class="checkbox" type="checkbox"  name="selecter" v-model="listOfCheckboxStatement[index]" @click="checkboxClickedInList"></td>

            </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons">
      	<button class="btn btn-secondary" @click="clearData" v-if="rcdrsSetFromDBSForFilling.length>0">清空</button>
        <button class="btn btn-primary" v-if="rcdrsSetFromDBSForFilling.length>0" @click="createFillingInvoice">填开发票</button>
      </div>        
    </div>
    <div class="modal fade" id="invoiceFiller" role="dialog" aria-labelledby="invoiceFiller" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>发票填开-----已选中记录的合计金额：￥{{amountOfSelectedRcdrs}}</span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
            <div class="showSelectedList">
              <table class="tblForSelectedList">
                <thead>
                  <th v-for="title,index in headerOfList" :width="widthOfTH[index]">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in listOfSelectedRecorders">
                    <td v-for="vlu in row">{{vlu}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr>
            <div id="detailsForFilling" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputOurCmpnyName">出票</label>
                  <input id="inputOurCmpnyName" type="text" name="nameOfOurCmpny" class="form-control" placeholder="出票公司名称" v-model="detailsOfFilling.nameOfOurCmpny" title="出具发票的公司名称" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputInvoiceType">类型</label>
                  <input id="inputInvoiceType" type="text" class="form-control" name="typeOfInvoice" v-model="detailsOfFilling.type" placeholder="需要的发票类型" title="发票类型" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputCstmrOgnztnName">抬头</label>
                  <input id="inputCstmrOgnztnName" type="text" class="form-control" name="cstmrOgnztnName" v-model="detailsOfFilling.cstmrOgnztnName" placeholder="发票中的单位名称" title="单位名称抬头" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputInvoicePrjct">商品</label>
                  <input id="inputInvoicePrjct" type="text" class="form-control" name="nameOfGoods" v-model="detailsOfFilling.nameOfGoods" title="商品或服务名称,不超过16个字" placeholder="发票中的商品或服务名称,不超过16个字" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputInvoiceAmount">金额</label>
                  <input id="inputInvoiceAmount" type="number" class="form-control" name="amount" v-model="detailsOfFilling.amount" title="开票金额" placeholder="开票金额" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputMem">备注</label>
                  <input id="inputMem" type="text" class="form-control" name="memInRqst" v-model="detailsOfFilling.memInRqst" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字" readonly>
                </div>
              </div>
              <hr class="hr">
              <div class="row">
              	<div class="col-lg  form-inline">
                  <label for="inputNumberOfInvoice">号码</label>
                  <input id="inputNumberOfInvoice" type="text" class="form-control" name="numberOfInvoice" v-model="detailsOfFilling.numberOfInvoice" title="发票号码,不少于8且不超过128个字" placeholder="发票号码,不少于8且不超过128个字">
                </div>
              	<div class="col-lg  form-inline">
                  <label for="inputImageOfInvoice">凭证</label>
                  <input id="inputImageOfInvoice" type="text" class="form-control" name="imageOfInvoice" v-model="detailsOfFilling.imageOfInvoice" title="凭证图片,2M" placeholder="凭证图片,2M">
                </div>                
              	<div class="col-lg  form-inline">
                  <label for="inputMemForFilling">备注</label>
                  <input id="inputMemForFilling" type="text" class="form-control" name="memForFilling" v-model="detailsOfFilling.memForFilling" title="开票备注,不超过64个字" placeholder="开票备注,不超过64个字">
                </div>                
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
              <button type="button" id="btnSaveFilledData" @click="saveFilledInvoiceData" class="btn btn-primary">保存数据</button>
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
  	data() {
  	  return {
        rcdrsSetFromDBSForFilling:[],
        headerOfList:[],
        allFillCheckbox:false,
        listOfCheckboxStatement:[],
        listOfSelectedRecorders:[],
        amountOfSelectedRcdrs:0,
        detailsOfFilling: {
          nameOfOurCmpny:'',
          idOfOurCmpny:0,
          type:'普票增值税',
          cstmrOgnztnName:'',
          idOfCstmrOgnztn:0,
          nameOfGoods:'',
          amount:0,
          memInRqst:'',
          listOfIDS:[],
          numberOfInvoice:'',
          memForFilling:'',
          imageOfInvoice:'',
          idOfFiller:1
        },
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
        },
        widthOfTH:['3%','6%','7%','9%','11%','8%','13%','7%','6%','6%','12%','8%','4'],
        listOfOurCompany:[],
        listOfInvoiceType:[],
        listOfCustomerOgnztn:[],
        listOfCstmrOgnztnFullName:[],
        clonedDetailsOfFilling:''
  	  }	
  	},
    components: {
     datepicker
    },    
    methods: {
      aRowInListClicked:function(e) {
        
        if(e.toElement.parentElement.children[e.toElement.parentElement.children.length-1].children[0].checked!=undefined || e.toElement.parentElement.children[e.toElement.parentElement.children.length-1].children[0].checked!=null) {
          var rowIndex;
          e.toElement.parentElement.children[e.toElement.parentElement.children.length-1].children[0].checked=!e.toElement.parentElement.children[e.toElement.parentElement.children.length-1].children[0].checked;
          rowIndex=e.toElement.parentElement.rowIndex;
          this.listOfCheckboxStatement[rowIndex]=e.toElement.parentElement.children[e.toElement.parentElement.children.length-1].children[0].checked;
          this.changeAllCheckboxStatus("requesting");
        }
      },
      getRecordersFromDBSToFillInvoice:function() {
        if(this.detailsOfFilling.nameOfOurCmpny==='' && this.detailsOfFilling.cstmrOgnztnName==='' && this.detailsOfFilling.amount===0){this.clonedDetailsOfFilling=JSON.stringify(this.detailsOfFilling);
          
        }
        this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);
        this.allFillCheckbox=false;
        if(this.rcdrsSetFromDBSForFilling.length>0) {
          this.rcdrsSetFromDBSForFilling=[];
          this.listOfCheckboxStatement=[];
        }
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
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
            url: 'getListFromRequestInvoiceWithoutInvoice.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(_this.queryContent);
// console.log(response.data);
// return;
        	if(response.data.length>0){
              _this.rcdrsSetFromDBSForFilling = response.data;
              _this.listOfCheckboxStatement = new Array(response.data.length).fill(false);
	          if(_this.headerOfList.length>0) {
                _this.headerOfList=[];
	          }
	          for(var title in response.data[0]) {
	            _this.headerOfList.push(title);
	          }
             _this.headerOfList[0]="申请ID";          		
        	} else {
	          _this.$toast({
	            text: "没有记录符合搜索条件",
	            type: 'info',
	            duration: 1000
	          });        		
        	}
          }).catch(function (error) {
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
                duration: 4000
            });
            console.log(error);
          });
      },
      checkboxClickedInList(e) {
        //阻止冒泡事件 
        e.stopImmediatePropagation();
        var rowIndex;
        rowIndex=e.target.parentElement.parentElement.rowIndex;
        this.listOfCheckboxStatement[rowIndex]=!this.listOfCheckboxStatement[rowIndex];
        this.changeAllCheckboxStatus("requesting");
      },
      createFillingInvoice() {
        if(this.listOfSelectedRecorders.length>0) {
          this.listOfSelectedRecorders=[];
          this.amountOfSelectedRcdrs=0;
        }
        for(var index=0;index<this.listOfCheckboxStatement.length;index++) {
          if(this.listOfCheckboxStatement[index]){
            this.listOfSelectedRecorders.push(this.rcdrsSetFromDBSForFilling[index]);
            var tmpAmount=(this.rcdrsSetFromDBSForFilling[index]['金额'])?this.rcdrsSetFromDBSForFilling[index]['金额']:0;
            this.amountOfSelectedRcdrs=parseFloat(this.amountOfSelectedRcdrs)+parseFloat(tmpAmount);
          }
        }
        if(this.listOfSelectedRecorders.length<1) {
          this.$toast({
            text: "请勾选至少一条记录!",
            type: 'info',
            duration: 2000
            });
          return;
        }

        this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);
        
        if(this.listOfSelectedRecorders.length>0){
            for(var index=0;index<this.listOfSelectedRecorders.length;index++) {
              if(this.listOfSelectedRecorders[0]['发票抬头']!==this.listOfSelectedRecorders[index]['发票抬头']){
                this.$toast({
                  text: "您所选记录中的发票抬头不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              if(this.listOfSelectedRecorders[0]['出票单位']!==this.listOfSelectedRecorders[index]['出票单位']){
                this.$toast({
                  text: "您所选记录中的出票公司不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              if(this.listOfSelectedRecorders[0]['发票类型']!==this.listOfSelectedRecorders[index]['发票类型']){
                this.$toast({
                  text: "您所选记录中的发票类型不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
/*
              if(this.listOfSelectedRecorders[0]['商品名称']!==this.listOfSelectedRecorders[index]['商品名称']){
                this.$toast({
                  text: "您所选记录中的商品名称不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
*/              
              if(this.listOfSelectedRecorders[0]['申请人']!==this.listOfSelectedRecorders[index]['申请人']){
                this.$toast({
                  text: "您所选记录中的申请人不一致！",
                  type: 'danger',
                  duration: 2000
                });
                return;            
              }
              this.detailsOfFilling.listOfIDS.push(this.listOfSelectedRecorders[index]['ID']);
	        }        	
        }

        this.detailsOfFilling.cstmrOgnztnName=this.listOfSelectedRecorders[0]['发票抬头'];
        this.detailsOfFilling.nameOfOurCmpny=this.listOfSelectedRecorders[0]['出票公司'];
        this.detailsOfFilling.nameOfGoods=this.listOfSelectedRecorders[0]['商品名称'];
        this.detailsOfFilling.memInRqst=this.listOfSelectedRecorders[0]['备注'];
        this.detailsOfFilling.amount=this.amountOfSelectedRcdrs;

        $('#invoiceFiller').modal('toggle');
      },
      allCheckboxClicked() {
        this.allFillCheckbox=!this.allFillCheckbox;
        //数据更新后更新DOM
        this.$nextTick(()=> {
          this.listOfCheckboxStatement = new Array(this.rcdrsSetFromDBSForFilling.length).fill(this.allFillCheckbox);
        });
      },
      changeAllCheckboxStatus(strMode) {
        if(strMode=="requesting") {
          for(var i=0;i<this.listOfCheckboxStatement.length;i++) {
            if(!this.listOfCheckboxStatement[i]) {
              this.allFillCheckbox=false;
              break;
            }
            else {
              if(i===this.listOfCheckboxStatement.length-1) {
                this.allFillCheckbox=true;
              }
            }
          }          
        }
        //  else {
        //   var i;
        //   for(i=0;i<this.markedListForFilling.length;i++) {
        //     if(!this.markedListForFilling[i]) {
        //       this.allFillCheckbox=false;
        //       break;
        //     }
        //     else {
        //       if(i===this.markedListForFilling.length-1) {
        //         this.allFillCheckbox=true;
        //       }
        //     }
        //   }               
        // }
      },
      saveFilledInvoiceData() {
//检查数据是否合法
        if(!this.detailsOfFilling.numberOfInvoice || this.detailsOfFilling.numberOfInvoice.length<8) {
            this.$toast({
              text: "发票号码不符合要求!不少于8且不超过128个字。",
              type: 'danger',
              duration: 1500
            });
            return;        	
        }
/*        
        if(!this.detailsOfFilling.nameOfOurCmpny) {
            this.$toast({
              text: "请选择出票单位!",
              type: 'danger',
              duration: 1500
            });
            return;        	
        } 
        if(!this.detailsOfFilling.nameOfGoods || this.detailsOfFilling.nameOfGoods.length>16 || this.detailsOfFilling.nameOfGoods.length<2) {
            this.$toast({
              text: "商品名称不符合要求!",
              type: 'danger',
              duration: 3000
            });
            return;            
        }
        if(!this.detailsOfFilling.amount || this.detailsOfFilling.amount<=0) {
            this.$toast({
              text: "金额这么少,不开票了吧,不够麻烦的!",
              type: 'danger',
              duration: 3000
            });
            return;       
        }
*/               
//获取出票公司ID  idOfOurCmpny
        var idOfOurCmpnyInvoice=0;
        for(var index=0;index<this.listOfOurCompany.length;index++){
        	if(this.detailsOfFilling.nameOfOurCmpny===this.listOfOurCompany[index]['name']) {
        	  this.detailsOfFilling.idOfOurCmpny=this.listOfOurCompany[index]['id'];
        	  break;
        	}
        }
//获取发票抬头Ognztn的ID  idOfCstmrOgnztn
        for(var index=0;index<this.listOfCustomerOgnztn.length;index++){
        	if(this.detailsOfFilling.cstmrOgnztnName===this.listOfCustomerOgnztn[index]['full_name']) {
        	  this.detailsOfFilling.idOfCstmrOgnztn=this.listOfCustomerOgnztn[index]['id'];
        	  break;
        	}
        }
//获取发票类型在数组中的索引值,作为detailsOfFilling.type的值
        for(var index=0;index<this.listOfInvoiceType.length;index++) {
          if(this.detailsOfFilling.type===this.listOfInvoiceType[index]['name']) {
            this.detailsOfFilling.type=this.listOfInvoiceType[index]['id'];
          }
        }
//将数据保存到数据库,用mySQL事务进行
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'saveFillInvoiceData.php',
        data: qs.stringify(_this.detailsOfFilling)
        }).then(function (response) {
            $('#invoiceFiller').modal('toggle');
console.log(response.data);
// return;

            //从未开票的申请列表中清除已经开票的记录.includes
            for(var index=0;index<_this.rcdrsSetFromDBSForFilling.length;index++) {
              if(_this.detailsOfFilling.listOfIDS.includes(_this.rcdrsSetFromDBSForFilling[index]['ID'])) {
                  _this.rcdrsSetFromDBSForFilling.splice(index, 1);
                  index--;
              }               
            }
            if(_this.rcdrsSetFromDBSForFilling.length>0) {
	            _this.listOfCheckboxStatement = new Array(_this.rcdrsSetFromDBSForFilling.length).fill(false);
            } else {
            	_this.headerOfList=[];
            }
            _this.detailsOfFilling=JSON.parse(_this.clonedDetailsOfFilling);
            _this.allFillCheckbox=false;
            _this.listOfSelectedRecorders=[];
            _this.amountOfSelectedRcdrs=0;
console.log(response.data);
            _this.$toast({
              text: "开票信息已保存",
              type: 'success',
              duration: 1000
            });
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      },
      clearData () {
      	this.rcdrsSetFromDBSForFilling=[];
      	this.headerOfList=[];
      	this.listOfSelectedRecorders=[];
      	this.listOfCheckboxStatement=[];
      	this.allFillCheckbox=false;
      	this.detailsOfFilling=JSON.parse(this.clonedDetailsOfFilling);
      }                                          
    },
    beforeCreate:function() {
      var _this = this;
      this.listOfOurCompany=[];
      this.$axios({
        method: 'post',
        url: 'getListOfOurCompanys.php'
        }).then(function (response) {
          _this.listOfOurCompany=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      this.listOfInvoiceType=[];
      this.$axios({
        method: 'post',
        url: 'getListOfTypeOfInvoice.php'
        }).then(function (response) {
          _this.listOfInvoiceType=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });      
      this.listOfCustomerOgnztn=[];
      var queryContent={keyWord:''};
      this.$axios({
            method: 'post',
            url: 'getClntPrntOgnztn.php',
            data:qs.stringify(queryContent)
        })
        .then(function (response) {
          _this.listOfCustomerOgnztn=response.data;
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
.buttons {
  text-align:right;
  margin-right:50px;
}
.buttons button {
  width: 120px;
}
#searchConditions > * {
  margin:5px 5px;
}
.row {
  margin: 5px;
}
#searchConditions input {
  width: 180px;
}
datepicker {
  margin-left: 10px;	
}
table {
  overflow: auto;
  font-size: 15px;
  text-align: left;
}
td {
    overflow:hidden; 
    white-space:nowrap; 
    text-overflow:ellipsis;
    max-width: 50px;
}
#detailsForFilling input {
  width: 80%;
}
#detailsForFilling select {
  width: 80%;
}
#detailsForFilling table {
  font-size: 12px;
}

input[type=checkbox] {
  -ms-transform: scale(1.3); /* IE */
  -moz-transform: scale(1.3); /* FireFox */
  -webkit-transform: scale(1.3); /* Safari and Chrome */
  -o-transform: scale(1.3); /* Opera */
}
.modal-footer button {
	width: 120px;
}
#searchConditions button {
  width: 120px;
}
.hr {
   border:1px solid red
}
h5 {
  color: #007bff;
}

</style>

