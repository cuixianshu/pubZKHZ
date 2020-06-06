<template>
  <div class="father">
    <h5>当前位置:订单管理/机票出库</h5>
    <div id="requestInvoice" class="container-fluid">
      <div id="searchConditions"  class="form-group form-inline">
        <label for="queryConditions">关键词:</label>
        <input id="queryConditions" type="text" name="queryConditions" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="乘机人、客户单位、票号等搜索关键词">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="出票时间区间,默认最近7天" :shortcuts="shortcuts" placeholder="出票的时间范围"></datepicker> 
        <button class="btn btn-primary" @click="getTkts">🔍获取数据</button>
        <button class="btn btn-secondary" @click="clearData" v-if="setOftickets.length>0">清空</button>
        <button class="btn btn-primary" v-if="setOftickets.length>0" @click="outboundSeletcedTkts">出库</button>
      </div>

      <div v-if="setOftickets.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in listOfTitles" @click="allCheckboxClicked" :width="widthOfTH[index]">{{title}}</th>
            <th><input class="checkbox" type="checkbox" @click="allCheckboxClicked" v-model="allRequestCheckbox"></th>
          </thead>
          <tbody>
            <tr v-for="(row,index) in setOftickets">
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
              <td><input :id="index" class="checkbox" type="checkbox"  name="selecter" v-model="listOfCheckboxStatement[index]" @click.stop="checkboxClickedInTable(index)"></td>
            </tr>
          </tbody>
        </table>
      </div>
<!--       <div class="buttons">
        <button class="btn btn-secondary" @click="clearData" v-if="setOftickets.length>0">清空</button>
        <button class="btn btn-primary" v-if="setOftickets.length>0" @click="outboundSeletcedTkts">出库</button>
      </div>  -->       
    </div>
    <div class="modal fade" id="outboundShower" role="dialog" aria-labelledby="outboundShower" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>机票出库</span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div>
            <span><h5 style="color:#007bff">您选中的以下机票将进行出库操作,您确定吗?</h5></span>
          </div>
          <div class="modal-body">  
            <div class="showSelectedList">
              <table width="100%">
                <thead>
                  <th width="25%">票号</th>
                  <th width="12%">乘机人</th>
                  <th width="12%">航班号</th>
                  <th width="15%">乘机日期</th>
                  <th width="20%">航程</th>
                  <th width="8%">票价</th>
                  <th width="8%">税</th>
                </thead>
                <tbody>
                  <tr v-for="row in listOfSelectedTickets">
                    <td>{{row.number_ticket}}</td>
                    <td>{{row.name_psgr}}</td>
                    <td>{{row.number_flight}}</td>
                    <td>{{row.date_departure}}</td>
                    <td>{{row.trip}}</td>
                    <td>{{row.price}}</td>
                    <td>{{row.tax}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>  
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>  
            <button type="button" @click="saveOutBoundedData" class="btn btn-primary">确定</button>
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
        setOftickets:[],
        listOfTitles:['出票日期','票号','乘机人','所属单位','航班号','起飞日期','航程','票价','税','保险'],
        allRequestCheckbox:false,
        listOfCheckboxStatement:[],
        listOfSelectedTickets:[],
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
        },
        widthOfTH:['9%','12%','11%','12%','8%','9%','10%','8%','8%','6%','7%']
      } 
    },
    components: {
     datepicker
    },    
    methods: {
      // aRowInListClicked (indexRow) {
      //     this.listOfCheckboxStatement[indexRow]=!this.listOfCheckboxStatement[indexRow];
      //     this.changeAllCheckboxStatus("requesting");
      //     // $("#"+indexRow).attr("checked",this.listOfCheckboxStatement[indexRow]);
      //     // console.log(this.listOfCheckboxStatement[indexRow]);
      // },
      getTkts:function() {
        this.allRequestCheckbox=false;
        if(this.setOftickets.length>0) {
          this.setOftickets=[];
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
        this.queryContent.conditions="NotOutBounded";
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'getTickets.php',
            data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(response.data.length>0){
              _this.setOftickets = response.data;
              _this.listOfCheckboxStatement = new Array(response.data.length).fill(false);
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
      checkboxClickedInTable(i) {
        this.listOfCheckboxStatement[i]=!this.listOfCheckboxStatement[i];
        this.changeAllCheckboxStatus();
// console.log(this.listOfCheckboxStatement);
      },
      outboundSeletcedTkts() {
        if(this.listOfSelectedTickets.length) {
          this.listOfSelectedTickets=[];
        }
        for(var i=0;i<this.setOftickets.length;i++) {
          if(this.listOfCheckboxStatement[i]) {
            this.listOfSelectedTickets.push(this.setOftickets[i]);
          }
        }

        if(this.listOfSelectedTickets.length<1) {
          this.$toast({
            text: "请勾选至少一条记录!",
            type: 'info',
            duration: 2000
            });
          return;
        }

        $('#outboundShower').modal('toggle');
      },
      allCheckboxClicked() {
        this.allRequestCheckbox=!this.allRequestCheckbox;
        this.listOfCheckboxStatement = new Array(this.setOftickets.length).fill(this.allRequestCheckbox);
        //数据更新后更新DOM
        // this.$nextTick(()=> {
        //   this.listOfCheckboxStatement = new Array(this.setOftickets.length).fill(this.allRequestCheckbox);
        // });
// console.log(this.listOfCheckboxStatement);
      },
      changeAllCheckboxStatus() {
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
      },
      saveOutBoundedData() {
        this.queryContent.conditions="UpdateOutboundedData";
        this.queryContent.data=this.listOfSelectedTickets;
        var numbersOfSelectedTickets=[];
        for(var i=0;i<this.listOfSelectedTickets.length;i++) {
          numbersOfSelectedTickets.push(this.listOfSelectedTickets[i]['number_ticket']);
        }
// console.log(numbersOfSelectedTickets);
// return;
      var _this=this;
      this.$axios({
        method: 'post',
        url: 'updateTickets.php',
        data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          $('#outboundShower').modal('toggle');
          if(response.data===true) {

            for(var index=0;index<_this.setOftickets.length;index++) {
              if(numbersOfSelectedTickets.includes(_this.setOftickets[index]['number_ticket'])) {
                  _this.setOftickets.splice(index, 1);
                  index--;
              }               
            }
            if(_this.setOftickets.length>0) {
              _this.listOfCheckboxStatement = new Array(_this.setOftickets.length).fill(false);
            }
            _this.allRequestCheckbox=false;
            _this.listOfSelectedTickets=[];

            _this.$toast({
              text: "出库操作成功!",
              type: 'success',
              duration: 1000
            });
          } else {
            _this.$toast({
              text: "操作失败,请稍后再试!",
              type: 'danger',
              duration: 2000
            });            
          }
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
        this.setOftickets=[];
        this.listOfSelectedTickets=[];
        this.listOfCheckboxStatement=[];
        this.allRequestCheckbox=false;
      }                                          
    },
    beforeCreate:function() {
      var _this=this;
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
