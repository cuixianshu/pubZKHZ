<template>
  <div class="father">
    <h5>当前位置:订单管理/机票退改</h5>
    <div class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="operateType">类型:</label>
        <select id="operateType" v-model="operateType" style="width:80px;" class="form-control" title="操作类型" @change="listOfTickets=[]">
          <option value=0>退票</option>
          <option value=1>改签</option>
          <option value=2>选择</option>
        </select>
        <label for="queryConditions">关键词:</label>
        <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="票号、乘机人、客人单位等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="出票日期,默认最近7天" :shortcuts="shortcuts" placeholder="出票日期的范围"></datepicker> 
        <button class="btn btn-primary" @click="getTickets">🔍获取数据</button>
        <button class="btn btn-secondary" @click="listOfTickets=[]" v-if="listOfTickets.length>0">清空</button>
      </div>
      <div v-if="listOfTickets.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in headerOfList" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row,index in listOfTickets" @click="aRowInListClicked(row)">
              <td :title="row.date_issued">{{row.date_issued}}</td>
              <td :title="row.number_ticket">{{row.number_ticket}}</td>
              <td :title="row.name_psgr">{{row.name_psgr}}</td>
              <td :title="row.dptmt_client">{{row.dptmt_client}}</td>
              <td :title="row.number_flight">{{row.number_flight}}</td>
              <td :title="row.date_departure">{{row.date_departure}}</td>
              <td :title="row.trip">{{row.trip}}</td>
              <td :title="row.price">{{row.price}}</td>
              <td :title="row.tax">{{row.tax}}</td>
              <td :title="row.insurance">{{row.insurance}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal fade" id="tktEditer" role="dialog" aria-labelledby="tktEditer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span v-if="operateType==1">机票改签--乘客:{{theTicket.name_psgr}}--票号:{{theTicket.number_ticket}}</span>
            <span v-if="operateType==0">机票退票--乘客:{{theTicket.name_psgr}}--票号:{{theTicket.number_ticket}}</span>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>  
            </button>  
          </div>
          <div class="modal-body">  
            <div id="detailsInTheTkt" class="container-fluid">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputDptrDate">日期</label>
                  <input id="inputDptrDate" type="date" name="departure" class="form-control" placeholder="航班日期" v-model="theTicket.date_departure" title="出具发票的公司名称" :readonly="operateType==0">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputFlightNumber">班次</label>
                  <input id="inputFlightNumber" type="text" class="form-control" name="flightNumber" v-model="theTicket.number_flight" placeholder="航班号" title="航班号" :readonly="operateType==0">
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputTrip">航程</label>
                  <input id="inputTrip" type="text" class="form-control" name="trip" v-model="theTicket.trip" placeholder="航程" title="航程" :readonly="operateType==0">
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputPrice">原价</label>
                  <input id="inputPrice" type="number" class="form-control" name="price" v-model="theTicket.price" title="原票价" placeholder="原票价" readonly>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputTax">税费</label>
                  <input id="inputTax" type="number" class="form-control" name="tax" v-model="theTicket.tax" title="原税费" placeholder="原税费" readonly>
                </div>
                <div v-if="operateType==1" class="col-lg  form-inline">
                  <label for="inputFeeOfChanging">费用</label>
                  <input id="inputFeeOfChanging" type="number" class="form-control" name="feeOfChanging" v-model="theTicket.feeOfChanging" title="改签费用" placeholder="改签费用">
                </div>
                <div v-if="operateType==0" class="col-lg  form-inline">
                  <label for="inputFeeOfRefounding">费用</label>
                  <input id="inputFeeOfRefounding" type="number" class="form-control" name="fee_refound" v-model="theTicket.fee_refound" title="退票费用" placeholder="退票费用">
                </div>                
              </div>
            </div>
          </div>  
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button type="button" id="btnSaveFilledData" @click="saveData" class="btn btn-primary">保存数据</button>
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
        headerOfList:['出票日期','票号','乘机人','所属单位','航班号','起飞日期','航程','票价','税','保险'],
        listOfTickets:[],
        theTicket: {},
        originalTicket:{},
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:''
        },
        widthOfTH:['9%','12%','11%','12%','8%','9%','10%','8%','8%','6%','7%'],
        operateType:'2',//0:退票；1：改签;3选择
        currentUserID:this.$store.state.user.id_user
  	  }	
  	},
    components: {
     datepicker
    },    
    methods: {
      aRowInListClicked (dataRow) {
// console.log(dataRow);
// return;
        this.theTicket=dataRow;
       
        this.originalTicket.number_flight=dataRow.number_flight;
        this.originalTicket.date_departure=dataRow.date_departure;
        this.originalTicket.trip=dataRow.trip;
        $('#tktEditer').modal('toggle');

      },
      getTickets () {
        if(this.operateType==='2') {
          this.$toast({
            text: "请先选择类型",
            type: 'info',
            duration: 1500
          });
          return; 
        }        
        if(this.listOfTickets.length>0) {
          this.listOfTickets=[];
        }
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }
        if(this.operateType==='0') {
          this.queryContent.conditions="NotRefoundedAndNotUsed"
        } 
        if(this.operateType==='1') {
          this.queryContent.conditions="NotRefoundedAndNotDepartured"
        }
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getTickets.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
        	if(response.data.length>0){
              _this.listOfTickets = response.data;
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
      saveData() {
        this.queryContent.currentUserID=this.currentUserID;
        if(this.operateType==='1') {//改签
          //内容是否改动过
          var isChanged=false;
          for(var prop in this.originalTicket) {
            if(this.theTicket[prop]!==this.originalTicket[prop]) {
              isChanged=true;
            }
          }
          if(!isChanged) {
            this.$toast({
              text: "没有检测到数据变化",
              type: 'info',
              duration: 1500
            });
            return; 
          }
          //检查数据是否合法
          if(this.theTicket.date_departure<(new Date()).format("yyyy-MM-dd") || this.theTicket.number_flight.length<4 || this.theTicket.trip.length<4 || this.theTicket.feeOfChanging<1) {
              this.$toast({
                text: "请检查日期、班次、航程、费用输入是否正确！",
                type: 'info',
                duration: 1500
              });
              return;         
          }
          
          this.queryContent.conditions="TicketChanded";
        }
//如果已收取票款,需要自动生成机票退票请款单
        if(this.operateType==='0') {//退票
          //检查数据是否合法
          if(this.theTicket.fee_refound<0) {
              this.$toast({
                text: "请检查退票费！",
                type: 'info',
                duration: 1500
              });
              return;         
          }
          
          this.queryContent.conditions="TicketRefound";
        }

//将数据保存到数据库
      this.queryContent.data=this.theTicket;
// console.log(this.queryContent);
// return;
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'updateTickets.php',
        data: qs.stringify(_this.queryContent)
        }).then(function (response) {
console.log(response.data);
// return;
          if(response.data) {

            //从列表中清除记录
            for(var index=0;index<_this.listOfTickets.length;index++) {
              if(_this.theTicket.number_ticket==_this.listOfTickets[index]['number_ticket']) {
                  _this.listOfTickets.splice(index, 1);
                  index--;
              }               
            }

            if(_this.operateType==0 && _this.theTicket.amount_clctd>0) {
              _this.$toast({
                text: "操作成功,且已生成退票请款单,请到'请款报销/机票退款'中查看",
                type: 'success',
                duration: 5000
              });
            } else {
              _this.$toast({
                text: "操作成功",
                type: 'success',
                duration: 1000
              });              
            }

            _this.theTicket.fee_refound=0;
            _this.theTicket.feeOfChanging=0;            
          } else {
            _this.$toast({
              text: "失败,请联系管理员",
              type: 'danger',
              duration: 3000
            });  
          }
          $('#tktEditer').modal('toggle');

        }).catch(function (error) {
          console.log(error);
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
              duration: 4000
          });
        });
      }
    },
    beforeCreate:function() {
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
#detailsInTheTkt input {
  width: 80%;
}
#detailsInTheTkt select {
  width: 80%;
}
#detailsInTheTkt table {
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

