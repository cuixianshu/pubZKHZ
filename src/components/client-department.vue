<template>
  <div class="father">
    <h5>当前位置:基础数据/客户单位信息</h5>
    <div id="clientDepartment" class="container-fluid">
      <div class="form-group form-inline searchBar">
          <div class="col-lg">
            <span for="schKeyWds">关键词:</span>
            <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、简称、">
            <button @click="getListOfClientOgnztn"class="btn btn-primary" type="button">搜索数据</button>
            <button @click="clearListOfClientOgnztn"class="btn btn-secondary" type="button" v-if="listOfClientOgnztn.length>0">清空</button>
          
          </div>
          <div class="col-lg createnewclient">
            <button @click="newCreate"class="btn btn-primary" type="button">新建客户</button>
          </div>
      </div>
      <div class="listShower" v-if="listOfClientOgnztn.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="title,index in titleOfList" :width="widthOfTH[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in listOfClientOgnztn" @click="clickedARecorderToModify(row)">
              <td v-for="vlu in row" :title='vlu'>{{vlu}}</td>
            </tr>
          </tbody>
        </table>
      </div>      
    </div>
    <div class="modal fade shower-ognztn" id="mdfRecorder" role="dialog" aria-labelledby="showClntOgnztnModifyer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipFormdfRecorder">客户单位ID:{{theClientOgnztn.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputShortName">单位简称:</label>
                  <input class="form-control" id="inputShortName" type="text" v-model="theClientOgnztn.short_name" title="客户单位简称">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputAdd">办公地址:</label>
                  <input class="form-control" id="inputAdd" type="text" v-model="theClientOgnztn.address" title="客户实际办公地址">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputFullName">开票全称:</label>
                  <input class="form-control" id="inputFullName" type="text" v-model="theClientOgnztn.full_name" title="开发票时的单位全称">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputTaxNum">开票税号:</label>
                  <input class="form-control" id="inputTaxNum" type="text" v-model="theClientOgnztn.tax_num_in_invoice" title="三证合一的税号">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputAddInvoice">地址电话:</label>
                  <input class="form-control" id="inputAddressInvoice" type="text" v-model="theClientOgnztn.address_in_invoice" title="开发票时的单位地址和电话">
                </div>
                <div class="col-lg form-inline">
                  <label for="inputAccountInvoice">发票账号:</label>
                  <input class="form-control" id="inputAccountInvoice" type="text" v-model="theClientOgnztn.account_in_invoice" title="开发票时的开户行和账号">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="inputRemark">备注信息:</label>
                  <input class="form-control" id="inputRemark" type="text" v-model="theClientOgnztn.other" title="备注信息">
                </div>
                <div class="col-lg form-inline">
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
import qs from 'qs';
export default {
  data () {
    return {
      queryContent:{
        keyWord:''
      },
      listOfClientOgnztn:[],
      titleOfList:[],
      widthOfTH:['3%','6%','15%','20%','15%','19%','15%','7%'],
      theClientOgnztn:{
        id:'',
        short_name:'',
        address:'',
        full_name:'',
        tax_num_in_invoice:'',
        address_in_invoice:'',
        account_in_invoice:'',
        other:''
      },
      isNewCreate:false
    }
  },
  methods: {
    getListOfClientOgnztn () {
      this.listOfClientOgnztn=this.$store.state.clntParentOgnztns;
      this.titleOfList=[];
      for(var ttl in this.listOfClientOgnztn[0]) {
        this.titleOfList.push(ttl);
      }
    },
    clearListOfClientOgnztn() {
      this.listOfClientOgnztn=[];
      this.titleOfList=[];
    },
    clickedARecorderToModify:function (dataRow) {
      this.theClientOgnztn=dataRow;
      this.isNewCreate=false;
      $('#mdfRecorder').modal('toggle');
    },
    saveModifyedRcdr() {
      for(var prop in this.theClientOgnztn) {
        if(prop!=='other' && prop!=='id') {
          if(prop!=='short_name') {
            if(this.theClientOgnztn[prop].length<4) {
              this.$toast({
                text: prop+'至少4个字!',
                type: 'info',
                duration: 1500
              });
              return;              
            }            
          } else {
            if(this.theClientOgnztn[prop].length<2) {
              this.$toast({
                text: prop+'至少2个字!',
                type: 'info',
                duration: 1500
              });
              return;              
            }
          }
        }
      }
      var _this = this;
      if(this.isNewCreate) {
        this.$axios({
          method: 'post',
          url: 'insertNewToTblClientParentOgnztn.php',
          data: qs.stringify(_this.theClientOgnztn)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            _this.$store.dispatch('getCPOs',_this);
            _this.listOfClientOgnztn=_this.$store.state.clntParentOgnztns;
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
          url: 'updateTblClientParentOgnztn.php',
          data: qs.stringify(_this.theClientOgnztn)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '成功保存数据!',
                 type: 'success',
                 duration: 800
              });
            $('#mdfRecorder').modal('toggle');
            _this.$store.dispatch('getCPOs',_this);
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
      this.listOfClientOgnztn=[];
      this.theClientOgnztn.id='';
      this.theClientOgnztn.short_name='';
      this.theClientOgnztn.address='';
      this.theClientOgnztn.full_name='';
      this.theClientOgnztn.tax_num_in_invoice='';
      this.theClientOgnztn.address_in_invoice='';
      this.theClientOgnztn.account_in_invoice='';
      this.theClientOgnztn.other='';
      $('#mdfRecorder').modal('toggle');
      this.isNewCreate=true;
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
.shower-ognztn input{
  width: 80%;
}
.shower-ognztn .row{
  margin-top: 5px;
}
.searchBar input,.searchBar button {
  margin-right: 10px;
}
.createnewclient {
  text-align: right;
}
</style>

