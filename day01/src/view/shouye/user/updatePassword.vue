<template>
  <div style="margin-top: 30px;width: 80%;margin-left: 10%">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="步骤 1" description="请输入您的邮箱，接收验证码。"></el-step>
      <el-step title="步骤 2" description="请输入您邮箱接收到的验证码。"></el-step>
      <el-step title="步骤 3" description="修改密码。"></el-step>
      <el-step title="步骤 4" description="恭喜您完成修改。"></el-step>
    </el-steps>

    <div style="width: 60%;margin-left: 15%;margin-top: 20px;" id="email">
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

    <div style="width: 60%;margin-left: 15%;margin-top: 20px;display: none" id="code">
      <el-form :model="codeform"  label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="code"
          label="验证码">
          <el-input v-model="codeform.code"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sendcode">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="width: 60%;margin-left: 15%;margin-top: 20px;display: none" id="password">
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


    <div style="width: 60%;margin-left: 15%;margin-top: 20px;display: none" id="message">
      <p>恭喜您修改成功,请<a @click="login">登录</a>。</p>
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
            active: 0
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
                   this.$message.error("发送失败!");
                 }

               });

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        sendcode(){

          this.$axios.post(this.domain.serverpath+"selEmailCode?code="+this.$data.codeform.code+"&email="+this.$data.dynamicValidateForm.email).then((res)=>{

            if(res.data.code==200){

              this.active = 2;

              $("#password").css("display","block");

              $("#code").css("display","none");

            }else{

              this.active = 1;

              this.$message.error(res.data.error);

            }

          });

        },
        updatePassword(){
          this.active = 4;
          $("#password").css("display","none");
          $("#message").css("display","block");

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

              }else{

                this.$message.error("修改失败!");

              }

            });

          }else{

            this.$message.error("您两次输入的密码不一致，请重新输入!");

          }

        },
        login(){

          this.$router.push("/");

        }
      }
    }
</script>

<style scoped>

</style>
