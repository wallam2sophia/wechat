<template>
  <div class="login-cmp">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div class="group-btns">
      <div @click="onSubmit" class="middle-btn main-color">提交</div>
      <div @click="onCancel" class="middle-btn minor-color">取消</div>
    </div>
  </div>
</template>

<script>
import service from "../utils/service";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      service
        .login(this.form)
        .then((res) => {
          this.$store.commit("setUser", res);
          this.$router.push("/");
          this.$message({
            type: "success",
            message: "登录成功",
          });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.msg,
          });
        });
    },
    onCancel() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="stylus" scoped>
.login-cmp {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 60%;
  }
}
</style>
