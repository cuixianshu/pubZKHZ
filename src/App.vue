<template>
  <div>



<!-- 使用日历 placeholder='开始日期' -->
<!--   <div>
    <date-picker id='time1' v-model="time1" :first-day-of-week="7" format='YYYY年MM月DD日' :clearable='clearable'></date-picker>
    <label>至</label>
    <date-picker v-model="time2" :first-day-of-week="7" :clearable='clearable'></date-picker> 
    
    <date-picker v-model="time3" range :shortcuts="shortcuts"></date-picker>
    <date-picker v-model="value" :lang="lang" v-on:change='dateChanged'></date-picker>
  </div> -->

 
  <!-- *************************************************************************************** 
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2" style="background-color:lavender; height: 100%;"><strong>财务发票</strong></div>
      <div class="col-sm-10" style="background-color:lavenderblush;  height: 100%;">内容在这里</div>
    </div>
  </div>-->
  <!-- </div>
  <form>
    <div class="form-group">
      <label for="exampleFormControlFile1">请选择要上传的文件</label>
      <input type="file" class="form-control-file" id="exampleFormControlFile1">
    </div>
  </form>
   -->
</div>

</template>

<script>
// import DatePicker from 'vue2-datepicker'
// import HelloWorld from './components/HelloWorld'


export default {
  // name: 'App',
  // components: {  },//DatePicker, HelloWorld
  // data() {
  //   return {
      // time1: new Date(),
      // time2: new Date(),
      // time3: '',
      // value: new Date(),
      // clearable:false,
      // // custom lang
      // lang: {
      //   days: ['日', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      //   months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', '六', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //   pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
      //   placeholder: {
      //     date: '请选择',
      //     dateRange: 'Select Date Range'
      //   }
      // },
      // // custom range shortcuts
      // shortcuts: [
      //   {
      //     text: 'kwg kwg ',
      //     onClick: () => {
      //       this.time3 = [ new Date(), new Date() ]
      //     }
      //   }
      // ],
      // timePickerOptions:{
      //   start: '00:00',
      //   step: '00:30',
      //   end: '23:30'
      // }
  //   }
  // },
  // methods: {
  //   dateChanged: function () {
  //     console.log(this.value);
  //   }
  // }
}
</script>

<style scoped>
* {
  font-size: 16px;
  margin:0;
  padding: 0;
}

.content {
  float: left;
  width: 100px;
  height: 100px;
  background-color: lightgreen;
  border: 1px solid pink;
}

.wrapper {
  width: 1200px;
  height: 800px;
  border: 1px solid #000;
  background-image: url(./assets/dpanda.jpg);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
}

img {
  /*width: 50px;*/
  /*height:50px;*/
  /*border: 1px solid black;*/
  /*border-radius: 50%; */
  cursor: pointer; 
}

/*.wrapper::after {
  content: "";
  display: block;
  clear: both;
}*/
.clearFloat {
  margin:0;
  /*border-top: 0 solid black;*/
  clear:both;
}

.personPicture {
  height: 100px;
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
