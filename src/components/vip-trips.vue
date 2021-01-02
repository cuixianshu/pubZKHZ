<template>
<div class="father">
  <h5>当前位置:VIP行程管理</h5>
  <div class="container-fluid">
    <div v-if="showPrjctPicker">
      <input type="text" class="form-control" placeholder="请输入搜索词" v-model="prjctKW" @input="prjctKwChanged">
      <ul v-if="dueProjects.length>0">
        <li v-for="item in fltdPrjct" class="mgtp10 thinborder" @click="clkAProject(item)">
          <div class="info-box">
            <div class="form-inline">
              <label>会议:</label><span>{{item.name}}</span>
            </div>
          </div>
          <div class="info-box">
            <div class="form-inline">
              <label>日期:</label><span>{{item.time_start}}</span>
            </div>
            <div class="form-inline">
              <label>主办:</label><span>{{item.name_part_a}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="showVipsInCurProject">
      <div class="row">
        <div class="col-lg">
          <button class="btn btn-link" @click="bkToProjectPicker">返回会议选择页面</button>
        </div>
        <div class="col-lg">
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <ul v-if="vipsInCurProject.length>0">
        <h5>请选择一VIP以新建或修改行程</h5>
        <input type="text" class="form-control" placeholder="请输入搜索词" v-model="kwForFdgJndVip" @input="kwForJndVipInputed">
        <li v-for="item in fltdVipsInCurProject" class="mgtp10 thinborder" @click="clkAVIP(item)">
          <div class="info-box">
            <div class="form-inline">
              <label>姓名:</label><span>{{item.name}}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{{item.pro_rank}}</span>
            </div>
          </div>
          <div class="info-box">
            <div class="form-inline">
              <label>职务:</label><span>{{item.position}}</span>
            </div>
            <div class="form-inline">
              <label>单位:</label><span>{{item.ognztn}}</span>
            </div>
            <div class="form-inline">
              <label>计数:</label><span>{{item.count_trips}}</span>
            </div>
            <div class="form-inline">
              <label>更新:</label><span>{{item.last_modified_time?item.last_modified_time:'----'}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="vipsInCurProject.length<1"><h5>还没有VIP参会</h5></div>
    </div>
    <div v-if="showTripsPanel">
      <div class="row">
        <div class="col-lg">
          <button class="btn btn-link" @click="bkToVipsListInCurProject">返回VIP列表</button>
        </div>
        <div class="col-lg" v-if="!isNewCreateTrip">
          <button class="btn btn-primary" @click="createNewTripsForTheVip">新建行程</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="showTripList">
        <ul v-if="tripsForTheVIP.length>0">
          <h5>{{vip.name}}--的行程</h5>
          <li v-for="item in tripsForTheVIP" class="mgtp10 thinborder" @click="clkATrip(item)">
            <div class="info-box">
              <div class="form-inline">
                <label>出发时间:</label><span>{{item.time_departure}}</span>
              </div>
              <div class="form-inline">
                <label>出发地点:</label><span>{{item.plc_departure}}</span>
              </div>
              <div class="form-inline">
                <label>抵达时间:</label><span>{{item.time_arrival}}</span>
              </div>
              <div class="form-inline">
                <label>目的地点:</label><span>{{item.plc_destination}}</span>
              </div>
              <div class="form-inline">
                <label>交通工具:</label><span>{{item.transports}}</span>
              </div>
              <div class="form-inline">
                <label>班次车次:</label><span>{{item.num_trnspts}}</span>
              </div>
              <div class="form-inline">
                <label>随从人员:</label><span>{{item.entourage}}</span>
              </div>
              <div class="form-inline">
                <label>官方迎接:</label><span>{{item.official_greeter}}</span>
              </div>
              <div class="form-inline">
                <label>是否接送:</label><span>{{item.need_car==1?'是':'否'}}</span>
              </div>
              <div class="form-inline">
                <label>接送车辆:</label><span>{{item.driver_car}}</span>
              </div>
              <div class="form-inline">
                <label>备注信息:</label><span>{{item.remark}}</span>
              </div>
              <div class="row">
                <div class="col">
                  <button class="btn btn-secondary btn-sm" @click="delTheTrip(item)">删除此行程</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="tripsForTheVIP.length<1"><h5>没有{{vip.name}}的行程信息</h5></div>
      </div>
      <div v-if="showTripEditer">
          <h5>{{vip.name}}--的行程</h5>
          <div class="editer-box">
            <div class="form-inline mgtp10">
              <label>出发时间:</label><input type="datetime-local" class="form-control" v-model="trip.time_departure">
            </div>
            <div class="form-inline mgtp10">
              <label>出发地点:</label><input type="text" class="form-control" v-model="trip.plc_departure">
            </div>
            <div class="form-inline mgtp10">
              <label>抵达时间:</label><input type="datetime-local" class="form-control" v-model="trip.time_arrival">
            </div>
            <div class="form-inline mgtp10">
              <label>目的地点:</label><input type="text" class="form-control" v-model="trip.plc_destination">
            </div>
            <div class="form-inline mgtp10">
              <label>交通工具:</label>
              <select class="form-control" v-model="trip.transports">
                <option value="飞机">飞机</option>
                <option value="火车">火车</option>
                <option value="大巴">大巴</option>
                <option value="中巴">中巴</option>
                <option value="小巴车">小巴车</option>
                <option value="商务车">商务车</option>
                <option value="轿车">轿车</option>
              </select>
            </div>
            <div class="form-inline mgtp10">
              <label>班次车次:</label><input type="text" class="form-control" v-model="trip.num_trnspts">
            </div>
            <div class="form-inline mgtp10">
              <label>随从人员:</label><input type="text" class="form-control" v-model="trip.entourage" placeholder="姓名及电话">
            </div>
            <div class="form-inline mgtp10">
              <label>官方迎接:</label><input type="text" class="form-control" v-model="trip.official_greeter" placeholder="姓名及电话">
            </div>
<!--             <div class="form-inline mgtp10">
              <label>酒店房型</label><input type="text" class="form-control" v-model="trip.time_departure" placeholder="入住酒店及房间类型">
            </div>
            <div class="form-inline mgtp10">
              <label>入住时间</label><input type="datetime-local" class="form-control" v-model="trip.time_departure">
            </div>
            <div class="form-inline mgtp10">
              <label>退房时间</label><input type="datetime-local" class="form-control" v-model="trip.time_departure">
            </div> -->
<!--             <div class="form-inline mgtp10">
              <label>专职负责</label><input type="text" class="form-control" v-model="trip.id_resp">
            </div> -->
            <div class="form-inline mgtp10">
              <label>是否接送:</label>
              <select class="form-control" v-model="trip.need_car">
                <option value="0">否</option>
                <option value="1">是</option>
              </select>              
            </div>
            <div class="form-inline mgtp10">
              <label>接送车辆:</label><input type="text" class="form-control" v-model="trip.driver_car">
            </div>
            <div class="form-inline mgtp10">
              <label>备注信息:</label><input type="text" class="form-control" v-model="trip.remark">
            </div>
            <div class="row mgtp10">
              <div class="col">
                <button class="btn btn-primary" @click="saveTheTrip">保存此行程</button>
              </div>
            </div>
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
    data(){
      return {
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        curUsrId:this.$store.state.user.id_user,
        prjctKW:'',
        fltdPrjct:[],
        dueProjects:[],
        id_curProject:0,
        kwForFdgJndVip:"",
        tripsForTheVIP:[],
        vipsInCurProject:[],
        fltdVipsInCurProject:[],
        queryContent:{
          keyWord:'',
          conditions:'',
        },
        trip:{},
        showVipsInCurProject:false,
        showPrjctPicker:true,
        showTripsPanel:false,
        showTripList:false,
        showTripEditer:false,
        vip:{},
        orgTrip:"",
        checkType:Object.prototype.toString,
        isNewCreateTrip:false,
      }

    },
    methods:{
      prjctKwChanged() {
        if(this.prjctKW.replace(/^\s+|\s+$/g,"").length) {
          this.fltdPrjct=this.dueProjects.filter(function(p){
            for(let prop in p) {
              if(this.checkType.call(p[prop])==='[object String]' && p[prop].indexOf(this.prjctKW)>-1) {
                return p;
                break;
              }
            }
          },this);
        } else {
          this.fltdPrjct=JSON.parse(JSON.stringify(this.dueProjects));
        }
      },
      kwForJndVipInputed() {
        if(this.kwForFdgJndVip.replace(/^\s+|\s+$/g,"").length) {
          this.fltdVipsInCurProject=this.vipsInCurProject.filter(function(p){
            for(let prop in p) {
              if(this.checkType.call(p[prop])==='[object String]' && p[prop].indexOf(this.kwForFdgJndVip)>-1) {
                return p;
                break;
              }
            }
          },this);
        } else {
          this.fltdVipsInCurProject=JSON.parse(JSON.stringify(this.vipsInCurProject));
        }
      },
      clkAProject(p) {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showPrjctPicker=false;
        this.showVipsInCurProject=true;
        this.showTripsPanel=false;
        this.kwForFdgJndVip="";
        this.id_curProject=p.id;
        let queryContent={};
        queryContent.conditions="vipInTheProjectWithTripsCount";
        queryContent.id_project=p.id;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.vipsInCurProject=response.data;
          _this.fltdVipsInCurProject=JSON.parse(JSON.stringify(_this.vipsInCurProject));
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 4000
          });
        });
      },
      bkToProjectPicker() {
        this.vips=[];
        this.showVipsInCurProject=false;
        this.showPrjctPicker=true;
      },
      clkAVIP (v) {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showVipsInCurProject=false;
        this.showTripsPanel=true;
        this.showTripList=true;
        this.isNewCreateTrip=false;
        this.tripsForTheVIP=[];
        this.vip=v;
        let queryContent={};
        queryContent.conditions="tripsOfCurVIP";
        queryContent.id_project=this.id_curProject;
        queryContent.id_vip=v.id;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tripsForTheVIP=response.data;
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 4000
          });
        });        
      },
      clkATrip(t) {
        this.isNewCreateTrip=false;
        this.showTripList=false;
        this.trip=JSON.parse(JSON.stringify(t));
        this.trip.time_departure=this.trip.time_departure?this.trip.time_departure.replace(" ","T"):"";
        this.trip.time_arrival=this.trip.time_arrival?this.trip.time_arrival.replace(" ","T"):"";
        console.log(this.trip);
        this.showTripEditer=true;
      },
      createNewTripsForTheVip() {
        this.isNewCreateTrip=true;
        this.showTripList=false;
        this.showTripEditer=true;
        this.trip={
          id:0,
          id_vip:this.vip.id,
          id_project:this.id_curProject,
          time_departure:"",
          time_arrival:"",
          transports:"飞机",
          plc_departure:"",
          plc_destination:"",
          num_trnspts:"",
          entourage:"",
          official_greeter:"",
          id_resp:this.curUsrId,
          need_car:1,
          driver_car:"",
          remark:"",
          id_modifyer:this.curUsrId,

        }
      },
      saveTheTrip() {
        let queryContent={};
        this.trip.time_departure=this.trip.time_departure?this.trip.time_departure:"";
        this.trip.time_arrival=this.trip.time_arrival?this.trip.time_arrival:"";
        let s=this.trip.time_departure;
        let e=this.trip.time_arrival;
        if(s.length==0 && e.length==0) {
          this.$toast({text:'起始时间,根据情况,至少填写一项!',type:'danger',duration:3000});
          return;
        }
        if(s.length && e.length) {
          if(e<=s) {
            this.$toast({text:'抵达时间必须晚于出发时间!',type:'danger',duration:3000});
            return;
          }
        }
        if(this.trip.plc_departure.length==0 && this.trip.plc_destination.length==0) {
          this.$toast({text:'起始地点,根据情况,至少填写一项!',type:'danger',duration:3000});
          return;
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        queryContent.trip=JSON.parse(JSON.stringify(this.trip));
        queryContent.curUsrId=this.curUsrId;
        queryContent.trip.time_departure=(queryContent.trip.time_departure).replace("T"," ");
        queryContent.trip.time_arrival=(queryContent.trip.time_arrival).replace("T"," ");
        // queryContent.id_project=this.id_curProject;
        let url='';
        if(this.isNewCreateTrip) {
          queryContent.conditions="newCreate";
          url='insertNewToVipTrips.php';
        } else {
          queryContent.conditions="ModifyAnExistTrip";
          url='updateVipTrips.php';
        }
        // this.showVipsInCurProject=false;
        // this.showTripsPanel=true;
        let _this=this;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data==true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
            if(_this.isNewCreateTrip) {
              _this.vip.count_trips+=1;
            }
            _this.vip.last_modified_time=(new Date()).format("yyyy-MM-dd hh:mm:ss");
            _this.showTripEditer=false;
            _this.showTripList=false;
            _this.showTripsPanel=false;
            _this.showVipsInCurProject=true;
            _this.isNewCreateTrip=false;
          } else {
            _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:3000});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({
            text: '通信错误!'+response.data,
            type: 'danger',
            duration: 4000
          });
        });

      },
      delTheTrip(t) {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        let queryContent={
          conditions:'deleteATripByTripId',
          id_trip:t.id,
          id_modifyer:this.curUsrId,
        }
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data==true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
            _this.vip.count_trips-=1;
            _this.vip.last_modified_time=(new Date()).format("yyyy-MM-dd hh:mm:ss");
            _this.showTripsPanel=false;
            _this.showTripList=false;
            _this.showTripEditer=false;
            _this.showVipsInCurProject=true;
          } else {
            _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:3000});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
          _this.$toast({text: '通信错误!',type:'danger',duration:4000});
        });
      },
      bkToVipsListInCurProject() {
        this.showTripEditer=false;
        this.showTripsPanel=false;
        this.showVipsInCurProject=true;
        this.isNewCreateTrip=false;
      },
      getProjects () {
        let queryContent={};
        let _this=this;
        queryContent.conditions="afterTodayDecrease3Days";
        _this.$axios({
          method: 'post',
          url: 'getProjects.php',
          data:qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.dueProjects=response.data;
          _this.fltdPrjct=JSON.parse(JSON.stringify(_this.dueProjects));
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '异步通信错误!'+error,
            type: 'danger',
            duration: 4000
          });
        });      
      },
    },
    computed:{
      // getOfclRank() {
      //   return function (i) {
      //     return ofclRank[i];
      //   }
      // },
    },
    mounted() {
      this.getProjects();
    },
    watch:{
      // 'fltdVipsInCurProject': {
      //   handler() {
      //     //somecode here;
      //   },
      //   // deep: true,
      //   // immediate: true
      // },
    },
  }


</script>

<style scoped>
.thinborder {
  padding: 10px;
  border: 1px solid #000000;
}
.mgtp10 {
  margin-top:10px;
}
ul li {
  list-style-type:none;
}
.wt80p {
  width: 80%;
  text-align: left;
}
.info-box span {
  margin-left: 10px;
  font-weight: bold;
}
.info-box .form-inline {
  margin-top:10px;
}
.editer-box input,.editer-box select {
  width:75%;
}
.loading {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%,-110%);
}
</style>
