<template>
  <div class="user-center">
    <div v-if="userInfo.username">
      <span style="position: relative">{{ userInfo.username }}</span>
      <span
        @click="handleSysMsg"
        class="msg-badge"
        v-if="applyList.length > 0"
        >{{ applyList.length }}</span
      >
    </div>
    <div v-else>请先登录或注册</div>
  </div>
</template>

<script>
import service from "../utils/service";
export default {
  // props: {
  //   list: {
  //     type: Array
  //   }
  // },
  data() {
    return {};
  },
  computed: {
    applyList() {
      return this.$store.state.applyList;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    handleSysMsg() {
      this.$router.push({
        name: "sysMsg",
        query: {
          list: this.applyList,
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.user-center {
  .msg-badge {
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    position: relative;
    top: 0;
    right: 30px;
    transform: translateY(-50%) translateX(100%);
    cursor:pointer
  }
}
</style>
