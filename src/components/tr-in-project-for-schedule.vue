<template>
  <tr>
    <td>{{index+1}}</td>
    <td><input type="text" v-model="scheduleAgenda.time_range" placeholder="如:2088-10-01 08:40-11:30" title="时间段,格式如:2088-10-01 08:40-11:30"></td>
    <td><input type="text" v-model="scheduleAgenda.location" placeholder="此项议程地点"></td>
    <td>
      <select v-model="scheduleAgenda.id_agenda">
        <option value="0">选择议程</option>
        <option v-for="item in agendas" :value="item.id">{{item.name}}</option>
      </select>
    </td>
    <td>
      <select v-model="scheduleAgenda.speaker">
        <option value="0">报告人</option>
        <option value="张三">张三</option>
        <option value="李四">李四</option>
        <option value="王五">王五</option>
      </select>
    </td>
    <td><input type="text" v-model="scheduleAgenda.speech_topics" placeholder="填写报告题目"></td>
    <td>
      <select v-model="scheduleAgenda.hosts">
        <option value="0">主持人</option>
        <option value="张三">张三</option>
        <option value="李四">李四</option>
        <option value="王五">王五</option>
      </select>
    </td>
    <td><input type="text" v-model="scheduleAgenda.remark" placeholder="其它备注信息"></td>
    <td>
      <button class="dlt" @click="dltRowInChild" title="从列表中删除">删</button>
      <button class="add" @click="addRowInChild" title="在当前行下添加一行">加</button>
    </td>
  </tr>
</template>

<script>
// import Inputmask from "inputmask";
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    scheduleAgenda: {
      type: Object,
      default: {
        id:0,
        time_range:'',
        location:'',
        id_agenda:0,
        hosts:0,
        speaker:0,
        speech_topics:'',
        remark:'',
      },
    },
  },
  data () {
    return {
      agendas:this.$store.state.agendas,
    }
  },
  watch: {
  },
  methods: {
    dltRowInChild () {
      this.$emit('dltRow', this.index);
    },
    addRowInChild () {
      this.$emit('addRow',this.scheduleAgenda);
    }
  },
  beforeCreate() {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dlt {
  background: #dc3545;border:1px solid #dc3545;
}
.add {
  background: #007bff;  
  border:1px solid #007bff;
}
tr td {
  padding:2px 2px;
}
tr input,tr select {
  width: 100%;
  margin:0px;
}
tr button {
  width: 25px;height: 25px;line-height:25px;border-radius:5px;color:#FFF;
}
</style>
