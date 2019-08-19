<template>
  <div style="margin: 10px">
    <div style="float: left">
      <el-button type="primary" @click="addRole()" v-show="addRoleButton">添加</el-button>
      <el-button type="primary" @click="downloadExcel()">下载模板</el-button>
    </div>
    <div class="demo-input-suffix" style="float: right;margin-right: 50px">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称">
              <el-input v-model="where.rname" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
          </el-col>
          <el-button icon="el-icon-search" @click="getlist(pageInfo.page,pageInfo.rows)" circle style="margin-left: 10px"></el-button>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="角色名"
        prop="roleName">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>角色名: {{ scope.row.roleName }}</p>
            <p>描述: {{ scope.row.miaoShu }}</p>
            当前绑定的用户:<p>{{scope.row.userName}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        prop="miaoShu">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <div>操作</div>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)" v-show="updateRoleButton">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" v-show="delRoleButton">Delete</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="bindingMenu(scope.$index, scope.row)" v-show="addRoleAndMenu">绑定权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--绑定权限-->
    <el-dialog title="绑定权限" :visible.sync="bindingMenuModel">
      <el-form :model="entityMod">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="entityMod.roleName" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="entityMod.miaoShu" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
      <div class="custom-tree-container">
        <div class="block">
          <p>权限列表信息</p>
          <el-tree
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys=this.$data.defaultShu
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindingMenuModel = false">取 消</el-button>
        <el-button type="primary" @click="bindingMenuAndRole">确 定</el-button>
      </div>
    </el-dialog>



    <div class="block" style="text-align: center;margin-top: 5px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size=pageInfo.rows
        layout="total, sizes, prev, pager, next, jumper"
        :total=pageInfo.total>
      </el-pagination>
    </div>

    <!--修改form-->
    <el-dialog title="更新数据" :visible.sync="updateModel">
      <el-form :model="entityMod">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="entityMod.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="entityMod.miaoShu" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input v-model="entityMod.leval" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateModel = false">取 消</el-button>
        <el-button type="primary" @click="updateRole()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "roleCrud",
      data() {
        return {
          addRoleButton:false,
          updateRoleButton:false,
          delRoleButton:false,
          addRoleAndMenu:false,
          tableData: [],
          entityMod:{},
          where:{rname:""},
          pageInfo:{
            page:1,
            rows:10
          },
          updateModel:false,
          formLabelWidth:'120px',
          multipleSelection: [],
          ids:[],
          bindingMenuModel:false,
          defaultProps: {
            children: 'menuInfoList',
            label: 'menuName'
          },
          menuList:[],
          defaultShu:[],
          checkMeuns:[],
          currentUser:window.JSON.parse(window.localStorage.getItem("userInfo")),
        }
      },
      mounted(){

          if(this.$data.currentUser.authmap['http://localhost:10000/addRole']===""){
            this.addRoleButton=true;
          }

          if(this.$data.currentUser.authmap['http://localhost:10000/updateRole']===""){
            this.updateRoleButton=true;
          }

          if(this.$data.currentUser.authmap['http://localhost:10000/delRole']===""){
            this.delRoleButton=true;
          }

          if(this.$data.currentUser.authmap['http://localhost:10000/addMenuAndRole']===""){
            this.addRoleAndMenu=true;
          }

          /*查询角色列表*/
        this.$axios.post(this.domain.serverpath+"selRole?rname="+this.where.rname).then((res)=>{

          console.log(res);

          this.tableData = res.data.list;

          this.pageInfo.page = res.data.pageNum;

          this.pageInfo.rows = res.data.pageSize;

          this.pageInfo.total = res.data.total;

        });

        console.log(this.$data.currentUser)

        /*查询菜单列表*/
        this.$axios.post(this.domain.serverpath+"selAllMenuByRoleId?rid="+this.$data.currentUser.role.id).then((reponse)=>{

          this.menuList = reponse.data

        });

      },
      methods: {
        //列表下载
        downloadExcel() {
          this.$confirm('确定下载列表文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.excelData = []; //你要导出的数据list。
            this.export2Excel();
          }).catch(() => {

          });
        },
        //数据写入excel
        export2Excel() {
          var that = this;
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/excel/export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const tHeader = ['角色ID','角色名称','角色描述','角色等级']; // 导出的表头名信息
            const filterVal = ['id','roleName', 'miaoShu', 'leval']; // 导出的表头字段名，需要导出表格字段名
            const list = [];
            const data = that.formatJson(filterVal, list);

            export_json_to_excel(tHeader, data, '角色模板');// 导出的表格名称，根据需要自己命名
          })
        },
        //格式转换，直接复制即可
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
        handleSelectionChange(val) {
          console.log(val);
          this.ids = [];

          for(let i=0;i<val.length;i++){

            this.ids[i] = val[i].id;

          }

          /*this.ids = val.map(item=>item.id);*/

          console.log(this.ids);

        },
        handleEdit(index, row) {

          this.updateModel = true;

          this.entityMod = {};

          this.entityMod = row;

          console.log(index, row);
        },
        bindingMenu(index, row){
          /*回显权限*/

          console.log(row);
          if(row.leval<this.$data.currentUser.rleval){

            this.$message.error("您没有权限,不能更改该等级的权限!");

          }else{

            this.entityMod = {};

            this.defaultShu.length=0;

            console.log(this.defaultShu);

            this.entityMod = row;
            /*通过一个根据角色id菜单全查的方法*/
            this.$axios.post(this.domain.serverpath+"selMenuByRoleId?id="+this.entityMod.id).then((res)=>{

              console.log(res)

              let defaultMenu = res.data;

              if(defaultMenu.length > 0){

                /*挑选出最低的权限的id*/
                for (let a = 0; a < defaultMenu.length; a++){

                  if(defaultMenu[a].leval==4){

                    this.defaultShu[a] = defaultMenu[a].id;

                  }

                }

                /*this.defaultShu = this.defaultShu.concat(m1);*/

                console.log(this.defaultShu);

                setTimeout(() => {

                  this.$refs.tree.setCheckedKeys(this.defaultShu), 0

                });

              }else{

                setTimeout(() => {

                  this.$refs.tree.setCheckedKeys(this.defaultShu),0

                });

              }

            });

            this.bindingMenuModel = true;

          }

        },
        bindingMenuAndRole(){

          console.log(this.$refs.tree.getHalfCheckedKeys()+','+this.$refs.tree.getCheckedKeys());

          let str = '';

          if(this.$refs.tree.getHalfCheckedKeys().length==0){

            str = this.$refs.tree.getHalfCheckedKeys()+','+this.$refs.tree.getCheckedKeys();

            str = str.substring(1);

          }else{

            str = this.$refs.tree.getHalfCheckedKeys()+','+this.$refs.tree.getCheckedKeys();

          }

          let ids = str.split(",");

          console.log(ids);

          this.$axios.post(this.domain.serverpath+"addMenuAndRole?ids="+ids+"&rid="+this.entityMod.id).then((res)=>{

              if(res.data==true){

                this.$message({
                  message: '恭喜你，绑定成功！',
                  type: 'success',
                  duration:2000
                });

                this.getlist(this.pageInfo.page,this.pageInfo.rows);

                this.bindingMenuModel = false;

              }else{

                this.$message.error('错了哦，绑定失败,无权限!');

                this.bindingMenuModel = false;

              }

          }).catch((res)=>{

            this.$message.error("您没有权限,不能访问该资源!");

          });

        },
        updateRole(){

          if(this.entityMod.id==null){

            if(this.entityMod.leval<this.$data.currentUser.rleval){

              this.$message.error("您无权添加比您权限高的角色!");

              this.updateModel = false;

            }else{

              this.$axios.post(this.domain.serverpath+"addRole",this.entityMod).then((res)=>{

                if(res){

                  this.$message({
                    message: '恭喜你，添加成功！',
                    type: 'success',
                    duration:2000
                  });

                  this.updateModel = false;

                  this.getlist(this.pageInfo.page,this.pageInfo.rows);

                }else{

                  this.$message.error("添加失败,无权限!");

                }

              }).catch((res)=>{

                this.$message.error("您没有权限,不能访问该资源!");

              });

            }

          }else{

            this.$axios.post(this.domain.serverpath+"updateRole",this.entityMod).then((res)=>{

              if(res){

                this.$message({
                  message: '恭喜你，修改成功！',
                  type: 'success',
                  duration:2000
                });

                this.updateModel = false;

                this.getlist(this.pageInfo.page,this.pageInfo.rows);

              }else{

                this.$message.error("修改失败,无权限!");

              }

            }).catch((res)=>{

              this.$message.error("您没有权限,不能访问该资源!");

              this.updateModel = false;

            });

          }

        },
        handleDelete(index, row) {

          this.ids[0] = row.id;

          this.$axios.post(this.domain.serverpath+"delRole",this.ids).then((res)=>{

            if(res){

              this.$message({
                message: '恭喜你，删除成功！',
                type: 'success',
                duration:2000
              });

              this.getlist(this.pageInfo.page,this.pageInfo.rows);

            }else{

              this.$message.error("删除失败,无权限!");

            }

          }).catch((res)=>{

            this.$message.error("您没有权限,不能访问该资源!");

          });

          console.log(index, row);
        },
        getlist(page,rows){

          this.$axios.post(this.domain.serverpath+"selRole?rname="+this.where.rname+"&page="+page+"&rows="+rows).then((res)=>{

            console.log(res);

            this.tableData = res.data.list;

            this.pageInfo.page = res.data.pageNum;

            this.pageInfo.rows = res.data.pageSize;

            this.pageInfo.total = res.data.total;

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
        addRole(){

          this.updateModel = true;

          this.entityMod = {};

        },

      }
    }
</script>

<style scoped>

</style>
