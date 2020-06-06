<template>
<div>
  <h5>当前位置:个人中心/更改密码</h5>
  <div class="wndw">
    <div class="container-fluid" v-if="!isConfirmedOldPswd">
      <div class="row">
        
      </div>
      <div class="row">
        <div class="col-lg form-inline">
          <input id="oldPswd" type="password" name="oldPswd" class="form-control" placeholder="请输入原密码" v-model="oldPswd" title="原密码">
        </div>
      </div>
      <div class="row buttons">
        <div class="col-lg form-inline">
          <button class="btn btn-secondary" @click="clearOldPswd">清空</button>
          <button class="btn btn-primary" @click="okOldPswd">确定</button>
        </div>
      </div>
    </div>
    <div class="container-fluid" v-if="isConfirmedOldPswd">
      <div class="row">
        <div class="col-lg form-inline">
          <input id="newPswd1" type="password" name="newPswd1" class="form-control" placeholder="请输入新密码" v-model="newPswd1" title="新密码">
        </div>
      </div>
      <div class="row">
        <div class="col-lg form-inline">
          <input id="newPswd2" type="password" name="newPswd2" class="form-control" placeholder="请再次输入新密码" v-model="newPswd2" title="确认新密码">
        </div>
      </div>
      <div class="row buttons">
        <div class="col-lg form-inline">
          <button class="btn btn-secondary" @click="clearNewPswd">清空</button>
          <button class="btn btn-primary" @click="saveTheNewPswd">保存</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import qs from 'qs';
  export default {
    data() {
      return {
        oldPswd:'',
        newPswd1:'',
        newPswd2:'',
        isConfirmedOldPswd:false,
        currentUserId:this.$store.state.user.id_user
      }
    },
    methods:{
      clearOldPswd () {
        this.oldPswd='';
      },
      okOldPswd () {//需要和后参数据进行比较 
        var queryContent = {
          id:this.currentUserId,
          pswd:this.oldPswd
        }
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'comparePswd.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
// console.log(response.data);
          if(response.data) {
            _this.isConfirmedOldPswd=true;
          } else {
            _this.isConfirmedOldPswd=false;
            _this.$toast({
              text: '密码错误!',
              type: 'info',
              duration: 1000
            });              
          }

        }).catch(function (error) {
            _this.$toast({
              text: '与服务器通信失败!',
              type: 'info',
              duration: 2000
            });           
          console.log(error);
        });
      },
      clearNewPswd () {
        this.newPswd1='';
        this.newPswd2='';
      },
      saveTheNewPswd () {//保存新密码,并退出登录
        if(this.newPswd1.length<8 || this.newPswd2.length<8) {
          this.$toast({
            text: '密码不能少于8位字符!',
            type: 'info',
            duration: 1500
          });
          return;
        } else {
          if(this.newPswd1!==this.newPswd2) {
            this.$toast({
              text: '两次输入不一致',
              type: 'info',
              duration: 1500
            });
            return;
          }
        }
        var queryContent={};
        queryContent.conditions='changePswd';
        queryContent.id=this.currentUserId;
        queryContent.pswd=this.newPswd1;
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'updateEmployees.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
// console.log(response.data);
          if(response.data) {
            _this.$toast({
              text: '成功!请牢记新密码!',
              type: 'success',
              duration: 1500
            });
            _this.$store.commit('userLoginOut');
            _this.$router.push('/');
          } else {
            _this.$toast({
              text: '操作失败,请稍后再试!',
              type: 'danger',
              duration: 1500
            });
            return;              
          }

        }).catch(function (error) {
            _this.$toast({
              text: '与服务器通信失败!',
              type: 'info',
              duration: 2000
            });           
          console.log(error);
        });        

      }
    }
  } 
</script>

<style scoped>
.wndw {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-130%);  
}
h5 {
  color: #007bff;
}  
.row {
  margin-bottom: 10px;
}
.buttons {
  display: inline-block;
  margin:10px auto;
}
.btn {
  margin-right: 10px;
}
</style>
