<template>
  <div class="father">
    <h5>当前位置:财务业务/增补发票</h5>
    <div class="container-fluid">
      <div class="row form-inline query">
        <datepicker class="datepicker"id="dateRange" v-model="queryContent.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="付款的时间范围,默认最近7天" :shortcuts="shortcuts" placeholder="付款的时间范围"></datepicker>
        <input id="queryConditions" type="text" class="form-control" v-model="queryContent.keyWord" placeholder="请输入搜索关键词" title="金额、用途、收款账号、备注等搜索关键词">
        <select class="form-control" v-model="queryContent.id_project" style="max-width: 280px;">
          <option value="0">不限项目</option>
          <option v-for="item in projects" value="item.id">{{item.name}}</option>
        </select>
        <select class="form-control" v-model="queryContent.id_applyer">
          <option value="0">不限请款人</option>
          <option v-for="item in ourEmplys" value="item.id">{{item.name}}</option>
        </select>
        <button class="btn btn-primary" @click="getRqstFunds">🔍获取数据</button>
        <button class="btn btn-secondary" @click="clearList" v-if="listOfRqstFunds.length>0">清除</button>
      </div>
    </div>
    <div v-if="listOfRqstFunds.length>0" class="divfortable">
      <table class="table table-hover">
        <thead>
          <th v-for="(title,index) in titlesOfList" :width="widthOfTH[index]">{{title}}</th>
        </thead>
        <tbody>
          <tr v-for="(row,index) in listOfRqstFunds" @click="clickedARowInShower(row)">
            <td :title="row.id_project">{{getPrjctName(row.id_project)}}</td>
            <td :title="row.r_id_applyer">{{getEmplyName(row.r_id_applyer)}}</td>
            <td :title="row.r_time_applied">{{row.r_time_applied}}</td>
            <td :title="row.r_amount">{{row.r_amount}}</td>
            <td :title="row.r_account">{{row.r_account}}</td>
            <td :title="row.r_use_for">{{row.r_use_for}}</td>
            <td :title="row.r_remark">{{row.r_remark}}</td>
            <td :title="row.p_amount">{{row.p_amount}}</td>
            <td :title="row.p_time_paid">{{row.p_time_paid}}</td>
            <td :title="row.p_remark">{{row.p_remark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="mdlEditer" role="dialog" aria-labelledby="mdlEditer" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">  
          <div class="modal-body">
            <div class="container-fluid">
              <div class="form-inline">
                <label>所属项目:</label><span>{{getPrjctName(pmt.id_project)}}</span>
              </div>
              <div class=" form-inline">
                <label>请款员工:</label><span>{{getEmplyName(pmt.r_id_applyer)}}</span>
              </div>
              <div class="form-inline">
                <label>请款时间:</label><span>{{pmt.r_time_applied}}</span>
              </div>
              <div class="form-inline">
                <label>请款金额:</label><span>{{pmt.r_amount}}</span>
              </div>
              <div class="form-inline">
                <label>请款账号:</label><span>{{pmt.r_account}}</span>
              </div>
              <div class="form-inline">
                <label>请款备注:</label><span>{{pmt.r_remark}}</span>
              </div>
              <div class="form-inline">
                <label>付款时间:</label><span>{{pmt.p_time_paid}}</span>
              </div>
              <div class="form-inline">
                <label>付款金额:</label><span>{{pmt.p_amount}}</span>
              </div>
              <div class="form-inline">
                <label>付款备注:</label><span>{{pmt.p_remark}}</span>
              </div>
              <div class="form-inline">
                <label>原票据号:</label><span>{{pmt.p_numbers_bills}}</span>
              </div>
              <div class="form-inline">
                <label>增补号码</label><input type="text" class="form-control" v-model="pmt.appendedNums" title="请点击右侧+进行添加" readonly><button class="btn btn-link" @click="apdANum">+</button>
              </div>
              <div class="form-inline" v-if="showApdNumBox">
                &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                <input type="text" class="form-control" v-model="pmt.aNumber" placeholder="增补的票据号码,一次增加一个" style="width:50%;"><button class="btn btn-secondary btn-sm" @click="showApdNumBox=false;">取消</button><button class="btn btn-primary btn-sm" @click="checkNum">确定</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">  
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button @click="svData" class="btn btn-primary">保存</button>
          </div>           
        </div>
      </div>
    </div>    
    <div id="loading" class="loadingbox" v-show="showLoading">
      <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
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
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        shortcuts:false,
        queryContent:{
          keyWord:'',
          dateRange:[],
          conditions:'',
          id_applyer:0,
          id_project:0,
        },
        titlesOfList:['所属项目','请款人','请款时间','请款金额','请款账户','款项用途','请款备注','付款金额','付款时间','付款备注'],
        widthOfTH:['10%','10%','10%','10%','10%','10%','10%','10%','10%','10%'],
        listOfRqstFunds:[],
        pmt:{appendedNums:[]},
        showApdNumBox:false,
        projects:this.$store.state.projects,
        ourEmplys:this.$store.state.myEmplys,
      }
    },
    components: {
      datepicker
    },    
    methods: {
      getRqstFunds() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        if(this.queryContent.dateRange.length<2 || !this.queryContent.dateRange[0] || !this.queryContent.dateRange[1]){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.queryContent.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.queryContent.dateRange[1] = day2.format("yyyy-MM-dd");
        }       
        var _this = this;
        this.listOfRqstFunds=[];
        // this.titlesOfList=[];
        this.queryContent.conditions="requestFundsWhichPaidForAppendInvoice";
        this.$axios({
          method: 'post',
          url: 'getRequestFunds.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            _this.showLoading=false;
            $("body").css("overflow","");
            console.log(response.data);
            if(typeof(response.data)==='object') {
              if(response.data.length<1) {
                _this.$toast({text:'找不到符合条件的记录!',type:'info',duration:1000});
              } else {
                _this.listOfRqstFunds=response.data;
              }
            } else {
              _this.$toast({text:'查询失败!',type:'danger',duration:1000});
            }
          }).catch(function (error) {
            _this.showLoading=false;
            $("body").css("overflow","");
            console.log(error);
            _this.$toast({text:'通讯错误!',type:'danger',duration:1500});
          });
      },
      clickedARowInShower(dataRow) {
        this.pmt=dataRow;
        this.pmt.appendedNums='';
        this.pmt.aNumber='';
        this.showApdNumBox=false;
        $('#mdlEditer').modal('toggle');
      },
      apdANum() {
        this.showApdNumBox=!this.showApdNumBox;
        this.pmt.aNumber='';
      },
      checkNum() {
        this.pmt.aNumber=this.pmt.aNumber.replace(/(^\s*)|(\s*$)/g, "");
        let reg=/^\d{8,}$/;//验证至少8位数字
        if (!reg.test(this.pmt.aNumber)) {
          this.$toast({text: '只能由纯数字组成,且不少于8位!',type:'info',duration:2000});
          return;
        }
        this.pmt.appendedNums+=this.pmt.appendedNums==''?this.pmt.aNumber:(','+this.pmt.aNumber);
        this.showApdNumBox=false;
      },
      svData() {
        if(this.pmt.appendedNums=='') {
          this.$toast({text:'增补号码是空的!',type:'info',duration:1000});
          return;          
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.pmt.p_numbers_bills+=this.pmt.p_numbers_bills==''?this.pmt.appendedNums:(','+this.pmt.appendedNums);
        var queryContent={
          p_id:this.pmt.p_id,
          r_id:this.pmt.r_id,
          curUserId:this.$store.state.user.id_user,
          newNums:this.pmt.p_numbers_bills,
        };
        queryContent.conditions='withUpdatedInvoiceNumbers';
console.log(queryContent);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateRequestFunds.php',
          data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            _this.showLoading=false;
            $("body").css("overflow","");
            if(response.data===true) {
              $('#mdlEditer').modal('toggle'); 
              _this.$toast({text:"操作成功",type:'success',duration:800});
            } else {
              _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:2000});
            }
          }).catch(function (error) {
            _this.showLoading=false;
            $("body").css("overflow","");
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:2000});
          });        
      },
      clearList () {
        this.listOfRqstFunds=[];
      },
    },
    watch:{
    },
    computed:{
      getPrjctName () {
        return function(i) {
          let p= this.projects.find((ele)=>ele.id==i);
          return typeof p==='undefined'?'':p.name;
        }
      },
      getEmplyName () {
        return function(i) {
          let p= this.ourEmplys.find((ele)=>ele.id==i);
          return typeof p==='undefined'?'':p.name;
        }
      },

    },
    beforeCreate:function() {
    }    
  } 
</script>

<style scoped>
.modal-body input,.modal-body select {
  width: 80%;
}
.row {
  margin-top: 10px;
}
.query input,.query button, .query select,.query .datepicker {
  margin-right: 5px;
}
.query button {
  margin-left: 5px;
}
.modal-body span {
  margin-left: 10px;
  font-size: 1.2rem;
}
.modal-body .form-inline {
  margin-top: 5px;
}
.btn-sm {
  margin-right: 10px;
  margin-left: 10px;
}
</style>

