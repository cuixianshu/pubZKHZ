<template>
<div class="father">
  <h5>当前位置:VIP基本信息</h5>
  <div class="container-fluid">
    <div v-if="showSearchBox">
      <div class="mgtp10">
        <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="姓名\手机号\单位等">
      </div>
      <div class="mgtp10">
        <button @click="getVips" class="btn btn-primary" style="margin-right: 20px;">
          查找VIP
        </button>
        <button @click="newCreateVip" class="btn btn-primary">
          新建VIP
        </button>
      </div>
      
    </div>
    <div v-if="showVipsList"><!--  class="pre-scrollable" -->
      <p><button class="btn btn-link" @click="bkToSrch">返回搜索</button></p>
      <ul v-if="vips.length>0" class="info-box">
        <li v-for="item in vips" class="mgtp10 thinborder" @click="clkAVip(item)">
          <div class="header">
            <div class="form-inline">
              <label>姓名:</label><span>{{item.name}}</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{{item.gender==0?'女':'男'}}</span>
            </div>
          </div>
          <div class="body">
            <div class="form-inline">
              <label>职务:</label><span>{{item.position}}</span>
            </div>
            <div class="form-inline">
              <label>职称:</label><span>{{item.pro_rank}}</span>
            </div>
            <div class="form-inline">
              <label>单位:</label><span>{{item.ognztn}}</span>
            </div>
            <div class="form-inline">
              <label>级别:</label><span>{{item.official_rank}}</span>
            </div>
            <div class="form-inline">
              <label>手机:</label><span>{{item.mbl_number}}</span>
            </div>
            <div class="form-inline">
              <label>备注:</label><span>{{item.remark}}</span>
            </div>
          </div>
          <div class="footer">
          </div>
        </li>
      </ul>
      <div v-if="vips.length<1"><h5>没有数据</h5></div>
      <p><button class="btn btn-link" @click="bkToSrch">返回搜索</button></p>
    </div>
    <div v-if="showVipEditer">
      <p><button class="btn btn-link" @click="bkToVipsList">返回VIP列表</button></p>
      <div class="container-fluid">
        <!-- <h5>VIP编辑器</h5> -->
        <div>
          <div class="form-inline mgtp10">
            <label>姓名</label>
            <input type="text" class="form-control wt85p" v-model="vip.name">
          </div>
          <div class="form-inline mgtp10">
            <label>性别</label>
            <select class="form-control wt85p" v-model="vip.gender">
              <option value="0">女</option>
              <option value="1">男</option>
            </select>
          </div>
          <div class="form-inline mgtp10">
            <label>职务</label>
            <input type="text" class="form-control wt85p" v-model="vip.position">
          </div>
          <div class="form-inline mgtp10">
            <label>职称</label>
            <select class="form-control wt85p" v-model="vip.pro_rank">
              <option value="未知">未知</option>
              <option value="副高">副高</option>
              <option value="正高">正高</option>
              <option value="院士">院士</option>
            </select>
          </div>
          <div class="form-inline mgtp10">
            <label>单位</label>
            <input type="text" class="form-control wt85p" v-model="vip.ognztn">
          </div>
          <div class="form-inline mgtp10">
            <label>级别</label>
            <select class="form-control wt85p" v-model="vip.official_rank">
              <option value="未知">未知</option>
              <option value="副科">副科</option>
              <option value="正科">正科</option>
              <option value="副处">副处</option>
              <option value="正处">正处</option>
              <option value="副局">副局</option>
              <option value="正局">正局</option>
              <option value="副部">副部</option>
              <option value="正部">正部</option>
              <option value="副国">副国</option>
            </select>
            <!-- <input type="text" class="form-control wt85p" v-model="vip.official_rank"> -->
          </div>
          <div class="form-inline mgtp10">
            <label>手机</label>
            <input type="text" class="form-control wt85p" v-model="vip.mbl_number">
          </div>
          <div class="form-inline mgtp10">
            <label>备注</label>
            <input type="text" class="form-control wt85p" v-model="vip.remark">
          </div>
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" @click="saveTheVip">保存</button>
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
  export default {
    data(){
      return {
        curUsrId:this.$store.state.user.id_user,
        showLoading:false,
        imgUrl:require('@/assets/images/loading.gif'),
        queryContent:{
          keyWord:'',
          conditions:'',
        },
        vips:[],
        showVipsList:false,
        showSearchBox:true,
        showVipEditer:false,
        isNewCreate:false,
        vip:{},
        orgVip:"",
      }

    },
    methods:{
      getVips () {
        this.showLoading=true;
        $("body").css("overflow","hidden");
        this.showVipsList=true;
        this.vips=[];
        this.queryContent.conditions="byKwForViewOrEditing";
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getVips.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.vips=response.data;
          _this.showSearchBox=false;
          _this.showLoading=false;
          $("body").css("overflow","");
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
      newCreateVip() {
        this.isNewCreate=true;
        this.showVipsList=false;
        this.showSearchBox=false;
        this.showVipEditer=true;
        this.vip={
          id:0,
          name:'',
          gender:1,
          pro_rank:'未知',
          position:'',
          ognztn:'',
          official_rank:'职员',
          mbl_number:'',
          remark:''
        };
      },
      clkAVip(v) {
        this.showVipsList=false;
        this.showVipEditer=true;
        this.isNewCreate=false;
        this.vip=v;
        this.orgVip=JSON.stringify(this.vip);
      },
      bkToSrch() {
        this.vips=[];
        this.showVipsList=false;
        this.showSearchBox=true;
      },
      bkToVipsList() {
        this.showVipEditer=false;
        this.showVipsList=true;
      },
      saveTheVip() {
        if(this.vip.name.trim().length<2) {
          this.$toast({text: '请输入姓名!',type: 'danger',duration: 2000});
          return;
        }
        if(this.vip.ognztn.trim().length<2) {
          this.$toast({text: '请输入单位!',type: 'danger',duration: 2000});
          return;
        }
        let url="";
        let conditions="";
        if(this.isNewCreate) {
          url="insertNewToVips.php";
          conditions="newVip";
        } else {
          if(this.orgVip===JSON.stringify(this.vip)) {
            this.$toast({text:'无改变!',type:'info',duration: 800});
            return;
          }
          url="updateVips.php";
          conditions="editVip";
        }
        this.vip.id_editor=this.curUsrId;
        let queryContent={
          conditions:conditions,
          data:this.vip
        }
        this.showLoading=true;
        $("body").css("overflow","hidden");
        let _this=this;
        this.$axios({
          method: 'post',
          url:url,
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.showLoading=false;
          $("body").css("overflow","");
          let msgtxt="";
          let msgtype="";
          let msgdur=1000;
          if(response.data) {
            msgtxt="操作成功!";
            msgtype="success";
            msgdur=800;
            _this.showVipsList=true;
            _this.showVipEditer=false;
          } else {
            msgtxt="操作失败,请稍后再试!";
            msgtype="danger";
            msgdur=2000;
          }
          _this.$toast({text:msgtxt,type: msgtype,duration: msgdur});
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
    },
    computed:{
      getProRank() {
        return function (i) {
          let proRank=['未知','副高','正高','院士']
          return proRank[i];
        }
      },
      getOfclRank() {
        return function (i) {
          let ofclRank = ['职员','副科','正科','副处','正处','副局','正局','副部','正部','副国'];
          return ofclRank[i];
        }
      },
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
</style>
