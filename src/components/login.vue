<template>
  <div>
    <h3>
      this is login page!
    </h3>
    <!-- <router-link to="/"></router-link> -->
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default ({
  data() {
    return {
      isLogined:false
    }
  },
  methods:{
    login() {
      this.isLogined=true;
      console.log(location.href);
      // window.location.href="http://www.ifeng.com"; 
      self.location.href="http://www.ifeng.com"; 

    }
  }
})
	
</script>

<style>
	
</style>