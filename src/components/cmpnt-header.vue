<template>
  <div id='CmpntHeader'  class="container-fluid" style="background-color:#CECEF6">
    <!--  style="background-color:  #E0FFFF;  fixed-top" -->
    <div class="row align-items-center">
      <div class="col-sm text-left">
        <div style="display: inline-block; margin:5px auto;">
          <img src="../assets/logo1.png" alt="标志照片" style="width: 196px;height: 50px;">
          <!-- <span style="font-size:24px;">中科会展</span> -->
        </div>
      </div>
      <div class="col-sm text-center">
        <h5 style="cursor: pointer;">您有{{undealCounter}}条业务未处理</h5>
      </div>
      <div class="col-sm text-right">
        <div class='personPicture' style="display: inline; cursor: pointer;">
          <img src="../assets/dpanda.jpg" alt="用户照片" style="width: 50px; height:50px;border-radius: 50%;">
          <span class="userName">{{user_name}}，&nbsp辛苦啦!</span>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  name: 'cmpntHeader',
  data () {
    return {
      // msg: '欢迎来到大连'
      user_name:"温泉",
      undealCounter:8
    }
  },
  methods: {
    confirmOperating: function() {
      alert('您的操作已成功执行！')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*// .hello {
//   color: #42b983;
//   height: 60px;
//   background-color: #EFFBFB;
//   border:1px solid black;
//}*/
#CmpntHeader {
  padding-right: 0!important;
}
img {
  
  /*border: 1px solid black;*/
  cursor: pointer; 
}
.personPicture {
  margin:5px auto;
  height: 50px;
}

.userName {
  display: inline-block;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  /*border:1px solid black;*/
}
</style>