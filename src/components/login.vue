<template>
  <div>
    <div class="login-window">
      <h5>系统登录</h5><!-- 当前位置:系统登录 -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg form-inline">
            <input type="text" name="tel_work" class="form-control" v-model="logining_user.tel_work" placeholder="请输入手机号" title="手机号">
          </div>
        </div>
        <div class="row"> 
          <div class="col-lg form-inline">
            <input type="password" name="pswd" class="form-control" v-model="logining_user.pswd" placeholder="请输入密码" title="登录密码">
          </div>
        </div>
        <div class="row buttons">
          <button type="button" class="btn btn-secondary" @click="forgotPswd">忘记密码</button>
          <button type="button" class="btn btn-primary" @click="login">登录系统</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>
        <a href="http://www.beian.miit.gov.cn/" target="_blank">
          辽ICP备19004409号-2
        </a>
      </p>
      <p>
        中科会展(大连)有限公司
      </p> 
      <p>
        Copyright © 2020 JOYCLERK CONFERENCE AND EXHIBITION (Dalian) Co.,ltd. All rights reserved.
      </p>        
    </div>
  </div>
</template>

<script>
import qs from 'qs';
export default ({
  data() {
    return {
      logining_user:{
        tel_work:'',
        pswd:''
      }
    }
  },
  methods:{
    login() {
      if((Object.keys(this.$store.state.user)).length<1) {
        this.$store.dispatch('tryToLongin',{'logining_user':this.logining_user,'vue':this});
      }
    },
    forgotPswd() {
      this.$axios({
        method: 'post',
        url: 'sendCheckCode.php'
      }).then(function (response) {
console.log(response);
      }).catch(function (error) {
        _this.$toast({
          text: '异步通信错误!'+error,
          type: 'danger',
          duration: 4000
        });
      }); 
      this.$toast({text: '请联系管理员处理!',type: 'info',duration: 3000});
    }
  }
})
	
</script>

<style scoped>
.login-window {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-110%);
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
.footer {
  display: inline-block;
  position: absolute;
  bottom: 0;
  transform: translate(-50%,0%);
}
</style>