<template>
  <div class="home">
    <div @click="handleLogin" class="big-btn main-color">登录</div>
    <div @click="handleRegister" class="big-btn minor-color">注册</div>
  </div>
</template>

<script>
import service from "./utils/service";
export default {
  watch:{
    
  },
  methods: {
    handleLogin() {
      this.$router.push("/login");
    },
    handleRegister() {
      this.$router.push("/register");
    }
  }
};
</script>

<style lang="stylus" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;

  .big-btn {
    padding: 10px 16px;
    line-height: 100%;
    border-radius: 4px;
    cursor: pointer;
    width: 150px;
    text-align: center;

    &:hover {
      opacity: 0.8;
    }

    +.big-btn {
      margin-top: 10px;
    }
  }

  .main-color {
    background-color: #303f9f;
    color: #fff;
    border: 1px solid #303f9f;
  }

  .minor-color {
    border: 1px solid #930078;
    color: #930078;
    background-color: #fff;
  }
}
</style>
