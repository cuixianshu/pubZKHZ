<template>
  <div class="father container-fluid">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#importInvitedResult">将邀请结果导入</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#followCommunications">沟通联系</a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="importInvitedResult" class="tab-pane  pre-scrollable active">
        <div class="=mgtp30">
          <h5>根据操作目的,以CSV文件格式,将邀请结果导入数据库</h5>
          <h5>文件必须有email列</h5>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div class="form-inline mgtp5">
          <label>项目</label>
          <select class="form-control" v-model="qcInIIR.id_project" @change="projectChanged()">
            <option value=0>选择项目</option>
            <option v-for="item in projectsInIIR" :value="item.id">{{item.name}}</option>
          </select>
          <label>专场</label>
          <select class="form-control" v-model="qcInIIR.id_track" :disabled="isTrackUnselectable">
            <option value=0>选择专场</option>
            <option v-for="item in tracksInIIR" :value="item.id">{{item.name}}</option>
          </select>
          <label>目的</label>
          <select class="form-control" v-model="qcInIIR.id_purpose" :disabled="isPurposeUnselectable">
            <option value=0>导入目的</option>
            <option value=1>沟通联系</option>
            <option value=2>拒绝参会</option>
            <option value=3>进黑名单</option>
          </select>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        <div class="row" v-if="qcInIIR.id_project!=0 && qcInIIR.id_track!=0 && qcInIIR.id_purpose!=0 && !dataFromCSV.length">
          <div class="col-lg">
            <input id="csvFileInput" class="input-hide" type="file" @change="readCSVFile" accept=".csv"/>
            <button class="btn btn-primary" type="button" name="seach" @click="clkImportCSV">从CSV导入邀请结果</button>
            <label v-if="csvFileName!=''">{{csvFileName}}</label>
          </div>
        </div>
        <div v-if="dataFromCSV.length">
          <h5>
            正在更新系统,请稍候...
          </h5>
          <h5>
            文件名:{{csvFileName}}
          </h5>
          <h5>
            共:{{dataFromCSV.length}}条数据
          </h5>
        </div>
      </div>
      <div id="followCommunications" class="tab-pane  pre-scrollable">
        <div class="form-inline mgrt5 mgtp5" v-if="showFcSchBox" title="末次沟通所在时间范围">
          <label>上次沟通</label>
          <input type="date" class="form-control" v-model="QcInFC.sDate">
          <label>到</label>
          <input type="date" class="form-control" v-model="QcInFC.eDate">
        </div>
        <div class="form-inline mgtp5" v-if="showFcSchBox">
          <label>大会项目</label>
          <select class="form-control mgrt10" v-model="QcInFC.id_project" title="选择所属项目">
            <option value="0">选择项目</option>
            <option v-for="item in projectsInIIR" :value="item.id">{{item.name}}</option>
          </select>
          <label>专场</label>
          <select class="form-control mgrt10" v-model="QcInFC.id_track" title="选择专场前请先选择大会项目">
            <option value="0">选择专场</option> 
            <option v-for="item in trksInCurPrjctInFC" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-inline mgtp5" v-if="showFcSchBox">
          <label>限定嘉宾</label>
          <input class="form-control" type="text" placeholder="嘉宾查询词" v-model="QcInFC.kwForAtds" @input="kwForAtdsChanged" title="将在姓名,职务,头衔,机构,取得的成就,荣誉,国家,邮箱,备注,论文摘要,杂志名,论文名称等中查找" style="margin-right: 0px;border-right-style:none;border-left-style:none;">
          <select class="form-control" v-model="QcInFC.id_attendee" title="嘉宾">
            <option value="0">任意嘉宾</option> 
            <option v-for="item in filteredAtdsInQcAtdSlcter" :value="item.id">{{item.name}}~~{{item.email1}}</option>
          </select>
        </div>
        <div class="form-inline mgtp5" v-if="showFcSchBox">
          <label>已交题目</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_topiced"  title="题目">
            <option value="2">不限</option>
            <option value="1">已交</option>
            <option value="0">未交</option>
          </select>
          <label>已交摘要</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_abstracted"  title="摘要">
            <option value="2">不限</option>
            <option value="1">已交</option>
            <option value="0">未交</option>
          </select>
        </div>
        <div class="form-inline mgtp5" v-if="showFcSchBox">
          <label>注册状态</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_registered"  title="注册">
            <option value="2">不限</option>
            <option value="1">已注册</option>
            <option value="0">未注册</option>
          </select>
          <label>酒店状态</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_hotel"  title="酒店">
            <option value="5">不限</option>
            <option v-for="item in hTOps" :value="item.id">{{item.name}}</option>
          </select>
          <label>观光状态</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_tour"  title="观光">
            <option value="5">不限</option>
            <option v-for="item in hTOps" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-inline mgrt10 mgtp5" v-if="showFcSchBox">
          <label>积极程度</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_initiative"  title="积极">
            <option value="0">未知的</option>
            <option value="1">无兴趣</option>
            <option value="2">感兴趣</option>
            <option value="3">积极的</option>
            <option value="4">热切的</option>
            <option value="5">不限</option>
          </select>
          <label>紧急程度</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.id_urgent"  title="紧急">
            <option value="unlimited">不限</option>
            <option value="red">红色</option>
            <option value="orange">橙色</option>
            <option value="blue">蓝色</option>
          </select>
          <label>退会状态</label>
          <select class="form-control mgrt10 wth100" v-model="QcInFC.is_quit" title="是否已退出">
            <option value="2">不限</option> 
            <option value="0">正常</option>
            <option value="1">已退</option>
          </select>
        </div>
        <div class="mgtp10" v-if="showFcSchBox">
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getCmntnRcds">获取沟通历史数据</button>
        </div>
        <hr v-if="showFcSchBox" style="height:1px;border:none;border-top:2px solid #007bff;" />
        <div v-if="showCmtnRcdsViewer && cmtdRcdsOfAllATDsInFC.length>1">
          <button class="btn btn-link" @click="backToFcSchBox">返回搜索条件</button>
          <ul>
            <li v-for="(item,index) in cmtdRcdsOfAllATDsInFC" @click="clkACmnRcdToCmt(item)">
              <div :class="clsCardHeader">
                <div class="row">
                  <div class="col-lg form-inline">
                    热度:<span class="title-in-card">{{item.ar_times_to_us?item.ar_times_to_us:0}}/{{item.ar_times_we_sent?item.ar_times_we_sent:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    注册:<span class="title-in-card">{{item.ar_registration_fee_received?item.ar_registration_fee_received:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    酒店:<span class="title-in-card">{{item.ar_hotel?item.ar_hotel:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    观光:<span class="title-in-card">{{item.ar_tour?item.ar_tour:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    编号:<span class="title-in-card">{{item.id_attendee}}</span>
                  </div>
                </div>
              </div>
              <div :class="clsCardBody">
                <div class="row">
                  <div class="col-lg form-inline">
                    沟通日期:<span class="title-in-card">{{item.date_cmnctd}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    沟通同事:<span class="title-in-card">{{item.id_operator}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    沟通类型:<span>{{item.nature}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    嘉宾全名:<span class="title-in-card">{{item.a_name}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    职务头衔:<span class="title-in-card">{{item.a_position}}/{{item.a_title1}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    所在机构:<span class="title-in-card">{{item.a_workplace?item.a_workplace:"未填写"}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    专场计划:<span class="title-in-card">{{item.ar_id_track?item.ar_id_track:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    日程计划:<span class="title-in-card">{{item.ar_ids_schedule?item.ar_ids_schedule:0}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    角色计划:<span class="title-in-card">{{item.ar_id_role?item.ar_id_role:0}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    报告题目:<span class="title-in-card">{{item.ar_topic?item.ar_topic:"未提交"}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    报告摘要:<span class="title-in-card">{{item.ar_abstract?item.ar_abstract:"未提交"}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    沟通摘要:<span>{{item.abstract}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    沟通备注:<span>{{item.remark}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg form-inline">
                    下次日期:<span class="title-in-card">{{item.date_next=="0001-01-01"?"":item.date_next}}</span>
                  </div>
                  <div class="col-lg form-inline">
                    下次计划:<span class="title-in-card">{{item.plan_next}}</span>
                  </div>
                </div>
              </div> 
              <br>
            </li>
          </ul>
          <button class="btn btn-link" @click="backToFcSchBox">返回搜索条件</button>
        </div>
        <div class="bg-hvgrey" v-if="showCmntnEditer">
          <button  class="btn btn-link" @click="backToAllATDsCmtdRcdsViewer">返回沟通历史列表</button>
          <div id="atdInfoInFC" class="thinborder mgtp5">
            <div class="row">
              <div class="col-lg form-inline">
                <label for="">姓名</label>
                <input class="form-control" type="text" placeholder="嘉宾姓名" v-model="curCommunication.a_name">
              </div>
              <div class="col-lg form-inline">
                <label for="">机构</label>
                <input class="form-control" type="text" placeholder="嘉宾单位" v-model="curCommunication.a_workplace">
              </div>
              <div class="col-lg form-inline">
                <label for="">头衔</label>
                <input class="form-control" type="text" placeholder="嘉宾担任的职务" v-model="curCommunication.a_title1">
              </div>
              <div class="col-lg form-inline">
                <label for="">性别</label>
                <select class="form-control" v-model="curCommunication.a_gender">
                  <option value="0">女</option>
                  <option value="1">男</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label for="">饮食</label>
                <select class="form-control" v-model="curCommunication.a_dietary">
                  <option value="0">任意</option>
                  <option value="1">清真</option>
                  <option value="2">素食</option>
                  <option value="3">荤食</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <button class="btn btn-link" v-if="showAtdDetails" @click="tglAtdDetailsInFC">收起详情</button>
                <button class="btn btn-link" v-if="!showAtdDetails" @click="tglAtdDetailsInFC">查看详情</button>
              </div>
            </div>
            <div id="attAwa" v-if="showAtdDetails"><!--  :class="clsShowDetails" -->
              <div class="row">
                <div class="col-lg">
                  <button class="btn btn-link" @click="openWedPage(curCommunication.a_personal_page)" v-if="curCommunication.a_personal_page && curCommunication.a_personal_page.length">个人主页</button>
                </div>
                <div class="col-lg">
                  <button class="btn btn-link" @click="openWedPage(curCommunication.atcl_url)" v-if="curCommunication.atcl_url && curCommunication.atcl_url.length">打开论文</button>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="">所获奖项</label>
                  <input class="form-control" type="text" placeholder="主要获奖项" v-model="curCommunication.a_awards" style="width:95%;">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="">近期成就</label>
                  <input class="form-control" type="text" placeholder="近期主要成果" v-model="curCommunication.a_attainment" style="width:95%;">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="">专论题目</label>
                  <input class="form-control" type="text" placeholder="专论题目" v-model="curCommunication.atcl_title" style="width:95%;" title="专题论文题目">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label for="">专论摘要</label>
                  <input class="form-control" type="text" placeholder="专论摘要" v-model="curCommunication.atcl_abstract" style="width:95%;" title="专题论文摘要">
                </div>
              </div>
              <div class="mgtp5">
                <button class="btn btn-primary" @click="saveTheAtd">保存对嘉宾的更改</button>
              </div>
            </div>            
          </div>
          <div id="cmnctnEditePanle">
            <div class="form-inline mgtp5 thinborder">
              <label>沟通热度:</label><span class="mgrt10">{{curCommunication.ar_times_to_us}}/{{curCommunication.ar_times_we_sent}}</span>
              <label>酒店:</label>
              <select class="form-control mgrt10" v-model="curCommunication.ar_hotel">
                <!-- <option value=0>未知</option> -->
                <option v-for="o in hTOps" :value="o.id">{{o.name}}</option>
              </select>
              <label>观光:</label>
              <select class="form-control mgrt10" v-model="curCommunication.ar_tour">
                <!-- <option value=0>未知</option> -->
                <option v-for="o in hTOps" :value="o.id">{{o.name}}</option>
              </select>
              <label>已收注册费:</label><span class="mgrt10">{{curCommunication.ar_registration_fee_received?curCommunication.ar_registration_fee_received:0}}</span>
              <label>已收住宿费:</label><span class="mgrt10">{{curCommunication.ar_hotel_expense_received?curCommunication.ar_hotel_expense_received:0}}</span>
              <label>已收观光费:</label><span class="mgrt10">{{curCommunication.ar_tour_fee_received?curCommunication.ar_tour_fee_received:0}}</span>
            </div>
            <div class="thinborder mgtp5">
              <div class="form-inline mgtp5 mgrt5">
                <label>专场计划</label>
                <select class="form-control" v-model="curCommunication.ar_id_track">
                  <option value="0">专题场次</option>trksInCurPrjctInFC
                  <option v-for="item in trksInCurPrjctInFC" :value="item.id">{{item.name}}</option>
                </select>
                <button  @click="tglScdlsInTheTrackInFC" title="点击查看" class="btn btn-link">日程计划
                </button>
                <select class="form-control" v-model="curCommunication.ar_ids_schedule">
                  <option value="0">请选择</option>
                  <option v-for="item in scdlsAtCurTrackInFC" :value="item.id">{{item.time_ranges}}</option>
                </select>
                <label>参会角色</label>
                <select class="form-control" v-model="curCommunication.ar_id_role">
                  <option value="0">主席</option>
                  <option value="1">副主席</option>
                  <option value="2">报告人</option>
                  <option value="3">其它</option>
                </select>
                <label>参会备注</label>
                <input class="form-control" v-model="curCommunication.ar_remark" title="该嘉宾参加此专场的备注">
              </div>
              <div class="thinborder tablebox mgtp5" v-if="showScdlViewerInFC">
                <table class="table table-sm">
                  <thead>
                    <th>序号</th>
                    <th>时段</th>
                    <th>环节</th>
                    <th>主席</th>
                    <th>副主席</th>
                    <th>报告人</th>
                    <th>报告题目</th>
                  </thead>
                  <tbody>
                    <tr v-for="(scdl,index) in scdlsAtCurTrackInFC" @click="pickedAScheduleInCmctEditer(scdl)">
                      <td>{{index+1}}</td>
                      <td>{{scdl.time_ranges}}</td>
                      <td>{{scdl.id_agenda}}</td>
                      <td>{{scdl.hosts_id}}</td>
                      <td>{{scdl.co_hosts_id}}</td>
                      <td>{{scdl.speaker_id}}</td>
                      <td>{{scdl.speech_topics}}</td>
                    </tr>
                  </tbody>                
                </table>
              </div>
              <div class="form-inline">
                <label>报告题目:</label><textarea rows="1" type="text" class="form-control wh90  mgtp5" v-model="curCommunication.ar_topic"></textarea>
              </div>
              <div class="form-inline">
                <label>报告摘要:</label><textarea rows="2" type="text" class="form-control wh90  mgtp5" v-model="curCommunication.ar_abstract"></textarea>
              </div>              
            </div>
            <div class="thinborder mgtp5">
              <div class="form-inline mgtp5 mgrt5">
                <label>沟通类型</label>
                <select class="form-control" v-model="curCommunication.nature" title="是主动跟信还是被动回复">
                  <option value=0>沟通类型</option>
                  <option value=1>被动回信</option>
                  <option value=2>主动跟信</option>
                </select>
                <label>积极程度</label>
                <select class="form-control" v-model="curCommunication.initiative"  title="积极">
                  <option value="0">积极程度</option>
                  <option value="1">无兴趣</option>
                  <option value="2">感兴趣</option>
                  <option value="3">积极的</option>
                  <option value="4">热切的</option>
                </select>
                <label>退会状态</label>                
                <select class="form-control" v-model="curCommunication.ar_is_quit">
                  <option value=0>正常</option>
                  <option value=1>已退</option>
                </select>
                <input type="text" class="form-control mgrt10" placeholder="退出原因" v-model="curCommunication.ar_why_quit" v-if="curCommunication.ar_is_quit==1">
                <span class="mgrt10"></span>
                <button class="btn btn-link" @click="getCurAtdCmtdHistoryInCurTrk" v-if="showAtdCmtdHstys">
                  隐藏历史记录</button>
                <button class="btn btn-link" @click="getCurAtdCmtdHistoryInCurTrk" v-if="!showAtdCmtdHstys">查看历史记录</button>
              </div>
              <div class="container-fluid mgtp5 thinborder" v-if="showAtdCmtdHstys">
                <div v-if="curAtdCmtdHstyInCurTrack.length">
                  <div v-for="(hstry,index) in curAtdCmtdHstyInCurTrack">
                    <div class="card">
                      <div class="card-header bg-secondary text-white">
                        <div class="row">
                          <div class="col-lg form-inline">
                            沟通日期:<span>{{hstry.time_cmnctd}}</span>
                          </div>
                          <div class="col-lg form-inline">
                            沟通类型:<span>{{hstry.nature}}</span>
                          </div>
                          <div class="col-lg form-inline">
                            沟通员工:<span>{{hstry.id_operator}}</span>
                          </div>
                          <div class="col-lg form-inline">
                            积极程度:<span>{{hstry.initiative}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="card-body bg-success text-white">
                        <div class="row">
                          <div class="col-lg form-inline">
                            沟通摘要:<span>{{hstry.abstract}}</span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg form-inline">
                            沟通备注:<span>{{hstry.remark}}</span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg form-inline">
                            下次日期:<span>{{hstry.date_next}}</span>
                          </div>
                          <div class="col-lg form-inline">
                            下次计划:<span>{{hstry.plan_next}}</span>
                          </div>
                        </div>
                      </div> 
                    </div>
                    <br>
                  </div>
                </div>
                <div v-else>
                  <h5>没有找到沟通历史记录</h5>
                </div>
              </div>

              <div class="row">
                <div class="col-lg form-inline">
                  <label>沟通摘要</label>
                  <textarea type="text" class="form-control" placeholder="沟通的摘要内容" style="width:90%;" rows="3" v-model="curCommunication.abstract"></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>沟通备注</label>
                  <textarea type="text" class="form-control" placeholder="备注内容" style="width:90%;" rows="1" v-model="curCommunication.remark"></textarea>
                </div>
              </div>
              <div class="form-inline mgtp5 mgrt5">
                <label>下次日期</label>
                <input type="date" class="form-control" v-model="curCommunication.date_next">
                <label>下次计划</label>
                <input type="text" class="form-control" v-model="curCommunication.plan_next">

              </div>
            </div>
          </div>
          <div class="row mgtp5">
            <div class="col-lg">
              <button  class="btn btn-link" @click="backToAllATDsCmtdRcdsViewer">返回沟通历史列表</button>
            </div>
            <div class="col-lg">
              <button class="btn btn-primary" @click="saveEditedCmtnRcd">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import csvExportor from 'csv-exportor';
Date.prototype.format = function(fmt) { 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt; 
} 
  export default {
    data() {
      return {
        currentUserId:this.$store.state.user.id_user,
        allATDs:[],
        queryContent:{
          keyWord:'',
          conditions:'',
          id_project:0,
          id_track:0,
        },
        //importInvitedResult
        qcInIIR:{
          id_project:0,
          id_track:0,
          id_purpose:0,
        },
        projectsInIIR:JSON.parse(JSON.stringify(this.$store.state.projects)),//和follow up communications共用
        tracksInIIR:[],
        dataFromCSV:[],
        csvFileName:'',

        //follow up communications
        QcInFC:{
          id_project:0,
          id_track:0,
          kwForAtds:'',
          id_attendee:0,
          sDate:'',
          eDate:'',
          is_quit:2,
          id_topiced:2,
          id_abstracted:2,
          id_initiative:5,
          id_urgent:"unlimited",
          id_registered:2,
          id_hotel:5,
          id_tour:5,
        },
        trksInCurPrjctInFC:[],
        allTrksInFC:[],
        atdsInCurPrjct:[],
        atdsInCurTrk:[],
        filteredAtdsInQcAtdSlcter:[],
        cmtdRcdsOfAllATDsInFC:[],
        clsCardHeader:'card-header bg-info text-white',
        clsCardBody:'card-body bg-hvgrey text-white',// card-text bg-success 
        showFcSchBox:true,
        showCmtnRcdsViewer:false,
        showCmntnEditer:false,
        showAtdDetails:false,
        showAtdCmtdHstys:false,
        clsShowDetails:'collapse thinborder',
        curCommunication:{
          date_next:new Date(),
        },
        hTOps:[{id:0,name:'未知'},{id:1,name:'自理'},{id:2,name:'意向'},{id:3,name:'同意'},{id:4,name:'已购'}],
        showScdlViewerInFC:false,
        scdlsAtCurTrackInFC:{},
        curAtdCmtdHstyInCurTrack:[],
        curTrackIdInFC:0,



      }
    },
    methods:{
      //****************************importInvitedResult  begin **************************
      projectChanged() {
        this.tracksInIIR=[];
        if(this.qcInIIR.id_project==0) {
          return;
        } else {
          this.qcInIIR.id_track=0;
        }
        var _this=this;
        this.qcInIIR.conditions="TracksInThisProject";
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data: qs.stringify(_this.qcInIIR)
        }).then(function (response) {
          console.log(response.data);
          _this.tracksInIIR=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      clkImportCSV() {
        // $("#csvFileInput").val("");
        $("#csvFileInput").click();
      },
      readCSVFile(e) {
        this.dataFromCSV=[];
        this.csvFileName="";
        if(e.target.files.length>1 || !e.target.files.length) {
          this.$toast({text:'请选择一个CSV文件!',type:'info',duration:1500});
          return;
        }
        this.csvFileName=e.target.files[0].name;
        let _this=this;
        let obj=e.target;
        let reader = new FileReader();
        reader.readAsText(obj.files[0],"GB2312");
        reader.onload = function () {
          let tmp=_this.csvToObject(reader.result);
          if(!tmp) {
            _this.$toast({text:'CSV文件错误!',type:'danger',duration:1500});
            // obj.files=[];
            _this.resetCsvData();
            return;
          }
          _this.dataFromCSV = tmp;
          let colNames=Object.keys(tmp[0]);
          let essentialColNames=['track','name','email','article_title'];//必须要有的列
          for(let i=0;i<essentialColNames.length;i++) {
            if(!colNames.includes(essentialColNames[i])) {
              _this.$toast({text:'缺少必要的列"'+essentialColNames[i]+'"(不分大小写),请检查文件!',type:'danger',duration:3000});
              
              _this.resetCsvData();
              return;
            }
          }

          _this.qcInIIR.id_curUser=_this.currentUserId;
          _this.qcInIIR.conditions="importRepliedEmailsIntoTblForSavingInvitedResult";
          _this.qcInIIR.dataFromCSV=_this.dataFromCSV;

          _this.$axios({
            method: 'post',
            url: 'insertNewToCommunicatedRcds.php',
            data: qs.stringify(_this.qcInIIR)
          }).then(function (response) {
            console.log(response.data);
          // return;
            let rsp=response.data;
            // obj.files=[];
            _this.resetCsvData();
            if(rsp.strRslt==="CreateCmnctnDone") {
              _this.$toast({text:'成功'+rsp.insertedCount+"条,重复"+rsp.duplicateCount+"条.",
                type:'success',duration:800});
            }
            if(rsp.strRslt==="AllAreDuplicate"){
              _this.$toast({text:'数据重复!',type:'warning',duration:1000});
            }
            if(rsp.strRslt==="CheckTrack") {
              _this.$toast({text:'在此专场中找不到这些人员的信息,请重新选择专场.',type:'info',duration:4000});
            }
            if(rsp.strRslt==="MarkedRefusedInviteDone") {
              let info="";
              if(Number(rsp.existInCmtnCount)>0) {
                if(Number(rsp.markedCount)>0) {
                  info="更新"+rsp.markedCount+"位,但有"+rsp.existInCmtnCount+"位因已存在沟通记录,无法更改,请在沟通时更改";
                } else {
                  info="表中人员都存在沟通记录,无法在此更改,请在沟通时更改";
                }
              } else {
                if(Number(rsp.markedCount)>0) {
                  info="更新了"+rsp.markedCount+"位.";
                } else {
                  info="没有记录被更新";
                }
              }
              _this.$toast({text:info,type:'success',duration:4000});
            }
            if(rsp.strRslt==="MarkedRefusedInviteFailed" || rsp.strRslt==="MarkedBlackListFailed" || rsp.strRslt==="CreateCmnctnFailed") {
              _this.$toast({text:'操作失败',type:'danger',duration:3000});
            }
            if(rsp.strRslt==="MarkedBlackListDone") {
              _this.$toast({text:rsp.markedCount+'位成功地加入黑名单!有'+rsp.existInCmtnCount+'位已有沟通记录,请在沟通记录中操作!',type:'success',duration:4000});
            }
            if(rsp.strRslt==="NoRecordMarked") {
              _this.$toast({text:'全都有沟通记录,请在沟通联系中操作!',type:'success',duration:3000});
            }
          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:3000});
          });           
        }
      },
      kwForAtdsChanged() {
        if(this.QcInFC.kwForAtds.replace(/^\s+|\s+$/g,"").length) {
          this.filteredAtdsInQcAtdSlcter=this.atdsInCurTrk.filter(function(u){
            for(let prop in u) {
              if(u[prop] && u[prop].indexOf(this.QcInFC.kwForAtds)>-1) {
                return u;
                break;
              }
            }
          },this);
          if(this.filteredAtdsInQcAtdSlcter.length && this.filteredAtdsInQcAtdSlcter.length!==this.atdsInCurTrk.length) {
            this.QcInFC.id_attendee=this.filteredAtdsInQcAtdSlcter[0]['id'];
          } else {
            this.QcInFC.id_attendee=0;
          }
        } else {
          this.filteredAtdsInQcAtdSlcter=JSON.parse(JSON.stringify(this.atdsInCurTrk));
          this.QcInFC.id_attendee=0;
        }
      },
      csvToObject (csvString) {
        let csvarry = csvString.split("\r\n");
        for(let i=0;i<csvarry.length;i++) {
          //删除空行
          if(!(csvarry[i].replace(/\s+/g,"").length)) {
            csvarry.splice(i,1);
            i--;
            continue;
          }
          //去掉每行的最后一个逗号
          if(csvarry[i].indexOf(",")>-1) {
            if(csvarry[i].charAt(csvarry[i].length-1)===",") {
              csvarry[i]=csvarry[i].substring(0,csvarry[i].length-1);
            }

          } else {//文件不符合要求
            return false;
          }
        }
        let datas = [];
        let headers = csvarry[0].split(",");
        let ds=csvarry[1].split(",");
        headers.forEach( function(item,index,arr) {
          if(!item.replace(/\s+/g,"")) {//空列名替换
            arr[index] ="eMptyClmnNaMe"+index;
          } else {//转为小写
            arr[index]=arr[index].toLowerCase();
          }
        });
        let essentialColNames=['track','name','email','article_title'];//必须要有的列
        for(let i=1;i<csvarry.length;i++){
          let data={};
          let row=csvarry[i].split(",");

            //去除多余的双引号或单引号
            for(let j=0;j<headers.length;j++){
              //跳过空列头的项
              if(headers[j].indexOf("eMptyClmnNaMe")===0 || !essentialColNames.includes(headers[j])) {
                continue;
              }
              if(row[j] && (row[j].charAt(0)==='"' && row[j].charAt(row[j].length-1)==='"' || row[j].charAt(0)==="'" && row[j].charAt(row[j].length-1)==="'")) {
                row[j]=row[j].substring(1,row[j].length-1);
              }
              data[headers[j]]=row[j]?row[j]:'';
            }
          datas.push(data);
        }
        return datas;
      },
      resetCsvData() {
        this.dataFromCSV=[];
        this.qcInIIR.id_project=0;
        this.qcInIIR.id_track=0;
        this.qcInIIR.id_purpose=0;
        this.csvFileName="";

      },
      //****************************importInvitedResult end******************************
      //****************************communicate begin************************************
      backToFcSchBox() {
        this.showFcSchBox=true;
        this.showCmtnRcdsViewer=false;
      },
      getCmntnRcds() {
        if(!this.QcInFC.sDate || !this.QcInFC.eDate) {//有空项,设为默认,过去7天
          let td = new Date();
          td.setDate(td.getDate() - 7);
          this.QcInFC.sDate=td.format("yyyy-MM-dd");
          td = new Date();
          td.setDate(td.getDate());
          this.QcInFC.eDate=td.format("yyyy-MM-dd");
        } else {
          if(this.QcInFC.eDate<this.QcInFC.sDate) {//调整好大小
            let t=this.QcInFC.eDate;
            this.QcInFC.eDate=this.QcInFC.sDate;
            this.QcInFC.sDate=t;
          }
        }
        if(this.QcInFC.id_track==0) {
          this.$toast({text:'请选择专场!',type:'info',duration:2000});
          return;
        }
        //先获取cmtdRcdsOfAllATDsInFC,
        this.QcInFC.conditions="byDateRangeTrackId......ForCommunicate";
        var _this=this;
        this.cmtdRcdsOfAllATDsInFC=[];
        this.$axios({
          method: 'post',
          url: 'getCmnctnRcds.php',
          data: qs.stringify(_this.QcInFC)
        }).then(function (response) {
          console.log(response.data);
    // return;
          _this.cmtdRcdsOfAllATDsInFC=response.data;
          _this.showCmtnRcdsViewer=_this.cmtdRcdsOfAllATDsInFC.length?true:false;
          _this.showFcSchBox=!_this.showCmtnRcdsViewer;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
        //
        

      },
      clkACmnRcdToCmt(r) {
        this.showCmtnRcdsViewer=false;
        this.showCmntnEditer=true;
        // this.curCommunication=JSON.parse(JSON.stringify(r));
        this.curCommunication=r;
        console.log(this.curCommunication);
        let td = new Date();
        if(this.curCommunication.date_next==="0001-01-01" || this.curCommunication.date_next==="") {
          td.setDate(td.getDate() + 3);
          this.curCommunication.date_next=td.format("yyyy-MM-dd");
        }
        //获取当前track下的所有日程
        console.log(this.curCommunication);
        let _this=this;
        let queryContent={};
        queryContent.conditions="ByTrackIdForFollowingCommunication";
        queryContent.id_track=this.curCommunication.id_track;
        this.$axios({
          method: 'post',
          url: 'getSchedules.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.scdlsAtCurTrackInFC=response.data;
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      backToAllATDsCmtdRcdsViewer() {
        this.showCmntnEditer=false;
        this.showCmtnRcdsViewer=true;
        
      },
      openWedPage(url) {
        url="cnblogs.com/sghy/p/9604813.html";
        if(!url || url.length<8){

        } else {
          if(url.indexOf('https://www.')!==0 && url.indexOf('http://www.')!==0) {
            url='http://www.'+url;
          }
          window.open(url, '_blank');
        }
      },
      getCurAtdCmtdHistoryInCurTrk() {
        this.showAtdCmtdHstys=!this.showAtdCmtdHstys;
        //根据id_attendee和id_track获取沟通历史列表
        if(this.showAtdCmtdHstys) {
          console.log(this.curCommunication.id_attendee+'@'+this.curCommunication.ar_id_track);
        }
      },
      tglAtdDetailsInFC() {
        this.showAtdDetails=!this.showAtdDetails;
        this.clsShowDetails=this.showAtdDetails?'collapse show thinborder':'collapse thinborder'
      },
      saveTheAtd() {
        let atd={};
        atd.a_attainment=this.curCommunication.a_attainment;
        atd.a_awards=this.curCommunication.a_awards;
        atd.a_country=this.curCommunication.a_country;
        atd.a_dietary=this.curCommunication.a_dietary;
        atd.a_email1=this.curCommunication.a_email1;
        atd.a_gender=this.curCommunication.a_gender;
        atd.a_name=this.curCommunication.a_name;
        atd.a_personal_page=this.curCommunication.a_personal_page;
        atd.a_position=this.curCommunication.a_position;
        atd.a_title1=this.curCommunication.a_title1;
        atd.a_workplace=this.curCommunication.a_workplace;
        atd.atcl_md5=this.curCommunication.atcl_md5;
        atd.atcl_abstract=this.curCommunication.atcl_abstract;
        atd.atcl_title=this.curCommunication.atcl_title;
        atd.id=this.curCommunication.id_attendee;
        for(let prop in atd) {
          atd[prop]=atd[prop]==undefined?"":atd[prop];//是undefined 中 null吗
        }
        //update tbl_cnfrc_attendees
        let _this=this;
        let queryContent={};
        queryContent.conditions="updateWithCmnctedInfoForFollowCommunication";
        queryContent.atd=atd;
        queryContent.curId=this.currentUserId;
        this.$axios({
          method: 'post',
          url: 'updateAttendees.php',
          data: qs.stringify(queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data==true) {
            _this.$toast({text:'更新成功!',type:'success',duration:800});
          } else {
            _this.$toast({text:'更新失败,请稍后再试!',type:'danger',duration:2000});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:2000});
        });
      },
      tglScdlsInTheTrackInFC() {
        this.showScdlViewerInFC=!this.showScdlViewerInFC;
        // if(this.showScdlViewerInFC) {
        //   console.log("通过id_track到tbl_cnfrc_schedules中查找专场日程");
        // }
      },
      pickedAScheduleInCmctEditer(sdl) {
        this.curCommunication.ar_ids_schedule=sdl.id;
      },
      saveEditedCmtnRcd() {
        this.showCmntnEditer=false;
        this.showCmtnRcdsViewer=true;
        //将this.curCommunication从cmtdRcdsOfAllATDsInFC中移除
        
      },

      //****************************communicate end***************************************
      // getATDsWithCmnctdRcdsInThisProject() {
      //   var _this=this;
      //   this.cmnctdRcdsInThisPrjct=[];
      //   this.queryContent.conditions="AttendeesWithKeyWordAndCommunicationsRecordsInThisProject";
      //   this.queryContent.id_project=this.theProject.id;
      //   this.$axios({
      //     method: 'post',
      //     url: 'getAttendees.php',
      //     data: qs.stringify(_this.queryContent)
      //   }).then(function (response) {
      //     console.log(response.data);
      //     _this.cmnctdRcdsInThisPrjct=response.data;
      //     if(_this.cmnctdRcdsInThisPrjct.length) {
      //       let ids_attendees=[];
      //       _this.cmnctdRcdsInThisPrjct.forEach( function(item, index) {
      //         if(!ids_attendees.includes(item.id)) {
      //           _this.lastCmnctnRcdsOfEvryATD.push(item);
      //           ids_attendees.push(item.id);
      //         }
      //       });
      //     }
      //   }).catch(function (error) {
      //     console.log(error);
      //     _this.$toast({text:'通信错误!',type:'danger',duration:4000});
      //   });
      // },
      // getProjects() {
      //   this.projects=JSON.parse(JSON.stringify(this.$store.state.projects));

      // },
      // searchATDsInTableShower() {
      //   console.log(this.tmpATDsInTbl);
      //   this.keyWord=this.keyWord.replace(/^\s+|\s+$/g,"");//去除开头和结尾的空格
      //   if(!this.keyWord) {
      //     this.ATDsInTable=JSON.parse(JSON.stringify(this.tmpATDsInTbl));
      //   } else {
      //     this.ATDsInTable = this.tmpATDsInTbl.filter((item,i,arr) => {
      //       return (item.name && item.name.indexOf(this.keyWord) > -1 || item.workplace && item.workplace.indexOf(this.keyWord) > -1 || item.email1 && item.email1.indexOf(this.keyWord)>-1 || item.email2 && item.email2.indexOf(this.keyWord)>-1 || item.attainment && item.attainment.indexOf(this.keyWord)>-1 || item.awards && item.awards.indexOf(this.keyWord)>-1 || item.mp1 && item.mp1.indexOf(this.keyWord)>-1);
      //       //
      //     },this);
      //     if(this.ATDsInTable.length<1) {
      //       console.log('No Data');
      //     }
      //   }
      // },
      // clkAProject(r) {
      //   this.theProject=r;
      //   this.showProjectsViewer=false;
      //   this.showATDsViewer=true;
      //   this.showProjectTitle=true;
      //   this.slctdATDs=[];
      //   this.theCmnctnRcd.id_project=this.theProject.id;
      //   this.cmnctdRcdsInThisPrjct=[];
      //   this.lastCmnctnRcdsOfEvryATD=[];
      //   this.acptdInviteInLastCmnctnRcdOfEvryATD=[];
      //   this.rfsdInviteInLastCmnctnRcdOfEvryATD=[];
      //   this.hesitatingInLstCmnctnRcdOfEvryATD=[];
      //   this.NotRepliedATDs=[];
      //   this.allATDs=JSON.parse(JSON.stringify(this.tmpAllATDs));
      //   this.ivtdStatus=0;
      //   this.ivtdStatus=1;
      //   var _this=this;
      //   this.queryContent.conditions="AttendeesWithKeyWordAndCommunicationsRecordsInThisProject";
      //   this.queryContent.id_project=this.theProject.id;
      //   this.$axios({
      //     method: 'post',
      //     url: 'getAttendees.php',
      //     data: qs.stringify(_this.queryContent)
      //   }).then(function (response) {
      //     console.log(response.data);
      //     _this.cmnctdRcdsInThisPrjct=response.data;
      //     if(_this.cmnctdRcdsInThisPrjct.length) {
      //       //获取去重后的已沟通代表清单
      //       let lastCmnctnRcds=[];//每位代表的最后一次沟通记录组成的数组
      //       let ids_attendees=[];
      //       _this.cmnctdRcdsInThisPrjct.forEach( function(item, index) {
      //         if(!ids_attendees.includes(item.id_attendee)) {
      //           lastCmnctnRcds.push(JSON.parse(JSON.stringify(item)));
      //           ids_attendees.push(item.id_attendee);
      //         } else {
      //           let i=lastCmnctnRcds.findIndex((ele)=>ele.id_attendee==item.id_attendee);
      //           if(item.r_id>lastCmnctnRcds[i].r_id) {
      //             lastCmnctnRcds[i]=JSON.parse(JSON.stringify(item));
      //           }
      //         }
      //       });
      //       _this.lastCmnctnRcdsOfEvryATD=lastCmnctnRcds;
      //       //获取沟通总次数和已经回复的次数,同时获取未邀请的代表清单
      //       _this.lastCmnctnRcdsOfEvryATD.forEach( function(lastCmmRcd) {
      //         lastCmmRcd.times_cmnctd=0;//沟通总次数
      //         lastCmmRcd.times_replied=0;//已回复次数
      //         _this.cmnctdRcdsInThisPrjct.forEach( function(cmnctdRcd) {
      //           //沟通(含邀请)总次数
      //           if(lastCmmRcd.id_attendee==cmnctdRcd.id_attendee) {
      //             lastCmmRcd.times_cmnctd++;
      //           }
      //           //回复(含邀请)总次数
      //           if(lastCmmRcd.id_attendee==cmnctdRcd.id_attendee && (cmnctdRcd.date_replied && cmnctdRcd.status_invite!==null)) {
      //             lastCmmRcd.times_replied++; 
      //           }
      //         });
      //         //已经接受邀请的记录
      //         if(lastCmmRcd.status_invite==1) {
      //           _this.acptdInviteInLastCmnctnRcdOfEvryATD.push(lastCmmRcd);
      //         }
      //         //已经拒绝邀请的记录或沟通时拒绝参会
      //         if(lastCmmRcd.status_invite==0 || lastCmmRcd.status_cmnctn==0) {
      //           _this.rfsdInviteInLastCmnctnRcdOfEvryATD.push(lastCmmRcd);
      //         }
      //         //正在犹豫的记录
      //         if(lastCmmRcd.status_invite==2) {
      //           _this.hesitatingInLstCmnctnRcdOfEvryATD.push(lastCmmRcd);
      //         }
      //         //获取未邀请的代表清单,即:从allATDs中删除已经邀请过的代表
      //         let i=_this.allATDs.findIndex((ele)=>ele.id==lastCmmRcd.id_attendee);
      //         if(i>-1) {
      //           _this.allATDs.splice(i,1);
      //         }
      //       });
      //       //未回复
      //       _this.NotRepliedATDs=_this.lastCmnctnRcdsOfEvryATD.filter((item)=>item.times_replied==0);
      //     }
      //     //初始化ATDsInTable及其临时表
      //     _this.ATDsInTable=_this.NotRepliedATDs;
      //     _this.tmpATDsInTbl=JSON.parse(JSON.stringify(_this.ATDsInTable));
      //   }).catch(function (error) {
      //     console.log(error);
      //     _this.$toast({text:'通信错误!',type:'danger',duration:4000});
      //   });
      // },
      // backToProjectsViewer() {
      //   this.showProjectsViewer=true;
      //   this.showATDsViewer=false;
      //   this.showProjectTitle=false;

      // },
      // clkAnATDToCommunicate(r) {
      //   console.log(r);
      //   this.showATDsViewer=false;
      //   this.showCmnctnViewer=true;
      //   this.currentATD=r;
      //   this.theCmnctnRcd.id_attendee=this.currentATD.id;
      //   //获取参会记录
        
      //   console.log(r);
      // },
      // clkSlctAllCkbx () {
      //   this.ckAllATDs=!this.ckAllATDs;
      //   if(this.ckAllATDs) {
      //     this.slctdATDs=JSON.parse(JSON.stringify(this.ATDsInTable));
      //   } else {
      //     this.slctdATDs=[];
      //   }
      // },
      // backToATDsViewer() {
      //   this.showATDsViewer=true;
      //   this.showCmnctnViewer=false;
      // },
      // saveTheCmnctnRcd() {
      //   console.log(this.theCmnctnRcd);
      //   this.backToATDsViewer();
      //   //需要移除刚才联系过的代表
      // },
      // getAllAttendees() {
      //   var _this=this;
      //   this.queryContent.conditions="ALLAttendees";
      //   this.$axios({
      //     method: 'post',
      //     url: 'getAttendees.php',
      //     data: qs.stringify(_this.queryContent)
      //   }).then(function (response) {
      //     console.log(response.data);
      //     if(response.data.length) {
      //       _this.allATDs=response.data;

      //       //添加属性
      //       _this.allATDs.forEach( function(element) {
      //         element.id_attendee=element.id;
      //         element.times_replied=0;
      //         element.times_cmnctd=0;
      //         element.status_invite=null;
      //         element.date_replied=null;
      //       });
      //       _this.tmpAllATDs=JSON.parse(JSON.stringify(_this.allATDs));
      //     }
      //   }).catch(function (error) {
      //     console.log(error);
      //     _this.$toast({text:'通信错误!',type:'danger',duration:4000});
      //   });
      // },
    },
    mounted () {
      let _this=this;
      this.queryContent.conditions="anyone";
      this.$axios({
        method: 'post',
        url: 'getTracks.php',
        data: qs.stringify(_this.queryContent)
      }).then(function (response) {
        console.log(response.data);
        _this.allTrksInFC=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({text: '通信错误!',type: 'danger',duration: 4000});
      });
    },
    watch:{
      'curCommunication.ar_id_track': {
        handler: function() {
          if(this.curCommunication.ar_id_track==0) {
            this.scdlsAtCurTrackInFC=[];
            return;
          }
          let _this=this;
          let queryContent={};
          queryContent.conditions="ByTrackIdForFollowingCommunication";
          queryContent.id_track=this.curCommunication.id_track;
          this.$axios({
            method: 'post',
            url: 'getSchedules.php',
            data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            _this.scdlsAtCurTrackInFC=response.data;
          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          });
        },
      },
      'QcInFC.id_project': {
        handler: function() {
          if(this.QcInFC.id_project==0) {
            this.atdsInCurPrjct=[];
            this.trksInCurPrjctInFC=[];
          }else {
            this.trksInCurPrjctInFC=this.allTrksInFC.filter((item)=>item.id_project==this.QcInFC.id_project);
            //得到此项目下的id_track的集合
            let idsOfTracksInCurPrjct=[];
            for (let item of this.allTrksInFC) {
              if(item.id_project==this.QcInFC.id_project) {
                idsOfTracksInCurPrjct.push(item.id);
              }
            }
            //根据idsOfTracksInCurPrjct,得到此项目下的所有atd
            var _this=this;
            this.queryContent.conditions="ALLATDsInCurPrjctInFCForProvidingOptions";
            this.queryContent.idsOfTracks=idsOfTracksInCurPrjct;
            this.$axios({
              method: 'post',
              url: 'getAttendees.php',
              data: qs.stringify(_this.queryContent)
            }).then(function (response) {
              console.log(response.data);
              if(response.data.length) {
                _this.atdsInCurPrjct=response.data;
              }
            }).catch(function (error) {
              console.log(error);
              _this.$toast({text:'通信错误!',type:'danger',duration:4000});
            });
          }
          //重置
          this.QcInFC.id_track=0;
        },
      },
      'QcInFC.id_track': {
        handler: function() {
          this.atdsInCurTrk=[];
          if(this.QcInFC.id_track!=0) {
            this.atdsInCurTrk=this.atdsInCurPrjct.filter((item)=>item.id_last_track==this.QcInFC.id_track);
          }
          this.filteredAtdsInQcAtdSlcter=JSON.parse(JSON.stringify(this.atdsInCurTrk));
          console.log(this.atdsInCurTrk);
        }
      },
    },
    computed:{
      // getInvitedStatus() {
      //   return function(r) {
      //     if(r.time_cmnctd===null || r.time_cmnctd===undefined) {
      //       return '未邀请';
      //     } else {
      //       switch (r.status_invite) {
      //         case null:
      //           return '已邀请,未回复';
      //           break;
      //         case 0:
      //           return '已回复,已拒绝';
      //           break;
      //         case 1:
      //           return '已回复,已应邀';
      //           break;
      //         case 2:
      //           return '已回复,考虑中';
      //           break;
      //       }
      //     }
      //   }
      // },
      isTrackUnselectable() {
        return (this.qcInIIR.id_project==0 || this.tracksInIIR.length==0)?true:false;
      },
      isPurposeUnselectable() {
        return (this.qcInIIR.id_track==0 || this.tracksInIIR.length==0)?true:false;
      },
    },
  } 
</script>

<style scoped>
.input-hide {
    display:none;
/*    position: absolute;
    right: 0px;
    opacity: 0;*/
}
.searchbox button,.searchbox input,.searchbox select {
  margin-left: 5px;
}
.searchbox {
  margin-bottom: 5px;  
}
.btn-at-right {
  position: absolute;
  right: 20px;
}
.row select, .row input {
  width:70%;
}
.card {
  margin-bottom: 5px;
}
li {
 list-style: none;
}
.thinborder {
  padding: 10px;
  border: 1px solid #000000;
}
.mgrt5 input,.mgrt5 select,.dsfds input,.mgrt5 {
  margin-right: 5px;
}
#attAwa,#cmnctnEditePanle,.mgtp5,.row {
  margin-top: 5px;
}
#cmnctnEditePanle span {
  min-width: 50px;
  display:inline-block;
}
.mgrt10 input,.mgrt10 select,.mgrt10 {
  margin-right: 10px;
}
.title-in-card {
  margin-right: 10px;
  min-width: 30px;
}
.wh90 {
  width: 90%;
}
.space50 {
  margin-right: 10px;
  min-width: 50px;
}
.bg-hvgrey {
  background-color: #3C3C3C;
}
.bg-hvgrey label,.bg-hvgrey span,.bg-hvgrey select,.bg-hvgrey input,.bg-hvgrey textarea,.bg-hvgrey table {
  background-color: #3C3C3C;
  color: white;
}
.wth100 {
  width: 100px;  
}
.mgtp10 {
  margin-top:10;
}
.mgtp30 {
  margin-top:30;
}

</style>
