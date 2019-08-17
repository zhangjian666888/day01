<template>
  <div class="login-wrap" :style="divimg">

    <div>
      <p class="p-title">LCG我爱编码,蛟龙在线,欢迎点评</p>
    </div>

    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="普通登陆">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="loginname">
              <el-input v-model="ruleForm.loginname" placeholder="请输入用户名" @keyup.enter.native="submitForm('ruleForm')">
                <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item prop="code">
              <div class="form-inline-input">
                <div class="code-box" id="code-box">
                  <input ref="coderef" type="text" name="code" class="code-input" />
                  <p></p>
                  <span style="color:#909399">
                     拖动验证
                  </span>
                </div>
              </div>
            </el-form-item>

            <el-form-item >
              <el-checkbox v-model="day">7天免登陆</el-checkbox>

            </el-form-item>

            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
            <!-- 登录进度 -->
            <el-progress ref="jindu" :style="jindustyle"  :text-inside="true"
                         :stroke-width="18"
                         :percentage="percent"
                         status="success"></el-progress>
            <p><a @click="updatePassword" style="text-decoration: none;font-size: 14px">忘记密码</a></p>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="短信登陆">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item  prop="phone">
              <el-input  placeholder="请输入手机号" v-model="ruleForm.phone">
                <el-button slot="prepend" icon="el-icon-phone"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input placeholder="请输入验证码" v-model="ruleForm.code" class="input-with-select">
                <el-button slot="append" :class="{disabled: !this.canClick}" @click="countDown">{{content}}</el-button>
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="phonelogin" style="width: 100%">登录</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </div>



  </div>
</template>

<script>
  import {getCookie, setCookie} from "../../js/cookieutil";

  export default {
    name: "login",
    data(){
      return{
        messageCode:{},
        content: '发送验证码',
        totalTime: 60,
        canClick: true,
        day:false,
        divimg:{//背景图片的使用
          backgroundImage:"url(" + require('../../assets/yun.jpg') + ")",
          backgroundRepeat: "no-repeat",
          height:"100%",
          width:"100%",
          overflow:"hidden",
          backgroundSize:"cover"
        },
        percent:0,
        jindustyle:{
          display:'none'
        },
        ruleForm: {
          loginname:'zhangsan',
          password:'123456',
          phone:""
        },
        rules: {
          loginname: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        phoneCode:"",

      }
    },
    methods:{
      updatePassword(){
        this.$router.push("/view/shouye/user/updatePassword");
      },
      phonelogin(){

        this.$axios.post(this.domain.serverpath+"selUserByCode?code="+this.$data.ruleForm.code+"&tel="+this.$data.ruleForm.phone).then((res)=>{

          console.log(res);

          if(res.data.code==500){

            this.$message.error(res.data.error);

          }else{

            //存储token到浏览器端的缓存中，
            window.localStorage.setItem("token",res.data.token);

            window.localStorage.setItem("userInfo",window.JSON.stringify(res.data.result));

            window.localStorage.setItem("heng",window.JSON.stringify(res.data.keys));

            window.localStorage.setItem("zong",window.JSON.stringify(res.data.values));

            this.$router.push({path:'/system'});

            this.$message({
              message: res.data.success,
              type: 'success',
              duration:2000
            });
          }

        });

      },
      countDown () {

        let str = "^1(3|4|5|6|7|8|9)\\d{9}$";

        if(!this.ruleForm.phone.match(str)){

          this.$message.error("请输入正确格式的手机号!");

        }else{

          if (!this.canClick) return  //改动的是这两行代码
          this.canClick = false
          this.content = this.totalTime + 's后重新发送'
          let clock = window.setInterval(() => {
            this.totalTime--
            this.content = this.totalTime + 's后重新发送'
            if (this.totalTime < 0) {
              window.clearInterval(clock)
              this.content = '重新发送验证码'
              this.totalTime = 60
              this.canClick = true  //这里重新开启
            }
          },1000);
          this.$axios.post(this.domain.serverpath+"selMessage?myPhone="+this.ruleForm.phone).then((res)=>{

            if(res.data.code==200){

              this.$data.phoneCode = res.data.success;

            }else{

              this.$message.error(res.data.error);
              window.clearInterval(clock)
            }

          });

        }


      },
      submitForm(ruleid){

        let code=this.$refs.coderef.value;
        console.log(code);
        if(code==null||code==""){
          const h = this.$createElement;
          this.$notify({
            title: '提示信息：',
            message: h('i', { style: 'font-style:normal'}, '请进行拖动校验！'),
            duration:1500 //延时时间
          });
        }else{

          if(this.ruleForm.loginname==""||this.ruleForm.loginname==null){
            this.$notify.info({
              title: '提示',
              message: '请填写用户名'
            });
            return;
          }
          if(this.ruleForm.password==""||this.ruleForm.password==null){
            this.$notify.info({
              title: '提示',
              message: '请填写密码'
            });
            return;
          }
          this.login()
        }

      },
      login(){
        //将用户名和密码的明文进行加密
        if(getCookie("username")!=null&&getCookie("password")!=null){

          this.$data.ruleForm.loginname=getCookie("username");
          this.$data.ruleForm.password=getCookie("password");
          this.$data.ruleForm.key=getCookie("key");
        }

        this.$data.ruleForm.code=this.$refs.coderef.value;
        this.$data.ruleForm.codekey=this.Cookies.get("authcode");

        //打开登陆进度条
        this.$data.jindustyle.display='block';
        //每0.1秒更新一下进度
        var timer=setInterval(()=>{
          let pp=this.$data.percent+10;
          if(pp>=100){
            pp=99;
          }
          this.$data.percent=pp;
        },100)


        this.$axios.post(this.domain.serverpath+"login",this.$data.ruleForm).then((response)=>{

          console.log(response);

          let respo=response.data;

          if(respo.code=="200"){

            if(this.day){

              setCookie("key","value",7);

              setCookie("username",this.ruleForm.loginname,7);

              setCookie("password",this.ruleForm.password,7);

            }
            //存储token到浏览器端的缓存中，
            window.localStorage.setItem("token",respo.token);

            window.localStorage.setItem("userInfo",window.JSON.stringify(respo.result));

            window.localStorage.setItem("heng",window.JSON.stringify(respo.keys));

            window.localStorage.setItem("zong",window.JSON.stringify(respo.values));

            //关闭加载窗
            this.$data.percent=100
            //隐藏进度条
            this.$data.jindustyle.display='none'
            //关闭定时
            clearInterval(timer)

            //跳转到首页界面
            this.$router.push({path:'/system'});
          }else if(respo.error!=null){
            //关闭加载窗
            //关闭加载窗
            this.$data.percent=100
            //隐藏进度条
            this.$data.jindustyle.display='none'
            //关闭定时
            clearInterval(timer)
            this.$notify.error({
              title: '提示',
              duration:1000,
              message: respo.error
            });
          }

        }).catch((error)=>{
          //关闭加载窗
          this.$data.percent=100;
          //隐藏进度条
          this.$data.jindustyle.display='none';
          //关闭定时
          clearInterval(timer);
          this.$notify.error({
            title: '错误',
            message: '出错了~_~，请联系管理员！'
          });
        });

      },
      //拖动验证start
      getOffset(box,direction){
        var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while(parentBox){
          offset+=parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      },
      moveCode(code,_this){
        var fn = {codeVluae : code};
        var box = document.querySelector("#code-box"),
          progress = box.querySelector("p"),
          codeInput = box.querySelector('.code-input'),
          evenBox = box.querySelector("span");
        //默认事件
        var boxEven = ['mousedown','mousemove','mouseup'];
        //改变手机端与pc事件类型
        if(typeof document.ontouchstart == 'object'){
          boxEven = ['touchstart','touchmove','touchend'];
        }
        var goX,offsetLeft,deviation,evenWidth,endX;
        function moveFn(e){
          e.preventDefault();
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          endX = e.clientX - goX;
          endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
          if(endX > evenWidth * 0.7){
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
          }else{
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
          }
          progress.style.width = endX+deviation+'px';
          evenBox.style.left = endX+'px';
        }
        function removeFn() {
          document.removeEventListener(boxEven['2'],removeFn,false);
          document.removeEventListener(boxEven['1'],moveFn,false);
          if(endX > evenWidth * 0.7){
            progress.innerText = '验证成功';
            progress.style.width = evenWidth+deviation+'px';
            evenBox.style.left = evenWidth+'px'
            codeInput.value = fn.codeVluae;
            evenBox.onmousedown = null;
            _this.ruleForm.verification = true;

            //alert( codeInput.value);

          }else{
            progress.style.width = '0px';
            evenBox.style.left = '0px';
          }
        };
        function getOffset(box,direction){
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        };
        evenBox.addEventListener(boxEven['0'], function(e) {
            console.log(e);
            e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
            goX = e.clientX,
              offsetLeft = getOffset(box,'left'),
              deviation = this.clientWidth,
              evenWidth = box.clientWidth - deviation,
              endX;
            document.addEventListener(boxEven['1'],moveFn,false);
          document.addEventListener(boxEven['2'],removeFn,false);
        },false);
        fn.setCode = function(code){
          if(code)
            fn.codeVluae = code;
        }
        fn.getCode = function(){
          return fn.codeVluae;
        }
        fn.resetCode = function(){
          alert("====")
          evenBox.removeAttribute('style');
          progress.removeAttribute('style');
          codeInput.value = '';
        };
        return fn;
      }//拖动验证end

    },
    mounted(){
      if(getCookie("key")=="value"){

        this.login();
        this.$router.push("/system");

      }else{

        var _this = this;
        var code = "";
        //从后台获取滑动验证码
        //参数 url 访问参数
        this.$axios.post(this.domain.serverpath+'getCode').then((response)=>{
          code=response.data.result;
          //向浏览器写一个Cookie
          //document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
          _this.moveCode(code,_this);
        })

      }

    }
  }
</script>

<style scoped>
  /*  .login-wrap{
      position: relative;
      width:100%;
      height:100%;
      background-image: url(../../assets/login-bg.jpg);
      background-size: 100%;
    }*/
  .ms-title{
    width:100%;
    line-height: 50px;
    text-align: left;
    font-size:20px;
    color: #fff;
    font-style:italic;
    border-bottom: 1px solid #ddd;
  }
  .ms-login{
    position: absolute;
    left:70%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content{
    padding: 30px 30px;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
  }

  /** 滑动验证start **/
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 70px;
    background-color:#fff;
    font-size: 12px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .p-title{
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style:italic
  }
  /** 滑动验证end **/

  .disabled{
     background-color: #ddd;
     border-color: #ddd;
     color:#57a3f3;
     cursor: not-allowed;
  }
</style>
