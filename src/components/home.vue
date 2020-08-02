<template>
  <div class="father">
    <div class="container-fluid">
      <h3>尊敬的{{$store.state.user.name}},您辛苦啦!</h3>
      <p></p>
      <ul>
        <h4></h4>
        <li><span class="tips">因水平有限,此系统在使用中如有任何问题,烦请您记录:</span></li>
        <li><span class="tips">您正在进行的操作</span></li>
        <li><span class="tips">您所使用的数据</span></li>
        <li><span class="tips">您所使用的浏览器</span></li>
        <li><span class="tips">再次感谢!</span></li>
      </ul>
      <div class="row">
        <a @click="loadProjects" class="form-inline">查看近期项目</a>
      </div>
      <div class="listShower" v-if="projects.length>0 && on_off">
        <table class="table table-hover">
          <thead>
            <th v-for="(title,index) in projectTitle" :width="titleWidth[index]">{{title}}</th>
          </thead>
          <tbody>
            <tr v-for="row in projects">
              <td :title='row.name'>{{row.name}}</td>
              <td :title='row.name_part_a'>{{row.name_part_a}}</td>
              <td :title='row.content'>{{row.content}}</td>
              <td :title='row.time_start'>{{row.time_start}}</td>
              <td :title='row.time_end'>{{row.time_end}}</td>
              <td :title='row.address_of_project'>{{row.address_of_project}}</td>
              <td :title='row.scale'>{{row.scale}}</td>
              <td :title='row.manager'>{{row.manager}}</td>
              <td :title='row.other'>{{row.other}}</td>
            </tr>
          </tbody>
        </table>
      </div>    
      <div v-else>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        projects:[],
        on_off:false,
        projectTitle:['项目名称','甲方','主要内容','开始日期','结束日期','项目举办地点','项目规模','我司负责人','备注'],
        titleWidth:['11%','11%','12%','11%','11%','11%','11%','11%','11%'],
      }
    },
    methods:{
      loadProjects() {
        this.on_off=!this.on_off;
        this.projects=this.$store.state.projects;
        // var i=this.projects.findIndex((value)=>value.id==1);
        // this.projects.splice(i,1);        
        // console.log(this.projects);
      }
    },
    mounted () {
      // this.projects=this.$store.state.projects;
      // var i=this.projects.findIndex((value)=>value.id==1);
      // this.projects.splice(i,1);
    }
  } 
</script>

<style scoped>
.tips {
  font-size: 18px;
}
li {
  text-align: left;
}
a {
 cursor: pointer;
 color: #007bff;
}
a:hover {
 color: #dc3545;

}
/*.bkgrd {:hover
  background-image:url("../../static/logo.png");
}*/
</style>
