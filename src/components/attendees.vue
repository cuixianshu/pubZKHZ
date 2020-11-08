<template>
  <div class="father">
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#checkInfo">信息查验</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#sendInvitation">发送邀请</a>
      </li> 
<!--       <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#newCreateOrModify" @click="goToNewOrEditerTab">新建或修改嘉宾基本信息</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#attendCnfrc" @click="getBasicDataToManageAttendedCnfrcRcds">嘉宾参会管理</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#VIPTrips" @click="getAttendees">VIP贵宾行程管理</a>
      </li>  -->
    </ul>
    <div class="tab-content">
      <div id="checkInfo" class="container-fluid tab-pane pre-scrollable active">
        <div v-if="showCiSearchBox">
          <div class="row form-inline">
            <select class="form-control mgrt10" v-model="queryContent.id_track">
              <option value=0>不限专场</option>
              <option v-for="(item,index) in tracks" :value="item.id">{{item.subject}}</option>
            </select>
            <input type="text" class="form-control mgrt10" placeholder="关键词" v-model="queryContent.keyWord">
            <button  class="btn btn-primary" @click="getAttendeesInCi">搜索代表</button>
            
          </div>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div v-if="showCiATDsList">
          <div v-if="attendeesInCI.length>0">
            <div class="row">
              <div class="col-lg">
                <button class="btn btn-link" @click="backToCiSearchBox">返回</button>
              </div>
              <div class="col-lg">
              </div>
              <div class="col-lg">
                <button class="btn btn-link" @click="gotoPreviousPage" v-if="showPreviousPage">上一页</button>
                到<input type="text" style="width:35px;" v-model="currentPageNumber" @change="pageNumberInputed" >/{{countOfTotalPages}}页
                <button class="btn btn-link" @click="gotoNextPage" v-if="showNextPage">下一页</button>
              </div>
            </div>
            <div class="samecard" v-for="(row,index) in attendeesInCI">
              <div class="row">
                <div class="col-lg-4 form-inline">
                  <label>姓名</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.name" style="width:85%;">
                </div>
                <div class="col-lg-3 form-inline">
                  <label>国家</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.country" style="width:85%;">
                </div>
               <div class="col-lg form-inline">
                  <label>专场</label>
                  <select class="form-control bgchvy-txtwt" v-model="row.id_last_track">
                    <option value=0>选择专场</option>
                    <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
                  </select>
                </div>
                <div class="col-lg-2 form-inline">
                  <label>黑名单</label>
                  <select class="form-control bgchvy-txtwt" v-model="row.is_blacklisted" style="">
                    <option value="0">否</option>
                    <option value="1">是</option>
                  </select>
                </div>
                 <div class="col-lg-1 form-inline">
                  <span class="bgchvy-txtwt">{{row.id}}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>邮箱</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.email1" style="width:90%;">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>机构</label>
                  <input class="form-control bgchvy-txtwt slmbdr" type="text" v-model="row.workplace" style="width:90%;">
                </div>
              </div>
              <div class="row">
                <div class="col-lg form-inline">
                  <label>备注</label>
                  <input class="form-control bgchvy-txtwt" type="text" v-model="row.remark" style="width:90%;" title="备注">
                </div>
              </div>
              <div class="row">
                <div class="col-lg">
                  <button class="btn btn-primary  btn-sm" @click="saveCurrentATD(row)">保存修改</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="attendeesInCI.length<1">
            没有数据
          </div>
          <div class="row">
            <div class="col-lg">
              <button class="btn btn-link" @click="backToCiSearchBox">返回</button>
            </div>
            <div class="col-lg">
            </div>
            <div class="col-lg">
              <button class="btn btn-link" @click="gotoPreviousPage" v-if="showPreviousPage">上一页</button>
              到<input type="text" style="width:35px;" v-model="currentPageNumber" @change="pageNumberInputed">/{{countOfTotalPages}}页
              <button class="btn btn-link" @click="gotoNextPage" v-if="showNextPage">下一页</button>
            </div>
          </div>

        </div>
      </div>
      <div id="sendInvitation" class="container-fluid tab-pane">
        <div class="container-fluid form-inline searchbox">
          <label>拟参加</label>
          <select class="form-control" v-model="queryContent.id_track">
            <option value=0>请选择专场</option>
            <option v-for="item in tracks" :value="item.id">{{item.subject}}</option>
          </select>;&nbsp
          <label>已邀请</label>
          <select class="form-control" v-model="queryContent.invitedTimes">
            <option value=0>0</option>
            <option value=1>1</option>
            <option value=2>2</option>
            <option value=3>3</option>
            <option value=4>4</option>
            <option value=5>5</option>
            <option value=6>6</option>
            <option value=7>7</option>
            <option value=8>8</option>
            <option value=9>9</option>
          </select>次;&nbsp
          <label>上次于</label>
          <input type="date" class="form-control" v-model="queryContent.sDate">至
          <input type="date" class="form-control" v-model="queryContent.eDate">间;&nbsp
          </select>
          <label>需导出</label>
          <select class="form-control" v-model="queryContent.wantQty">
            <option value=1>1k</option>
            <option value=2>2k</option>
<!--             <option value=6>6k</option>
            <option value=8>8k</option>
            <option value=10>10k</option> -->
          </select>条。
          <button  class="btn btn-primary" @click="getEmailsList">获取嘉宾信息</button>
        </div>
        <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
<!--         <div class="container-fluid" v-if="emailList.length>0">
          <h5>已获取到{{emailList.length}}条数据。</h5>
        </div>-->
        <div class="container-fluid" v-if="emailList.length<1">
          <h5>{{textOfOperatedResult}}</h5>
        </div> 
        <div>
          <button class="btn btn-secondary" v-if="emailList.length>0" @click="clrAtdArr">清除</button>
          <button class="btn btn-primary" @click="saveAsCsvToSendEmails" v-if="emailList.length>0">存为CSV以发送邀请</button>

        </div>
        <div class="divfortable container-fluid" v-if="emailList.length>0">
          <table class="table table-hover">
            <thead>
              <th>姓名</th><th>邮箱</th><th>论文题目</th><th>专场主题</th><th style="width:6%;">专场号</th>
            </thead>
            <tbody>
              <tr v-for="row in emailList">
                <td class="txtleft">{{row.name}}</td>
                <td class="txtleft">{{row.email1}}</td>
                <td class="txtleft">{{row.atcl_title}}</td>
                <td>{{getTrackName(row.id_last_track)}}</td>
                <td>{{row.id_last_track}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="newCreateOrModify" class="container-fluid tab-pane">
        <div name="atdsSchBox" v-if="showSchBoxInNewOrEditTab">
          <div class="container-fluid form-inline searchbox">
            <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="姓名,电话号,Email,工作单位,职称,微信,职务等关键词">
            <button  class="btn btn-primary" @click="getAttendees">
              搜索嘉宾
            </button>
            <button  class="btn btn-secondary" @click="attendees=[];" v-if="attendees.length">清空结果</button>
            <button @click="newCreateAttendee" class="btn btn-primary btn-at-right">新建嘉宾代表</button>
          </div>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div name="atdsList" class="divfortable container-fluid" v-if="attendees.length && showSchBoxInNewOrEditTab">
          <table class="table table-hover">
            <thead>
              <th v-for="(item,index) in titleForATDs" :width="widthForATDs[index]">{{item}}</th>
            </thead>
            <tbody>
              <tr v-for="row in attendees" @click=clkAnATDtoModify(row)>
                <td>{{row.name}}</td>
                <td>{{row.position}}</td>
                <td>{{row.workplace}}</td>
                <td>{{row.professional_title}}</td>
                <td>{{row.administrative_rank}}</td>
                <td>{{row.mp1}}</td>
                <td>{{row.email1}}</td>
                <td>{{row.fp1}}</td>
                <td>{{row.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div name="cnfrcRcdsEditer" class="container-fluid pre-scrollable" v-if="showAnATDEditer"><!-- class="row pre-scrollable" -->
          <div name="tips" class="row" style="margin-bottom: 10px;">
            <div class="col-lg" v-if="isModifyOldATD">
              <h5 style="margin-top: 10px;">{{anAtd.name}}----{{anAtd.workplace}}----{{anAtd.position}}</h5>
            </div>
            <div class="col-lg" v-if="!isModifyOldATD">
              <h5 style="margin-top: 10px;">新建会议嘉宾信息</h5>
            </div>
          </div>
          <div name="switchOfBaseInfo" class="row">
            <div class="col-lg">
              <button class="btn btn-link" data-toggle="collapse" data-target="#baseinfobox">展开/收起--基本信息--编辑器</button>
            </div>
          </div>
          <div name="baseInfoEditer" id="baseinfobox" class="collapse show" style="margin-top: 5px;">  
            <div class="row">
              <div class="col-lg form-inline">
                <label>嘉宾姓名</label>
                <input type="text" class="form-control" v-model="anAtd.name" placeholder="嘉宾姓名" title="嘉宾姓名">
              </div>
              <div class="col-lg form-inline">
                <label>工作单位</label>
                <input type="text" class="form-control" v-model="anAtd.workplace" placeholder="工作单位" :title="anAtd.workplace">
              </div> 
              <div class="col-lg form-inline">
                <label>行政级别</label>
                <select type="text" class="form-control" v-model="anAtd.administrative_rank" title="行政级别">
                  <option value=0>选择级别</option>
                  <option value=1>正局级</option>
                  <option value=2>副局级</option>
                  <option value=2>正处级</option>
                </select>                
              </div>
              <div class="col-lg form-inline">
                <label>担任职务</label>
                <input type="text" class="form-control" v-model="anAtd.position" placeholder="担任所在单位的职务" title="担任所在单位的职务">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>嘉宾性别</label>
                <select type="text" class="form-control" v-model="anAtd.gender">
                  <option value=1>男</option>
                  <option value=0>女</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label>专业职称</label>
                <input type="text" class="form-control" v-model="anAtd.professional_title" title="专业职称">
              </div>                             
              <div class="col-lg form-inline">
                <label>主研方向</label>
                <input type="text" class="form-control" v-model="anAtd.ICO" placeholder="研究方向或主要掌管"  :title="anAtd.ICO">
              </div> 
              <div class="col-lg form-inline">
                <label>所在国家</label>
                <input type="text" class="form-control" v-model="anAtd.national" placeholder="所在国家" title="所在国家">
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label>手机号一</label>
                <input type="text" class="form-control" v-model="anAtd.mp1" placeholder="手机号" title="手机号" @input="mpInputed(anAtd.mp1)">
              </div>                                        
              <div class="col-lg form-inline">
                <label>兼任职一</label>
                <input type="text" class="form-control" v-model="anAtd.title1" placeholder="兼任职务1" :title="anAtd.title1">
              </div>
              <div class="col-lg form-inline">
                <label>兼任职二</label>
                <input type="text" class="form-control" v-model="anAtd.title2" placeholder="兼任职务2" :title="anAtd.title2">
              </div>
              <div class="col-lg form-inline">
                <label>兼任职三</label>
                <input type="text" class="form-control" v-model="anAtd.title3" placeholder="兼任职务3" :title="anAtd.title3">
              </div>
            </div>
            <div class="row"> 
              <div class="col-lg form-inline">
                <label>手机号二</label>
                <input type="text" class="form-control" v-model="anAtd.mp2" placeholder="手机号" title="手机号" @input="mpInputed(anAtd.mp2)">
              </div>                                        
              <div class="col-lg form-inline">
                <label>办公电话</label>
                <input type="text" class="form-control" v-model="anAtd.fp1" title="办公电话">
              </div> 
              <div class="col-lg form-inline">
                <label>第一秘书</label>
                <input type="text" class="form-control" v-model="anAtd.secretary1_a_tel" title="第1秘书及电话">
              </div>                                        
              <div class="col-lg form-inline">
                <label>第二秘书</label>
                <input type="text" class="form-control" v-model="anAtd.secretary2_a_tel" title="第2秘书及电话">
              </div>                                        
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>电子信箱</label>
                <input type="text" class="form-control" v-model="anAtd.email1" placeholder="电子信箱" title="电子信箱" @input="emailInputed(anAtd.email1)">
              </div>
              <div class="col-lg form-inline">
                <label>备用信箱</label>
                <input type="text" class="form-control" v-model="anAtd.email2" title="备用信箱">
              </div>
              <div class="col-lg form-inline">
                <label>身份证号</label>
                <input type="text" class="form-control" v-model="anAtd.num_idcard" placeholder="身份证号" :title="anAtd.num_idcard">
              </div> 
              <div class="col-lg form-inline">
                <label>护照号码</label>
                <input type="text" class="form-control" v-model="anAtd.num_passport" placeholder="护照号码" title="护照号码">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>微信昵称</label>
                <input type="text" class="form-control" v-model="anAtd.nknm_wc" placeholder="微信昵称" title="微信昵称">
              </div>
              <div class="col-lg form-inline">
                <label>发票抬头</label>
                <input type="text" class="form-control" v-model="anAtd.ognzn_invoice" placeholder="发票抬头" :title="anAtd.ognzn_invoice">
              </div>
              <div class="col-lg form-inline">
                <label>发票税号</label>
                <input type="text" class="form-control" v-model="anAtd.taxnum_invoice" placeholder="发票税号" :title="anAtd.taxnum_invoice">
              </div>
              <div class="col-lg form-inline">
                <label>开户信息</label>
                <input type="text" class="form-control" v-model="anAtd.account_invoice" placeholder="开户信息" :title="anAtd.account_invoice">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>备注信息</label>
                <input type="text" class="form-control" v-model="anAtd.remark" placeholder="备注信息" :title="anAtd.remark">
              </div>
             <div class="col-lg form-inline">
                <label>发票地址</label>
                <input type="text" class="form-control" v-model="anAtd.addr_a_tel_invoice" placeholder="发票地址电话" :title="anAtd.addr_a_tel_invoice">
              </div>
              <div class="col-lg form-inline">
              </div>
              <div class="col-lg form-inline">
                <label>目标客户</label>
                <select class="form-control" v-model="anAtd.is_useful" title="是否是目标客户">
                  <option value="0">否</option>
                  <option value="1">是</option>
                </select>
              </div> 
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>主要成就</label>
                <input type="text" class="form-control" v-model="anAtd.attainment" placeholder="主要成就" :title="anAtd.attainment" style="width:95%;">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>获得奖项</label>
                <input type="text" class="form-control" v-model="anAtd.awards" placeholder="获得奖项" :title="anAtd.awards" style="width:95%;">
              </div>
            </div>
          </div>
          <div name="resumeEditer" class="row">
            <div class="col-lg">
              <button class="btn btn-link" data-toggle="collapse" data-target="#editAtdedCnfrcRcds">展开/收起--参会记录和主要履历--编辑器</button>
            </div>
          </div>
          <div name="cnfrcEditer" style="margin-top: 5px;"  id="editAtdedCnfrcRcds" class="collapse">
              <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" data-toggle="tab" href="#atdedCnfrcRcdsEditer">参会记录</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#resumeEditer">主要履历</a>
                </li>
              </ul>
              <div class="tab-content">
                <div id="atdedCnfrcRcdsEditer" class="container-fluid tab-pane active">
                  <table class="table table-hover">
                    <thead>
                      <th v-for="(item,index) in titleOfAtdedCnfcRcds" :width="widthOfAtdedCnfcRcds[index]">{{item}}</th>
                    </thead>
                    <tbody>
                      <atdedcnfrcrcds v-for="(item,index) in sbdyAtdedCnfrcRcds" @dltRow="deleteTheRowAdvnc" @addRow="addOneRowAdvnc" :key="index" :index="index" :rcdOfCnfrc="item"></atdedcnfrcrcds>
                    </tbody>
                  </table>
                </div>
                <div id="resumeEditer" class="container-fluid tab-pane">
                  <textarea rows="14" v-model="anAtd.resume" placeholder="不能超过1023个字">
                   </textarea>
                </div>
              </div>
          </div>
          <div name="buttons" class="row" style="margin-top: 30px;">
            <div class="col-lg">
              <button class="btn btn-info" @click="goToNewOrEditerTab">返回</button>
            </div>  
            <div class="col-lg">
              <button class="btn btn-primary savebutton" @click="saveNewOrEditedATD" v-if="showSaveBtnInNewOrEdit">保存</button>
            </div>  
          </div>
        </div>
      </div>
      <div id="attendCnfrc" class="container-fluid tab-pane">
        <div name="attendCnfrcSchBox" v-if="showSchBoxInAtdCnfrc">
          <div class="container-fluid form-inline searchbox">
            <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="请输入关键词" title="姓名,电话号,Email,工作单位,职称,微信,职务等关键词">
            <button  class="btn btn-primary" @click="getBasicDataToManageAttendedCnfrcRcds">
              搜索嘉宾
            </button>
            <button  class="btn btn-secondary" @click="attendees=[];" v-if="attendees.length">清空结果</button>
          </div>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
        </div>
        <div name="atdsListInAttendCnfrc" class="divfortable container-fluid" v-if="attendees.length && showSchBoxInAtdCnfrc">
          <table class="table table-hover">
            <thead>
              <th v-for="(item,index) in titleForATDs" :width="widthForATDs[index]">{{item}}</th>
            </thead>
            <tbody>
              <tr v-for="row in attendees" @click=clkAnATDToEditAttdCnfrcRcds(row)>
                <td>{{row.name}}</td>
                <td>{{row.position}}</td>
                <td>{{row.workplace}}</td>
                <td>{{row.professional_title}}</td>
                <td>{{row.administrative_rank}}</td>
                <td>{{row.mp1}}</td>
                <td>{{row.email1}}</td>
                <td>{{row.fp1}}</td>
                <td>{{row.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div name="pickerOfConferences" class="container-fluid" v-if="showPickerOfConferences">
          <div class="row">
            <div class="col-lg">
              <h5>
                {{theSlctdATD.name}}--
                {{theSlctdATD.workplace}}--
                {{theSlctdATD.position}}--
                  的参会管理
              </h5>
            </div>
          </div>
          <div class="row">
             <div class="col-lg">
              <button class="btn btn-link" @click="backToSchBoxInAtdCnfrc" >
                <span style="color:red;">点击返回嘉宾列表</span>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="waitingSlcting col-lg-4">
              <div class="row form-inline">
                <input class="form-control" type="text" placeholder="会议名称" v-model="keyWdOfSchingSlctablePrjcts" @input="keyWdOfSchingSlctablePrjctsChanged">
                <span class="tip-span">未出席的会议,共{{prjctsHasNotAtdd.length}}场.</span>
              </div>
              <div class="tablebox">
                <table class="table table-hover table-sm">
                  <thead>
                    <th>日期</th>
                    <th>会议名称</th>
                  </thead>
                  <tbody>
                    <tr v-for="row in prjctsHasNotAtdd" @dblclick="PushItIntoAtddCnfrcs(row)" title='双击添加为已出席的会议'>
                      <td>{{row.time_start}}</td>
                      <td>{{row.name}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="slctd col-lg-8">
              <div class="row form-inline">
                <input class="form-control" type="text" placeholder="会议名称" v-model="keyWdForSchingAttendedProjects" @input="keyWdForSchingAttendedProjectsChanged">
                <span style="color:#007bff;" class="tip-span">已出席的会议,共{{prjctsHasAtdd.length}}场.</span>
              </div>
              <div class="tablebox">
                <table class="table table-hover table-sm" style="color:#007bff;">
                  <thead>
                    <th style="width:11%;max-width: none;">日期</th>
                    <th style="width:27%;max-width: none;">会议名称</th>
                    <th style="width:18%;max-width: none;">举办地点</th>
                    <th style="width:12%;max-width: none;">参会身份</th>
                    <th style="width:20%;max-width: none;">报告题目</th>
                    <th style="width:12%;max-width: none;">日程</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row,index) in prjctsHasAtdd">
                      <td @dblclick="DeleteFromHasAtddCnfrcs(row)" title='双击此处从已参会列表中删除'>{{row.time_start}}</td>
                      <td @dblclick="DeleteFromHasAtddCnfrcs(row)" title='双击此处从已参会列表中删除'>{{row.name}}</td>
                      <td @dblclick="DeleteFromHasAtddCnfrcs(row)" title='双击此处从已参会列表中删除'>{{row.address_of_project}}</td>
                      <td>
                        <select v-model="row.acr.role"><!--   -->
                          <option value=0>普通参会者</option>
                          <option value=1>主席</option>
                          <option value=2>主席并报告</option>
                          <option value=3>副主席</option>
                          <option value=4>副主席并报告</option>
                          <option value=5>报告人</option>
                        </select>
                      </td>
                      <td title="不能超过250个字,多的部分会丢失"><input type="text" placeholder="报告题目" v-model="row.acr.speech_topics"></td><!--  -->
                      <td><a title="选择嘉宾出席此次的会议日程" @click="showSchedulesListOfThisProjects(row,index)" ><span style="color:red;cursor:pointer;">去选择</span></a></td>
                    </tr>
                  </tbody>
                </table>            
              </div>
              <div class="modal fade" id="pickerOfSchedules" role="dialog" aria-labelledby="pickerOfSchedules" data-backdrop="static" data-keyboard: false>
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      会议日程选择器
                    </div>
                    <div class="modal-body">
                      <table class="table table-hover table-sm">
                        <thead>
                          <tr>
                            <th style="width:30%;">时间</th>
                            <th style="width:30%;">地点</th>
                            <th style="width:30%;">环节</th>
                            <th style="width:10%;"><input type="checkbox" v-model="isSlctAllScheduls" @click="clkdTheAllSlctCheckboxInScheduleShower"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in schedulesOfTheCnfrc">
                            <td :title="item.time_range">{{item.time_range}}</td>
                            <td :title="item.location">{{item.location}}</td>
                            <td :title="item.id_agenda">{{item.id_agenda}}</td>
                            <td title="勾选以出席">
                              <input type="checkbox" v-model="slctdSchedulesInThisProjectAtATD" :value="item">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                      <button class="btn btn-default" data-dismiss="modal">取消</button>
                      <button class="btn btn-primary" @click="pickingSchedulesDone">选好了</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="row">
              <div class="col-lg">
                <button class="btn btn-info" @click="backToSchBoxInAtdCnfrc">返回</button>
              </div>
              <div class="col-lg">
                <button class="btn btn-primary" @click="saveTheAttendedCnfrcData">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="VIPTrips" class="container-fluid tab-pane">
        <div v-if="showSchBoxAndTripsList">
          <div class="container-fluid form-inline searchbox">
            <input type="text" class="form-control" v-model="queryContent.keyWord"  placeholder="VIP或会议的查询关键词" title="会议及VIP的查询关键词">
            <select type="text" v-model="queryContent.id_attendee" class="form-control">
              <option value="0">不限VIP贵宾</option>
              <option v-for="item in attendees" :value="item.id">{{item.name}}</option>
            </select>
            <select type="text" v-model="queryContent.id_project" class="form-control">
              <option value="0">不限展会项目</option>
              <option v-for="item in projects" :value="item.id">{{item.name}}</option>
            </select>
            <button  class="btn btn-primary" @click="getAllAttendeesAndAllTrips">搜索VIP行程</button>
            <button  class="btn btn-secondary" v-if="allAttendeesAndTrips" @click="allAttendeesAndTrips=[];">清空结果</button>
            <button  class="btn btn-primary btn-at-right" @click="newCreateTrip">新建VIP行程</button>
          </div>
          <hr style="height:1px;border:none;border-top:2px solid #007bff;" />
          <div class="divfortable" v-if="allAttendeesAndTrips.length">
            <table class="table table-hover small-font-table">
              <thead>
                <th v-for="(item,index) in titleForTrips" :width="widthForTrips[index]">{{item}}</th>
              </thead>
              <tbody>
                <tr v-for="row in allAttendeesAndTrips" @click="clkTheTripToModify(row)">
                  <td :title="row.p_name">{{row.p_name}}</td>
                  <td :title="row.a_name">{{row.a_name}}</td>
                  <td :title="row.a_mp1">{{row.a_mp1}}</td>
                  <td :title="row.a_workplace">{{row.a_workplace}}</td>
                  <td :title="row.a_position">{{row.a_position}}</td>
                  <td :title="row.t_time_departure">{{row.t_time_departure}}</td>
                  <td :title="row.t_time_arrival">{{row.t_time_arrival}}</td>
                  <td :title="row.t_num_trnspts">{{row.t_num_trnspts}}</td>
                  <td :title="row.t_location_origination">{{row.t_location_origination}}</td>
                  <td :title="row.t_location_destination">{{row.t_location_destination}}</td>
                  <td :title="row.t_entourage_a_mp">{{row.t_entourage_a_mp}}</td>
                  <td :title="row.t_official_greeter">{{row.t_official_greeter}}</td>
                  <td :title="row.t_driver_a_car">{{row.t_driver_a_car}}</td>
                  <td :title="row.t_remark">{{row.t_remark}}</td>
                  <td :title="getRspsblName(row)">{{getRspsblName(row)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div name="tripsEditer" class="container-fluid" v-if="showTripEditer">
          <h5 v-if="theTrip.t_id!=0">{{theTrip.a_name}}--{{theTrip.a_workplace}}--{{theTrip.a_position}}--行程编辑器</h5>
          <h5 v-if="theTrip.t_id==0">行程编辑器</h5>
          <div>
            <button class="btn btn-link" data-toggle="collapse" data-target="#vipTripEditer">展开/收起--VIP行程--编辑器</button>
          </div>
          <div name="vipTripEditer" id="vipTripEditer" class="collapse show" style="margin-top: 5px;">
            <div class="row">
              <div class="col-lg form-inline">
                <label>会议名称</label>
                <select type="text" v-model="theTrip.t_id_project" class="form-control" @change="getAllAgendasInThisProject">
                  <option value="0">选择会议</option>
                  <option v-for="item in projects" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label>贵宾姓名</label>
                <select type="text" v-model="theTrip.a_id" class="form-control" :disabled="theTrip.t_id!=0" @change="getDetailsInfoOfATD">
                  <option value="0">选择贵宾</option>
                  <option v-for="item in attendees" :value="item.id">{{item.name}}</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label>担任职务</label>
                <input type="text" class="form-control" v-model="theTrip.position" placeholder="担任职务" title="担任职务" readonly>
              </div>
              <div class="col-lg form-inline">
                <label for="pstn">贵宾电话</label>
                <input type="text" class="form-control" v-model="theTrip.mp1" placeholder="贵宾的电话号码" title="贵宾的电话号码" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>出发时间</label>
                <input type="datetime-local" v-model="theTrip.t_time_departure" class="form-control">
              </div>
              <div class="col-lg form-inline">
                <label>预抵时间</label>
                <input type="datetime-local" v-model="theTrip.t_time_arrival" class="form-control">
              </div>
              <div class="col-lg form-inline">
                <label>出发地点</label>
                <input type="text" class="form-control" v-model="theTrip.t_location_origination" placeholder="出发地点" title="出发地点">
              </div>
              <div class="col-lg form-inline">
                <label for="pstn">目的地点</label>
                <input type="text" class="form-control" v-model="theTrip.t_location_destination" placeholder="前往目的地点" title="前往目的地点">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>航班车次</label>
                <input type="text" class="form-control" v-model="theTrip.t_num_trnspts" placeholder="乘坐的交通班次号" title="乘坐的交通班次号">
              </div>
              <div class="col-lg form-inline">
                <label>随从电话</label>
                <input type="text" class="form-control" v-model="theTrip.t_entourage_a_mp" placeholder="随从人员及电话" title="随从人员及电话">
              </div>
              <div class="col-lg form-inline">
                <label>官方接待</label>
                <input type="text" class="form-control" v-model="theTrip.t_official_greeter" placeholder="官方接待人及电话" title="官方接待人及电话">
              </div>
              <div class="col-lg form-inline">
                <label for="pstn">我司负责</label>
                <select type="text" v-model="theTrip.t_id_responsible_person" class="form-control" title="公司负责此行程的人员">
                  <option value="0">我司负责人</option>
                  <option v-for="item in myEmplys" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label>此行目的</label>
                <input type="text" class="form-control" v-model="theTrip.t_activity_contents" placeholder="此行程的目的" title="此行程的目的">
              </div>
              <div class="col-lg form-inline">
                <label>入住酒店</label>
                <input type="text" class="form-control" v-model="theTrip.t_hotel_a_roomtype" placeholder="入住酒店及房型房间号" title="入住酒店及房型房间号">
              </div>
              <div class="col-lg form-inline">
                <label>入住时间</label>
                <input type="datetime-local" v-model="theTrip.t_time_checkin_thelastest" class="form-control" title="最迟入住时间">
              </div>
              <div class="col-lg form-inline">
                <label>退房时间</label>
                <input type="datetime-local" class="form-control" v-model="theTrip.t_time_checkout_thelastest" title="最迟退房时间">
              </div>
            </div>
            <div class="row">
              <div class="col-lg form-inline">
                <label for="pstn">是否接送</label>
                <select type="text" v-model="theTrip.t_need_pickup" class="form-control">
                  <option value="2">是否接送</option>
                  <option value="0">否</option>
                  <option value="1">是</option>
                </select>
              </div>
              <div class="col-lg form-inline">
                <label>接送车辆</label>
                <input type="text" class="form-control" v-model="theTrip.t_driver_a_car" placeholder="负责接送的车辆和司机" title="负责接送的车辆和司机">
              </div>
              <div class="col-lg form-inline">
                <label>行程备注</label>
                <input type="text" class="form-control" v-model="theTrip.t_remark" placeholder="行程备注" title="行程备注">
              </div>
              <div class="col-lg form-inline">
              </div>
            </div>
          </div>
            <div class="container-fluid">
              <div><!--  class="col-lg form-inline" -->
                <button class="btn btn-link" data-toggle="collapse" data-target="#AttendAgendasEditer">展开/收起--会议日程--选择器</button>
              </div>
            </div>
            <div id="AttendAgendasEditer"  class="collapse show" style="margin-top: 5px;">
              <div class="divfortable" v-if="allAgendasInThisProject.length">
                <table class="table table-hover"><!--  small-font-table -->
                  <thead>
                    <th v-for="(item,index) in titleForAgendas" :width="widthForAgendas[index]">{{item}}</th>
                    <th><input type="checkbox" @click="clkTheCkbxForSlctingAllAgendasInThisPrjct" v-model="checkAllAgendasInThisPrjct"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(row,index) in allAgendasInThisProject">
                      <td>{{index+1}}</td>
                      <td :title="row.time_range">{{row.time_range}}</td>
                      <td :title="row.location">{{row.location}}</td>
                      <td :title="row.id_agenda">{{row.id_agenda}}</td>
                      <td :title="row.speaker">{{row.speaker}}</td>
                      <td :title="row.speech_topics">{{row.speech_topics}}</td>
                      <td :title="row.hosts">{{row.hosts}}</td>
                      <td :title="row.remark">{{row.remark}}</td>
                      <td title="选择"><input type="checkbox" v-model="slctdAgendas" :value="row"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="!allAgendasInThisProject.length">
                <p>没有"{{this.theTrip.p_name}}"的日程.</p>
              </div>
            </div>
          <div name="tripsButtons" class="row">
            <div class="col-lg">
              <button class="btn btn-info" @click="backToSchBoxAndTripsList">返回</button>
              </div>
            <div class="col-lg">
              <button class="btn btn-primary savebutton" @click="saveTrips">保存</button>
            </div>
          </div>
        </div>
      </div>    
    </div>
    <div class="modal fade" id="mdlForViewingAtndRcds" role="dialog" aria-labelledby="mdlForViewingAtndRcds" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            {{anAtd.name}}--的参会记录
          </div>
          <div class="modal-body">
            <div class="container-fluid divfortable">
              <table class="table table-hover">
                <thead>
                  <th>日期</th><th>会议名称</th><th>会议内容</th><th>参会身份</th><th>报告题目</th>
                </thead>
                <tbody>
                  <tr v-for="row in anAtdAtendedCnfrcRcds">
                    <td :title="row.time_start">{{row.time_start}}</td>
                    <td :title="row.p_name">{{row.p_name}}</td>
                    <td :title="row.content">{{row.content}}</td>
                    <td :title="row.role">{{row.role}}</td>
                    <td :title="row.speech_topics">{{row.speech_topics}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>  
        </div>
      </div>
    </div>
    <div class="modal fade" id="mdlForViewingResume" role="dialog" aria-labelledby="mdlForViewingResume" data-backdrop="static" data-keyboard: false>
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            {{anAtd.name}}--的主要履历
          </div>
          <div class="modal-body">
            <textarea rows="15" v-model="anAtd.resume" readonly>
            </textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showLoading" class="mask">
      <img class="loading" :src="require('../../static/loading.gif')" alt="正在载入数据"/>
    </div>    
  </div>
</template>
<script>
  import qs from 'qs';
  import datepicker from 'vue2-datepicker';
  import atdedcnfrcrcds from './tr-editing-cnfrc-rcds.vue';
  import saveAsCSV from '@/cuiLibs/saveAsCSV.js'
  export default {
    data () {
      return {
        //common
        showLoading:false,
        currentUserId:this.$store.state.user.id_user,
        myEmplys:this.$store.state.myEmplys,
        projects:this.$store.state.projects,
        queryContent:{
          keyWord:'',
          conditions:'',
          dateRange:[],
          id_attendee:0,
          id_project:0,
          id_track:0,//checkInfo,sendInvitation
          invitedTimes:0,//sendInvitation
          sDate:'',//sendInvitation
          eDate:'',//sendInvitation
          wantQty:1,//sendInvitation
        },
        //checkInfo
        tracks:[],//和sendInvitation共用
        showCiSearchBox:true,
        showCiATDsList:false,
        attendeesInCI:[],
        showPreviousPage:true,
        showNextPage:true,
        countOfRows:0,
        endId:0,
        startId:0,
        idsOfAll:[],
        currentPageNumber:1,
        countOfTotalPages:1,
        countInOnePage:20,
        
        //sendInvitation
        //tracks:[],//和checkInfo共用
        emailList:[],
        textOfOperatedResult:"",
        


        //
        attendees:[],
        titleForATDs:['姓名','职务','工作单位','职称','行政级别','手机号','Email','办公电话','备注'],
        widthForATDs:['8%','12%','15%','9%','9%','13%','13%','13%','8%'],
        anAtd:{},//某代表,与viewer共用
        showListOfATDS:true,//显示参会代表清单
        showSendIvtnSchBox:false,//显示某代表详细页面
        anAtdAtendedCnfrcRcds:[],//某代表出席会议的记录

        showAnATDEditer:false,//显示编辑器
        showSchBoxInNewOrEditTab:false,//显示新建或修改页面的搜索框,同时控制列表显示
        isModifyOldATD:false,//控制编辑器的title,在嘉宾概要信息和新建嘉宾间进行切换
        theOriginATD:{},
        allMobileNumbers:[],
        allEmails:[],
        showSaveBtnInNewOrEdit:true,//显示更改或新建Tab内的保存按钮
        showResumeEditer:false,
        showAtdedCnfrcRcdsEditer:false,
        toggleTextForEditingResume:"展开主要履历编辑器",
        toggleTextForEditingAttendedCnfrcRcds:"展开参会记录编辑器",
        titleOfAtdedCnfcRcds:['序号','日期','会议名称','参会身份','报告题目','反馈意见','备注','操作'],
        widthOfAtdedCnfcRcds:['6%','12%','20%','12%','16%','15%','11%','8%'],
        sbdyAtdedCnfrcRcds:[
          {
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
          }
        ],
        beenRemovedCnfrcRcds:[],
        //参会管理
        // theSelectedAttendeeToAttendSomeProjects:{},
        showSchBoxInAtdCnfrc:true,
        showPickerOfConferences:false,
        keyWdOfSchingSlctablePrjcts:'',
        keyWdForSchingAttendedProjects:'',
        prjctsHasNotAtdd:JSON.parse(JSON.stringify(this.$store.state.projects)),
        tempHasNotAtdd:JSON.parse(JSON.stringify(this.$store.state.projects)),
        prjctsHasAtdd:[],
        tempHasAtdd:[],
        theSlctdATD:{//某个参会代表
          name:'',
          id:0,
          position:'',
          workplace:'',
        },
        slctdSchedulesInThisProjectAtATD:[],//某次参会记录的已选定日程
        id_TheProjectPickedScheduls:'',
        allSchedulsOfAllCnfrcs:[],//所有会议的所有日程
        schedulesOfTheCnfrc:[],//此会的所有日程
        originAtddCnfrcRcdsOfThisATD:[],//某嘉宾的所有原始参会记录
        newAtddCnfrcRcdsOfThisATD:[],//此嘉宾的新参会记录
        allAtddCnfrcRcdsOfAllATDs:[],//所有嘉宾的参会记录
        isSlctAllScheduls:false,//是否全选


        //行程管理
        showSchBoxAndTripsList:true,//显示行程管理的搜索框和清单列表
        showTripEditer:false,//显示行程编辑页面
        allAttendeesAndTrips:[],
        titleForTrips:['会议名称','VIP姓名','VIP手机号','VIP工作单位','VIP职务','出发时间','预抵时间','班次','出发地点','目的地点','随从及电话','官方接待人','司机及车辆','备注','负责人'],
        widthForTrips:['7%','6%','6%','7%','7%','6%','7%','7%','7%','7%','6%','7%','7%','7%','6%'],
        theTrip:{t_id:0},
        theOriginTrip:{},
        titleForAgendas:['序号','开始/结束时间','地点','议程','报告人','报告题目','主持人','备注'],
        widthForAgendas:['6%','15%','15%','14%','8%','13%','8%','13%','8%'],
        agendasOfAllProjects:[],
        allAgendasInThisProject:[],
        slctdAgendas:[],
        checkAllAgendasInThisPrjct:false,


      }
    },
    components: {
     datepicker,
     atdedcnfrcrcds,
     // button,
    },
    methods:{
      getTracksInCi() {
        this.queryContent.conditions="byKeyWordForCheckATDsInfo";
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getTracks.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
            console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.tracks=response.data;
            }
          } else {
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      getAttendeesInCi() {
        this.showLoading=true;
        this.attendeesInCI=[];
        this.countOfTotalPages=0;
        this.showCiATDsList=true;
        this.showCiSearchBox=false;
        this.queryContent.conditions="byKeyWordAndTrack's ID ForCheckATDsInfo";
        this.queryContent.startId=0;
        this.queryContent.endId=0;
        this.queryContent.countInOnePage=this.countInOnePage;
        console.log(this.queryContent);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.rows.length>0) {
              _this.attendeesInCI=response.data.rows;
              _this.countOfRows=response.data.ids.length;
              _this.idsOfAll=response.data.ids;
              //开始和结束Id
              _this.attendeesInCI.forEach( function(ele, index) {
                _this.endId=Number(ele.id)>Number(_this.endId)?Number(ele.id):Number(_this.endId);
                _this.startId=Number(ele.id)<Number(_this.startId)?Number(ele.id):Number(_this.startId);
              },_this);
              //不显示上一页
              _this.showPreviousPage=false;
              _this.currentPageNumber=1;
              _this.showNextPage=_this.countOfRows>_this.countInOnePage && _this.attendeesInCI.length>0?true:false;
              if(_this.countOfRows%_this.countInOnePage==0) {
                _this.countOfTotalPages=_this.countOfRows/_this.countInOnePage;
              } else {
                _this.countOfTotalPages=Math.ceil(_this.countOfRows/_this.countInOnePage);
              }
            }
          } else {
            console.log(response.data);
          }
          _this.showLoading=false;
        }).catch(function (error) {
          _this.showLoading=false;
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      backToCiSearchBox() {
        this.showCiATDsList=false;
        this.showCiSearchBox=true;
        this.startId=0;
        this.endId=0;
      },
      gotoPreviousPage() {
        this.currentPageNumber--;
        let firstPosition=this.idsOfAll.findIndex((ele)=>ele==this.startId);
        
        if((firstPosition-20)<=0) {
          this.startId=this.idsOfAll[0];
          this.endId=this.idsOfAll[19];
        } else {
          this.startId=this.idsOfAll[firstPosition-20];
          this.endId=this.idsOfAll[firstPosition-1];
        }
        
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      gotoNextPage(){
        this.currentPageNumber++;
        let lastPosition=this.idsOfAll.findIndex((ele)=>ele==this.endId);
        this.startId=this.idsOfAll[lastPosition+1];
        this.endId=this.idsOfAll[lastPosition+20];
        if((lastPosition+20)>=(this.idsOfAll.length-1)) {
          this.endId=this.idsOfAll[this.idsOfAll.length-1];
        } else {
          this.endId=this.idsOfAll[lastPosition+20];
        }
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      pageNumberInputed() {
        //将用户输入中的非数字部分过滤掉
        this.currentPageNumber=this.currentPageNumber.replace(/[^\d]/g,'');
        this.currentPageNumber=(this.currentPageNumber=='' || this.currentPageNumber<=0)?1:Number(this.currentPageNumber);
        this.currentPageNumber=this.currentPageNumber>=this.countOfTotalPages?Number(this.countOfTotalPages):Number(this.currentPageNumber);
        //获取该页码的起始和结束位置
        this.startId=this.idsOfAll[(this.currentPageNumber-1)*20];
        if(((this.currentPageNumber-1)*20+19)>this.countOfRows) {
          this.endId=this.idsOfAll[this.countOfRows-1];
        } else {
          this.endId=this.idsOfAll[(this.currentPageNumber-1)*20+19];
        }
        // console.log(this.endId);
        this.getATDsByStartAndEndID(this.startId,this.endId);
      },
      getATDsByStartAndEndID(s,e) {
        this.attendeesInCI=[];
        var _this=this;
        this.queryContent.conditions="byKeyWordAndTrack's ID ForCheckATDsInfo";
        this.queryContent.startId=s;
        this.queryContent.endId=e;
        this.queryContent.countInOnePage=this.countInOnePage;
        console.log(this.queryContent);
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(typeof(response.data)==='object') {
            if(response.data.rows.length>0) {
              _this.attendeesInCI=response.data.rows;
              //开始和结束Id
              _this.attendeesInCI.forEach( function(ele, index) {
                _this.endId=Number(ele.id)>Number(_this.endId)?Number(ele.id):Number(_this.endId);
                _this.startId=Number(ele.id)<Number(_this.startId)?Number(ele.id):Number(_this.startId);
              },_this);
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration: 2000});
        });
      },
      saveCurrentATD(r) {
        this.queryContent.id_curUser=this.currentUserId;
        this.queryContent.conditions="UpdateWithCheckedATDsInfoToForCheckingAtdsInfo";
        this.queryContent.curATD=r;
        console.log(this.queryContent);
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:1000});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:3000});
        });        
      },
// **************************CI end**************************************************//
// **************************SI start**************************************************//
      getEmailsList() {
        if(this.queryContent.id_track==0) {
          this.$toast({text:'专场无效!',type:'warning',duration:1000});
          return;
        }
        if(this.queryContent.sDate>this.queryContent.eDate) {
          let d=this.queryContent.sDate;
          this.queryContent.sDate=this.queryContent.eDate;
          this.queryContent.eDate=d;
        }
        this.showLoading=true;
        this.queryContent.conditions="byIdTrackInvitedTimesDurationForSendingInvite";
        console.log(this.queryContent);
        this.emailList=[];
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.emailList=response.data;
          _this.textOfOperatedResult=_this.emailList.length?"已找到"+_this.emailList.length+"条数据":"没有找到符合条件的数据";
          _this.showLoading=false;
        }).catch(function (error) {
          _this.showLoading=false;
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      clrAtdArr() {
        this.emailList=[];
        this.textOfOperatedResult="没有找到符合条件的数据";
      },
      saveAsCsvToSendEmails() {
        let csvFileName="ForSendingInvite";//id_track
        csvFileName+=((new Date()).getTime()).toString();
        this.emailList.forEach( function(element) {
          let o=this.tracks.find((ele) => ele['id'] == element['id_last_track']);
          element.subject= typeof o==='undefined'?'':o.subject;          
        },this);
        let obj={
          data:this.emailList,
          fileName:csvFileName,
          columns:{
            txtInheader:['姓名','电子信箱','论文题目','专场主题','专场代号'],//表头文字
            fields:['name','email1','atcl_title','subject','id_last_track'],//对应字段名
          }
        };
        saveAsCSV.setDataConver(obj);
        // update attendees invited_times
        let ids=[];
        this.emailList.forEach( function(element, index) {
          ids.push(element['id']);
        });
        // 更新attendees的invited_times=invited_times+1
        this.queryContent.conditions="invited_times+1 ForSendingInvite";
        this.queryContent.ids=ids;
        // console.log(this.queryContent);
        // return;
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.textOfOperatedResult="成功导出"+_this.emailList.length+"条数据!";
            _this.emailList=[];
          } else {
            console.log("update failed!")
          }
        }).catch(function (error) {
          console.log(error);
        });
      },


// **************************SI end**************************************************// 
      getAttendees() {
        this.showListOfATDS=true;
        this.showAnATDEditer=false;
        var _this=this;
        this.attendees=[];
        this.queryContent.conditions="ALLAttendeesWithAttendedInfoWithKeyWord";
        this.$axios({
          method: 'post',
          url: 'getAttendees.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          _this.attendees=response.data;
          _this.attendees.forEach( function(elmt, index) {
            if(elmt.mp1) {
              _this.allMobileNumbers.push(elmt.mp1);
            }
            if(elmt.mp2) {
              _this.allMobileNumbers.push(elmt.mp2);
            }
            if(elmt.email1) {
              _this.allEmails.push(elmt.email1);
            }
          },_this);
          //去重
          let o={};
          let tmpArray=[];
          tmpArray=_this.allMobileNumbers.filter(function(item, index, arr){
            return o.hasOwnProperty(typeof item+item)?false:(o[typeof item+item]=true);
          });
          _this.allMobileNumbers=[...tmpArray];
          //去重
          o={};
          tmpArray=[];
          tmpArray=_this.allEmails.filter(function(item, index, arr){
            return o.hasOwnProperty(typeof item+item)?false:(o[typeof item+item]=true);
          });
          _this.allEmails=[...tmpArray];
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });
      },
      clkARowToView(r) {
        this.showSendIvtnSchBox=true;
        this.anAtd=r;
      },
      toViewAttendedRcds(o) {
        var _this=this;
        this.anAtdAtendedCnfrcRcds=[];
        if(o.ids_projects) {
          this.queryContent.conditions="ATTENDED_RECORDS";
          this.queryContent.id_attendee=o.id;
          this.$axios({
            method: 'post',
            url: 'getAttendedRcds.php',
            data: qs.stringify(_this.queryContent)
          }).then(function (response) {
            console.log(response.data);
            _this.anAtdAtendedCnfrcRcds=response.data;
          }).catch(function (error) {
            console.log(error);
            _this.$toast({text:'通信错误!',type:'danger',duration:4000});
          });
          $('#mdlForViewingAtndRcds').modal('toggle');
        } else {
          this.$toast({text:'没有记录!',type:'info',duration:1000});
        }
      },
      toViewResume(o) {
        if(!o.resume) {
          this.$toast({text:'没有记录!',type:'info',duration:1000});
          return;
        }
        $('#mdlForViewingResume').modal('toggle');
      },
      goToNewOrEditerTab() {
        this.showSchBoxInNewOrEditTab=true;
        this.showAnATDEditer=false;
      },
      newCreateAttendee() {
        this.showSchBoxInNewOrEditTab=false;
        this.showAnATDEditer=true;
        this.isModifyOldATD=false;
        this.anAtd={
          ICO:'',
          account_invoice:'',
          addr_a_tel_invoice:'',
          administrative_rank:'',
          awards:'',
          attainment:'',
          email1:'',
          fp1:'',
          email2:'',
          gender:'',
          id:'',
          id_modifyer:this.currentUserId,
          ids_projects:'',
          mp1:'',
          mp2:'',
          name:'',
          nknm_wc:'',
          num_idcard:'',
          num_passport:'',
          ognzn_invoice:'',
          position:'',
          professional_title:'',
          remark:'',
          resume:'',
          secretary1_a_tel:'',
          secretary2_a_tel:'',
          taxnum_invoice:'',
          time_modifyed:'',
          title1:'',
          title2:'',
          title3:'',
          workplace:'',
        };
        this.sbdyAtdedCnfrcRcds=[
          {
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
          }
        ];

        // this.showListOfATDS=false;

      },
      clkAnATDtoModify(attendee) {
        if(!attendee.administrative_rank) {
          attendee.administrative_rank="0";
        }
        this.theOriginATD={...attendee};
        this.showSchBoxInNewOrEditTab=false;
        this.showAnATDEditer=true;
        this.isModifyOldATD=true;
        this.showSaveBtnInNewOrEdit=true;
        this.anAtd={...attendee};
        this.anAtd.administrative_rank=!this.anAtd.administrative_rank?"0":this.anAtd.administrative_rank;
        console.log(attendee);
      },
      mpInputed(mp) {
        var o=this.allMobileNumbers.find((ele) => ele == mp);
        this.showSaveBtnInNewOrEdit=typeof(o)=='undefined'?true:false;
      },
      emailInputed(eml) {
        var o=this.allEmails.find((ele) => ele == eml);
        this.showSaveBtnInNewOrEdit=typeof(o)=='undefined'?true:false;
      },
      toEditAttendedRcds(o) {
        // $('#mdlForViewingResume').modal('toggle');
      },
      openResumeEditer(o) {
        // this.showAnATDEditer=false;
        this.showResumeEditer=!this.showResumeEditer;
        this.showAtdedCnfrcRcdsEditer=false;
        this.toggleTextForEditingResume=this.showResumeEditer?"收起主要履历编辑器":"展开主要履历编辑器";
      },
      openAttendeCnfrcRcdsEditer(){
        this.showAtdedCnfrcRcdsEditer=!this.showAtdedCnfrcRcdsEditer;
        this.showResumeEditer=false;
        this.toggleTextForEditingAttendedCnfrcRcds=this.showAtdedCnfrcRcdsEditer?"收起参会记录编辑器":"展开参会记录编辑器";
      },
      closeResumeEditer() {
        this.showAnATDEditer=true;
        this.showResumeEditer=false;
        if(this.anAtd.resume && this.anAtd.resume.length>1024) {
          this.$toast({text:'过长,已截取前1024个字!',type:'warning',duration:2000});
          this.anAtd.resume=this.anAtd.resume.substr(0 ,1024);
        }
      },  
      saveNewOrEditedATD() {
        console.log(this.anAtd);
        if(JSON.stringify(this.anAtd)===JSON.stringify(this.theOriginATD)) {
          this.$toast({text:'没有改动!',type:'info',duration:1000});
          return;
        }
        if(!this.anAtd.name || this.anAtd.name.length<2) {
          this.$toast({text:'名字最少两个字!',type:'info',duration:1000});
          return;
        }
        if(!this.anAtd.workplace || this.anAtd.workplace.length<2) {
          this.$toast({text:'工作单位最少两个字!',type:'info',duration:1000});
          return;
        }
        if((!this.anAtd.mp1 || this.anAtd.mp1.length<11) && (!this.anAtd.mp2 || this.anAtd.mp2.length<11) && (!this.anAtd.email1 || this.anAtd.email1.length<8)) {
          this.$toast({text:'至少需要一个手机号或电子信箱!',type:'info',duration:3000});
          return;
        }
        
        if(this.anAtd.id){//修改
          this.queryContent.conditions="EditAnAttendee";
        } else {//新建
          this.queryContent.conditions="NewCreateAnAttendee";
        }
        
        this.queryContent.id_curUser=this.currentUserId;
        this.queryContent.anAtd=this.anAtd;
        console.log(this.queryContent);
        let _this=this;
        this.$axios({
          method: 'post',
          url: 'updateAttendedRecords.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          console.log(response.data);
          if(response.data===true) {
            _this.$toast({text:'操作成功!',type:'success',duration:800});
          } else {
            _this.$toast({text:'操作失败!',type:'danger',duration:1000});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:3000});
        });
        
      },
      addOneRowAdvnc() {
        var atddCnfrcRcd= {
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
        };
        this.sbdyAtdedCnfrcRcds.push(atddCnfrcRcd);
      },
      deleteTheRowAdvnc(idx) {
        if(this.sbdyAtdedCnfrcRcds.length===1) {
          this.$toast({text:'至少需要一条记录!',type:'info',duration:1000});
          return;
        }
        if(this.sbdyAtdedCnfrcRcds[idx]['id']) {//将要移除的是原有的记录
          this.beenRemovedCnfrcRcds.push(this.sbdyAtdedCnfrcRcds[idx]);
        }
        this.sbdyAtdedCnfrcRcds.splice(idx,1);
      },

      //参会管理的methods
      getBasicDataToManageAttendedCnfrcRcds() {
        this.getAttendees();//获取全部嘉宾
        //所有会议的所有日程
        this.allSchedulsOfAllCnfrcs=[];
        let _this=this;
        this.queryContent.conditions="allSchedulesOfAllProjects";
        this.$axios({
          method: 'post',
          url: 'getSchedules.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.allSchedulsOfAllCnfrcs=response.data;
            } else {
              // _this.$toast({text:'找不到该展会项目的日程!',type:'info',duration: 1500});
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text: '通信错误!',type: 'danger',duration: 2000});
        });
        //所有人的所有参会记录
        this.allAtddCnfrcRcdsOfAllATDs=[];
        this.queryContent.conditions="AllAttendedConferenceRecordsOfAllAttendees";
        this.$axios({
          method: 'post',
          url: 'getAttendedRcds.php',
          data:qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.allAtddCnfrcRcdsOfAllATDs=response.data;
            } else {
              // _this.$toast({text:'找不到该展会项目的日程!',type:'info',duration: 1500});
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text: '通信错误!',type: 'danger',duration: 2000});
        });
      },
      backToSchBoxInAtdCnfrc() {
        this.showSchBoxInAtdCnfrc=true;
        this.showPickerOfConferences=false;
        this.prjctsHasAtdd=[];
        this.prjctsHasNotAtdd=JSON.parse(JSON.stringify(this.$store.state.projects));
        // this.schedulesOfTheCnfrc=[];

      },
      keyWdOfSchingSlctablePrjctsChanged() {
        this.keyWdOfSchingSlctablePrjcts=this.keyWdOfSchingSlctablePrjcts.replace(/^\s+|\s+$/g,"");
        if(!this.keyWdOfSchingSlctablePrjcts) {
          this.prjctsHasNotAtdd=JSON.parse(JSON.stringify(this.tempHasNotAtdd));
        } else {
          this.prjctsHasNotAtdd = this.tempHasNotAtdd.filter((item,i,arr) => {
            return (item.name.indexOf(this.keyWdOfSchingSlctablePrjcts) != -1 );
          },this);
          if(this.prjctsHasNotAtdd.length<1) {
            console.log('No Data');
          }
        }
      },
      keyWdForSchingAttendedProjectsChanged() {
        this.keyWdForSchingAttendedProjects=this.keyWdForSchingAttendedProjects.replace(/^\s+|\s+$/g,"");
        if(!this.keyWdForSchingAttendedProjects) {
          this.prjctsHasAtdd=JSON.parse(JSON.stringify(this.tempHasAtdd));
        } else {
          this.prjctsHasAtdd = this.tempHasAtdd.filter((item,i,arr) => {
            return (item.name.indexOf(this.keyWdForSchingAttendedProjects) != -1 );
          },this);
          if(this.prjctsHasAtdd.length<1) {
            console.log('No Data');
          }
        }
      },
      clkAnATDToEditAttdCnfrcRcds(r) {
        console.log(this.prjctsHasAtdd);
        this.showSchBoxInAtdCnfrc=false;
        this.showPickerOfConferences=true;
        // console.log(JSON.parse(JSON.stringify(r)));
        //获取此嘉宾的所有原始参会记录
        this.originAtddCnfrcRcdsOfThisATD=this.allAtddCnfrcRcdsOfAllATDs.filter(function(el,index,arr) {
          return el.id_attendee==r.id;
        },this);
        //新参会记录初始化
        this.newAtddCnfrcRcdsOfThisATD=this.allAtddCnfrcRcdsOfAllATDs.filter(function(el,index,arr) {
          return el.id_attendee==r.id;
        },this);
        this.theSlctdATD.id=r.id;
        this.theSlctdATD.name=r.name;
        this.theSlctdATD.position=r.position;
        this.theSlctdATD.workplace=r.workplace;
        //获取准确的已参加和未参加的会议清单
        this.originAtddCnfrcRcdsOfThisATD.forEach( function(element, index,arr) {
          let i=this.prjctsHasNotAtdd.findIndex((ele) => ele['id'] == element.id_project);
          if(i!==-1) {
            //添加到已参加的会议列表中
            this.prjctsHasAtdd.push(this.prjctsHasNotAtdd[i]);
            //从未参加的会议列表中删除
            this.prjctsHasNotAtdd.splice(i,1);
          }
        },this);

        let atddCnfrcRcd={
          id:0,
          id_attendee:this.theSlctdATD.id,
          id_modifyer:this.currentUserId,
          id_project:'',
          role:'一般参会代表',
          speech_topics:'',
          time_attended:'',
          ids_schedule:'',
          remark:'',
          feedback:'',
          is_deleted:0,
        };
        //为已选择的会议添加参会记录
        for(let i=0;i<this.prjctsHasAtdd.length;i++) {
          let acr=this.newAtddCnfrcRcdsOfThisATD.find((ele) => ele['id_project'] == this.prjctsHasAtdd[i].id);
          if(typeof acr==='undefined') {//没有原始参会记录,添加一个新的
            atddCnfrcRcd.id_project=this.prjctsHasAtdd[i].id;
            atddCnfrcRcd.time_attended=this.prjctsHasAtdd[i].time_start;
            let idx=this.newAtddCnfrcRcdsOfThisATD.push(atddCnfrcRcd);
            this.prjctsHasAtdd[i].acr=atddCnfrcRcd;
          } else {//有原始参会记录,将此原始参会记录添加到这个会议上
            this.prjctsHasAtdd[i].acr=acr;
          }
        }
        this.tempHasAtdd=JSON.parse(JSON.stringify(this.prjctsHasAtdd));
      },
      DeleteFromHasAtddCnfrcs(r) {
        let index=this.prjctsHasAtdd.findIndex((ele) => ele['id'] == r.id);
        let o=this.prjctsHasAtdd.find((ele) => ele['id'] == r.id);
        this.prjctsHasAtdd.splice(index,1);
        index=this.tempHasAtdd.findIndex((ele) => ele['id'] == r.id);
        this.tempHasAtdd.splice(index,1);

        this.prjctsHasNotAtdd.unshift(o);
        this.tempHasNotAtdd.unshift(o);
        index=this.newAtddCnfrcRcdsOfThisATD.findIndex((ele) => ele['id_project'] == r.id && ele['id_attendee'] == this.theSlctdATD.id);
        this.newAtddCnfrcRcdsOfThisATD.splice(index,1);
      },
      PushItIntoAtddCnfrcs(r) {
        let index=this.prjctsHasNotAtdd.findIndex((ele) => ele['id'] == r.id);
        let o=this.prjctsHasNotAtdd.find((ele) => ele['id'] == r.id);
        this.prjctsHasNotAtdd.splice(index,1);
        index=this.tempHasNotAtdd.findIndex((ele) => ele['id'] == r.id);
        this.tempHasNotAtdd.splice(index,1);

        this.prjctsHasAtdd.unshift(o);//不含参会记录的
        this.tempHasAtdd.unshift(o);
        //为已选择的会议添加参会记录
        //参会记录模板
        let atddCnfrcRcd={
          id:0,
          id_attendee:this.theSlctdATD.id,
          id_modifyer:this.currentUserId,
          id_project:'',
          role:'一般参会代表',
          speech_topics:'',
          time_attended:'',
          ids_schedule:'',
          remark:'',
          feedback:'',
          is_deleted:0,
        };
        let acr=this.newAtddCnfrcRcdsOfThisATD.find((ele) => ele['id_project'] == o.id);
        if(typeof acr==='undefined') {//没有原始参会记录,添加一个新的
          atddCnfrcRcd.id_project=o.id;
          atddCnfrcRcd.time_attended=o.time_start;
          this.newAtddCnfrcRcdsOfThisATD.push(atddCnfrcRcd);
          o.acr=atddCnfrcRcd;
        } else {//有原始参会记录,将此原始参会记录添加到这个会议上
          o.acr=acr;
        }
      },
      showSchedulesListOfThisProjects(r,i) {
        this.id_TheProjectPickedScheduls=r.id;
        this.slctdSchedulesInThisProjectAtATD=[];
        this.schedulesOfTheCnfrc=[];
        //获取此会议的所有日程
        this.schedulesOfTheCnfrc=this.allSchedulsOfAllCnfrcs.filter(function(el,index,arr) {
          return el.id_project==r.id;
        },this);
        if(!this.schedulesOfTheCnfrc.length) {
          this.$toast({text:'没有这个会议的日程!',type:'info',duration:1000});
          return;
        }
        //在此嘉宾的所有参会记录中,找出出席此会的记录
        let rcdsOfatddThisCnfrc=[];
        rcdsOfatddThisCnfrc=this.originAtddCnfrcRcdsOfThisATD.filter(function(el,index,arr) {
          return el.id_project=r.id;
        },this);
        //找出此嘉宾出席的此会日程ID集合
        let idsSchedulesInTheCnfrc=[];
        for(let i=0;i<rcdsOfatddThisCnfrc.length;i++) {
          if(rcdsOfatddThisCnfrc[i].ids_schedule) {
            idsSchedulesInTheCnfrc.push(...rcdsOfatddThisCnfrc[i].ids_schedule.split(','));
          }
        }
        //去除重复项
         var obj = {};
         idsSchedulesInTheCnfrc=idsSchedulesInTheCnfrc.filter(function(item, index, arr){
         return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true);
         });
        //将已出席的日程添加到已出席日程slctdSchedulesInThisProjectAtATD中
        for(let i=0;i<idsSchedulesInTheCnfrc.length;i++) {
          let o=this.schedulesOfTheCnfrc.find(function(el,index,arr) {
            return el.id==idsSchedulesInTheCnfrc[i];
          },this);
          if(typeof(o)!=='undefined') {
            this.slctdSchedulesInThisProjectAtATD.push(o);
          }
        }
        $("#pickerOfSchedules").modal("toggle");//open
      },
      clkdTheAllSlctCheckboxInScheduleShower() {
        this.isSlctAllScheduls=!this.isSlctAllScheduls;
        if(this.isSlctAllScheduls) {
          this.slctdSchedulesInThisProjectAtATD=this.schedulesOfTheCnfrc.filter(function(index) {
            return true;
          });
        } else {
          this.slctdSchedulesInThisProjectAtATD=[];
        }
      },
      pickingSchedulesDone() {
        // this.slctdSchedulesInThisProjectAtATD//已选择的此次会议日程
        // this.id_TheProjectPickedScheduls//选取日程的会议ID
        // this.originAtddCnfrcRcdsOfThisATD//此代表的原始参会记录
        // this.theSlctdATD
        // this.newAtddCnfrcRcdsOfThisATD
        
        //找到需更新的project 
        let i=this.newAtddCnfrcRcdsOfThisATD.findIndex((ele) => ele['id_project'] == this.id_TheProjectPickedScheduls && ele['id_attendee'] ==this.theSlctdATD.id);
        //将日程ids变为字符串
        let ids_schedules="";
        if(this.slctdSchedulesInThisProjectAtATD.length) {
          this.slctdSchedulesInThisProjectAtATD.forEach( function(el, index,arr) {
            if(ids_schedules) {
              ids_schedules+=","+el.id;
            } else {
              ids_schedules=el.id;
            }
          },this);
        }
        //更新参会记录,共两处需更新,newAtddCnfrcRcdsOfThisATD和当前项目
        this.newAtddCnfrcRcdsOfThisATD[i]['ids_schedule']=ids_schedules;
        let curPrjct=this.prjctsHasAtdd.find((ele) => ele['id'] == this.id_TheProjectPickedScheduls);
        curPrjct.acr.ids_schedule=ids_schedules;

        // console.log(this.newAtddCnfrcRcdsOfThisATD);
        $("#pickerOfSchedules").modal("toggle");//close
      },
      saveTheAttendedCnfrcData() {
        /*
        this.$toast({text:'操作成功!',type:'success',duration:800});
        this.showSchBoxInAtdCnfrc=true;
        this.showPickerOfConferences=false;
        this.prjctsHasAtdd=[];
        this.prjctsHasNotAtdd=JSON.parse(JSON.stringify(this.$store.state.projects));
        
         */
        console.log(this.newAtddCnfrcRcdsOfThisATD);
      },
      
      //行程管理的methods
      getAllAttendeesAndAllTrips() {
        var _this=this;
        this.allAttendeesAndTrips=[];
        this.queryContent.conditions="GetALLAttendeesWithTheirCnfrcRcdsByKeyWord";
        this.$axios({
          method: 'post',
          url: 'getVipTrips.php',
          data: qs.stringify(_this.queryContent)
        }).then(function (response) {
          if(Array.isArray(response.data)){
            if(response.data.length) {
              _this.allAttendeesAndTrips=response.data;
            } else {
            _this.$toast({text:'找不到数据!',type:'info',duration:1200});
            }
          } else {
            console.log(response.data);
            _this.$toast({text:'运行错误!',type:'danger',duration:4000});
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({text:'通信错误!',type:'danger',duration:4000});
        });

        this.getAllSchedulesOfAllProjects();
      },
      clkTheTripToModify(r) {
        this.showSchBoxAndTripsList=false;
        this.showTripEditer=true;
        this.theTrip=r;
        this.theOriginTrip=JSON.parse(JSON.stringify(r));
        // this.theOriginTrip.id=9999;
        // this.theOriginTrip.t_ids_agendas="4,5,6,7";
        this.allAgendasInThisProject=this.agendasOfAllProjects.filter(function(item,index,arr) {
          return item.id_project==this.theTrip.t_id_project;
        },this);
        console.log(this.theTrip);
        console.log(this.theOriginTrip);

      },
      newCreateTrip() {
        this.showSchBoxAndTripsList=false;
        this.showTripEditer=true;
        this.theTrip={
          a_administrative_rank:'',
          a_email1:'',
          a_gender:'',
          a_id:0,
          a_mp1:'',
          a_name:'',
          a_num_idcard:'',
          a_num_passport:'',
          a_position:'',
          a_secretary1_a_tel:'',
          a_workplace:'',
          p_name:'',
          t_activity_contents:'',
          t_driver_a_car:'',
          t_entourage_a_mp:'',
          t_hotel_a_roomtype:'',
          t_id:0,
          t_id_project:0,
          t_id_responsible_person:this.currentUserId,
          t_ids_agendas:'',
          t_location_destination:'',
          t_location_origination:'',
          t_need_pickup:2,
          t_need_transfer_to:'',
          t_num_trnspts:'',
          t_official_greeter:'',
          t_time_checkin_thelastest:'',
          t_time_checkout_thelastest:'',
          t_remark:'',
          t_time_arrival:'',
          t_time_departure:'',
        };
        this.allAgendasInThisProject=[];
        //获取所有会议的日程
        this.getAllSchedulesOfAllProjects();

      },
      backToSchBoxAndTripsList() {
        this.showSchBoxAndTripsList=true;
        this.showTripEditer=false;
      },
      getAllSchedulesOfAllProjects() {
        var queryContent={
          conditions:"allSchedulesOfAllProjects",
          id_project:this.theTrip.t_id!="0"?this.theTrip.t_id:0,
        };
        this.agendasOfAllProjects=[];
        var _this=this;
        this.$axios({
          method: 'post',
          url: 'getSchedules.php',
          data:qs.stringify(queryContent)
        }).then(function (response) {
          if(typeof(response.data)==='object') {
            if(response.data.length>0) {
              _this.agendasOfAllProjects=response.data;
            } else {
              // _this.$toast({text:'找不到该展会项目的日程!',type:'info',duration: 1500});
            }
          } else {
            console.log(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _this.$toast({
            text: '通信错误!',
            type: 'danger',
            duration: 2000
          });
        });
      },
      getAllAgendasInThisProject() {
        //设置此行程的项目名称
        if(this.theTrip.t_id_project!=0) {
          let p=this.projects.find((ele) => ele['id'] == this.theTrip.t_id_project);
          this.theTrip.p_name=p.name;
        } else {
          this.theTrip.p_name="选择会议";
          this.allAgendasInThisProject=[];
          return;
        }
        //获取此项目的全部日程
        this.allAgendasInThisProject=this.agendasOfAllProjects.filter(function(item,index,arr) {
          return item.id_project==this.theTrip.t_id_project;
        },this);
        //默认参加全部议程
        this.slctdAgendas=JSON.parse(JSON.stringify(this.allAgendasInThisProject));
      },
      getDetailsInfoOfATD() {
        let a=this.attendees.find((ele) => ele['id'] == this.theTrip.a_id);
        if(typeof a==='undefined') {
          return;
        } else {
          this.theTrip.position=a.position;
          this.theTrip.mp1=a.mp1;
        }
        // console.log(this.theTrip);
      },
      clkTheCkbxForSlctingAllAgendasInThisPrjct() {
        this.checkAllAgendasInThisPrjct=!this.checkAllAgendasInThisPrjct;
        if(this.checkAllAgendasInThisPrjct) {
          this.slctdAgendas=JSON.parse(JSON.stringify(this.allAgendasInThisProject));
        } else {
          this.slctdAgendas=[];
        }
      },
      saveTrips() {
        if(this.theTrip.t_id_project==0 || this.theTrip.t_id_project==1){
          this.$toast({text:'请选择会议名称',type:'info',duration: 2000});
          return;
        }
        this.showSchBoxAndTripsList=true;
        this.showTripEditer=false;
        console.log(this.theTrip);

      },

    },
    computed:{
      getRspsblName() {
        return function (r) {
          let o=this.myEmplys.find((ele) => ele['id'] == r.t_id_responsible_person);
          return typeof o==='undefined'?'':o.name;
        }
      },
      getTrackName() {
        return function(i) {

          let o=this.tracks.find((ele) => ele['id'] == i);
          return typeof o==='undefined'?'':o.subject;
        }
      },
      // getAtddCnfrcRcdsByIdPrjct() {
      //   return function (r) {
      //     // return;
      //     let atddCnfrcRcd={
      //       id:0,
      //       id_attendee:this.theSlctdATD.id,
      //       id_modifyer:this.currentUserId,
      //       id_project:'',
      //       role:'一般参会代表',
      //       speech_topics:'cmptd',
      //       time_attended:'',//r.time_start
      //       ids_schedule:'',
      //       remark:'',
      //       feedback:'',
      //       is_deleted:0,
      //     };
      //     for(let i=0;i<this.prjctsHasAtdd.length;i++) {

      //       let o=this.newAtddCnfrcRcdsOfThisATD.find((ele) => ele['id_project'] == this.prjctsHasAtdd[i].id);
      //       if(typeof o==='undefined') {
      //         atddCnfrcRcd.id_project=this.prjctsHasAtdd[i].id;
      //         atddCnfrcRcd.time_attended=this.prjctsHasAtdd[i].time_start;
      //         let idx=this.newAtddCnfrcRcdsOfThisATD.push(atddCnfrcRcd);
      //         // this.originAtddCnfrcRcdsOfThisATD.push(atddCnfrcRcd);
      //         // console.log(this.newAtddCnfrcRcdsOfThisATD[idx-1]);
      //         // return this.newAtddCnfrcRcdsOfThisATD[idx-1];
      //       } else {
      //         // return o;
      //       }
      //     }
      //     return this.newAtddCnfrcRcdsOfThisATD.find((ele) => ele['id_project'] == r.id);
      //     // let o=this.newAtddCnfrcRcdsOfThisATD.find((ele) => ele['id_project'] == r.id);
      //     // if(typeof o==='undefined') {
      //     //   //没有对应的参会记录,则push一个新的参会记录.push返回的是增加元素后的数组长度
      //     //   let i=this.newAtddCnfrcRcdsOfThisATD.push(atddCnfrcRcd);
      //     // console.log(this.newAtddCnfrcRcdsOfThisATD[i-1]);
      //     //   return this.newAtddCnfrcRcdsOfThisATD[i-1];
      //     // } else {
      //     //   return o;
      //     // }
      //   }
      // },
    },
    beforeCreate() {
    },
    mounted() {
      this.getTracksInCi();
    },
    watch:{
      'slctdSchedulesInThisProjectAtATD': {
        handler: function() {
          if(this.schedulesOfTheCnfrc.length===this.slctdSchedulesInThisProjectAtATD.length) {
            this.isSlctAllScheduls=true;
          } else {
            this.isSlctAllScheduls=false;
          }
        }
      },
      'slctdAgendas': {
        handler: function() {
          if(this.slctdAgendas.length===this.allAgendasInThisProject.length) {
            this.checkAllAgendasInThisPrjct=true;
          } else {
            this.checkAllAgendasInThisPrjct=false;
          }
        }
      },
      'currentPageNumber':{
        handler: function() {
          if(this.currentPageNumber<=1) {
            this.showPreviousPage=false;
          } else {
            this.showPreviousPage=true;
          }
          if(this.currentPageNumber>=this.countOfTotalPages) {
            this.showNextPage=false;
          } else {
            this.showNextPage=true;
          }
        }
      },
    }
  }  
</script>

<style scoped>
.modal input,.modal select {
  width: 75%;
}
.tab-content,.row {
  margin-top: 5px;
}
.searchbox button,.searchbox input,.searchbox select {
  margin-left: 5px;
}
.searchbox {
  margin-bottom: 5px;  
}
.tab-pane {
  margin-top: 5px;
  margin-bottom: 5px;
}
.btn-at-right {
  position: absolute;
  right: 20px;
}
textarea {
  width: 90%;
}
.row .col-lg input, .row .col-lg select {
  width: 80%;
}
.attendee-viewer .row {
margin-bottom: 10px;
}
.savebutton {
  width: 120px;
}
.pre-scrollable {
 min-height: 620px;
}
#atdedCnfrcRcdsEditer {
  width: 100%;
  overflow: scroll;
  max-height: 400px;
}
.small-font-table {
  font-size: 12px;
}
.tip-span {
  margin-left: 50px;
  font-size: 1.2rem;
}
.tablebox {
  width: 100%;
  overflow: scroll;
  max-height: 560px;
}
.waitingSlcting {
  border: solid 2px gray;
  border-radius:5px;
}
.slctd {
  border: solid 2px #007bff;
  border-radius:5px
}
.table-sm td {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: none;
}
.samecard {
  border-radius:5px;
  background-color: #3C3C3C;
  padding: 5px;
  margin-bottom: 10px;
}
.samecard label {
  color: white;
}
.mgrt10 {
  margin-right:10px;
}
.txtleft {
  text-align: left;
}
.bgchvy-txtwt {
  background: #3C3C3C;
  color: white;  
}
.slmbdr {
  border: 1px solid #ced4da;
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
</style>
