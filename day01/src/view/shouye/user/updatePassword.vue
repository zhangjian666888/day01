<template>
  <div style="margin-top: 30px;width: 80%;margin-left: 10%">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="步骤 1" description="请输入您的邮箱，接收验证码。"></el-step>
      <el-step title="步骤 2" description="请查看您的邮件。"></el-step>
      <el-step title="步骤 3" description="修改密码。"></el-step>
      <el-step title="步骤 4" description="恭喜您完成修改。"></el-step>
    </el-steps>

    <div style="width: 60%;margin-left: 15%;margin-top: 30px;" id="email">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                  ]"
        >
          <el-input v-model="dynamicValidateForm.email"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button type="primary" @click="login">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="width: 60%;margin-left: 15%;margin-top: 30px;display: none" id="code">
      <el-form :model="codeform"  label-width="100px" class="demo-dynamic">
        <el-form-item>
          <el-button type="primary" @click="sendcode">查看邮箱</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="width: 60%;margin-left: 15%;margin-top: 30px;display: none" id="password">
      <el-form :model="passwordform" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="password"
          label="密码">
          <el-input type="password" v-model="passwordform.password"></el-input>
        </el-form-item>

        <el-form-item
          prop="password2"
          label="再次输入密码">
          <el-input type="password" v-model="passwordform.password2"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updatePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="width: 60%;margin-left: 15%;margin-top: 30px;display: none" id="message">
      <p>恭喜您修改成功,请<a @click="login" style="font-size: 20px">登录</a>,或等待<span style="color: red;font-size: 20px;">{{count}}</span>秒后自动跳转。</p>
    </div>

  </div>
</template>

<script>
    export default {
        name: "updatePassword",
        data(){
          return{
            dynamicValidateForm: {
              email: ''
            },
            codeform:{},
            passwordform:{},
            active: 0,
            count:"",//倒计时
          }
        },
      mounted(){
        this.active = this.$route.query.ss;
        this.$data.dynamicValidateForm.email = this.$route.query.email;
        if(this.active!=null){
          $("#email").css("display","none");

          $("#code").css("display","none");

          $("#password").css("display","block");

        }
      },
      methods:{
        submitForm(formName) {

          this.$refs[formName].validate((valid) => {

            if (valid) {

               this.$axios.post(this.domain.serverpath+"selEmail?email="+this.$data.dynamicValidateForm.email).then((res)=>{

                 if(res.data.code==200){

                   this.active = 1;

                   $("#email").css("display","none");

                   $("#code").css("display","block");

                   this.$message({
                     message: "验证码已发送到您的邮箱!",
                     type: 'success',
                     duration:2000
                   });

                 }else{

                   this.active = 0;
                   this.$message.error(res.data.error);
                 }

               });

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        sendcode(){

          let str = this.$data.dynamicValidateForm.email;

          $("#code").css("display","none");

          $("#password").css("display","block");

          if(str.indexOf("qq")>0){

            location = "https://mail.qq.com/";

          }
          if(str.indexOf("163")>0){
            location = "https://mail.163.com/";
          }

        },
        updatePassword(){


          let s1 = this.$data.passwordform.password;

          let s2 = this.$data.passwordform.password2;

          if(s1==s2){

            this.$axios.post(this.domain.serverpath+"selUpdatePassword?password="+this.$data.passwordform.password+"&email="+this.$data.dynamicValidateForm.email).then((res)=>{

              if(res.data.code==200){

                this.$message({
                  message: "修改成功!!",
                  type: 'success',
                  duration:2000
                });

                this.active = 4;
                $("#password").css("display","none");
                $("#message").css("display","block");

                this.startDivi();

              }else{

                this.$message.error(this.data.error);

              }

            });

          }else{

            this.$message.error("您两次输入的密码不一致，请重新输入!");

          }

        },
        login(){

          this.$router.push("/");

        },
        startDivi(){
          const TIME_COUNT = 5;
          if(!this.timer){
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(()=>{
              if(this.count > 0 && this.count <= TIME_COUNT){
                this.count--;
              }else{
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                //跳转的页面写在此处
                this.$router.push({
                  path: '/'
                });
              }
            },1000)
          }
        },
      }
    }
</script>

<style scoped>

</style>
