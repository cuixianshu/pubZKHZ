<!-- 设定VIP参会就是在vip_trips里设定一个时间和地点都为""的记录 -->
<!-- 设定VIP参会就是在vip_trips里设定一个时间和地点都为""的记录 -->
<!-- 设定VIP参会就是在vip_trips里设定一个时间和地点都为""的记录 -->
<!-- 设定VIP参会就是在vip_trips里设定一个时间和地点都为""的记录 -->
<!-- 设定VIP参会就是在vip_trips里设定一个时间和地点都为""的记录 -->
<template>
<div class="father">
  <h5>当前位置:VIP参会管理</h5>
  <div class="container-fluid">
    <div v-if="showPrjctPicker">
      <input type="text" class="form-control" placeholder="请输入搜索词" v-model="prjctKW" @input="prjctKwChanged">
      <ul v-if="dueProjects.length>0" class="info-box">
        <li v-for="item in fltdPrjct" class="mgtp10 thinborder" @click="clkAProject(item)">
          <div>
            <div class="form-inline">
              <label>会议:</label><span>{{item.name}}</span>
            </div>
          </div>
          <div class="body">
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
          <button class="btn btn-primary" @click="getVipsWhoHasNotAtdCurProject">添加VIP以参会</button>
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <ul v-if="vipsInCurProject.length>0" class="info-box">
      <input type="text" class="form-control" placeholder="请输入搜索词" v-model="kwForFdgJndVip" @input="kwForFdgJoinedVipInputed">
        <li v-for="item in fltdVipsInCurProject" class="mgtp10 thinborder">
          <div class="header">
            <div class="form-inline">
              <label>姓名:</label><span>{{item.name}}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{{item.gender==0?'女':'男'}}</span>
            </div>
          </div>
          <div class="body">
            <div class="form-inline">
              <label>工作单位:</label><span>{{item.ognztn}}</span>
            </div>
            <div class="form-inline">
              <label>职务职称:</label><span>{{item.position}}/{{item.pro_rank}}</span>
            </div>
            <div class="form-inline">
              <label>行政级别:</label><span>{{item.official_rank}}</span>
            </div>
            <div class="form-inline">
              <label>手机:</label><span>{{item.mbl_number}}</span>
            </div>
          </div>
          <div class="footer">
            <button class="btn btn-secondary btn-sm" @click="leaveCurProject(item)">点击以退会</button>
          </div>
        </li>
      </ul>
      <div v-if="vipsInCurProject.length<1"><h5>还没有VIP参会</h5></div>
    </div>
    <div v-if="showVipPicker">
      <div class="row">
        <div class="col-lg">
          <button class="btn btn-link" @click="bkToVipsListInCurProject">返回已参会VIP</button>
        </div>
        <div class="col-lg">
        </div>
      </div>
      <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
      <ul v-if="vipsNotInCurProject.length" class="info-box">
        <input type="text" class="form-control" placeholder="请输入关键词" v-model="kwForFdgNotJndVip" @input="kwForfdNotJndVipsInputed">
        <li v-for="item in fltdvipsNotInCurProject" class="mgtp10 thinborder">
          <div class="header">
            <div class="form-inline">
              <label>姓名:</label><span>{{item.name}}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{{item.gender==0?'女':'男'}}</span>
            </div>
          </div>
          <div class="body">
            <div class="form-inline">
              <label>工作单位:</label><span>{{item.ognztn}}</span>
            </div>
            <div class="form-inline">
              <label>职务职称:</label><span>{{item.position}}/{{item.pro_rank}}</span>
            </div>
            <div class="form-inline">
              <label>行政级别:</label><span>{{item.official_rank}}</span>
            </div>
            <div class="form-inline">
              <label>手机:</label><span>{{item.mbl_number}}</span>
            </div>
          </div>
          <div class="footer">
            <button class="btn btn-primary btn-sm" @click="attendCurProject(item)">出席会议</button>
          </div>
        </li>
      </ul>
      <div v-if="vipsNotInCurProject.length<1"><h5>没有可选的未参会VIP</h5></div>
    </div>
  </div>
  <div id="loading" class="loadingbox" v-show="showLoading">
    <img class="loadingpic" :src="imgUrl" alt="正在载入数据"/>
  </div>
</div>
</template>

<script>
import qs from 'qs';
import rmvLoadingBox from '@/cuiLibs/rmvLoadingBox';
  export default {
    data(){
      return {
        curUsrId:this.$store.state.user.id_user,
        imgUrl:require('@/assets/images/loading.gif'),
        showLoading:false,
        prjctKW:'',
        fltdPrjct:[],
        dueProjects:[],
        id_curProject:0,
        keyWordForFindingVip:"",
        kwForFdgJndVip:"",
        kwForFdgNotJndVip:"",
        vipsInCurProject:[],
        fltdVipsInCurProject:[],
        vipsNotInCurProject:[],
        fltdvipsNotInCurProject:[],
        queryContent:{
          keyWord:'',
          conditions:'',
        },
        vips:[],
        showVipsInCurProject:false,
        showPrjctPicker:true,
        showVipPicker:false,
        isNewCreate:false,
        vip:{},
        orgVip:"",
        checkType:Object.prototype.toString,
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
      clkAProject(p) {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showPrjctPicker=false;
        this.showVipsInCurProject=true;
        this.kwForFdgJndVip="";
        this.id_curProject=p.id;
        let queryContent={};
        queryContent.conditions="vipInTheProject";
        queryContent.id_project=p.id;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response);
          _this.vipsInCurProject=response.data;
          _this.fltdVipsInCurProject=JSON.parse(JSON.stringify(_this.vipsInCurProject));
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'请检查网络',type:'danger',duration: 1500});
        });            
      },
      bkToProjectPicker() {
        this.vips=[];
        this.showVipsInCurProject=false;
        this.showPrjctPicker=true;
      },
      kwForFdgJoinedVipInputed() {
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
      leaveCurProject(v) {
        // 
        // 离会:把此VIP的参会的记录和所有的行程都:is_deleted=1
        // 
        let queryContent={};
        queryContent.conditions="The VIP Leaves The Project";
        queryContent.id_project=this.id_curProject;
        queryContent.id_vip=v.id;
        queryContent.id_modifyer=this.curUsrId;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data) {
            _this.$toast({text:'操作成功!',type:'success',duration: 800});
            let i=_this.vipsInCurProject.findIndex((ele)=>ele.id==v.id);
            let curVip=_this.vipsInCurProject.splice(i,1);
            _this.vipsNotInCurProject.push(curVip);
            _this.fltdvipsNotInCurProject.push(curVip);
            i=_this.fltdVipsInCurProject.findIndex((ele)=>ele.id==v.id);
            _this.fltdVipsInCurProject.splice(i,1);
          } else {
            _this.$toast({text:'操作失败!请稍后再试.',type:'danger',duration: 1500});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!'+response.data,type:'danger',duration:4000});
        });
      },
      getVipsWhoHasNotAtdCurProject() {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showVipsInCurProject=false;
        this.showVipPicker=true;
        let queryContent={};
        queryContent.conditions="vipNotInTheProject";
        queryContent.id_project=this.id_curProject;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.vipsNotInCurProject=response.data;
          _this.fltdvipsNotInCurProject=JSON.parse(JSON.stringify(_this.vipsNotInCurProject));
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
        });
      },
      bkToVipsListInCurProject() {
        this.showVipPicker=false;
        this.showVipsInCurProject=true;
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
        //
        //参会:设置一个空白行程,此空白行程代表已参会
        //
        let queryContent={};
        queryContent.conditions="The VIP Joins A Project";
        queryContent.id_project=this.id_curProject;
        queryContent.id_vip=v.id;
        queryContent.id_modifyer=this.curUsrId;
        this.showLoading=true;
        $("body").css("overflow","hidden");
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'insertNewToVipTrips.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          if(response.data) {
            _this.$toast({text:'操作成功!',type:'success',duration: 800});
            let i=_this.vipsNotInCurProject.findIndex((ele)=>ele.id==v.id);
            let curVip=_this.vipsNotInCurProject.splice(i,1);
            if(_this.vipsInCurProject.length) {
              _this.vipsInCurProject.unshift(curVip);
            } else {
              _this.vipsInCurProject[0]=curVip;
            }
            _this.fltdVipsInCurProject.unshift(curVip);
            i=_this.fltdvipsNotInCurProject.findIndex((ele)=>ele.id==v.id);
            _this.fltdvipsNotInCurProject.splice(i,1);
          } else {
            _this.$toast({text:'操作失败!请稍后再试.',type:'danger',duration: 1500});
            return;
          }
        }).catch(function (error) {
          console.log(error);
          _this.showLoading=false;
          $("body").css("overflow","");
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
ul li {
  list-style-type:none;
}
.wt85p {
  width: 85%;
}
.info-box span {
  margin-left: 10px;
  font-weight: bold;
}
.info-box .form-inline {
  margin-top:10px;
}
.info-box {
  overflow-y: auto;
}

</style>
