<template>
<div class="father">
  <h5>当前位置:采购业务/询价比价</h5>
  
  <div class="container-fluid">
    <div class="form-group form-inline">
      <div class="row">
        <div class="col-lg">
          <span for="schKeyWds">关键词:</span>
          <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="项目名称\物品名称\规格型号\厂家品牌等">
          <button @click="getApprovedApplyingPurchasings" class="btn btn-primary" type="button">搜索数据</button>
          <button @click="clearApprovedPurchasingList"class="btn btn-secondary" type="button" v-if="listOfApprovedPurchasing.length>0">清空</button>
        </div>        
      </div>

    </div>
    <div class="listShower" v-if="listOfApprovedPurchasing.length>0">
      <table class="table table-hover">
        <thead>
          <th v-for="title,index in titleOfListStatic">{{title}}</th>
          <!-- <th>询价比价单</th> -->
        </thead>
        <tbody>
          <tr v-for="row in listOfApprovedPurchasing" :style="unPassed(row)" @click="clickedARow(row)">
            <!-- <td v-for="prop in row" :title='prop'>{{prop}}</td> -->
            <td>{{row.id_project}}</td>
            <td>{{row.name}}</td>
            <td>{{row.quantity}}</td>
            <td>{{row.unit}}</td>
            <td>{{row.brand}}</td>
            <td>{{row.model}}</td>
            <td>{{row.detail}}</td>
            <td>{{row.date_needed}}</td>
            <td>{{row.remark}}</td>
<!--             <td>{{row.result_of_approved_comparing==0?'比价未提交':'比价未通过'}}</td> -->
            <td>{{resultTextOfApprovedComparing(row.result_of_approved_comparing)}}</td>
            <td class="addEnquiry">
              <!-- <i class="oi oi-plus"></i>  title="添加询价比价单"-->
              <button @click.stop="newEnquiryCompare(row)">
                <font-awesome-icon icon="plus" title="添加询价"/>
              </button>
              <button @click.stop="modifyEnquiryCompare(row)">
                <font-awesome-icon :icon="['fas', 'tasks']" title="比价"/>
              </button>
            </td>
            <td v-show="false">{{row.id}}</td>
          </tr>
        </tbody>
      </table>
    </div>      
  </div>
  <div class="modal fade" id="showerOfDetails" role="dialog" aria-labelledby="showerOfDetails" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>未通过审核的比价单--请购ID:{{appliedPurchasingDetails.id}}</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <table class="table table-hover">
                <thead>
                  <th v-for="title,index in titleOfEnquiries">{{title}}</th>
                </thead>
                <tbody>
                  <tr v-for="row in enquiries" :style="row.is_made_deal?'color:red;font-weight:bold;':''" :title="row.is_made_deal?'已选中此行':'未选中'">
                    <!-- <td v-for="vlu in row" :title='vlu'>{{vlu}}</td> -->
                    <td>{{row.id}}</td>
                    <td>{{row.seller}}</td>
                    <td>{{row.price_include_tax}}</td>
                    <td>{{row.actual_amount}}</td>
                    <td>{{(new Date(row.promise_delivery_date)).format("yyyy-MM-dd")}}</td>
                    <td>{{row.way_payment}}</td>
                    <td>{{row.reason_of_deal}}</td>
                  </tr>
                </tbody>
              </table>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="addEnquiry">添加询价</button>
        </div>  
      </div>
    </div>
  </div>
  <div class="modal fade" id="addEnquiryCompare" role="dialog" aria-labelledby="addEnquiryCompare" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>新建询价单---保存后不可修改,请认真填写!--请购ID:{{id_applyedPurchasing}}</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="sellerName">商家名称</label>
                <input  class="form-control" id="sellerName" type="text" v-model="enquiry.seller">
              </div>
              <div class="col-lg form-inline">
                <label for="contacter">联系人</label>
                <input  class="form-control" id="contacter" type="text" v-model="enquiry.contacter">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="tel">联系电话</label>
                <input  class="form-control" id="tel" type="text" v-model="enquiry.tel">
              </div>              
              <div class="col-lg form-inline">
                <label for="price">含税价</label>
                <input  class="form-control" id="price" type="number" v-model="enquiry.priceIncludedTax">
              </div>
            </div>
            <div class="row">              
              <div class="col-lg form-inline">
                <label for="payment">支付方式</label>
                <input  class="form-control" id="payment" type="text"  v-model="enquiry.wayOfPayment">
              </div>              
              <div class="col-lg form-inline">
                <label for="date">交货日</label>
                <input  class="form-control" id="date" type="date" v-model="enquiry.promiseDeliveryDate">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="remark">备注信息</label>
                <input  class="form-control" id="remark" type="text" v-model="enquiry.remark">
              </div>
              <div class="col-lg form-inline">
                <label for="remark">总金额</label>
                <input  class="form-control" id="actualAmount" type="text" v-model="enquiry.actualAmount">
              </div>              
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveEnquiry">保存</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="modifyEnquiry" role="dialog" aria-labelledby="modifyEnquiry" data-backdrop="static" data-keyboard: false>
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5>比价单--请购ID:{{id_applyedPurchasing}}</h5><!-- (<span style="color:red;">红色为以前选定的商家</span>) -->
        </div>
        <div class="modal-body">
          <div class="container-fluid">
<!--             <div class="row">
              <div class="col-lg form-inline">
              </div>
            </div> -->
            <table class="table table-hover table-condensed">
              <thead>
                <th v-for="title,index in titleOfEnquiries">{{title}}</th>

              </thead>
              <tbody><!--  @click="clickedARow" <td class="addEnquiry"></td>-->
                <tr v-for="row in enquiries" :style="row.is_made_deal==1?'color:red;':''">
                  <!-- <td v-for="item in row" :title='item'>{{item}}</td> -->
                  <td title='询价ID'>{{row.id}}</td>
                  <td :title='row.seller'>{{row.seller}}</td>
                  <td :title='row.price_include_tax'>{{row.price_include_tax}}</td>
                  <td :title='row.actual_amount'>{{row.actual_amount}}</td>
                  <td :title='row.promise_delivery_date'>{{(new Date(row.promise_delivery_date)).format("yyyy-MM-dd")}}</td>
                  <td :title='row.way_payment'>{{row.way_payment}}</td>
                  <td :title='row.remark'>{{row.remark}}</td>
                  <td title='点击选择'>
                    <input class="form-control" type="radio" :value="row.id" v-model="resultOfComparePrice.selectedID"><!-- resultOfComparePrice.selectedID -->
                  </td>

<!--    :checked="row.is_made_deal==1?true:false"                <td>
                    <input type="radio" :checked="row.is_made_deal==1?true:false">
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <label><b>选定理由</b></label><input id="reasonOfChoose" class="form-control" type="text" v-model="resultOfComparePrice.reason">
          
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveDataToApprove">提交审核</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import qs from 'qs';
import '@icon/open-iconic/open-iconic.css'

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
  export default ({
    data() {
      return {
        queryContent:{
          keyWord:'',
          id_applyedPurchasing:'',
          conditions:''

        },
        appliedPurchasingDetails:{
          id:'',
          project:'',
          id_project:'',
          name:'',
          unit:'',
          quantity:'',
          brand:'',
          model:'',
          detail:'',
          neededDate:'',
          remark:'',
          id_applier:1,
          applier:''
        },
        enquiry: {
          seller:'',
          contacter:'',
          tel:'',
          priceIncludedTax:'',
          wayOfPayment:'',
          promiseDeliveryDate:'',
          remark:'',
          id_enquiryer:this.$store.state.user.id_user,
          actualAmount:0,
          idApplyed:''
        },
        listOfApprovedPurchasing:[],
        titleOfList:[],
        titleOfListStatic:['项目','物品','数量','单位','品牌','型号','细节','期望日期','备注','比价审核结果','询价比价'],
        projects:[],
        employees:[],
        id_applyedPurchasing:'',
        enquiries:[],
        // titleOfEnquiries:[],
        titleOfEnquiries:['询价ID','商家','含税价','总金额','到货日期','付款方式','备注信息','选定'],
        selectedID:'',//选定的询价单ID
        // showReasonBox:false
        resultOfComparePrice:{
          selectedID:'11',
          reason:'',
          idOfApplyedPurchasing:''
        },
        style:{
          color:'red'
        }
      }
    },
    methods:{
      clickedARow (dataRow) {
        this.appliedPurchasingDetails.id=dataRow.id;
        this.appliedPurchasingDetails.id_project=dataRow.id_project;
        this.appliedPurchasingDetails.name=dataRow.name;
        this.appliedPurchasingDetails.quantity=dataRow.quantity;
        this.appliedPurchasingDetails.unit=dataRow.unit;
        this.appliedPurchasingDetails.brand=dataRow.brand;
        this.appliedPurchasingDetails.model=dataRow.model;
        this.appliedPurchasingDetails.detail=dataRow.detail;
        this.appliedPurchasingDetails.neededDate=dataRow.date_needed;
        this.appliedPurchasingDetails.remark=dataRow.remark;
        this.appliedPurchasingDetails.id_applier=dataRow.id_applier;
        for(var i=0;i<this.projects.length;i++) {
          if(this.appliedPurchasingDetails.id_project===this.projects[i].id) {
            this.appliedPurchasingDetails.project=this.projects[i].prjct;
          }
        }
        for(var i=0;i<this.employees.length;i++) {
          if(this.appliedPurchasingDetails.id_applier===this.employees[i].id) {
            this.appliedPurchasingDetails.applier=this.employees[i].name;
          }
        }
        //获取对应此applyedID的询价比价单
        this.queryContent.conditions='EnquiryingNotPassedApproving';
        this.queryContent.id_applyedPurchasing=this.appliedPurchasingDetails.id;
        this.enquiries=[]; 
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getEnquiries.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(response.data.length>0) {
            _this.enquiries = response.data;

            //为resultOfComparePrice.selectedID设置初始值
            for(var i=0;i<_this.enquiries.length;i++) {
              if(_this.enquiries[i].is_made_deal) {
                _this.resultOfComparePrice.selectedID=_this.enquiries[i].id;               
              }
            }
        $('#showerOfDetails').modal('toggle');

          } else {
            _this.$toast({
              text: '找不到对应的询价比价记录',
              type: 'info',
              duration: 1000
            });              
          }
        }).catch(function (error) {
          console.log(error);
        });        
      },
      getApprovedApplyingPurchasings () {
        this.listOfApprovedPurchasing=[];
        this.titleOfList=[];
        this.queryContent.conditions='NotComparedOrEnquiryNotCommitedOrNotPassedApproving';//enquiry未提交审核或审核未通过的
        var _this = this;
        this.$axios({
          method: 'post',
          url: 'getAppliedPurchasings.php',
          data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length>0) {
              _this.listOfApprovedPurchasing = response.data;
              var ttl='';
              for(ttl in _this.listOfApprovedPurchasing[0]) {
                _this.titleOfList.push(ttl);
              }              
            } else {
              _this.$toast({
                text: '找不到需要比价的记录',
                type: 'info',
                duration: 2000
              });              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      clearApprovedPurchasingList() {
        this.listOfApprovedPurchasing=[];
        this.titleOfList=[];
      },
      newEnquiryCompare(dataRow) {
        //获取申请ID
        this.id_applyedPurchasing=dataRow.id;
        $('#addEnquiryCompare').modal('toggle');
      },
      saveEnquiry() {
        if(this.enquiry.seller.length<2) {
          this.$toast({
            text: '商家名称字数太少!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.contacter.length<2) {
          this.$toast({
            text: '联系人字数太少',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.tel.length<8) {
          this.$toast({
            text: '联系电话字数太少!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.priceIncludedTax<0 || this.enquiry.priceIncludedTax=='') {
          this.$toast({
            text: '含税价不对!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.wayOfPayment.length<2) {
          this.$toast({
            text: '支付方式太短!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.promiseDeliveryDate.length<2) {
          this.$toast({
            text: '交货日期太短!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        if(this.enquiry.actualAmount<0) {
          this.$toast({
            text: '总金额太少!',
            type: 'info',
            duration: 1500
          });
          return;          
        }
        this.enquiry.idApplyed=this.id_applyedPurchasing;
        var _this = this;
        this.$axios({
            method: 'post',
            url: 'insertNewToEnquiryPrice.php',
            data: qs.stringify(_this.enquiry)
          }).then(function (response) {
            if(response.data===true) {
                _this.$toast({
                   text: '成功保存数据!',
                   type: 'success',
                   duration: 800
                });
              $('#addEnquiryCompare').modal('toggle');
              _this.enquiry.seller='';              
              _this.enquiry.contacter='';
              _this.enquiry.tel='';
              _this.enquiry.priceIncludedTax=0;
              _this.enquiry.wayOfPayment='';
              _this.enquiry.promiseDeliveryDate='';
              _this.enquiry.remark='';
              _this.enquiry.actualAmount=0;
              _this.enquiry.idApplyed='';
              _this.enquiry.remark='';
           } else {
              _this.$toast({
                 text: '通信错误!'+response.data,
                 type: 'danger',
                 duration: 4000
              });
              $('#addEnquiryCompare').modal('toggle');
            } 
          }).catch(function (error) {
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
               duration: 4000
            });
            $('#addEnquiryCompare').modal('toggle');
          })
      },
      modifyEnquiryCompare (dataRow) {
        //设置查询条件
        this.queryContent.id_applyedPurchasing=dataRow.id;
        this.queryContent.conditions="NotSelectedSellerOrNotPassedApproving";

        //获取请购ID
        this.id_applyedPurchasing=dataRow.id;
        //获取对应清单
        var _this = this;
        this.enquiries=[];
        // this.titleOfEnquiries=[];
        this.$axios({
              method: 'post',
              url: 'getEnquiries.php',
              data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            if(response.data.length<1) {
              _this.$toast({
                text: '找不到询价单!',
                type: 'info',
                duration: 1000
              });
              return;        
            }
            _this.enquiries=response.data;
            $('#modifyEnquiry').modal('toggle');
            _this.queryContent.id_applyedPurchasing='';
            _this.queryContent.keyWord='';
          }).catch(function (error) {
            _this.$toast({
               text: '异步通信错误!'+error,
               type: 'danger',
                duration: 4000
            });
          });        
      },
      addEnquiry () {
        this.id_applyedPurchasing=this.appliedPurchasingDetails.id;
        $('#showerOfDetails').modal('toggle');
        $('#addEnquiryCompare').modal('toggle');

        // this.$nextTick( () => {
        //   $('#addEnquiryCompare').modal('toggle');
        // })        
      },
      saveDataToApprove() {
        if(this.resultOfComparePrice.reason.length<4){
          this.$toast({
            text: '选定理由最少4个字!',
            type: 'danger',
            duration: 3000
          });
          return;
        }
        if(!this.resultOfComparePrice.selectedID) {
          this.$toast({
            text: '请选择一项',
            type: 'danger',
            duration: 2000
          });
          return;
        }
        this.resultOfComparePrice.idOfApplyedPurchasing=this.id_applyedPurchasing;
        var _this=this;
        var url='updateEnquiriesWithComparedPrice.php';
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(_this.resultOfComparePrice)
        }).then(function (response) {
          if(response.data===true) {
              _this.$toast({
                 text: '已成功提交审核!',
                 type: 'success',
                  duration: 1000
              });
            $('#modifyEnquiry').modal('toggle');
            _this.resultOfComparePrice.selectedID='';              
            _this.resultOfComparePrice.reason='';
          } else {
        console.log(response.data);
            _this.$toast({
               text: '通信错误!'+response.data,
               type: 'danger',
               duration: 4000
            });
            $('#modifyEnquiry').modal('toggle');
          } 
        }).catch(function (error) {
          _this.$toast({
             text: '异步通信错误!'+error,
             type: 'danger',
             duration: 4000
          });
          $('#modifyEnquiry').modal('toggle');
        });
      },
      unPassed(dataRow) {
        return (dataRow.result_of_approved_comparing==1?this.style:'');
      }
    },
    filters:{
      getNameByProjectID(id,projects) {
        // console.log(id);
        // console.log(projects);
        projects.forEach(function(item,index,array){
          if(item.id==id) {
            // console.log(item.name);
            return id.replace(item.name);
          }
        })        
      }
    },
    computed:{
      resultTextOfApprovedComparing() {
          return function(intResult){
            if(!intResult && typeof(intResult)!="undefined" && intResult!=0) {
              return '未提交比价单';
            }
            if(intResult==0) {
              return '已提交,但未审核';
            }
            if(intResult==1) {
              return '已审核,但未通过';
            }       
          }           
      }
    },
    beforeCreate() {
     var _this = this;
     this.projects=[];
     this.$axios({
           method: 'post',
           url: 'getProject.php'
       }).then(function (response) {
         _this.projects=response.data;
       }).catch(function (error) {
         _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
             duration: 4000
         });
       });
     this.employees=[];
     this.$axios({
           method: 'post',
           url: 'getEmployees.php'
       }).then(function (response) {
         _this.employees=response.data;
       }).catch(function (error) {
         _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
             duration: 4000
         });
       });        
    },
    watch:{

    }
  })
</script>
<style scopede>
  .row {
    margin:5px 0px;
  }
  .btngroup {
    display: inline-block;
    text-align: right;
  }
  .clearBtn ,.saveBtn {
    margin-right: 10px;
    width: 100px;
  }
  .container-fluid {
    width: 100%;
  }
#showerOfDetails input,#showerOfDetails select {
  width: 80%;
}
#addEnquiryCompare input,#addEnquiryCompare select {
  width: 80%;
}
.radio-group {
/*  display:inline-block; 
  width:40px;*/
  height: 1.2em;
  vertical-align:middle;
  margin-top:-2px;
  margin-bottom:1px;
}
.radio-inline {
  /*display: inline-block;*/
  width: 50%;
  text-align: center;
}
input[type=radio] {
  width: 1.2em!important;
}
.addEnquiry {
  color: blue;
  cursor:pointer;

}
.addEnquiry  button {
  margin:auto 5px;
  width: 30px;
  /*border-radius:1em;*/
  color:#007bff;
  /*border: solid 2px #007bff;*/
}
.addEnquiry  button:hover {
  color: #dc3545;
  border: solid 2px #dc3545;
}
#reasonOfChoose {
  margin-right: 50px;
  width: 60%;
}
/*#remark {
  width: 80%;
}*/
</style>

