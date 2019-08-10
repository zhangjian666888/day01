<template>
  <div style="margin: 10px">
    <div style="float: left">
      <el-button type="primary" @click="addUser()">添加</el-button>

    </div>
    <div class="demo-input-suffix" style="float: right">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="名称">
              <el-input v-model="where.username" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="开始日期:">
              <!--<input type="date" v-model="where.startDate"/>-->
              <el-date-picker type="date" placeholder="选择日期" v-model="where.startDate" style="width: 100%;" value-format=" yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结束日期:">
              <!--<input type="date" v-model="where.endDate"/>-->
              <el-date-picker type="date" placeholder="选择日期" v-model="where.endDate" style="width: 100%;" value-format=" yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别:">
              <el-select v-model="where.sex" placeholder="请选择">
                <el-option label="" value=""></el-option>
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button icon="el-icon-search" @click="getlist(pageInfo.page,pageInfo.rows)" circle></el-button>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
       @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p><el-image
            style="width: 30px; height: 30px"
            :src="'http://localhost:8090/'+scope.row.photo"></el-image></p>
            <p>用户名: {{ scope.row.username }}</p>
            <p>登录名: {{ scope.row.loginname }}</p>
            <p>性别: {{ scope.row.sex }}</p>
            <p>电话: {{ scope.row.tel }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="登录名"
        prop="loginname">
      </el-table-column>
      <el-table-column
        label="性别"
        prop="sex">
        <template slot-scope="scope">
          {{scope.row.sex==1?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        prop="tel">
      </el-table-column>
      <el-table-column
        label="头像"
        prop="photo">
        <template   slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="'http://localhost:8090/'+scope.row.photo"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        prop="rname">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>角色名: {{ scope.row.rname }}</p>
            <p>描述: {{ scope.row.rdesc }}</p>
            <p><el-button type="danger" size="mini" round @click="removeRole(scope.row)" >解除绑定</el-button></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-if="scope.row.rname!=null">{{ scope.row.rname }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <div>操作</div>
        </template>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit" circle
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button
            type="danger" icon="el-icon-delete" circle
            @click="handleDelete(scope.$index, scope.row)"></el-button>
          <el-button
            type="success"
            icon="el-icon-share" circle
            @click="bindingRole(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="text-align: center;margin-top: 5px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size=this.pageInfo.rows
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.pageInfo.total>
      </el-pagination>
    </div>

    <!--修改form-->
    <el-dialog title="修改用户" :visible.sync="updateModel">
      <el-form :model="entityMod">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="entityMod.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="entityMod.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登陆名称" :label-width="formLabelWidth">
          <el-input v-model="entityMod.loginname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-radio-group v-model="entityMod.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="entityMod.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="http://localhost:8889/toUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateModel = false">取 消</el-button>
        <el-button type="primary" @click="updateUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!--绑定角色-->
    <el-dialog title="绑定角色" :visible.sync="bindingRoleModel">
      <template>
        角色：<el-select v-model="roleId" filterable placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindingRoleModel = false">取 消</el-button>
        <el-button type="primary" @click="binding">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "userCrud",
      data() {
        return {
          tableData: [],
          entityMod:{},
          where:{username:"",startDate:"",endDate:"",sex:""},
          pageInfo:{
            page:1,
            rows:10
          },
          updateModel:false,
          addModel:false,
          formLabelWidth:'120px',
          imageUrl: '',
          multipleSelection: [],
          ids:[],
          bindingRoleModel:false,
          roles:[],
          roleId:""
        }
      },
      mounted(){
        this.$axios.post(this.domain.serverpath+"selUser?username="+this.where.username+"&startDate="+this.where.startDate+"&endDate="+this.where.endDate+"&sex="+this.where.sex).then((res)=>{

          console.log(res);

          this.tableData = res.data.pageInfo.list;

          this.pageInfo.page = res.data.pageInfo.pageNum;

          this.pageInfo.rows = res.data.pageInfo.pageSize;

          this.pageInfo.total = res.data.pageInfo.total;

        });

        this.$axios.post(this.domain.serverpath+"selAllRole").then((res)=>{

          console.log(res);

          this.roles = res.data;

        });
      },
      methods: {
        handleSelectionChange(val) {
          console.log(val);
          this.ids = [];

          for(let i=0;i<val.length;i++){

            this.ids[i] = val[i].id;

          }

          /*this.ids = val.map(item=>item.id);*/

          console.log(this.ids);

        },
        beforeAvatarUpload(file) {

          this.entityMod.photo = file.name;

        },
        handleAvatarSuccess(res, file) {

          this.imageUrl = URL.createObjectURL(file.raw);

        },
        /*解除绑定*/
        removeRole(row){

          console.log(row);

          this.$axios.post(this.domain.serverpath+"delUserAndRole?userId="+row.id+"&roleId="+row.rid).then((res)=>{

            if(res.data.code==200){

              this.$message({
                message: res.data.success,
                type: 'success',
                duration:2000
              });

              this.getlist(this.pageInfo.page,this.pageInfo.rows);

            }else{

              this.$message.error("解除失败!");

            }

          });

        },
        bindingRole(index, row){

          this.bindingRoleModel = true;

          this.entityMod = {};

          this.entityMod = row;

        },
        binding(){

          this.$axios.post(this.domain.serverpath+"selUserAndRole?uid="+this.entityMod.id).then((res)=>{

              if(res.data.code==200){

                this.$axios.post(this.domain.serverpath+"addUserAndRole?rid="+this.roleId+"&uid="+this.entityMod.id).then((res)=>{

                  if(res.data.code==200){

                    this.$message({
                      message: res.data.success,
                      type: 'success',
                      duration:2000
                    });

                    this.bindingRoleModel = false;

                    this.getlist(this.pageInfo.page,this.pageInfo.rows);

                  }else{

                    this.bindingRoleModel = false;

                    this.$message.error(res.data.error);

                  }

                });

              }else{

                this.bindingRoleModel = false;

                this.$message.error(res.data.error);

              }

          });

        },
        handleEdit(index, row) {

          this.updateModel = true;

          this.imageUrl = '';

          this.entityMod = {};

          this.imageUrl = "http://localhost:8090/"+row.photo;

          this.entityMod = row;

          console.log(index, row);
        },
        updateUser(){

          if(this.entityMod.id==null){

            this.$refs.upload.submit();

            this.$axios.post(this.domain.serverpath+"addUser",this.entityMod).then((res)=>{

              if(res.data.code==200){

                this.$message({
                  message: res.data.success,
                  type: 'success',
                  duration:2000
                });

                this.updateModel = false;

                this.getlist(this.pageInfo.page,this.pageInfo.rows);

              }else if(res.data.code==505){

                this.updateModel = false;

                this.$message.error(res.data.success);

              }else{

                this.updateModel = false;

                this.$message.error(res.data.error);

              }

            });

          }else{

            this.$refs.upload.submit();

            this.$axios.post(this.domain.serverpath+"updateUser",this.entityMod).then((res)=>{

              if(res.data.code==200){

                this.$message({
                  message: res.data.success,
                  type: 'success',
                  duration:2000
                });

                this.updateModel = false;

                this.getlist(this.pageInfo.page,this.pageInfo.rows);

              }else{

                this.updateModel = false;

                this.$message.error(res.data.error);

              }

            });

          }


        },
        handleDelete(index, row) {

          console.log(row.id);

          this.ids[0] = row.id;

          this.$axios.post(this.domain.serverpath+"delUser",this.ids).then((res)=>{

            if(res.data.code==200){

              this.$message({
                message: res.data.success,
                type: 'success',
                duration:2000
              });

              this.getlist(this.pageInfo.page,this.pageInfo.rows);

            }else{

              console.log(res)

              this.$message.error(res.data.error);

            }

          });

          console.log(index, row);
        },
        getlist(page,rows){

          this.$axios.post(this.domain.serverpath+"selUser?username="+this.where.username+"&startDate="+this.where.startDate+"&endDate="+this.where.endDate+"&sex="+this.where.sex+"&page="+page+"&rows="+rows).then((res)=>{

            console.log(res);

            this.tableData = res.data.pageInfo.list;

            this.pageInfo.page = res.data.pageInfo.pageNum;

            this.pageInfo.rows = res.data.pageInfo.pageSize;

            this.pageInfo.total = res.data.pageInfo.total;

          });

        },
        handleSizeChange(val) {

          this.pageInfo.rows = val;

          this.getlist(this.pageInfo.page,val);

          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {

          this.pageInfo.page = val;

          this.getlist(val,this.pageInfo.rows);

          console.log(`当前页: ${val}`);
        },
        addUser(){

          this.updateModel = true;

          this.entityMod = {};

          this.imageUrl = '';

        },

      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
