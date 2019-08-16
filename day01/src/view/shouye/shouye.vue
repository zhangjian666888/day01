<template>
  <div style="width:100%;height: 100%;">
    <el-container style="height: 100%" direction="vertical">
      <el-header style="font-size: 12px;text-align: left">
        <span style="font-size:25px;margin-right:60%;">
            蛟龙在线
            <el-tooltip ref="tip" class="item" effect="dark"  placement="top-start" v-bind:content="this.$data.mycontent">
              <i class="el-icon-menu" @click="openParentClose()"></i>
            </el-tooltip>

          <!-- 提示音 -->
            <audio id="yinpin" src="../../static/tishi/tishiyin.mp3"> </audio>
            <audio id="en" src="../../static/tishi/en.mp3"> </audio>
            <audio id="qingsong" src="../../static/tishi/qingsong.mp3"> </audio>
            <audio id="aiya" src="../../static/tishi/aiya.mp3"> </audio>


        </span>


        <div style="float:right">
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">首页</el-dropdown-item>
              <el-dropdown-item command="a">查看</el-dropdown-item>
              <el-dropdown-item command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span ref="userinfo_username">{{this.$data.userInfo.username}}</span>
          <input ref="userinfo_userid" type="hidden" v-model="this.$data.userInfo.id">
          &nbsp;&nbsp;&nbsp;
          <el-dropdown trigger="click" >
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                评论
                <el-badge class="mark" :value="12" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </el-header>

      <el-container noresize:false>
        <!-- 左侧的菜单 -->
        <mymenu  ref="iiii" v-on:ee="updatePro"></mymenu>
        <!-- 右侧的主显示区域 -->
        <mymain style="padding:0px"></mymain>

      </el-container>
    </el-container>

    <el-dialog
      title="当前用户信息"
      :visible.sync="dialog1Visible"
      width="40%"
    >
      <img src="" width="150px">
      <el-form  :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="用户名:">{{this.$data.currInfo.username}}</el-form-item>
        <el-form-item label="登录名:">{{this.$data.currInfo.loginname}}</el-form-item>
        <el-form-item label="性别:">{{this.$data.currInfo.sex==1?'男':'女'}}</el-form-item>
        <br>
        <el-form-item label="电话:">{{this.$data.currInfo.tel}}</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import mymenu from './datamenu.vue'
  import mymain from './datamain.vue'
  import {delCookie} from "../../js/cookieutil";
    export default {
        name: "shouye",
        components:{mymenu,mymain},
      data(){
        return{
          dialog1Visible: false,
          mycontent:"点我打开菜单",
          userInfo:window.JSON.parse(window.localStorage.getItem("userInfo")),
          currInfo:{
            userName:'',
            loginName:'',
            sex:'',
            tel:'',

          }
        }
      },
      methods:{
        openParentClose(){
          //调用子组件menu中的openClose()
          this.$refs.iiii.openClose();
        },
        updatePro(uu){
          if(uu){
            this.$data.content="点击打开菜单";
          }else{
            this.$data.content="点击关闭菜单";
          }
        },
        handleCommand(command){

          if(command=="b"){//退出操作

            this.$confirm('确认登出？').then(_ => {
              this.$axios.post(this.domain.serverpath+"loginout",this.$data.userInfo).then((response)=>{

                delCookie("key");
                delCookie("username")
                delCookie("password")


                window.localStorage.removeItem("token");
                window.localStorage.removeItem("heng");
                window.localStorage.removeItem("zong");
                window.localStorage.removeItem("userInfo");

                let sts=response.data.success;
                if(sts=="ok"){
                  this.$router.push({path:'/'});
                }
              })

            }).catch(_ => {

            });

          }else if(command=="a"){
            this.$data.dialog1Visible = true;
            this.$data.currInfo=this.$data.userInfo;

          }else if(command=="c"){
            this.$router.push({path:"/system"})
          }
        }
      },
      mounted(){
        //登录之后提示
        this.playAudio("yinpin","yinpin");

      },
    }
</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height:60px;

  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
