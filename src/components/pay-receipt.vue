<template>
  <div class="container-fluid">
    <div class="titleOfPR">
      <span class="titleOfPR">收款与付款</span>
    </div>
    <div>
      <ul class="nav nav-pills" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" data-toggle="pill" href="#tbpnVerifyPrice" @click="getDataFor('VerifyingPrice')">核价</a>
        </li>
      	<li class="nav-item">
      	  <a class="nav-link" data-toggle="pill" href="#tbpnReceipt" @click="getDataFor('Receipting')">收款</a>
      	</li>
      	<li class="nav-item">
      	  <a class="nav-link" data-toggle="pill" href="#tbpnPaying" @click="getDataFor('Paying')">付款</a>
      	</li>
      </ul>
    </div>
    <div id="tbCtntPR" class="tab-content container-fluid">
      <div id="tbpnVerifyPrice" class="container-fluid tab-pane active">
        <div class="beingVerifiedPrice" v-if="beingVerifiedPriceList.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="title in headerOfList">{{title}}</th>
            </thead>
            <tbody @click="selectAnOrderToReceipt">
              <tr v-for="row in beingVerifiedPriceList">
                <td v-for="vlu in row">{{vlu}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="noDate" v-if="beingVerifiedPriceList.length<1" @click="getDataFor('VerifyingPrice')">
          没有要核价的订单
        </div> 
      </div>
      <div id="tbpnReceipt" class="container-fluid tab-pane">
        <div class="beingReceiptedList" v-if="beingReceiptedList.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="title in headerOfList">{{title}}</th>
            </thead>
            <tbody @click="selectAnOrderToReceipt">
              <tr v-for="row in beingReceiptedList">
                <td v-for="vlu in row">{{vlu}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="noDate" v-if="beingReceiptedList.length<1" @click="getDataFor('Receipting')">
          没有要收款的数据
        </div> 
      </div>
      <div id="tbpnPaying" class="container-fluid tab-pane fade">
        <div class="beingPaidList" v-if="beingPaidList.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="title in headerOfList">{{title}}</th>
            </thead>
            <tbody @click="selectAnPayingRequestToPay">
              <tr v-for="row in beingPaidList">
                <td v-for="vlu in row">{{vlu}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="noDate" v-if="beingPaidList.length<1"  @click="getDataFor('Paying')">
          没有要付款的数据
        </div>
      </div>
      <div id="wfs" class="container tab-pane fade">
        其它操作
      </div>
    </div>
    <div class="modal fade" id="reciepter" role="dialog" aria-labelledby="reciepter" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>收款台</span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
            <div class="showTheOrder">
              <table class="anOrderbeingReceipted">
                <thead>
                  <th>订单ID</th>
                  <th>伙伴</th>
                  <th>产品</th>
                  <th>金额</th>
                  <th>销售日期</th>
                  <th>负责人</th>
                  <th>项目</th>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="td in selectedRecordToReceipt">{{td.innerHTML}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr>
            <div id="receipter" class="container-fluid receipter">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputReceiptAmount">金额</label>
                  <input id="inputReceiptAmount" type="number" name="amount" v-model="receipter.amount" title="收款金额" placeholder="0">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctPayment">方式</label>
                  <select id="slctPayment"  v-model="receipter.payment" class="form-control" name="payment" type="text" title="收款方式" placeholder="收款方式">
                    <option v-for="item in payments">{{item}}</option>
                  </select>                  
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctAccount">账号</label>
                  <select id="slctAccount"  v-model="receipter.account" class="form-control" name="account" type="text" title="收款账号" placeholder="收款账号">
                    <option v-for="item in accounts">{{item}}</option>
                  </select>           
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctType">性质</label>
                  <select id="slctType"  v-model="receipter.rcptType" class="form-control" name="rcptType" type="text" title="所收款项的性质" placeholder="款项性质">
                    <option v-for="item in receiptTypes">{{item}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputMem">备注</label>
                  <input id="inputMem" type="text" name="mem" v-model="receipter.mem" title="其它需要说明的事项" placeholder="备注信息">
                </div>
                <div class="col-lg  form-inline">

                </div>                               
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>  
              <button type="button" id="btnReceipt" @click="saveReceiptData" class="btn btn-primary">保存</button>
            </div>  
        </div>  
      </div>  
    </div>
    <div class="modal fade" id="mdlPayer" role="dialog" aria-labelledby="mdlPayer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">  
          <div class="modal-header">
            <span>付款台</span>  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>  
              </button>  
          </div>
          <div class="modal-body">  
            <div class="showThePayingRequest">
              <table class="anPayingRqstForPaying">
                <thead>
                  <th>请款人</th>
                  <th>审批人</th>
                  <th>金额</th>
                  <th>请款日期</th>
                  <th>审核日期</th>
                  <!-- <th>项目</th> -->
                </thead>
                <tbody>
                  <tr>
                    <td v-for="td in selectedPayingRequestToPay">{{td.innerHTML}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr>
            <div id="payer" class="container-fluid payer">
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="inputPayAmount">金额</label>
                  <input id="inputPayAmount" type="number" name="amount" v-model="payer.amount" title="收款金额" placeholder="0">
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctPayment">方式</label>
                  <select id="slctPayment"  v-model="payer.payment" class="form-control" name="payment" type="text" title="收款方式" placeholder="收款方式">
                    <option v-for="item in payments">{{item}}</option>
                  </select>                  
                </div>
                <div class="col-lg  form-inline">
                  <label for="slctAccount">支付账号</label>
                  <select id="slctAccount"  v-model="payer.account" class="form-control" name="account" type="text" title="用哪个账号付款" placeholder="支付账号">
                    <option v-for="item in accounts">{{item}}</option>
                  </select>           
                </div>
              </div>
              <div class="row">
                <div class="col-lg  form-inline">
                  <label for="slctType">性质</label>
                  <select id="slctType"  v-model="payer.rcptType" class="form-control" name="rcptType" type="text" title="所收款项的性质" placeholder="款项性质">
                    <option v-for="item in receiptTypes">{{item}}</option>
                  </select>
                </div>
                <div class="col-lg  form-inline">
                  <label for="inputMem">备注</label>
                  <input id="inputMem" type="text" name="mem" v-model="payer.mem" title="其它需要说明的事项" placeholder="备注信息">
                </div>
                <div class="col-lg  form-inline">

                </div>                               
              </div>
            </div>
            </div>  
            <div class="modal-footer">  
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>  
              <button type="button" id="btnReceipt" @click="saveReceiptData" class="btn btn-primary">保存</button>
            </div>  
        </div>  
      </div>  
    </div>          	
  </div>
</template>

<script>
  export default {
    data() {
      return {
        beingVerifiedPriceList:[],
        beingReceiptedList:[],
        beingPaidList:[],
        tempArray:[],
        headerOfList:['销售员','日期','金额','项目名称','初审时间'],
        selectedRecordToReceipt:[],
        payments:['收款方式','微信','支付宝','支票','电汇','现金'],
        accounts:['收款账号','中科平安','中科中行','马晶华夏'],
        receiptTypes:['款项性质','预付款','全款','尾款'],
        receipter: {
          amount:0,
          payment:'收款方式',
          account:'收款账号',
          rcptType:'款项性质',
          mem:''
        },
        selectedPayingRequestToPay:[],
        payer: {
          amount:0,
          payment:'收款方式',
          account:'收款账号',
          rcptType:'款项性质',
          mem:''
        },
        // listOfReceiptFromDBS:[]
      }

    },
    methods:{
      getDataFor:function(usage) {
        //var tmpArray[];
        var actionFile;
        var _this = this;            
        switch (usage) {
          case 'VerifyingPrice':
            actionFile='getCntctrOgnztn.php';//根据不同的用途执行不同的服务器程序
            this.beingVerifiedPriceList=[];
            this.headerOfList=[];
            this.$axios.get(actionFile)
              .then(function (response) {
                _this.beingVerifiedPriceList = response.data;
                var ttl='';
                for(ttl in response.data[0]) {
                  _this.headerOfList.push(ttl);
                }
              })
              .catch(function (error) {
                console.log(error);
              });        
            break;
          case 'Receipting':
            actionFile='getCntctrOgnztn.php';//根据不同的用途执行不同的服务器程序
            this.beingReceiptedList=[];
            this.headerOfList=[];
            this.$axios.get(actionFile)
              .then(function (response) {
                _this.beingReceiptedList = response.data;
                var ttl='';
                for(ttl in response.data[0]) {
                  _this.headerOfList.push(ttl);
                }                
              })
              .catch(function (error) {
                console.log(error);
              });           
            break;
          case 'Paying':
            actionFile='getCntctrOgnztn.php';//根据不同的用途执行不同的服务器程序
            this.beingPaidList=[];
            this.headerOfList=[];
            this.$axios.get(actionFile)
              .then(function (response) {
                _this.beingPaidList = response.data;
                var ttl='';
                for(ttl in response.data[0]) {
                  _this.headerOfList.push(ttl);
                }                
              })
              .catch(function (error) {
                //console.log(error);
                _this.beingPaidList = error;
              }); 
            break;
        }
      
      },
      deleter:function() {

      },
      modifier:function() {

      },
      selectAnOrderToReceipt:function(e) {
        this.selectedRecordToReceipt= e.toElement.parentElement.children;
        $('#reciepter').modal('toggle');
      },
      saveReceiptData:function() {
        getCntctrOgnztn.php
      },
      selectAnPayingRequestToPay:function(e) {
        this.selectedPayingRequestToPay= e.toElement.parentElement.children;
        $('#mdlPayer').modal('toggle');
      }
    }
  }	
</script>

<style scoped>
.titleOfPR {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  color:#007bff;
}
.tab-content {
  margin-top: 20px;
  border: 1px solid #007bff;
  padding: 10px;
}
.anOrderbeingReceipted {
  width: 90%;
}
.showTheOrder {
   /* border: 1px solid #007bff;*/
}
.receipter,.payer,.receipter .row, .payer .row {
  margin-top: 20px;
}
/*#inputReceiptAmount {
  width: 100px;
}*/

.receipter input, .receipter select,.payer input, .payer select {
  width: 70%;
}	
.receipter input, .payer input {
  padding:4px;
}

</style>
