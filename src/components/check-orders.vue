<template>
  <div class="father">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#co">订单核验</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#co-history">核单报表</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#balanceOrder">开调节单</a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="co" class="container-fluid tab-pane active query-body">
        <div class="row form-inline">
          <label>关键词:</label>
          <input type="text" class="form-control" v-model="coQC.keyWord"  placeholder="请输入要搜索的内容" title="订车人乘车人用车单位项目附加信息等">
          <datepicker class="datepicker"id="dateRange" v-model="coQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="时间区间,默认最近7天" :shortcuts="shortcuts" placeholder="发生业务的时间范围"></datepicker> 
          <button @click="getRcdrsForModifying" class="btn btn-primary">搜索数据</button>
          <button @click="clearRcdrsInModifyer" class="btn btn-secondary" v-if="rcdrSetForChecking.length>0">清空</button>
        </div>
        <div class="divfortable" v-if="rcdrSetForChecking.length>0"><!-- form --> 
          <table class="table table-hover">
            <thead>
              <th v-for="(title,index) in titleOfTable" :width="widthOfTH[index]">{{title}}</th>
            </thead>
            <tbody>
              <tr v-for="row in rcdrSetForChecking" @click="clickedARow(row)">
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
      <div id="co-history" class="container-fluid tab-pane">
        <div class="row form-inline">
          <datepicker class="datepicker"id="dateRange" v-model="COHQC.dateRange" value-type="format" format="YYYY-MM-DD" :minute-step="10" range append-to-body width="220"  title="时间区间,默认今天" :shortcuts="shortcuts" placeholder="订单核验的时间范围"></datepicker> 
          <button @click="getCOHistoryData" class="btn btn-primary">搜索数据</button>
        </div>
        <div class="divfortable" v-if="coHstrData.length>0">
          <table class="table table-hover">
            <thead>
              <th v-for="(title,index) in titleOfCOHTable" :width="widthOfTH[index]">{{title}}</th>
            </thead>
            <tbody>
              <tr v-for="row in coHstrData">
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
                <td :title='row.actual_price'>{{row.actual_price}}</td>
                <td :title='row.mileage'>{{row.mileage}}</td>
                <td :title='row.park_fee'>{{row.park_fee}}</td>
                <td :title='row.surcharge'>{{row.surcharge}}</td>
                <td :title='row.use_surcharge'>{{row.use_surcharge}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div  v-if="coHstrData.length>0">
          <span>共核单:{{coHstrData.length}}条.</span>
          <jsonexcel class="btn btn-primary" :data="COH_json_data" :fields="COH_json_fields" :name="COH_filename" worksheet="核单报表">存为Excel</jsonexcel>
          <button @click="coHstrData=[];"class="btn btn-secondary">清空</button>
          
        </div>
      </div>
      <div id="balanceOrder" class="container-fluid tab-pane">
        <div class="form-inline">
          <label>所属项目</label>
          <select class="form-control" style="width:75%;" v-model="blncOdr.id_project">
            <option value="0">请选择</option>
            <option v-for="item in projects" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-inline"><!--  input-group -->
          <label>合作客户</label>
          <input type="text" class="form-control" placeholder="搜索词" style="width:30%;" @input="cstmrChanged" v-model="kwForCstmrs">
          <select class="form-control" style="width:45%;" v-model="blncOdr.contacter">
            <option :value="blncOdr.contacter">{{blncOdr.contacter.mix_name}}</option>
            <option v-for="item in fltdCstmrs" :value="item">{{item.mix_name}}</option>
          </select>
        </div>
        <div class="form-inline">
          <label>调节金额</label>
          <input type="number" class="form-control" style="width:75%;" v-model="blncOdr.amount">
        </div>
        <div class="form-inline">
          <label>调节说明</label>
          <input type="text" class="form-control" style="width:75%;" placeholder="调节说明,不少于4个字" title="不超过128字" v-model="blncOdr.dscrb">
        </div>
        <div class="btnrow">
          <button class="btn btn-primary" @click="svBlncOdr">保存</button>
        </div>
      </div>
    </div>
    <div class="modal fade" id="mdfRecorder" role="dialog" aria-labelledby="selectUseageLabel" data-backdrop="static" data-keyboard: false ref="mdfRecorder">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="tipFormdfRecorder">订单号:{{slctdOrderForChecking.id}}</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg form-inline">
                  <label>项目:</label>
                  <select type="text" class="form-control" placeholder="所属项目" v-model="slctdOrderForChecking.id_prjct_belongto" title="项目名称" >
                    <option v-for="proj in projects" :value="proj.id">{{proj.prjct}}</option>
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label>用户:</label>
                  <select type="text" class="form-control" placeholder="用户名称" v-model="slctdOrderForChecking.id_contacter" title="用户名称" disabled>
                    <option v-for="bkr in customers" :value="bkr.id">{{bkr.mix_name}}</option>
                  </select>
                </div>
                <div class="col-lg form-inline">
                  <label>产品:</label>
                    <select type="text" class="form-control" placeholder="产品名称" v-model="slctdOrderForChecking.id_product" title="产品名称">
                      <option v-for="item in products" :value="item.id">{{item.name}}</option>
                    </select>            
                </div>
              </div>
              <div class="row">                  
                <div class="col-lg form-inline">
                  <label>开始:</label>
                  <input  class="form-control" v-model="slctdOrderForChecking.start_time" type="datetime" title="开始时间" disabled>
                </div>
                <div class="col-lg form-inline">
                  <label>结束:</label>
                  <input  class="form-control" v-model="slctdOrderForChecking.end_time" type="datetime" title="结束时间">
                </div>
                <div class="col-lg form-inline">
                  <label>里程:</label>
                  <input type="number" class="form-control" placeholder="行驶里程" v-model="slctdOrderForChecking.mileage" title="实际行驶里程">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>起点:</label>
                  <input type="text" class="form-control" placeholder="出发地点" v-model="slctdOrderForChecking.start_point" title="预计出发地点">
                </div>
                <div class="col-lg form-inline">
                  <label>终点:</label>
                  <input type="text" class="form-control" placeholder="终到地点" v-model="slctdOrderForChecking.end_point" title="计划结束地点">
                </div>
                <div class="col-lg form-inline">
                  <label>发送:</label>
                  <input type="text" class="form-control" placeholder="通知信息" v-model="slctdOrderForChecking.msg_for_driver" title="发送给司机的信息">
                </div>
              </div>
              <div class="row">                                                       
                <div class="col-lg form-inline">
                  <label>司机:</label>
                  <select type="text" class="form-control" placeholder="选择司机" v-model="slctdOrderForChecking.id_operater" title="执行任务的司机" disabled>
                    <option v-for="item in employees" :value="item.id">{{item.name}}</option>
                  </select>                   
                </div>                                                 
                <div class="col-lg form-inline">
                  <label>车辆:</label>
                  <select type="text" class="form-control" placeholder="选择车辆" v-model="slctdOrderForChecking.id_equipment" title="执行任务的车辆" disabled>
                    <option v-for="item in equipments" :value="item.id">{{item.alias}}</option>
                  </select>                  
                </div>
                <div class="col-lg form-inline">
                  <label>结算:</label>
                  <select type="text" class="form-control" placeholder="结算人" v-model="slctdOrderForChecking.id_payer" title="实际结算人" >
                    <option v-for="booker in customers" :value="booker.id">{{booker.mix_name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label>金额:</label>
                  <input type="number" class="form-control" placeholder="订单金额" v-model="slctdOrderForChecking.actual_price" title="订单金额">
                </div>
                <div class="col-lg form-inline">
                  <label>停车:</label>
                  <input type="number" class="form-control" placeholder="停车费" v-model="slctdOrderForChecking.park_fee" title="停车费">
                </div>
                <div class="col-lg form-inline">
                  <label>垫付:</label>
                  <input type="number" class="form-control" placeholder="垫付费用" v-model="slctdOrderForChecking.surcharge" title="代垫费用">
                </div>
              </div>    
              <div class="row">                                    
                <div class="col-lg form-inline">
                  <label>计价:</label>
                  <select type="text" class="form-control" placeholder="计价器" v-model="slctdOrderForChecking.id_rule_price" title="选择此客户适用的计价器" >
                    <option v-for="rule in rulesPriceForTheClient" :value="rule.id">{{rule.name}}</option>
                  </select>
                </div>                
                <div class="col-lg form-inline">
                  <label>备注:</label>
                  <input type="text" class="form-control" placeholder="备注信息" v-model="slctdOrderForChecking.mem" title="备注信息">
                </div>
                <div class="col-lg form-inline">
                  <label>说明:</label>
                  <input type="text" class="form-control" placeholder="垫付用途说明" v-model="slctdOrderForChecking.use_surcharge" title="垫付用途说明">
                </div>                                  
              </div>    
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button class="btn btn-primary saveBtn" @click="saveModifyedRcdr">保存</button>  
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
import jsonexcel from 'vue-json-excel/JsonExcel.vue';
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
        currentUserId:this.$store.state.user.id_user,
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        coQC:{
          keyWord:'',
          dateRange:[],
        },      	
        slctdOrderForChecking: {},
        projects:this.$store.state.projects,
        customers:[],
        products:this.$store.state.products,
        rulesPrices:[],
        rulesPriceForTheClient:[],
        shortcuts:false,
        rcdrSetForChecking:[],
        titleOfTable:['订单ID','单位','订车人','项目','产品','开始','结束','起点','终点','司机','车辆','里程','停车','垫付','垫付用途'],
        widthOfTH:['4','10','6','10','8','6','6','7','7','6','6','6','6','6','6'],
        equipments:this.$store.state.equipments,
        employees:this.$store.state.employees,
        
        titleOfCOHTable:['订单ID','单位','订车人','项目','产品','开始','结束','起点','终点','司机','成交价','里程','停车','垫付','垫付用途'],
        COHQC:{
          dateRange:[],
        },
        coHstrData:[],
        COH_json_data:[],
        COH_json_fields:{},
        COH_filename:'核单报表',
        COH_volName:{
          '订单ID':'id',
          '单位':'cstmr_ognz',
          '订车人':'id_contacter',
          '项目':'id_prjct_belongto',
          '产品':'id_product',
          '开始':'start_time',
          '结束':'end_time',
          '起点':'start_point',
          '终点':'end_point',
          '里程':'mileage',
          '成交价':'actual_price',
          '停车费':'park_fee',
          '垫付':'surcharge',
          '垫付用途':'use_surcharge',
          '司机':'id_operater',
          '车辆':'id_equipment',
          '备注':'mem',
          '核单人':'id_verifyer',
          '核单时间':'time_verify',
          '给司机的信息':'msg_for_driver',
        },
        fltdCstmrs:[],
        kwForCstmrs:'',
        blncOdr:{
          id_filler:this.$store.state.user.id_user,
          id_project:0,
          id_product:36,
          dscrb:'',
          amount:0.00,
          contacter:{
            mix_name:'请选择',
            clnt_dptmt_name:'',
          },
        }
      }
    },
    components: {
     datepicker,
     jsonexcel
    },    
    methods: {
      getRcdrsForModifying() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        if(this.rcdrSetForChecking.length>0) {
          this.rcdrSetForChecking=[];
        }
        if(this.coQC.dateRange.length<2 || this.coQC.dateRange[0].length<10 || this.coQC.dateRange[1].length<10){//如果日期填写不全,默认是过去1周
          var day1=new Date();
          day1.setDate(day1.getDate() - 7);
          this.coQC.dateRange[0]= day1.format("yyyy-MM-dd");
          var day2 = new Date();
          day2.setDate(day2.getDate());
          this.coQC.dateRange[1] = day2.format("yyyy-MM-dd");
        }
        this.coQC.conditions="VehiclesNotChecked";
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getOrders.php',
          data: qs.stringify(_this.coQC)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data.length<1) {
            _this.$toast({
              text: '没有符合条件的待核单记录',
              type: 'info',
              duration: 2000
            });
            return;
          } 
          _this.rcdrSetForChecking = response.data;

        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });
      },
      clearRcdrsInModifyer() {
        this.rcdrSetForChecking=[];
      },
      clickedARow:function (dataRow) {
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
        console.log(this.slctdOrderForChecking);
        // return;
        var allowSpaceProps=['msg_for_driver','park_fee','surcharge','use_surcharge','mem','cstmr_ognz','id_cashier','id_contract','id_creater','id_fill_invoice','id_request_invoice','id_verifyer','quantity','time_create','time_verify','id_rule_price','amount_received'];
        var en_zhTranslate={
        actual_price:'金额',
        amount_received:'已收金额',
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
        use_surcharge:'说明',

        };
        for(var prop in this.slctdOrderForChecking){
          if(!this.slctdOrderForChecking[prop] && !allowSpaceProps.includes(prop) && prop!='actual_price'){
            this.$toast({
              text: en_zhTranslate[prop]+' 是必填项,不允许为0或空格!',
              type: 'danger',
              duration: 2000
            });
          return;
          } else if((Number(this.slctdOrderForChecking.surcharge)>0 && (!this.slctdOrderForChecking.use_surcharge.length || this.slctdOrderForChecking.use_surcharge.length<2)) || (Number(this.slctdOrderForChecking.surcharge)<=0 && (this.slctdOrderForChecking.use_surcharge.length>2 || this.slctdOrderForChecking.use_surcharge.length))){
              this.$toast({
                text: '垫付和说明不匹配!',
                type: 'danger',
                duration: 2000
              });
              return;
          }
          if(prop=='actual_price' && (this.slctdOrderForChecking[prop]<0 || !this.slctdOrderForChecking[prop])) {
            this.$toast({
              text: en_zhTranslate[prop]+' 不能为空格或小于0!',
              type: 'danger',
              duration: 2000
            });
          }
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.slctdOrderForChecking.id_verifyer=this.$store.state.user.id_user;
        var coQC=this.slctdOrderForChecking;
        coQC.conditions="WithCheckedData";
        //保存到数据库
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateOrders.php',
          data: qs.stringify(coQC)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data===true) {
            _this.$toast({
              text: '成功保存数据!',
              type: 'success',
              duration: 800
            });
            $('#mdfRecorder').modal('toggle');
            //从列表中移除
            _this.rcdrSetForChecking.forEach(function(item, index, arr) {
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
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
          $('#mdfRecorder').modal('toggle');
        });
      },
      cstmrChanged:function() {
        if(this.kwForCstmrs.replace(/^\s+|\s+$/g,"").length) {
          this.fltdCstmrs=this.customers.filter(function(c){
            for(let prop in c) {
              if(c[prop] && c[prop].indexOf(this.kwForCstmrs)>-1) {
                return c;
                break;
              }
            }
          },this);
          if(this.fltdCstmrs.length && this.fltdCstmrs.length!==this.customers.length) {
        console.log(this.fltdCstmrs);
            this.blncOdr.contacter=this.fltdCstmrs[0];
          } else {
            this.blncOdr.contacter={mix_name:"请选择",};
          }
        } else {
          this.fltdCstmrs=JSON.parse(JSON.stringify(this.customers));
          this.blncOdr.contacter={mix_name:"请选择",};
        }
      },
      svBlncOdr() {
        if(this.blncOdr.id_project==0) {
          this.$toast({text:'请选择所属项目',type:'info',duration:1500});
          return;
        }
        if(this.blncOdr.contacter.mix_name=="请选择") {
          this.$toast({text:'请选择客户',type:'info',duration:1500});
          return;
        }
        if(this.blncOdr.amount==0) {
          this.$toast({text:'请填写调节金额',type:'info',duration:1500});
          return;
        }
        if(this.blncOdr.dscrb.length<4) {
          this.$toast({text:'请填写调节说明',type:'info',duration:1500});
          return;
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.blncOdr.conditions="insertBlanceOrder";
        //保存到数据库
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'updateOrders.php',
          data: qs.stringify(_this.blncOdr)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data===true) {
            _this.$toast({text:'成功保存数据!',type:'success',duration:800});
            _this.blncOdr.contacter={mix_name:"请选择",};
            _this.blncOdr.id_project=0;
            _this.blncOdr.amount=0;
            _this.blncOdr.dscrb='';
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:4000});
          } 
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({text:'异步通信错误!',type:'danger',duration:4000});
        });
      },
      getCOHistoryData () {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        if(this.COHQC.dateRange.length<2 || this.COHQC.dateRange[0].length<10 || this.COHQC.dateRange[1].length<10){//如果日期填写不全,默认是过去1周
          var thisDay = new Date();
          thisDay.setDate(thisDay.getDate());
          this.COHQC.dateRange[0]= this.COHQC.dateRange[1] = thisDay.format("yyyy-MM-dd");
        }
        this.COH_filename="核单报表";
        this.COH_filename+=this.COHQC.dateRange[0]+'_'+this.COHQC.dateRange[1];
        this.COHQC.dateRange[0]+=(this.COHQC.dateRange[0].indexOf('00:00:00')==-1?' 00:00:00':'');
        this.COHQC.dateRange[1]+=(this.COHQC.dateRange[1].indexOf('23:59:59')==-1?' 23:59:59':'');
        this.COHQC.conditions="COHistory";
        this.COHQC.uid=this.currentUserId;
        this.coHstrData=[];
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getOrders.php',
          data: qs.stringify(_this.COHQC)
        }).then(function (response) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(response.data);
          if(response.data.length<1) {
            _this.$toast({text:'没有符合条件的待核单记录',type:'info',duration:2000});
            return;
          } 
          _this.coHstrData = response.data;
          _this.coHstrData.forEach(function(item,index,array){
            var ar=_this.projects.find((ele) => ele['id'] == item.id_prjct_belongto);
            item.id_prjct_belongto=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.products.find((ele) => ele['id'] == item.id_product);
            item.id_product=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_operater);
            item.id_operater=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.employees.find((ele) => ele['id'] == item.id_verifyer);
            item.id_verifyer=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.customers.find((ele) => ele['id'] == item.id_contacter);
            item.id_contacter=typeof(ar)=='undefined'?'':ar['name'];
            var ar=_this.equipments.find((ele) => ele['id'] == item.id_equipment);
            item.id_equipment=typeof(ar)=='undefined'?'':ar['alias'];
          });
          _this.COH_json_data=[];
          _this.COH_json_fields={};
          _this.COH_json_data=_this.coHstrData;
          for(var prop in _this.COH_volName) {
            _this.COH_json_fields[prop]=_this.COH_volName[prop];
          }
        }).catch(function (error) {
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });        
      },          	
    },
    watch: {
      'slctdOrderForChecking.id_rule_price': {
        handler: function() {
          if(this.slctdOrderForChecking.id_rule_price==7) {//防止影响到后续操作
            return;
          }
          var _this=this;
          var countMissMeal=0;
          this.rulesPrices.forEach(function(item, index, arr) {
            if(_this.slctdOrderForChecking.id_rule_price===item.id) {
              //获取用车时长
              var sttTm=new Date(_this.slctdOrderForChecking.start_time);
              var ndTm=new Date(_this.slctdOrderForChecking.end_time);
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
      var coQC={};
      this.customers=[];
      this.$axios({
        method: 'post',
        url: 'getContacters.php'
      }).then(function (response) {
        _this.customers=response.data;
        _this.fltdCstmrs=JSON.parse(JSON.stringify(_this.customers));
      }).catch(function (error) {
        _this.$toast({text:'通信错误!',type:'danger',duration:4000});
      });
      this.rulesPrices=[];
      let queryContent={};
      queryContent.keyWord="";
      this.$axios({
        method: 'post',
        url: 'getRulesPrice.php',
        data:qs.stringify(queryContent)
      }).then(function (response) {
        _this.rulesPrices=response.data;
      }).catch(function (error) {
        _this.$toast({text:'通信错误!',type:'danger',duration:4000});
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
.query-body button {
  margin-right: 10px;
}
.mx-input-wrapper {
  width: 100%;
}
#mdfRecorder input,#mdfRecorder select {
  width:80%;
}
.row {
  margin-bottom: 5px;
}
/*.table table-hover {
  font-size: 12px;
}*/
.datepicker {
  margin-left: 10px;
}
button {
  margin-left: 10px;
}
table {
  font-size: 14px;
}
.tipFormdfRecorder {
  color: red;
}
.tab-content {
  margin-top: 5px;
}
#balanceOrder .form-inline,#balanceOrder .btnrow{
  margin-top: 10px;
}
</style>
