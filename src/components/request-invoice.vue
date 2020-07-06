<template>
  <div class="father">
    <h5>当前位置:发票业务/申请发票</h5>
    <div id="requestInvoice" class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="queryConditions">关键词:</label>
        <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="用车人,单位,项目等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="时间区间,默认最近7天" :shortcuts="shortcuts" placeholder="发生业务的时间范围"></datepicker> 
        <button class="btn btn-primary" @click="getOrders">🔍获取数据</button>
      </div>
      <div class="listOfSelectedRecorders pre-scrollable" v-if="rcdrsSetFromDBSForRequesting.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in headerOfList" @click="allCheckboxClicked" :width="widthOfTH[index]">{{title}}</th>
            <th><input class="checkbox" type="checkbox" @click="allCheckboxClicked" v-model="allRequestCheckbox"></th>

          </thead>
          <tbody @click="aRowInListClicked">
            <tr v-for="row,index in rcdrsSetFromDBSForRequesting">
              <td v-for="vlu in row" :title="vlu">{{vlu}}</td>
              <td><input class="checkbox" type="checkbox"  name="selecter" v-model="listOfCheckboxStatement[index]" @click="checkboxClickedInList"></td>

            </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons">
      	<button class="btn btn-secondary" @click="clearData" v-if="rcdrsSetFromDBSForRequesting.length>0">清空</button>
        <button class="btn btn-primary" v-if="rcdrsSetFromDBSForRequesting.length>0" @click="createRequestInvoice">创建申请</button>
      </div>        
    </div>
    <div class="modal fade" id="invoiceRequester" role="dialog" aria-labelledby="invoiceRequester" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>发票申请单-----已选中记录的合计费用：￥{{amountOfSelectedRcdrs}}</span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
            <div class="showSelectedList">
              <table class="tblForSelectedList">
                <thead>
                  <th v-for="title,index in headerOfList" @click="allCheckboxClicked" :width="widthOfTH[index]">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in listOfSelectedRecorders">
                    <td v-for="vlu in row">{{vlu}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr>
            <div id="detailsForRequesting" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputOurCmpnyName">出票</label>
                  <select id="inputOurCmpnyName" type="text" name="nameOfOurCmpny" class="form-control" placeholder="出票公司名称" v-model="detailsOfRequest.nameOfOurCmpny" title="出具发票的公司名称" >
                    <option v-for="cmpny in listOfOurCompany">{{cmpny.name}}</option>
                  </select>                  
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputInvoiceType">类型</label>
                  <select id="inputInvoiceType" type="text" class="form-control" name="typeOfInvoice" v-model="detailsOfRequest.type" placeholder="需要的发票类型" title="发票类型" >
                    <option v-for="item in listOfInvoiceType">{{item.name}}</option>
                  </select> 
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputCstmrOgnztnName">抬头</label>
                  <select id="inputCstmrOgnztnName" type="text" class="form-control" name="cstmrOgnztnName" v-model="detailsOfRequest.cstmrOgnztnName" placeholder="发票中的单位名称" title="单位名称抬头" >
                    <option v-for="item in listOfCustomerOgnztn">{{item.full_name}}</option>
                  </select>                  
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputInvoicePrjct">商品</label>
                  <input id="inputInvoicePrjct" type="text" class="form-control" name="nameOfGoods" v-model="detailsOfRequest.nameOfGoods" title="商品或服务名称,不超过16个字" placeholder="发票中的商品或服务名称,不超过16个字">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputInvoiceAmount">金额</label>
                  <input id="inputInvoiceAmount" type="number" class="form-control" name="amount" v-model="detailsOfRequest.amount" title="开票金额" placeholder="开票金额">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputMem">备注</label>
                  <input id="inputMem" type="text" class="form-control" name="mem" v-model="detailsOfRequest.mem" title="备注信息,不超过64个字" placeholder="备注信息,不超过64个字">
                </div>
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
              <button type="button" id="btnCreateRequest" @click="saveRequestedInvoiceData" class="btn btn-primary">提交申请</button>
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
        rcdrsSetFromDBSForRequesting:[],
        headerOfList:[],
        allRequestCheckbox:false,
        listOfCheckboxStatement:[],
        listOfSelectedRecorders:[],
        amountOfSelectedRcdrs:0,
        detailsOfRequest: {
          nameOfOurCmpny:'',
          idOfOurCmpny:0,
          type:'普票增值税',
          cstmrOgnztnName:'',
          idOfCstmrOgnztn:0,
          nameOfGoods:'',
          amount:0,
          mem:'',
          listOfIDS:[],
          idOfApplyer:this.$store.state.user.id_user
        },
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
        },
        widthOfTH:['5%','12%','12%','10%','13%','9%','6%','8%','8%','6%','6%','5%'],
        listOfOurCompany:[],
        listOfInvoiceType:[],
        listOfCustomerOgnztn:[],
        cloneddetailsOfRequest:''
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
      getOrders:function() {
        if(this.detailsOfRequest.nameOfOurCmpny==='' && this.detailsOfRequest.cstmrOgnztnName==='' && this.detailsOfRequest.amount===0){
          this.cloneddetailsOfRequest=JSON.stringify(this.detailsOfRequest);
        }
        this.detailsOfRequest=JSON.parse(this.cloneddetailsOfRequest);
        this.allRequestCheckbox=false;
        if(this.rcdrsSetFromDBSForRequesting.length>0) {
          this.rcdrsSetFromDBSForRequesting=[];
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
        this.queryContent.conditions="NotRequestedInvoice";        
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getOrders.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
// console.log(response.data);
        	if(response.data.length>0){
              _this.rcdrsSetFromDBSForRequesting = response.data;
              _this.listOfCheckboxStatement = new Array(response.data.length).fill(false);
	          if(_this.headerOfList.length>0) {
                _this.headerOfList=[];
	          }
	          for(var title in response.data[0]) {
	            _this.headerOfList.push(title);
	          }          		
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
      createRequestInvoice() {
        if(this.listOfSelectedRecorders.length>0) {
          this.listOfSelectedRecorders=[];
          this.amountOfSelectedRcdrs=0;
        }
        for(var index=0;index<this.listOfCheckboxStatement.length;index++) {
          if(this.listOfCheckboxStatement[index]){
            this.listOfSelectedRecorders.push(this.rcdrsSetFromDBSForRequesting[index]);
            var tmpAmount=(this.rcdrsSetFromDBSForRequesting[index]['金额'])?this.rcdrsSetFromDBSForRequesting[index]['金额']:0;
            var tmpParkFee=(this.rcdrsSetFromDBSForRequesting[index]['停车'])?this.rcdrsSetFromDBSForRequesting[index]['停车']:0;
            var tmpSurcharge=(this.rcdrsSetFromDBSForRequesting[index]['垫付'])?this.rcdrsSetFromDBSForRequesting[index]['垫付']:0;
            this.amountOfSelectedRcdrs=(parseFloat(this.amountOfSelectedRcdrs)+parseFloat(tmpAmount)+parseFloat(tmpParkFee)+parseFloat(tmpSurcharge)).toFixed(2);
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
/*
          nameOfOurCmpny:'',
          idOfOurCmpny:0,
          type:'普票增值税',
          cstmrOgnztnName:'',
          idOfCstmrOgnztn:0,
          nameOfGoods:'',
          amount:0,
          mem:'',
          listOfIDS:[]
 */



        this.detailsOfRequest=JSON.parse(this.cloneddetailsOfRequest);
        // var firstPosition=this.listOfSelectedRecorders[0]['订车人'].indexOf('@');
        // var secondPosition=this.listOfSelectedRecorders[0]['订车人'].lastIndexOf('@');
        // var tmpNameInInvoice=this.listOfSelectedRecorders[0]['订车人'].substring(firstPosition+1,secondPosition);
        var tmpNameInInvoice=this.listOfSelectedRecorders[0]['订车人'];
        for(var index=0;index<this.listOfSelectedRecorders.length;index++) {
          // firstPosition=this.listOfSelectedRecorders[index]['订车人'].indexOf('@');
          // secondPosition=this.listOfSelectedRecorders[index]['订车人'].lastIndexOf('@');
          if(tmpNameInInvoice!==this.listOfSelectedRecorders[index]['订车人']){
            this.$toast({
              text: "您所选记录中的订车人或部门不一致！",
              type: 'danger',
              duration: 3000
            });
            return;            
          } else {//如果订车单位一致,则保存id
            this.detailsOfRequest.listOfIDS.push(this.listOfSelectedRecorders[index]['ID']);
          }       	
        }
        //获取对应的客户单位全称,以便自动填表
        for(var index=0;index<this.listOfCustomerOgnztn.length;index++) {
          if(tmpNameInInvoice===this.listOfCustomerOgnztn[index]['short_name']){
            this.detailsOfRequest.cstmrOgnztnName=this.listOfCustomerOgnztn[index]['full_name'];
          }
        }
        this.detailsOfRequest.amount=this.amountOfSelectedRcdrs;

        $('#invoiceRequester').modal('toggle');
      },
      allCheckboxClicked() {
        this.allRequestCheckbox=!this.allRequestCheckbox;
        //数据更新后更新DOM
        this.$nextTick(()=> {
          this.listOfCheckboxStatement = new Array(this.rcdrsSetFromDBSForRequesting.length).fill(this.allRequestCheckbox);
        });
      },
      changeAllCheckboxStatus(strMode) {
        if(strMode=="requesting") {
          for(var i=0;i<this.listOfCheckboxStatement.length;i++) {
            if(!this.listOfCheckboxStatement[i]) {
              this.allRequestCheckbox=false;
              break;
            }
            else {
              if(i===this.listOfCheckboxStatement.length-1) {
                this.allRequestCheckbox=true;
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
      saveRequestedInvoiceData() {
//检查数据是否合法
        if(!this.detailsOfRequest.nameOfOurCmpny) {
            this.$toast({
              text: "请选择出票单位!",
              type: 'danger',
              duration: 1500
            });
            return;        	
        } 
        if(!this.detailsOfRequest.nameOfGoods || this.detailsOfRequest.nameOfGoods.length>16 || this.detailsOfRequest.nameOfGoods.length<2) {
            this.$toast({
              text: "商品名称不符合要求!",
              type: 'danger',
              duration: 3000
            });
            return;            
        }
        if(!this.detailsOfRequest.amount || this.detailsOfRequest.amount<=0) {
            this.$toast({
              text: "金额这么少,不开票了吧,不够麻烦的!",
              type: 'danger',
              duration: 3000
            });
            return;       
        }
        if(this.detailsOfRequest.cstmrOgnztnName.length<4) {
            this.$toast({
              text: "抬头不符合要求",
              type: 'danger',
              duration: 3000
            });
            return;       
        }        
//获取出票公司ID  idOfOurCmpny
        var idOfOurCmpnyInvoice=0;
        for(var index=0;index<this.listOfOurCompany.length;index++){
        	if(this.detailsOfRequest.nameOfOurCmpny===this.listOfOurCompany[index]['name']) {
        	  this.detailsOfRequest.idOfOurCmpny=this.listOfOurCompany[index]['id'];
        	  break;
        	}
        }
//获取发票抬头Ognztn的ID  idOfCstmrOgnztn
        for(var index=0;index<this.listOfCustomerOgnztn.length;index++){
        	if(this.detailsOfRequest.cstmrOgnztnName===this.listOfCustomerOgnztn[index]['full_name']) {
        	  this.detailsOfRequest.idOfCstmrOgnztn=this.listOfCustomerOgnztn[index]['id'];
        	  break;
        	}
        }
//获取发票类型在数组中的索引值,作为detailsOfRequest.type的值
        for(var index=0;index<this.listOfInvoiceType.length;index++) {
          if(this.detailsOfRequest.type===this.listOfInvoiceType[index]['name']) {
            this.detailsOfRequest.type=this.listOfInvoiceType[index]['id'];
          }
        }
//将数据保存到数据库,用mySQL事务进行
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'saveRequestInvoiceData.php',
        data: qs.stringify(_this.detailsOfRequest)
        }).then(function (response) {
            $('#invoiceRequester').modal('toggle');
            //从未申请开票的列表中清除已经申请的记录.includes
            for(var index=0;index<_this.rcdrsSetFromDBSForRequesting.length;index++) {
              if(_this.detailsOfRequest.listOfIDS.includes(_this.rcdrsSetFromDBSForRequesting[index]['ID'])) {
                  _this.rcdrsSetFromDBSForRequesting.splice(index, 1);
                  index--;
              }               
            }
            if(_this.rcdrsSetFromDBSForRequesting.length>0) {
	            _this.listOfCheckboxStatement = new Array(_this.rcdrsSetFromDBSForRequesting.length).fill(false);
            } else {
            	_this.headerOfList=[];
            }
            _this.detailsOfRequest=JSON.parse(_this.cloneddetailsOfRequest);
            _this.allRequestCheckbox=false;
            _this.listOfSelectedRecorders=[];
            _this.amountOfSelectedRcdrs=0;

            _this.$toast({
              text: "开票申请已提交",
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
      	this.rcdrsSetFromDBSForRequesting=[];
      	this.headerOfList=[];
      	this.listOfSelectedRecorders=[];
      	this.listOfCheckboxStatement=[];
      	this.allRequestCheckbox=false;
      	this.detailsOfRequest=JSON.parse(this.cloneddetailsOfRequest);
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
#searchConditions >*{
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
#detailsForRequesting  input,#detailsForRequesting select {
  width: 80%;
}
/*#detailsForRequesting select {
  width: 80%;
}*/
#detailsForRequesting table {
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
h5 {
  color: #007bff;
}
#requestInvoice {
  overflow:auto;
}
</style>
