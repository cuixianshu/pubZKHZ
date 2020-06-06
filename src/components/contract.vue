<template>
<div class="father">
  <h5>当前位置:基础数据/合同管理</h5>
  <div class="container-fluid">
    <div class="form-group form-inline">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="甲方、联系人、产品、地点等">
          <button @click="getListOfContracts" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearlistOfContracts"class="btn btn-secondary" type="button" v-if="listOfContracts.length>0">清空</button>
          
        </div>
        <div class="col-lg createnewcontract">
          <button @click="newCreateContract" class="btn btn-primary" type="button">新建合同</button>
        </div>
    </div>
    <div class="listShower" v-if="listOfContracts.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfList">{{title}}</th>
        </thead>
        <tbody @click="clickedARecorderToModify">
          <tr v-for="row in listOfContracts">
            <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="mdfRecorder" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          合同编辑器--合同ID:{{contract.id}}
        </div>
        <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputPartA">甲方名称:</label>
                  <input id="inputPartA" type="text" name="partA" class="form-control" v-model="contract.partA" placeholder="甲方名称" title="甲方名称">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputAgent">甲方代表:</label>
                  <input id="inputAgent" type="text" name="agentA" class="form-control" placeholder="甲方代表和电话" title="甲方代表人和电话号" v-model="contract.agentA" required>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="slctOurCmpny">我方名称:</label>
                  <select id="slctOurCmpny" type="text" name="ourCompany" class="form-control" v-model="contract.ourCompany" placeholder="我方公司名" title="我方签约公司名称" required>
                    <option v-for="item in ourCompanys">{{item.name}}</option>
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label for="inputOurAgent">我方代表:</label>
                  <select id="inputOurAgent" type="text" name="ourAgent" class="form-control" v-model="contract.ourAgent" placeholder="我方代表人" title="我方签约代表人" required>
                    <option v-for="item in employees">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputContent">主要内容:</label>
                  <input id="inputContent" type="text" name="basicContent" class="form-control" v-model="contract.basicContent" placeholder="合同主要内容" title="对合同内容的主要概括">
                </div>                
                <div class="col-lg form-inline">
                  <label for="inputProduct">产品名称:</label>
                  <input id="inputProduct" type="text" name="nameOfProduct" class="form-control" v-model="contract.nameOfProduct" placeholder="合同销售的产品" title="产品名称">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputPrice">产品单价:</label>
                  <input id="inputPrice" type="number" name="unitPrice" class="form-control" v-model="contract.unitPrice" placeholder="请输入单价" title="产品单价">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputCount">合同数量:</label>
                  <input id="inputCount" type="number" name="count" class="form-control" v-model="contract.count" placeholder="请输入数量" title="产品数量">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputAmount">合同金额:</label>
                  <input id="inputAmount" type="number" name="amount" class="form-control" v-model="contract.amount" placeholder="合同金额" title="合同金额">
                </div>                
                <div class="col-lg form-inline">
                  <label for="inputPayment">付款方式:</label>
                  <select id="inputPayment" type="text" name="payment" class="form-control" v-model="contract.payment" placeholder="付款方式" title="付款方式">
                    <option v-for="item in payments">{{item.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="dtpkrStartDate">生效日期:</label>
                  <input id="dtpkrStartDate" type="date" name="startDate" class="form-control" v-model="contract.startDate" placeholder="生效日期" title="合同生效日期">
                </div>
                <div class="col-lg form-inline">
                  <label for="dtpkrEndDate">失效日期:</label>
                  <input id="dtpkrEndDate" type="date" name="endDate" class="form-control" v-model="contract.endDate" placeholder="合同失效日期" title="合同失效日期">
                </div>
              </div>              
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="dtpkrSignedDate">签约日期:</label>
                  <input id="dtpkrSignedDate" type="date" name="signedDate" class="form-control" v-model="contract.signedDate" placeholder="签约日期" title="合同的签订日期">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputRemark">备注信息:</label>
                  <input id="inputRemark" type="text" name="remark" class="form-control" v-model="contract.remark" placeholder="备注信息" title="备注信息">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputIsFinished">执行进度:</label>
                  <input id="inputIsFinished" type="number" name="isFinished" class="form-control" v-model="contract.isFinished" placeholder="执行进度" title="0:未完成;1:已完成">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputNumber">合同编号:</label>
                  <input id="inputNumber" type="text" name="number" class="form-control" v-model="contract.number" placeholder="合同编号" title="合同编号">
                </div>                
              </div>

            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button class="btn btn-primary saveBtn" type="button" @click="saveData">保存</button> 
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
        contract:{
          id:'',
          partA:'',
          agentA:'',
          ourCompany:'',
          ourAgent:'',
          nameOfProduct:'',
          unitPrice:0,
          count:1,
          basicContent:'',
          amount:0,
          startDate:'',
          endDate:'',
          payment:'',
          signedDate:'',
          isFinished:0,
          remark:'',
          number:''
        },
        listOfContracts:[],
        titleOfList:[],
        ourCompanys:[],
        employees:[],
        payments:[],
        isNew:false
      }
    },
    methods: {
      getListOfContracts () {
        this.listOfContracts=[];
        this.titleOfList=[];
        var _this = this;
        this.$axios.get('getContracts.php')
          .then(function (response) {
            if(response.data.length>0) {
              _this.listOfContracts = response.data;
              var ttl='';
              for(ttl in response.data[0]) {
                _this.titleOfList.push(ttl);
              }              
            } else {
              _this.$toast({
                text: '没有符合条件的记录',
                type: 'info',
                duration: 1000
              });              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      saveData () {
        if(this.contract.partA.length<4) {
          this.$toast({
            text: '甲方名称不能少于4个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.agentA.length<10) {
          this.$toast({
            text: '甲方代表不能少于10个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.ourCompany==='' || this.contract.ourAgent==='') {
          this.$toast({
            text: '我方信息不完整',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.nameOfProduct.length<2) {
          this.$toast({
            text: '产品名称不能少于2个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.unitPrice<0) {
          this.$toast({
            text: '单价必须大于0',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.count<0) {
          this.$toast({
            text: '数量必须大于0',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.basicContent.length<6) {
          this.$toast({
            text: '基本内容不能少于6个字',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.amount<0) {
          this.$toast({
            text: '不收钱就算了,还倒找???',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.startDate==='' || this.contract.endDate==='' || this.contract.signedDate==='') {
          this.$toast({
            text: '请选择日期',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.payment==='') {
          this.$toast({
            text: '请选择付款方式',
            type: 'info',
            duration: 1000
          });
          return;
        }
        if(this.contract.isFinished!=0 && this.contract.isFinished!=1) {
          this.$toast({
            text: '执行进度只能是0或1!',
            type: 'info',
            duration: 1000
          });
          return;
        }                
        //获取我方代表id 
        // for(var i=0;i<this.employees.length;i++) {
        //   if(this.employees[i].name===this.contract.ourAgent) {
        //     this.contract.idOfOurAgent=this.employees[i].id;
        //   }
        // }
        var _this=this;
        var url='';
        if(this.contract.id!=='') {
          url='updateTblContract.php';
        } else {
          url='insertNewToContract.php';
        }
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.contract)
        }).then(function (response) {
console.log(response.data);
// return;
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                  duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            _this.listOfContracts=[];
            _this.titleOfList=[];
            _this.contract.id='';              
            _this.contract.partA='';
            _this.contract.agentA='';
            _this.contract.ourCompany='';
            _this.contract.ourAgent='';
            _this.contract.nameOfProduct='';
            _this.contract.unitPrice=0;
            _this.contract.count=1;
            _this.contract.basicContent='';
            _this.contract.amount=0;
            _this.contract.startDate='';
            _this.contract.endDate='';
            _this.contract.payment='';
            _this.contract.signedDate='';
            _this.contract.isFinished=0;
            _this.contract.remark='';
            _this.contract.number='';
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
      clickedARecorderToModify:function (e) {
        var el=e.toElement.parentElement;
        this.contract.id=el.children[0].innerHTML;
        this.contract.number=el.children[1].innerHTML;
        this.contract.partA=el.children[2].innerHTML;
        this.contract.agentA=el.children[3].innerHTML;
        this.contract.ourCompany=el.children[4].innerHTML;
        this.contract.basicContent=el.children[5].innerHTML;
        this.contract.nameOfProduct=el.children[6].innerHTML;
        this.contract.unitPrice=el.children[7].innerHTML;
        this.contract.count=el.children[8].innerHTML;
        this.contract.amount=el.children[9].innerHTML;
        this.contract.payment=el.children[10].innerHTML;
        this.contract.startDate=el.children[11].innerHTML;
        this.contract.endDate=el.children[12].innerHTML;
        this.contract.ourAgent=el.children[13].innerHTML;
        this.contract.isFinished=el.children[15].innerHTML;
        this.contract.signedDate=el.children[16].innerHTML;
        this.contract.remark=el.children[17].innerHTML;
        $('#mdfRecorder').modal('toggle');
      },
      clearlistOfContracts () {
        this.listOfContracts=[];
        this.titleOfList=[];
      },
      newCreateContract () {
        this.listOfContracts=[];
        this.titleOfList=[];              
        this.contract.id='';
        this.contract.partA='';
        this.contract.agentA='';
        this.contract.ourCompany='';
        this.contract.ourAgent='';
        this.contract.nameOfProduct='';
        this.contract.unitPrice=0;
        this.contract.count=1;
        this.contract.basicContent='';
        this.contract.amount=0;
        this.contract.startDate='';
        this.contract.endDate='';
        this.contract.payment='';
        this.contract.signedDate='';
        this.contract.isFinished=0;
        this.contract.remark='';
        this.contract.number='';
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
      //初始化我方公司option  payments
      this.ourCompanys=[];
      this.$axios({
            method: 'post',
            url: 'getListOfOurCompanys.php'
        })
        .then(function (response) {
          _this.ourCompanys=response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      //初始化支付方式option  
      this.payments=[];
      this.$axios({
            method: 'post',
            url: 'getListOfPayWay.php'
        })
        .then(function (response) {
          _this.payments=response.data;
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
#mdfRecorder input,#mdfRecorder select {
  width: 70%;
}
.row {
  margin-top: 10px;
}
.saveBtn {
  width: 100px;
}
#mdfRecorder .row {
  margin-bottom: 5px;
}
</style>

