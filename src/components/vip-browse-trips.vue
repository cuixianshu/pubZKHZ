<template>
<div class="father">
  <h5>当前位置:查看VIP行程</h5>
  <div class="container-fluid">
    <div v-if="showPrjctPicker">
      <input type="text" class="form-control" placeholder="请输入搜索词" v-model="prjctKW" @input="prjctKwChanged">
      <ul v-if="dueProjects.length>0">
        <li v-for="item in fltdPrjct" class="mgtp10 thinborder" @click="clkAProject(item)">
          <div class="info-box">
            <div class="row mgtp5 pdl10">
              <label>会议:</label><span>{{item.name}}</span>
            </div>
            <div class="row mgtp5 pdl10">
              <label>日期:</label><span>{{item.time_start}}</span>
            </div>
            <div class="row mgtp5 pdl10">
              <label>主办:</label><span>{{item.name_part_a}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="showTripsInCurPrjt">
      <div class="row">
        <div class="col-lg">
          <button class="btn btn-link" @click="bkToProjectPicker">返回会议选择页面</button>
        </div>
        <div class="col-lg">
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <ul v-if="tripsInCurProject.length>0" class="scrl"><!--   -->
        <input type="text" class="form-control" placeholder="请输入搜索词" v-model="kwForFdgTrips" @input="kwForFdgTipsInputed">
        <li v-for="item in fltdTripsInCurPrjt" class="mgtp10 thinborder">
          <div class="info-box">
            <div class="form-inline">
              <label>贵宾姓名:</label><span>{{item.name}}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{{item.position}}/{{item.pro_rank}}/{{item.official_rank}}</span>
            </div>
            <div class="form-inline">
              <label>工作单位:</label><span>{{item.ognztn}}</span>
            </div>
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
              <label>班次车次:</label><span>{{item.num_trnspts}}</span>
            </div>
            <div class="form-inline">
              <label>官方迎接:</label><span>{{item.official_greeter}}</span>
            </div>
            <div class="form-inline">
              <label>接送车辆:</label><span>{{item.driver_car}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="tripsInCurProject.length<1"><h5>没有找到行程信息</h5></div>
    </div>
<!--     <div v-if="showTripsPanel">
      <div class="row">
        <div class="col-lg">
          <button class="btn btn-link" @click="bkToVipsListInCurProject">返回VIP列表</button>
        </div>
        <div class="col-lg">
          <button class="btn btn-primary" @click="createNewTripsForTheVip">新建行程</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <div v-if="showTripList">
        <ul v-if="tripsForTheVIP.length>0">
          <h5>{{vip.name}}--的行程</h5>
          <li v-for="item in tripsForTheVIP" class="mgtp10 thinborder" @click="clkATrip">
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
                <option value="0">飞机</option>
                <option value="1">火车</option>
                <option value="2">大巴</option>
                <option value="3">中巴</option>
                <option value="4">小巴</option>
                <option value="5">商务</option>
                <option value="6">轿车</option>
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
                <button class="btn btn-primary" @click="saveTheTrip()">保存此行程</button>
              </div>
            </div>
          </div>
        
      </div>
    </div> -->
  </div>
  <div id="loading" class="modal fade" v-if="showLoading">
    <img class="loading" :src="imgUrl" alt="正在载入数据"/>
  </div>
</div>
</template>

<script>
import qs from 'qs';
  export default {
    data(){
      return {
        curUsrId:this.$store.state.user.id_user,
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        prjctKW:'',
        fltdPrjct:[],
        dueProjects:[],
        id_curProject:0,
        kwForFdgTrips:"",
        tripsForTheVIP:[],
        vipsInCurProject:[],
        fltdVipsInCurProject:[],
        queryContent:{
          keyWord:'',
          conditions:'',
        },
        trip:{},
        showTripsInCurPrjt:false,
        showPrjctPicker:true,
        showTripsPanel:false,
        showTripList:false,
        showTripEditer:false,
        vip:{},
        orgTrip:"",
        checkType:Object.prototype.toString,
        isNewCreateTrip:false,
        tripsInCurProject:[],
        fltdTripsInCurPrjt:[],
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
      kwForFdgTipsInputed() {
        if(this.kwForFdgTrips.replace(/^\s+|\s+$/g,"").length) {
          this.fltdTripsInCurPrjt=this.tripsInCurProject.filter(function(p){
            for(let prop in p) {
              if(this.checkType.call(p[prop])==='[object String]' && p[prop].indexOf(this.kwForFdgTrips)>-1) {
                return p;
                // break;
              }
            }
          },this);
        } else {
          this.fltdTripsInCurPrjt=JSON.parse(JSON.stringify(this.tripsInCurProject));
        }
      },
      clkAProject(p) {
        this.showLoading=true;
        this.$nextTick(function(){
          $("#loading").modal("show");
        });
        this.showPrjctPicker=false;
        this.showTripsInCurPrjt=true;
        this.showTripsPanel=false;
        this.kwForFdgTrips="";
        this.id_curProject=p.id;
        let queryContent={};
        queryContent.conditions="tripsInTheProject";
        queryContent.id_project=p.id;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.tripsInCurProject=response.data;
          _this.fltdTripsInCurPrjt=JSON.parse(JSON.stringify(_this.tripsInCurProject));
          _this.showLoading=false;
          _this.$nextTick(function(){
            if($('.modal-backdrop').length>0) {
              $('.modal-backdrop').remove();
            }
          });
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          _this.$nextTick(function(){
            if($('.modal-backdrop').length>0) {
              $('.modal-backdrop').remove();
            }
          });
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 4000
          });
        });
      },
      bkToProjectPicker() {
        this.vips=[];
        this.showTripsInCurPrjt=false;
        this.showPrjctPicker=true;
      },
      clkAVIP (v) {
        this.showTripsInCurPrjt=false;
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
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 4000
          });
        });        
      },
      clkATrip() {
        this.isNewCreateTrip=false;
        this.showTripList=false;
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
          transports:"",
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
        if(this.trip.time_departure.length==0 && this.trip.time_arrival.length==0) {
          this.$toast({text:'起始时间,根据情况,至少填写一项!',type:'danger',duration:3000});
          return;
        }
        let s=this.trip.time_departure;
        let e=this.trip.time_arrival;
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
          queryContent.conditions="ModifyAnExist";
          url='updateVipTrips.php';
        }
        // this.showTripsInCurPrjt=false;
        // this.showTripsPanel=true;
        let _this=this;
        this.$axios({
          method: 'post',
          url: url,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data==true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
            _this.showTripEditer=false;
            _this.showTripList=false;
            _this.showTripsPanel=false;
            _this.showTripsInCurPrjt=true;
          } else {
            _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:3000});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!'+response.data,
            type: 'danger',
            duration: 4000
          });
        });

      },
      delTheTrip(t) {
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
          if(response.data==true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
            _this.showTripsPanel=false;
            _this.showTripList=false;
            _this.showTripEditer=false;
            _this.showTripsInCurPrjt=true;
          } else {
            _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:3000});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text: '通信错误!',type:'danger',duration:4000});
        });
      },
      bkToVipsListInCurProject() {
        this.showTripEditer=false;
        this.showTripsPanel=false;
        this.showTripsInCurPrjt=true;
      },
      kwForfdNotJndVipsInputed() {
        if(this.kwForFdgNotJndVip.replace(/^\s+|\s+$/g,"").length) {
          this.fltdvipsNotInCurProject=this.vipsNotInCurProject.filter(function(p){
            for(let prop in p) {
              if(this.checkType.call(p[prop])==='[object String]' && p[prop].indexOf(this.kwForFdgNotJndVip)>-1) {
                return p;
                break;
              }
            }
          },this);
        } else {
          this.fltdvipsNotInCurProject=JSON.parse(JSON.stringify(this.vipsNotInCurProject));
        }
      },
      attendCurProject(v) {
        let queryContent={};
        queryContent.conditions="The VIP Joins A Project";
        queryContent.id_project=this.id_curProject;
        queryContent.id_vip=v.id;
        queryContent.id_modifyer=this.curUsrId;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'insertNewToVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data) {
            _this.$toast({text:'操作成功!',type:'success',duration: 800});
            let i=_this.vipsNotInCurProject.findIndex((ele)=>ele.id==v.id);
            let curVip=_this.vipsNotInCurProject.splice(i,1);
            _this.vipsInCurProject.unshift(curVip);
            _this.fltdVipsInCurProject.unshift(curVip);
            i=_this.fltdvipsNotInCurProject.findIndex((ele)=>ele.id==v.id);
            _this.fltdvipsNotInCurProject.splice(i,1);
          } else {
            _this.$toast({text:'操作失败!请稍后再试.',type:'danger',duration: 1500});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
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
.mgtp5 {
  margin-top:5px;
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
.editer-box input,.editer-box select {
  width:75%;
}
.scrl {
  overflow: auto;
  max-height: 75vh;
}
.pdl10 {
  padding-left:10px;
}
.loading {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%,-110%);
}
</style>
