<template>
  <div class="father container-fluid">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#followCommunications">沟通联系</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#importInvitedResult">将邀请结果导入</a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="importInvitedResult" class="tab-pane  pre-scrollable">
        <div class="=mgtp30">
          <h5>根据操作目的,以CSV文件格式,将邀请结果导入数据库</h5>
          <h5>文件必须有:name,email,article_title列</h5>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div class="form-inline mgtp5">
          <label>项目</label>
          <select class="form-control" v-model="qcInIIR.id_project" @change="projectChanged()">
            <option value=0>选择项目</option>
            <option v-for="item in projectsInIIR" :value="item.id">{{item.name}}</option>
          </select>
<!--           <label>专场</label>
          <select class="form-control" v-model="qcInIIR.id_track" :disabled="isTrackUnselectable">
            <option value=0>选择专场</option>
            <option v-for="item in tracksInIIR" :value="item.id">{{item.subject}}</option>
          </select> -->
          <label>目的</label>
          <select class="form-control" v-model="qcInIIR.id_purpose" :disabled="isPurposeUnselectable">
            <option value=0>导入目的</option>
            <option value=1>沟通联系</option>
            <option value=2>拒绝参会</option>
            <option value=3>进黑名单</option>
          </select>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        <div class="row" v-if="qcInIIR.id_project!=0 && qcInIIR.id_purpose!=0 && !dataFromCSV.length"><!--  && qcInIIR.id_track!=0 -->
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
      <div id="followCommunications" class="tab-pane  pre-scrollable active">
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
            <option v-for="item in trksInCurPrjctInFC" :value="item.id">{{item.subject}}</option>
          </select>
        </div>
        <div class="form-inline mgtp5" v-if="showFcSchBox">
          <label>限定嘉宾</label>
          <input class="form-control" type="text" placeholder="嘉宾查询词" v-model="QcInFC.kwForAtds" @input="kwForAtdsChanged" title="将在姓名,职务,头衔,机构,取得的成就,荣誉,国家,邮箱,备注,论文摘要,杂志名,论文名称等中查找" style="margin-right: 0px;border-right-style:none;border-left-style:none;" :readonly="QcInFC.id_project==0">
          <select class="form-control" v-model="QcInFC.id_attendee" title="嘉宾" :disabled="!filteredAtdsInQcAtdSlcter.length">
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
          <button id="btnSearch" class="btn btn-primary" type="button" @click="getCmntnRcds">获取沟通记录</button>
        </div>
        <hr v-if="showFcSchBox" style="height:1px;border:none;border-top:2px solid #007bff;" />
        <div v-if="showCmtnRcdsViewer">
          <div v-if="cmtdRcdsOfAllATDsInFC.length>0">
            <button class="btn btn-link" @click="backToFcSchBox">返回搜索条件</button>
            <ul>
              <li v-for="(item,index) in cmtdRcdsOfAllATDsInFC" @click="clkACmnRcdToCmt(item)">
                <div :class="item.ar_rgst==1&&item.registration_fee_received>0?'card-header bg-success text-white':getUrgentLevel(item)">
                  <div class="row">
                    <div class="col-lg form-inline">
                      热度:<span class="ticl">{{item.ar_times_to_us}}/{{Number(item.ar_times_we_sent)+Number(item.a_invited_times)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      注册:<span class="ticl">{{item.ar_rgst==1?"已注册":"未注册"}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      已收注册费:<span class="ticl">{{item.registration_fee_received>0?item.registration_fee_received:0}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      酒店:<span class="ticl">{{getStatusOfHT(item.ar_hotel_expense_received,item.ar_hotel)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      已收酒店费:<span class="ticl">{{item.ar_hotel_expense_received>0?item.ar_hotel_expense_received:0}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      观光:<span class="ticl">{{getStatusOfHT(item.ar_tour_fee_received,item.ar_tour)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      已收观光费:<span class="ticl">{{item.ar_tour_fee_received>0?item.ar_tour_fee_received:0}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      序号:<span class="ticl">{{item.id_attendee}}</span>
                    </div>
                  </div>
                </div>
                <div :class="item.ar_rgst==1?bgRgstd:bgNotRgsted">
                  <div class="row">
                    <div class="col-lg form-inline">
                      沟通日期:<span class="ticl">{{item.date_cmnctd}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      沟通同事:<span class="ticl">{{getOperater(item.id_operator)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      沟通类型:<span class="ticl">{{getCmntdType(item.nature)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      下次日期:<span class="ticl">{{item.date_next=="0001-01-01"?"":item.date_next}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      嘉宾姓名:<span class="ticl">{{item.a_name}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      职务头衔:<span class="ticl">{{item.a_position}}/{{item.a_title1}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      所在国家:<span class="ticl">{{item.a_country}}</span>
                    </div>
                  </div>
                  <div class="row">
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      所在机构:<span class="ticl">{{item.a_workplace?item.a_workplace:"未填写"}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      专场计划:<span class="ticl">{{getTrkSubject(item.ar_id_track)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      日程计划:<span class="ticl">{{getSdlName(item.ar_ids_schedule)}}</span>
                    </div>
                    <div class="col-lg form-inline">
                      角色计划:<span class="ticl">{{getRoleName(item.ar_id_role)}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      参会备注:<span class="ticl">{{item.ar_remark?item.ar_remark:"---"}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      报告题目:<span class="ticl">{{item.ar_topic?item.ar_topic:"未提交"}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      <span>报告摘要</span>:<pre><span class="wttxt-alnlft">{{item.ar_abstract?item.ar_abstract:"未提交"}}</span></pre>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg form-inline">
                      沟通摘要:&nbsp<pre><p class="wttxt-alnlft">{{item.abstract}}</p></pre><!--  class="bg-hvgrey" -->
                    </div>
                  </div>
<!--                   <div class="row">
                    <div class="col-lg form-inline">
                      沟通备注:<span class="ticl">{{item.remark}}</span>
                    </div>
                  </div> -->
<!--                   <div class="row">
                    <div class="col-lg form-inline">
                      下次日期:<span class="ticl">{{item.date_next=="0001-01-01"?"":item.date_next}}</span>
                    </div>
                  </div> -->
<!--                   <div class="row">
                    <div class="col-lg form-inline">
                      下次计划:<span class="ticl">{{item.plan_next}}</span>
                    </div>
                  </div> -->
                </div> 
                <br>
              </li>
            </ul>
            <button class="btn btn-link" @click="backToFcSchBox">返回搜索条件</button>
          </div>
          <div v-if="cmtdRcdsOfAllATDsInFC.length<1">
            <h5>找不到符合条件的沟通记录</h5>
            <p><button class="btn btn-link" @click="backToFcSchBox">返回搜索条件</button></p>
          </div>
        </div>
        <div class="bg-hvgrey"  v-if="showCmntnEditer"><!-- :class="curCommunication.ar_rgst==0?bgHvgrey:bgSuces" -->
          <button  class="btn btn-link" @click="backToAllATDsCmtdRcdsViewer">返回沟通记录列表</button>
          <div id="atdInfoInFC" class="thinborder mgtp5">
            <div class="row">
              <div class="col-lg-4 form-inline">
                <label>全名</label>
                <input class="form-control" type="text" placeholder="嘉宾全名" v-model="curCommunication.a_name" style="width:85%;">
              </div>
              <div class="col-lg-4 form-inline">
                <label>信箱</label>
                <input class="form-control" type="text" v-model="curCommunication.a_email1" readonly style="width:85%;">
              </div>
              <div class="col-lg-2 form-inline">
                <label>国家</label>
                <input class="form-control" type="text" placeholder="嘉宾所在国家" v-model="curCommunication.a_country">
              </div>
              <div class="col-lg-2 form-inline">
                <label>餐食</label>
                <select class="form-control" v-model="curCommunication.a_dietary">
                  <option value="0">任意</option>
                  <option value="1">清真</option>
                  <option value="2">素食</option>
                  <option value="3">荤食</option>
                </select>
              </div>
            </div>
            <div class="form-inline mgtp10mgbt10">
              <label for="keynote">主题演讲</label>
              <input id="keynote" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="keynote">
              <label for="SAB">SAB</label>
              <input id="SAB" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="SAB">
              <label for="chair">主席</label>
              <input id="chair" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="chair">
              <label for="speaker">演讲人</label>
              <input id="speaker" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="speaker">
              <label for="media">媒体</label>
              <input id="media" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="media">
              <label for="partner">合作方</label>
              <input id="partner" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="partner">
              <label for="audience">观众</label>
              <input id="audience" type="checkbox" class="form-control mgrt20" v-model="curCommunication.level" value="audience">
            </div>
            <div class="row">
                <div class="col-lg-4 form-inline">
                  <label>头衔</label>
                  <input class="form-control" type="text" placeholder="嘉宾头衔" v-model="curCommunication.a_title1" style="width:85%;">
                </div>
                <div class="col-lg-4 form-inline">
                  <label>职务</label>
                  <input class="form-control" type="text" placeholder="嘉宾担任的职务" v-model="curCommunication.a_position" style="width:85%;">
                </div>
                <div class="col-lg-2 form-inline">
                  <label>性别</label>
                  <select class="form-control" v-model="curCommunication.a_gender">
                    <option value="0">女</option>
                    <option value="1">男</option>
                  </select>
                </div>
                <div class="col-lg-2 form-inline">
                <button class="btn btn-link" v-if="showAtdDetails" @click="tglAtdDetailsInFC">收起详情</button>
                <button class="btn btn-link" v-if="!showAtdDetails" @click="tglAtdDetailsInFC">查看详情</button>
                </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>机构</label>
                <input class="form-control" type="text" placeholder="嘉宾单位" v-model="curCommunication.a_workplace" style="width:95%;">
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
                  <label>获奖</label>
                  <textarea rows="3" placeholder="主要获奖项" v-model="curCommunication.a_awards" style="width:95%;"></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>成就</label> 
                  <textarea rows="3" placeholder="近期主要成果" v-model="curCommunication.a_attainment" style="width:95%;"></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>题目</label>
                  <textarea class="wttxt-alnlft" rows="3" placeholder="所发论文的题目" v-model="curCommunication.atcl_title" style="width:95%;" title="所发论文的题目"></textarea>
                </div>
              </div>
<!--               <div class="row">
                <div class="col-lg form-inline"><pre></pre>
                  <label>摘要</label>
                  <textarea rows="9" placeholder="所发论文的摘要" v-model="curCommunication.atcl_abstract" style="width:95%;" title="所发论文的摘要"></textarea>
                </div>
              </div> -->
              <div class="mgtp5">
                <button class="btn btn-primary" @click="saveTheAtd">保存对嘉宾的更改</button>
              </div>
            </div>            
          </div>
          <div>
            <div id="bgcPrmryColrW" class="form-inline mgtp5 thinborder">
              <label>沟通热度:</label><span>{{curCommunication.ar_times_to_us?curCommunication.ar_times_to_us:0}}/{{Number(curCommunication.ar_times_we_sent)+Number(curCommunication.a_invited_times)}}</span>
              <label>注册:</label>
              <select class="form-control" v-model="curCommunication.ar_rgst">
                <option value=0>未注册</option>
                <option value=1>已注册</option>
              </select>
              <label>酒店:</label>
              <select class="form-control" v-model="curCommunication.ar_hotel" >
                <!-- <option value=0>未知</option> -->
                <option v-for="o in hTOps" :value="o.id">{{o.name}}</option>
              </select>
              <label>观光:</label>
              <select class="form-control" v-model="curCommunication.ar_tour">
                <!-- <option value=0>未知</option> -->
                <option v-for="o in hTOps" :value="o.id">{{o.name}}</option>
              </select>
              <label>已收注册费:</label><span>{{curCommunication.ar_registration_fee_received?curCommunication.ar_registration_fee_received:0}}</span>
              <label>已收住宿费:</label><span>{{curCommunication.ar_hotel_expense_received?curCommunication.ar_hotel_expense_received:0}}</span>
              <label>已收观光费:</label><span>{{curCommunication.ar_tour_fee_received?curCommunication.ar_tour_fee_received:0}}</span>
              <label>参会状态</label>                
              <select class="form-control" v-model="curCommunication.ar_is_quit">
                <option value=0>正常</option>
                <option value=1>已退</option>
              </select>
              <input type="text" class="form-control mgrt10" placeholder="退出原因" v-model="curCommunication.ar_why_quit" v-if="curCommunication.ar_is_quit==1">
            </div>
            <div class="thinborder mgtp5" id="cmnctnEditePanle">
              <div class="form-inline mgtp5">
                <label>专场计划:</label>
                <select class="form-control mgrt5" v-model="curCommunication.ar_id_track">
                  <option value="0">专题场次</option>
                  <option v-for="item in trksInCurPrjctInFC" :value="item.id">{{item.subject}}</option>
                </select>
                <label>专场时段:</label>
                <span class="mgrt10">{{curCommunication.trk_time_ranges}}</span>
                <label>主席:</label>
                <span class="mgrt10">{{getAtdName(curCommunication.trk_id_chair)}}</span>
                <label>副主席:</label>
                <span class="mgrt10">{{getAtdName(curCommunication.trk_id_co_chair)}}</span>
                <label>专场备注:</label>
                <span class="mgrt10">{{curCommunication.trk_remark}}</span>
              </div>
            </div>
            <div class="mgtp5 thinborder">
              <div class="form-inline mgrt5"> <!-- col-lg-5  mgtp5 -->
                <div class="form-inline">
                  <button  @click="tglScdlsInTheTrackInFC" title="点击查看" class="btn btn-link" style="padding: 0px;">日程计划
                  </button>
                  <select class="form-control" v-model="curCommunication.ar_ids_schedule":disabled="curCommunication.ar_id_track==0">
                    <option value="0">请选择</option>
                    <option v-for="item in scdlsInCurTrackInFC" :value="item.id">{{item.name}}@{{item.time_ranges}}</option>
                  </select>
                  <label>演讲计划</label>
                  <select class="form-control" v-model="curCommunication.ar_id_role" :disabled="curCommunication.ar_ids_schedule==0">
                    <option value="0">无演讲</option>
                    <option value="1">有演讲</option>
                  </select>
<!--                 </div>
                <div class="form-inline"> --><!--min-width: col-lg-7  -->
                </div>
              </div>
                <div class="form-inline mgrt5 mgtp5">
                  <label>参会备注</label>
                  <textarea rows="1" class="form-control" v-model="curCommunication.ar_remark" title="该嘉宾参加此专场的备注" placeholder="参会的备注信息" style="width:90%;"></textarea>
                </div>
              <div class="thinborder mgtp5" v-if="showScdlViewerInFC">
                <table class="table table-sm" v-if="scdlsInCurTrackInFC.length">
                  <thead class="tablebox">
                    <th style="width:20%;">时段</th>
                    <th>报告人</th>
                    <th>所在国家</th>
                    <th>所属机构</th>
                    <th>职务/头衔</th>
                    <th>报告题目</th>
                  </thead>
                  <tbody class="tablebox">
                    <tr v-for="(scdl,index) in scdlsInCurTrackInFC"><!--  @click="pickedAScheduleInCmctEditer(scdl)" -->
                      <td>{{scdl.time_ranges}}</td>
                      <td @click="getAtdAr(scdl.speaker_id)" class="mushvr">{{getAtdName(scdl.speaker_id)}}</td>
                      <td>{{getAtdCountry(scdl.speaker_id)}}</td>
                      <td>{{getAtdOgnztn(scdl.speaker_id)}}</td>
                      <td>{{getAtdPositionAndTitle(scdl.speaker_id)}}</td>
                      <td>{{scdl.speech_topics?scdl.speech_topics:'---'}}</td>
                    </tr>
                  </tbody>                
                </table>
                <div class="form-inline" v-if="!scdlsInCurTrackInFC.length">
                  <span style="color:red;">此专场未设置任何日程</span>
                </div>
              </div>
              <div class="form-inline">
                <label>报告题目</label><textarea rows="1" type="text" class="form-control wh90  mgtp5" v-model="curCommunication.ar_topic" placeholder="报告题目" style="width:90%;"></textarea>
              </div>
              <div class="form-inline"><!--  -->
                <label>报告摘要</label>
                <textarea rows="2" type="text" v-model="curCommunication.ar_abstract" class="form-control wh90  mgtp5 wttxt-alnlft" placeholder="报告摘要" style="width:90%;">
                </textarea>
                <span></span>
              </div>              
            </div>
            <div class="thinborder mgtp5">
              <div class="container-fluid mgtp5 thinborder" v-if="showAtdCmtdHstys">
                <div v-if="curAtdCmtdHstyInCurPrjct.length">
                  <div v-for="(hstry,index) in curAtdCmtdHstyInCurPrjct">
                    <div class="card">
                      <!-- <div class="card-header bg-secondary text-white"> -->
                      <div class="card-body bg-secondary text-white" style="padding:5px;">
                        <div class="row">
                          <div class="col-lg form-inline">
                            沟通日期:<label>{{hstry.date_cmnctd}}</label>
                          </div>
                          <div class="col-lg form-inline">
                            沟通类型:<label>{{getCmntdType(hstry.nature)}}</label>
                          </div>
                          <div class="col-lg form-inline">
                            沟通员工:<label>{{getOperater(hstry.id_operator)}}</label>
                          </div>
                          <div class="col-lg form-inline">
                            积极程度:<label>{{getInitiativeName(hstry.initiative)}}</label>
                          </div>
<!--                           <div class="col-lg form-inline">
                            沟通编号:<label>{{hstry.id}}</label>
                          </div> -->
                          <div class="col-lg form-inline">
                            下次日期:<span>{{hstry.date_next=="0001-01-01"?"未设置":hstry.date_next}}</span>
                          </div>                        </div>
<!--                           <div class="col-lg form-inline">
                            下次计划:<span>{{hstry.plan_next}}</span>
                          </div> -->
                        <div class="row">
                          <div class="col-lg form-inline">
                            沟通摘要:<pre><p class="wttxt-alnlft">{{hstry.abstract}}</p></pre>
                          </div>
                        </div>
<!--                         <div class="row">
                          <div class="col-lg form-inline">
                            下次日期:<span>{{hstry.date_next=="0001-01-01"?"未设置":hstry.date_next}}</span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg form-inline">
                            下次计划:<span>{{hstry.plan_next}}</span>
                          </div>
                        </div> -->
                      </div> 
                    </div>
                    <br>
                  </div>
                </div>
                <div v-else>
                  <h5>没有找到沟通记录记录</h5>
                </div>
              </div>
              <div class="form-inline mgtp5 mgrt5">
                <label>沟通类型</label>
                <select class="form-control" v-model="curCommunication.nature" title="是主动跟信还是被动回复">
                  <option value=0>沟通类型</option>
                  <!-- <option value=1>回复邀请</option> -->
                  <option value=2>回信</option>
                  <option value=3>追信</option>
                </select>
                <label>积极程度</label>
                <select class="form-control" v-model="curCommunication.initiative"  title="积极">
                  <option value="0">积极程度</option>
                  <option value="1">感兴趣</option>
                  <option value="2">积极的</option>
                  <option value="3">热切的</option>
                </select>
                <label>下次日期</label>
                <input type="date" class="form-control" v-model="curCommunication.date_next">
                <label>下次计划</label>
                <input type="text" class="form-control" v-model="curCommunication.plan_next" placeholder="计划沟通事项" style="min-width: 500px;">
              <div class="form-inline mgtp5 mgrt5">
                <button class="btn btn-link" @click="hideCmtdHistory" v-if="showAtdCmtdHstys">
                  隐藏历史记录</button>
                <button class="btn btn-link" @click="getCurAtdCmtdHistoryInCurPrjct" v-if="!showAtdCmtdHstys">查看历史记录</button>
              </div>
                 
                <span class="mgrt10"></span>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>沟通摘要</label>
                  <textarea type="text" class="form-control wttxt-alnlft" placeholder="沟通的摘要内容,不超过640字" style="width:90%;" rows="3" v-model="curCommunication.abstract"></textarea>
                </div>
              </div>

<!--               <div class="form-inline mgtp5 mgrt5">
                <label>下次计划</label>
                <input type="text" class="form-control" v-model="curCommunication.plan_next" placeholder="计划沟通事项" style="min-width: 500px;">
              </div> -->
            </div>
          </div>
          <div class="modal fade" id="spkrDtlShower" role="dialog" aria-labelledby="spkrDtlShower" data-backdrop="static" data-keyboard: false>
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header bg-hvgrey">
                  <h5><!--  class="bg-hvgrey" -->
                    {{speakerInSdl.a_name}}&nbsp&nbsp&nbsp&nbsp
                    {{speakerInSdl.a_title1?speakerInSdl.a_title1:'头衔'}}&nbsp&nbsp&nbsp&nbsp
                    {{speakerInSdl.a_position?speakerInSdl.a_position:'职务'}}&nbsp&nbsp&nbsp&nbsp
                    {{speakerInSdl.a_country?speakerInSdl.a_country:'国家'}}
                  </h5>
                </div>
                <div class="modal-body bg-hvgrey wttxt">
                  <div class="container-fluid">
                    <div class="row">
                      注册:<span class="mgrt20">{{speakerInSdl.ar_rgst==1?'是':'否'}}</span>
                      注册费:<span class="mgrt20">{{speakerInSdl.ar_registration_fee_received}}</span>
                      酒店:<span class="mgrt20">{{speakerInSdl.ar_hotel==3||speakerInSdl.ar_hotel==4?'是':'否'}}</span>
                      酒店费:<span class="mgrt20">{{speakerInSdl.ar_hotel_expense_received}}</span>
                      观光:<span class="mgrt20">{{speakerInSdl.ar_tour==3||speakerInSdl.ar_tour==4?'是':'否'}}</span>
                      观光费:<span class="mgrt20">{{speakerInSdl.ar_tour_fee_received}}</span>
                    </div>
                    <div class="row">所在机构:</div>
                    <div class="row">&nbsp&nbsp&nbsp&nbsp{{speakerInSdl.a_workplace}}</div>
                    <div class="row">奖项和荣誉:</div>
                    <div class="row">&nbsp&nbsp&nbsp&nbsp{{speakerInSdl.a_awards}}</div>
                    <div class="row">最新成就:</div>
                    <div class="row">&nbsp&nbsp&nbsp&nbsp{{speakerInSdl.a_attainment}}</div>
                    <div class="row">所发论文:</div>
                    <div class="row">&nbsp&nbsp&nbsp&nbsp{{speakerInSdl.atcl_title}}</div>
                    <!-- <div class="row">论文摘要:</div> -->
                    <!-- <div class="row">&nbsp&nbsp&nbsp&nbsp{{speakerInSdl.atcl_abstract}}</div> -->
                  </div>
                </div>
                <div class="modal-footer bg-hvgrey wttxt">
                  <button class="btn btn-secondary" data-dismiss="modal">关闭</button>
                </div>  
              </div>
            </div>
          </div>
          <div class="row mgtp5">
            <div class="col-lg">
              <button  class="btn btn-link" @click="backToAllATDsCmtdRcdsViewer">返回沟通记录列表</button>
            </div>
            <div class="col-lg">
              <button class="btn btn-primary" @click="saveEditedCmtnRcd">保存</button>
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
import csvExportor from 'csv-exportor';
// import loading from '@/assets/loading.gif';
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
        showLoading:false,
        // imgUrl:loading,
        imgUrl:require('@/assets/images/loading.gif'),
        currentUserId:this.$store.state.user.id_user,
        // allATDs:[],
        queryContent:{
          keyWord:'',
          conditions:'',
          id_project:0,
          id_track:0,
        },
        //importInvitedResult
        qcInIIR:{
          id_project:0,
          // id_track:0,
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
          is_quit:0,
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
        atdsHaveArInCurPrjct:[],
        atdsInCurTrk:[],
        filteredAtdsInQcAtdSlcter:[],
        cmtdRcdsOfAllATDsInFC:[],
        bgNotRgsted:'card-body bg-hvgrey text-white',// card-text bg-success
        bgRgstd:'card-body bg-success text-white',//  card-text bg-success
        bgHvgrey:'background-color: #3C3C3C',
        bgSuces:'bg-success: #3C3C3C;',
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
        scdlsInCurTrackInFC:{},
        curAtdCmtdHstyInCurPrjct:[],
        // curTrackIdInFC:0,
        strOrgnlAR:{},
        strOrgnCmnctn:{},
        speakerInSdl:{},
        // showSpkrInSdl:false,



      }
    },
    methods:{
      //****************************importInvitedResult  begin **************************
      projectChanged() {
        this.tracksInIIR=[];
        if(this.qcInIIR.id_project==0) {
          this.qcInIIR.id_purpose=0;
          return;
        }
        // } else {
        //   this.qcInIIR.id_track=0;
        // }
        // var _this=this;
        // this.qcInIIR.conditions="TracksInThisProject";
        // this.$axios({
        //   method: 'post',
        //   url: 'getTracks.php',
        //   data: qs.stringify(_this.qcInIIR)
        // }).then(function (response) {
        //   console.log(response.data);
        //   _this.tracksInIIR=response.data;
        // }).catch(function (error) {
        //   console.log(error);
        //   _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        // });
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
            _this.$toast({text:'有  电子邮件地址  列?',type:'danger',duration:3000});
            _this.resetCsvData();
            return;
          }
          let colNames=Object.keys(tmp[0]);
          let essentialColNames=['email'];//必须要有的列[,'email','article_title'][i]
          for(let i=0;i<essentialColNames.length;i++) {
            if(!colNames.includes(essentialColNames[i])) {
              _this.$toast({text:'必须有 电子邮件地址 列,请检查文件!',type:'danger',duration:3000});
              _this.resetCsvData();
              return;
            }
          }
          _this.dataFromCSV = tmp;

          _this.qcInIIR.id_curUser=_this.currentUserId;
          _this.qcInIIR.conditions="importRepliedEmailsIntoTblForSavingInvitedResult";
          _this.qcInIIR.dataFromCSV=_this.dataFromCSV;
          _this.$axios({
            method: 'post',
            url: 'insertNewToCommunicatedRcds.php',
            data: qs.stringify(_this.qcInIIR)
          }).then(function (response) {
            console.log(response.data);
            let rsp=response.data;
            _this.resetCsvData();
            if(rsp.strRslt==="CreateCmnctnDone") {
              _this.$toast({text:'成功'+rsp.insertedCount+"条,重复"+rsp.duplicateCount+"条.",
                type:'success',duration:800});
            }
            if(rsp.strRslt==="NoAtdInfoInCurrentTrack") {
              _this.$toast({text:"当前项目中未找到可进行此操作的人员信息!",
                type:'warning',duration:4000});
            }
            if(rsp.strRslt==="AllAreDuplicate"){
              _this.$toast({text:'数据重复!',type:'warning',duration:1000});
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
        console.log(csvarry);
        // return false;
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
          }
        }
        let datas = [];
        let headers = csvarry[0].split(",");
        headers.forEach( function(item,index,arr) {
          if(!item.replace(/\s+/g,"")) {//空列名替换
            arr[index] ="eMptyClmnNaMe"+index;
          } else {//转为小写
            arr[index]=arr[index]==='电子邮件地址'?'email':arr[index];
            arr[index]=arr[index].toLowerCase();
          }
        });
        console.log(headers);
        let iPstn=0;//email所处的列
        let essentialColNames=['email'];//'track','name','article_title',必须要有的列
        if(!headers.includes(essentialColNames[0])) {
          return false;
        } else {
          iPstn=headers.findIndex((el)=>el==essentialColNames[0]);
        }
        console.log(csvarry);
        for(let i=1;i<csvarry.length;i++){
          csvarry[i]=(csvarry[i].trim()).replace(/\"/g,"|");
          // console.log(csvarry[1]);
          // return false;
          //如果此行是被双引号包围的并且其中含 有逗号,则用空格替换
          let s=0;
          let e=0;
          s=csvarry[i].indexOf("|");
          e=(csvarry[i].substring(Number(s+1))).indexOf("|")+s+1;
          let stmp=csvarry[i].substring(Number(s+1),e);
          stmp=stmp.replace(/,/g," ");//行中逗号替换为空格
          stmp=csvarry[i].substring(0,s)+stmp;//连接上首部分
          stmp+=csvarry[i].substring(e+1);//连接上尾部分
          csvarry[i]=stmp;
          // console.log(csvarry[i]);
          // return false;
          // continue;
          let data={};
          let row=csvarry[i].split(",");
            //去除多余的双引号或单引号            
          if(row[iPstn] && (row[iPstn].charAt(0)==='"' && row[iPstn].charAt(row[iPstn].length-1)==='"' || row[iPstn].charAt(0)==="'" && row[iPstn].charAt(row[iPstn].length-1)==="'")) {
            row[iPstn]=row[iPstn].substring(1,row[iPstn].length-1);
          }
          row[iPstn]=row[iPstn].replace(/,/g," ");//行中逗号替换为空格
          data[essentialColNames[0]]=row[iPstn]?row[iPstn]:'';
          datas.push(data);
        }
        // console.log(datas);
        // return false;
        return datas;
      },
      resetCsvData() {
        this.dataFromCSV=[];
        this.qcInIIR.id_project=0;
        this.qcInIIR.id_purpose=0;
        this.csvFileName="";

      },
      //****************************importInvitedResult end******************************
      //****************************communicate begin************************************
      getCmntnRcds() {
        if(this.QcInFC.id_track==0) {
          if(this.QcInFC.kwForAtds.trim().length<3) {
            this.$toast({text:'不限定专场时必须设定查询关键词且不少于3个字!',type:'info',duration:3000});
            return;
          }
        }
        if(!this.QcInFC.sDate || !this.QcInFC.eDate) {//有空项,设为默认,过去7天
          let td = new Date();
          td.setDate(td.getDate() - 21);
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
        this.showLoading=true;
        $("body").css("overflow","hidden");
        //先获取cmtdRcdsOfAllATDsInFC,
        this.QcInFC.conditions="byDateRangeTrackId......ForCommunicating";
        console.log(this.QcInFC);
        // return;
        var _this=this;
        this.cmtdRcdsOfAllATDsInFC=[];
        this.$axios({
          method: 'post',
          url: 'getCmnctnRcds.php',
          data: qs.stringify(_this.QcInFC)
        }).then(function (response) {
          console.log(response.data);
          _this.cmtdRcdsOfAllATDsInFC=response.data;
          // _this.showCmtnRcdsViewer=_this.cmtdRcdsOfAllATDsInFC.length?true:false;
          _this.showCmtnRcdsViewer=true;
          _this.showFcSchBox=!_this.showCmtnRcdsViewer;
          _this.showLoading=false;
          $("body").css("overflow","");
        }).catch(function (error) {
          _this.showLoading=false;
          $("body").css("overflow","");
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      backToFcSchBox() {
        this.showFcSchBox=true;
        this.showCmtnRcdsViewer=false;
      },
      clkACmnRcdToCmt(r) {
        this.curCommunication={};
        for(let prop in r) {
          r[prop]=r[prop]==null?"":r[prop];//是undefined 或 null吗
        }
        // console.log(r);
        // return;
        this.curCommunication=r;
        if(3-(r.ar_id_role+"").length===1) {
          r.ar_id_role="0"+(r.ar_id_role+"");
        }
        if(3-(r.ar_id_role+"").length===2) {
          r.ar_id_role="00"+(r.ar_id_role+"");
        }
        this.curCommunication.orgCoOrC=r.ar_id_role.substr(0,2);//保存原主席副主席状态
        this.curCommunication.orgAbs=r.abstract;
        this.curCommunication.orgNature=r.nature;
        this.curCommunication.orgDateNext=r.date_next;
        r.ar_id_role=r.ar_id_role.charAt(r.ar_id_role.length-1);
        let td = new Date();
        // if(this.curCommunication.date_next==="0001-01-01" || this.curCommunication.date_next==="") {
          td.setDate(td.getDate() + 3);
          this.curCommunication.date_next=td.format("yyyy-MM-dd");
        // }
        this.curCommunication.abstract="";
        this.curCommunication.remark="";
        this.curCommunication.nature="0";
        this.curCommunication.level=[];
        let numArrLvl=this.curCommunication.a_level.split('');
        let nameOfLvl=['keynote','SAB','chair','speaker','media','partner','audience'];
        let strNameLvl=[];
        for(let i=0;i<numArrLvl.length;i++) {
          if(numArrLvl[i]==1) {
            strNameLvl.push(nameOfLvl[i]);
          }
        }
        this.curCommunication.level=strNameLvl;        
        console.log(this.curCommunication);
        //获取当前communication的原始attendedRecord
        let orgnlAr={};
        orgnlAr.ar_id_track=this.curCommunication.ar_id_track;
        orgnlAr.ar_ids_schedule=this.curCommunication.ar_ids_schedule;
        orgnlAr.ar_id_role=this.curCommunication.ar_id_role;
        orgnlAr.ar_remark=this.curCommunication.ar_remark;
        orgnlAr.ar_topic=this.curCommunication.ar_topic;
        orgnlAr.ar_abstract=this.curCommunication.ar_abstract;
        orgnlAr.ar_rgst=this.curCommunication.ar_rgst;
        orgnlAr.ar_hotel=this.curCommunication.ar_hotel;
        orgnlAr.ar_tour=this.curCommunication.ar_tour;
        orgnlAr.ar_is_quit=this.curCommunication.ar_is_quit;
        orgnlAr.ar_why_quit=this.curCommunication.ar_why_quit;
        orgnlAr.id_attendee=this.curCommunication.id_attendee;
        this.strOrgnlAR=JSON.stringify(orgnlAr);
        //获取当前communication的原始communication
        let orgnlCmnctn={};
        orgnlCmnctn.abstract=this.curCommunication.abstract;
        orgnlCmnctn.date_next=this.curCommunication.date_next;
        // orgnlCmnctn.ar_id_track=this.curCommunication.ar_id_track;
        orgnlCmnctn.initiative=this.curCommunication.initiative;
        orgnlCmnctn.nature=this.curCommunication.nature;
        orgnlCmnctn.plan_next=this.curCommunication.plan_next;
        orgnlCmnctn.remark=this.curCommunication.remark;
        orgnlCmnctn.id_attendee=this.curCommunication.id_attendee;
        this.strOrgnCmnctn=JSON.stringify(orgnlCmnctn);
        this.showCmtnRcdsViewer=false;
        this.showCmntnEditer=true;
      },
      backToAllATDsCmtdRcdsViewer() {
        //补全参会角色
        this.curCommunication.ar_id_role=this.curCommunication.orgCoOrC+this.curCommunication.ar_id_role;
        this.curCommunication.abstract=this.curCommunication.orgAbs;
        this.curCommunication.nature=this.curCommunication.orgNature;
        this.curCommunication.date_next=this.curCommunication.orgDateNext;
        this.showCmntnEditer=false;
        this.showCmtnRcdsViewer=true;
        this.showAtdCmtdHstys=false;
        this.curAtdCmtdHstyInCurPrjct=[];
        
      },
      openWedPage(url) {
        // url="cnblogs.com/sghy/p/9604813.html";
        if(!url || url.length<8){

        } else {
          if(url.indexOf('https://www.')!==0 && url.indexOf('http://www.')!==0) {
            url='http://www.'+url;
          }
          window.open(url, '_blank');
        }
      },
      hideCmtdHistory() {
        this.showAtdCmtdHstys=false;
      },
      getCurAtdCmtdHistoryInCurPrjct() {
        this.showAtdCmtdHstys=!this.showAtdCmtdHstys;
        //根据id_attendee和 id_project 获取沟通记录列表  this.QcInFC  
        if(this.showAtdCmtdHstys) {
          this.curAtdCmtdHstyInCurPrjct=[];
          var qc={};
          qc.conditions="byAttendeeIdAndTrackIdForShowHistoryInCommunicate";
          qc.id_attendee=this.curCommunication.id_attendee;
          qc.id_project=this.QcInFC.id_project;//curCommunication.ar_id_track
          var _this=this;
          this.$axios({
            method: 'post',
            url: 'getCmnctnRcds.php',
            data: qs.stringify(qc)
          }).then(function (response) {
            console.log(response.data);
            _this.curAtdCmtdHstyInCurPrjct=response.data;
          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          });
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
        // atd.a_personal_page=this.curCommunication.a_personal_page;
        atd.a_position=this.curCommunication.a_position;
        atd.a_title1=this.curCommunication.a_title1;
        atd.a_workplace=this.curCommunication.a_workplace;
        atd.atcl_md5=this.curCommunication.atcl_md5;
        atd.level=this.curCommunication.level;
        // atd.atcl_abstract=this.curCommunication.atcl_abstract;
        atd.atcl_title=this.curCommunication.atcl_title;
        atd.id=this.curCommunication.id_attendee;
        for(let prop in atd) {
          atd[prop]=atd[prop]=="undefined"?"":atd[prop];//是undefined 中 null吗
        }
        let nameOfLvl=['keynote','SAB','chair','speaker','media','partner','audience'];
        let numArrLvl= new Array(nameOfLvl.length).fill(0)
        for(let i=0;i<nameOfLvl.length;i++) {
          if(atd.level.indexOf(nameOfLvl[i])>-1) {
            numArrLvl[i]=1;
          }
        }
        atd.a_level=numArrLvl.join('');        
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
//       trackChanged () {
// console.log("Track Changed!");
//       },
      tglScdlsInTheTrackInFC() {
        this.showScdlViewerInFC=!this.showScdlViewerInFC;
        // if(this.showScdlViewerInFC) {
        //   console.log("通过id_track到tbl_cnfrc_schedules中查找专场日程");
        // }
      },
      getAtdAr(idOfSpkr) {
        if(!idOfSpkr || idOfSpkr==0) {
          return;
        }
        this.speakerInSdl={};
        let c=this.cmtdRcdsOfAllATDsInFC.find((el)=>el.id_attendee==idOfSpkr);
        // console.log(c);
        // return;
        this.speakerInSdl.a_name=c.a_name;
        this.speakerInSdl.a_country=c.a_country;
        this.speakerInSdl.a_workplace=c.a_workplace;
        this.speakerInSdl.a_position=c.a_position;
        this.speakerInSdl.a_awards=c.a_awards;
        this.speakerInSdl.a_attainment=c.a_attainment;
        this.speakerInSdl.a_title1=c.a_title1;
        this.speakerInSdl.ar_rgst=c.ar_rgst;
        this.speakerInSdl.ar_registration_fee_received=c.ar_registration_fee_received;
        this.speakerInSdl.ar_hotel=c.ar_hotel;
        this.speakerInSdl.ar_hotel_expense_received=c.ar_hotel_expense_received;
        this.speakerInSdl.ar_tour=c.ar_tour;
        this.speakerInSdl.ar_tour_fee_received=c.ar_tour_fee_received;
        this.speakerInSdl.atcl_title=c.atcl_title;
        // this.speakerInSdl.atcl_abstract=c.atcl_abstract;
        $('#spkrDtlShower').modal('toggle');
      },
      pickedAScheduleInCmctEditer(sdl) {
        this.curCommunication.ar_ids_schedule=sdl.id;
      },
      saveEditedCmtnRcd() {
// console.log(this.curCommunication);
// return;

        //将this.curCommunication从cmtdRcdsOfAllATDsInFC中移除
        
        //和原始比较是否更改过
        let curAr={};
        curAr.ar_id_track=this.curCommunication.ar_id_track;
        curAr.ar_ids_schedule=this.curCommunication.ar_ids_schedule;
        curAr.ar_id_role=this.curCommunication.ar_id_role;
        curAr.ar_remark=this.curCommunication.ar_remark;
        curAr.ar_topic=this.curCommunication.ar_topic;
        curAr.ar_abstract=this.curCommunication.ar_abstract;
        curAr.ar_rgst=this.curCommunication.ar_rgst;
        curAr.ar_hotel=this.curCommunication.ar_hotel;
        curAr.ar_tour=this.curCommunication.ar_tour;
        curAr.ar_is_quit=this.curCommunication.ar_is_quit;
        curAr.ar_why_quit=this.curCommunication.ar_why_quit;
        curAr.id_attendee=this.curCommunication.id_attendee;
        let strCurAr=JSON.stringify(curAr);
        curAr.nature=this.curCommunication.nature;

        let curCmnctn={};
        curCmnctn.abstract=this.curCommunication.abstract;
        curCmnctn.date_next=this.curCommunication.date_next;
        curCmnctn.initiative=this.curCommunication.initiative;
        curCmnctn.nature=this.curCommunication.nature;
        curCmnctn.plan_next=this.curCommunication.plan_next;
        curCmnctn.remark=this.curCommunication.remark;
        curCmnctn.id_attendee=this.curCommunication.id_attendee;
        let strCurCmnctn=JSON.stringify(curCmnctn);
        curCmnctn.ar_id_track=this.curCommunication.ar_id_track;
// console.log(this.strOrgnlAR);
        if(this.curCommunication.ar_id_track==0) {
          this.$toast({text:'请选择一个专场!',type:'info',duration:2000});
          return;
        }
        if(this.curCommunication.abstract.length || this.curCommunication.remark.length || this.curCommunication.initiative!=JSON.parse(this.strOrgnCmnctn).initiative || this.curCommunication.date_next!=JSON.parse(this.strOrgnCmnctn).date_next || this.curCommunication.plan_next!=JSON.parse(this.strOrgnCmnctn).plan_next) {
          if(this.curCommunication.nature==0) {
            if(this.strOrgnCmnctn!==strCurCmnctn) {
              this.$toast({text:'请选择沟通类型:主动追信 或 被动回信!',type:'info',duration:2000});
              return;
            }
          }
        }
        if(!this.curCommunication.abstract.length && this.curCommunication.nature!=0) {
          this.$toast({text:'请填写 沟通摘要!',type:'info',duration:2000});
          return;
        }


console.log(curCmnctn);
// return;
        if(this.strOrgnlAR===strCurAr) {//参会记录没有改动
          if(this.strOrgnCmnctn===strCurCmnctn) {//沟通记录没有改动
            this.$toast({text:'没有改动!',type:'info',duration:2000});
            return;
          } else {//沟通记录有改动
            //检查输入合法性,再新建communication
            // if(this.curCommunication.abstract.length<2) {
            //   this.$toast({text:'沟通摘要不合要求!',type:'info',duration:1000});
            //    return;
            // }
            let _this=this;
            let queryContent={};
            queryContent.conditions="withDataFromCommunicatingToCreateNewCmnctn";
            queryContent.curCmnctn=curCmnctn;
            queryContent.curUserId=this.currentUserId;
            this.$axios({
              method: 'post',
              url: 'insertNewToCommunicatedRcds.php',
              data: qs.stringify(queryContent)
            }).then(function (response) {
              console.log(response.data);
              if(response.data==true) {
                _this.$toast({text:'操作成功!',type:'success',duration:800});
                _this.tglCmnctnEditerOrRcdsViewer();
              } else {
                _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:2000});
                return;
              }
            }).catch(function (error) {
              console.log(error);
              _this.$toast({text:'通信错误!',type:'danger',duration:2000});
              return;
            });
          }
        } else {//参会记录有改动
          let orgnlSdlId=JSON.parse(this.strOrgnlAR).ar_ids_schedule;
          let orgnlTrkId=JSON.parse(this.strOrgnlAR).ar_id_track;
          let sdlIsChanged=orgnlSdlId==this.curCommunication.ar_ids_schedule?false:true;
          let trkIsChanged=orgnlTrkId==this.curCommunication.ar_id_track?false:true;
          let _this=this;
          let queryContent={};
          queryContent.curAr=curAr;
          queryContent.curCmnctn=curCmnctn;
          queryContent.curUserId=this.currentUserId;
          queryContent.sdlIsChanged=sdlIsChanged;
          queryContent.trkIsChanged=trkIsChanged;
          queryContent.orgnlSdlId=orgnlSdlId;
          queryContent.orgnlTrkId=orgnlTrkId;
          console.log(queryContent);
          if(this.strOrgnCmnctn===strCurCmnctn) {//沟通记录没改动
            //更新attended records
            queryContent.conditions="withDataFromCommunicatingToUpdate";
            this.$axios({
              method: 'post',
              url: 'updateAttendedRecords.php',
              data: qs.stringify(queryContent)
            }).then(function (response) {
              console.log(response.data);
              // return;
              if(response.data==true) {
                _this.$toast({text:'操作成功!',type:'success',duration:800});
                _this.tglCmnctnEditerOrRcdsViewer();
              } else {
                console.log(response.data);
                _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:2000});
                return;
              }
            }).catch(function (error) {
              console.log(error);
              _this.$toast({text:'通信错误!',type:'danger',duration:2000});
              return;
            });
          } else {//沟通记录有改动
            // if(this.curCommunication.abstract.length<2) {
            //   this.$toast({text:'沟通摘要不合要求!',type:'info',duration:1000});
            //    return;
            // }
            //新建communication 和 更新attended records
            queryContent.conditions="withFullDataFromCommunicatingToCreateNewCmnctnAndUpdateAttendedRecords";
            this.$axios({
              method: 'post',
              url: 'insertNewToCommunicatedRcds.php',
              data: qs.stringify(queryContent)
            }).then(function (response) {
              console.log(response.data);
              if(response.data==true) {
                _this.$toast({text:'操作成功!',type:'success',duration:800});
                _this.tglCmnctnEditerOrRcdsViewer();
              } else {
                console.log(response.data);
                _this.$toast({text:'操作失败,请稍后再试!',type:'danger',duration:2000});
                return;
              }
            }).catch(function (error) {
              console.log(error);
              _this.$toast({text:'通信错误!',type:'danger',duration:2000});
              return;
            });
          }
        }
      },
      tglCmnctnEditerOrRcdsViewer() {
        this.showCmntnEditer=false;
        this.showCmtnRcdsViewer=true;
        let i=this.cmtdRcdsOfAllATDsInFC.findIndex((el)=>el.id==this.curCommunication.id);
        this.cmtdRcdsOfAllATDsInFC.splice(i,1);

      }

      //****************************communicate end***************************************

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
      this.queryContent.conditions="is_international";
      this.$axios({
        method: 'post',
        url: 'getProjects.php',
        data: qs.stringify(_this.queryContent)
      }).then(function (response) {
        console.log(response.data);
        _this.projectsInIIR=response.data;
      }).catch(function (error) {
        console.log(error);
        _this.$toast({text: '通信错误!',type: 'danger',duration: 4000});
      });
    },
    watch:{
      'curCommunication.ar_id_track': {
        handler: function() {
          if(JSON.parse(this.strOrgnlAR).ar_id_track!=this.curCommunication.ar_id_track) {
            this.curCommunication.ar_ids_schedule=0;
            this.curCommunication.ar_id_role=0;
          } else {
            this.curCommunication.ar_ids_schedule=JSON.parse(this.strOrgnlAR).ar_ids_schedule;
            this.curCommunication.ar_id_role=JSON.parse(this.strOrgnlAR).ar_id_role;
          }
          if(this.curCommunication.ar_id_track==0) {
            this.scdlsInCurTrackInFC=[];
            this.curCommunication.ar_ids_schedule=0;
            this.curCommunication.ar_id_role=0;
            this.curCommunication.trk_time_ranges="---";
            this.curCommunication.trk_id_chair="---";
            this.curCommunication.trk_id_co_chair="---";
            this.curCommunication.trk_remark="---";
            return;
          }
          let _this=this;
          let queryContent={};
          queryContent.conditions="ByTrackIdForFollowingCommunication";
          queryContent.id_track=this.curCommunication.ar_id_track;
          this.$axios({
            method: 'post',
            url: 'getSchedules.php',
            data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            _this.scdlsInCurTrackInFC=response.data;
            // if(_this.scdlsInCurTrackInFC.length) {
            //   _this.curCommunication.ar_ids_schedule=0;
            //   _this.curCommunication.ar_id_role=0;
            //   _this.curCommunication.ar_remark='';
            //   _this.curCommunication.ar_topic='';
            // }
            //trk_time_ranges
            //this.curCommunication.ar_id_track)
            let t={};

            t=_this.allTrksInFC.find((ele)=>ele['id']==_this.curCommunication.ar_id_track);
            _this.curCommunication.trk_time_ranges=t.time_ranges;
            _this.curCommunication.trk_id_chair=t.id_chair;
            _this.curCommunication.trk_id_co_chair=t.id_co_chair;
            _this.curCommunication.trk_remark=t.remark;

          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          });
        },
      },
      'curCommunication.ar_ids_schedule':{
        handler: function() {

          this.curCommunication.ar_id_role=this.curCommunication.ar_ids_schedule==0?0:this.curCommunication.ar_id_role;
        }
      },
      'QcInFC.id_project': {
        handler: function() {
          if(this.QcInFC.id_project==0) {
            // this.atdsInCurPrjct=[];
            this.trksInCurPrjctInFC=[];
          }else {
            this.trksInCurPrjctInFC=this.allTrksInFC.filter((item)=>item.id_project==this.QcInFC.id_project);
          }
          //重置
          this.QcInFC.id_track=0;
        },
      },
      'QcInFC.id_track': {
        handler: function() {
          this.QcInFC.kwForAtds="";
          this.atdsInCurTrk=[];
          this.filteredAtdsInQcAtdSlcter=[];
          var _this=this;
          if(this.QcInFC.id_track!=0) {
          this.showLoading=true;
          $("body").css("overflow","hidden");
            // this.atdsInCurTrk=this.atdsInCurPrjct.filter((item)=>item.id_last_track==this.QcInFC.id_track);
            this.queryContent.conditions="ALLATDsInCurTrackInFCForProvidingOptions";
            this.queryContent.idOfTrack=this.QcInFC.id_track;
            this.$axios({
              method: 'post',
              url: 'getAttendees.php',
              data: qs.stringify(_this.queryContent)
            }).then(function (response) {
              console.log(response.data);
              if(response.data.length) {
                _this.atdsInCurTrk=response.data;
                _this.filteredAtdsInQcAtdSlcter=JSON.parse(JSON.stringify(_this.atdsInCurTrk));
              }
              _this.showLoading=false;
              $("body").css("overflow","");
            }).catch(function (error) {
              _this.showLoading=false;
              $("body").css("overflow","");
              console.log(error);
              _this.$toast({text:'通信错误!',type:'danger',duration:4000});
            });
          } else {
            this.atdsInCurTrk=[];
            this.filteredAtdsInQcAtdSlcter=[];
          }
          // console.log(this.atdsInCurTrk);
          // let _this=this;
          let queryContent={};
          queryContent.conditions="ByTrackIdForFollowingCommunication";
          queryContent.id_track=this.QcInFC.id_track;
          this.$axios({
            method: 'post',
            url: 'getSchedules.php',
            data: qs.stringify(queryContent)
          }).then(function (response) {
            console.log(response.data);
            _this.scdlsInCurTrackInFC=response.data;
          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          });          
        },
        immediate: true,
      },
    },
    computed:{
      getUrgentLevel() {
        return function(cr) {
          if(cr.date_next==='0001-01-01') {
            return "card-header bg-secondary text-white"
          } else {
            let planDate = new Date(cr.date_next.replace(/-/g, "/"));
            let today = new Date();
            let diff=(planDate-today)/(1000*60*60*24);
            if(diff>7) {return "card-header bg-secondary text-white";}
            if(diff>4 && diff<=7) {return "card-header bg-primary text-white";}
            if(diff>2 && diff<=4) {return "card-header bg-warning text-white";}
            if(diff<=2) {return "card-header bg-danger text-white";}
          }
        }
      },
      getStatusOfHT () {
        return function(a,s) {
          if(Number(a)>0) {
            return a;
          } else {
            switch (s) {
              case "0":
                return '未知';
                break;
              case "1":
                return '自理';
                break;
              case "2":
                return '意向';
                break;
              case "3":
                return '同意';
                break;
              case "4":
                return '已购';
                break;
            }          
          }
        }
        
      },
      getOperater() {
        return function(o) {
          let ownAtds=this.$store.state.myEmplys;
          let empl=ownAtds.find((e)=>e.id==o);
          return typeof empl=="undefined"?"前同事":empl.name;
        }
      },
      getInitiativeName() {
        return function(id) {
          switch (id) {
            case "0":
              return '未知';
              break;
            case "1":
              return '感兴趣';
              break;
            case "2":
              return '积极的';
              break;
            case "3":
              return '殷切的';
              break;
          }
        }
      },
      getCmntdType() {
        return function(n) {
          switch (n) {
            case "1":
              return '回复邀请';
              break;
            case "2":
              return '被动回信';
              break;
            case "3":
              return '主动追信';
              break;
          }       
        }
      },
      // isTrackUnselectable() {
      //   return (this.qcInIIR.id_project==0 || this.tracksInIIR.length==0)?true:false;
      // },
      isPurposeUnselectable() {
        return (this.qcInIIR.id_project==0)?true:false;
      },
      getAtdName() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let atd=this.atdsInCurTrk.find((ele)=>ele.id==i);
            return typeof(atd)=="undefined"?'---':atd['name'];
          }
        }
      },
      getAtdCountry() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let atd=this.atdsInCurTrk.find((ele)=>ele.id==i);
            return typeof(atd)=="undefined"?'---':atd['country'];
          }
        }
      },
      getAtdOgnztn() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let atd=this.atdsInCurTrk.find((ele)=>ele.id==i);
            return typeof(atd)=="undefined"?'---':atd['workplace'];
          }
        }
      },
      getAtdPositionAndTitle() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let atd=this.atdsInCurTrk.find((ele)=>ele.id==i);
            return typeof(atd)=="undefined"?'/':atd['position']+'/'+atd['title1'];
          }
        }
      },
      getTrkSubject() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let trk=this.trksInCurPrjctInFC.find((ele)=>ele.id==i);
            return typeof(trk)=="undefined"?'---':trk['subject'];
          }
        }
      },
      getSdlName() {
        return function(i) {
          if(i==0 || !i) {
            return "---";
          } else {
            let sdl=this.scdlsInCurTrackInFC.find((ele)=>ele.id==i);
            return typeof(sdl)=="undefined"?'---':sdl['name'];
          }
        }
      },
      getRoleName() {
        return function(i) {
          switch (i) {
            case "000":
              return '普通参会者';
              break;
            case "100":
              return '主席';
              break;
            case "101":
              return '主席并报告';
              break;
            case "010":
              return '副主席';
              break;
            case "011":
              return '副主席并报告';
              break;
            case "001":
              return '报告人';
              break;
          }
        }
      },
      getRegisterStatus() {

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
#bgcPrmryColrW,#bgcPrmryColrW input,#bgcPrmryColrW select,#bgcPrmryColrW span,#bgcPrmryColrW label {
  background-color:#007bff;
}
#bgcPrmryColrW span,#bgcPrmryColrW select {
  font-weight:bold;
  margin-right: 20px;
}
.mgrt10 input,.mgrt10 select,.mgrt10 {
  margin-right: 10px;
}
.mgrt20 {
  margin-right: 20px;
  /*title in communication list*/
}
.ticl {
  margin-right: 10px;
  min-width: 30px;
  font-weight:bold;
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
.tablebox {
  color: #007bff;
}
.mushvr {
  cursor:pointer;
}
.mushvr:hover {
  color:#fff;
}
.wttxt {
  color:#007bff;
  font-size: 1.1rem;
}
.wttxt-alnlft {
  color: white;
  text-align:left;
  /*font-weight:bold;*/
  font-family:microsoft yahei;
  font-size: 1.1rem;
}
.mask{
  position:fixed;
  top     : 0;
  left    : 0;
  bottom  : 0;
  right   : 0;
  background:#000;  /*一般遮罩随便设置一个颜色*/
  opacity:70%;
}
.loading {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%,-110%);
}
input[type=checkbox] {
  width: 1.2rem;
  height: 1.2rem;
}
.mgtp10mgbt10 {
  margin-top:10px;
  margin-bottom: 10px;
}
</style>
