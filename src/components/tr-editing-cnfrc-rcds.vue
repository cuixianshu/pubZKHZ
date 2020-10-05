<template>
  <tr>
    <td>{{index+1}}</td>
    <td><input type="date" v-model="rcdOfCnfrc.time_attended" placeholder="如:2088-10-01" title="参会时间"></td>
    <td>
      <select v-model="rcdOfCnfrc.id_project">
        <option value="0">选择展会项目</option>
        <option v-for="item in projects" :value="item.id">{{item.name}}</option>
      </select>
    </td>
    <td>
      <select v-model="rcdOfCnfrc.role">
        <option value="0">参会身份</option>
        <option value="VIP">VIP</option>
        <option value="报告人">报告人</option>
        <option value="一般参会代表">一般参会代表</option>
      </select>
    </td>
    <td><input type="text" v-model="rcdOfCnfrc.speech_topics" placeholder="填写报告题目"></td>
    <td>
      <input v-model="rcdOfCnfrc.feedback">
    </td>
    <td><input type="text" v-model="rcdOfCnfrc.remark" placeholder="其它备注信息"></td>
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
    rcdOfCnfrc: {
      type: Object,
      default: {
        id:0,
        id_attendee:'',
        id_project:0,
        role:0,
        speech_topics:'',
        time_attended:'',
        ids_schedule:'',
        remark:'',
        feedback:'',
        is_deleted:0,
      },
    },
  },
  data () {
    return {
      projects:this.$store.state.projects,
    }
  },
  watch: {
  },
  methods: {
    dltRowInChild () {
      this.$emit('dltRow', this.index);
    },
    addRowInChild () {
      this.$emit('addRow',this.rcdOfCnfrc);
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
