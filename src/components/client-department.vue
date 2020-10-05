<template>
  <div class="father">
    <h5>当前位置:基础数据/客户单位信息</h5>
    <div class="container-fluid">
      <div class="form-inline query row">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="名称、简称、">
        <button @click="getListOfClientOgnztn"class="btn btn-primary">搜索数据</button>
        <button @click="clearListOfClientOgnztn"class="btn btn-secondary" v-if="listOfClientOgnztn.length>0">清空</button>
        <button @click="newCreate"class="btn btn-primary newitem">新建客户</button>
      </div>
      <div class="divfortable" v-if="listOfClientOgnztn.length>0">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in titleOfList" :width="widthOfTH[index]">{{title}}</th>
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipFormdfRecorder">客户单位ID:{{theClientOgnztn.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="iptShortName">单位简称:</label>
                  <input class="form-control" id="iptShortName" type="text" v-model="theClientOgnztn.short_name" title="客户单位简称">
                </div>
                <div class="col-lg form-inline">
                  <label for="iptAdd">办公地址:</label>
                  <input class="form-control" id="iptAdd" type="text" v-model="theClientOgnztn.address" title="客户实际办公地址">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="iptFullName">开票全称:</label>
                  <input class="form-control" id="iptFullName" type="text" v-model="theClientOgnztn.full_name" title="开发票时的单位全称">
                </div>
                <div class="col-lg form-inline">
                  <label for="iptTaxNum">开票税号:</label>
                  <input class="form-control" id="iptTaxNum" type="text" v-model="theClientOgnztn.tax_num_in_invoice" title="三证合一的税号">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="iptAddInvoice">地址电话:</label>
                  <input class="form-control" id="iptAddressInvoice" type="text" v-model="theClientOgnztn.address_in_invoice" title="开发票时的单位地址和电话">
                </div>
                <div class="col-lg form-inline">
                  <label for="iptAccountInvoice">发票账号:</label>
                  <input class="form-control" id="iptAccountInvoice" type="text" v-model="theClientOgnztn.account_in_invoice" title="开发票时的开户行和账号">
                </div>                
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="iptRemark">备注信息:</label>
                  <input class="form-control" id="iptRemark" type="text" v-model="theClientOgnztn.other" title="备注信息">
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
.shower-ognztn input{
  width: 80%;
}
.row{
  margin-top: 10px;
}
.query input,.query button {
  margin-right: 5px;
}
.newitem {
  position: absolute;
  right: 20px;
}
</style>

