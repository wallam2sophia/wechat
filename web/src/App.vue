<template>
  <div id="app">
    <div class="sidebar">
      <!-- <mycard></mycard> -->
      <div class="msglist">
        <!-- <search></search> -->
        <userCenter class="user-center"></userCenter>
        <chatList class="chat-list"></chatList>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import userCenter from "./components/userCenter";
import chatList from "./components/chatList";
import service from "./utils/service";
export default {
  components: {
    userCenter,
    chatList,
  },
  data() {
    return {
      sysMsgs: [],
    };
  },
  created() {},
  mounted() {
    if (this.userInfo.id) {
      this.fetchUser();
      this.fetchSys();
      this.fetchAllUser();
      this.$store.commit(
        "setWS",
        new WebSocket(this.WSURL + "/" + this.userInfo.id)
      );
      this.WS.onopen = () => {
        console.log("成功连上WS服务器");
      };
      this.$store.dispatch("initWebsocket", this);
    }
  },

  watch: {
    userInfo: {
      deep: true,
      handler(oldVal, newVal) {
        this.fetchUser();
        this.fetchSys();
        this.fetchAllUser();
        this.$store.commit(
          "setWS",
          new WebSocket(this.WSURL + "/" + this.userInfo.id)
        );
        this.WS.onopen = () => {
          console.log("成功连上WS服务器");
        };
        this.$store.dispatch("initWebsocket", this);
      },
    },
  },
  methods: {
    fetchUser() {
      service.fetchUser(this.userInfo.id).then((res) => {
        this.$store.commit("setUser", res);
      });
    },
    fetchSys() {
      service.fetchAudit({ userId: this.userInfo.id }).then((res) => {
        this.$store.commit("setApplyList", res);
      });
    },
    fetchAllUser() {
      service.fetchAllUser().then((res) => {
        this.$store.commit("setAllUser", res);
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
#app {
  display: flex;
  margin: 20px auto;
  width: 860px;
  height: 600px;
  background-color: #fff;

  .sidebar {
    width: 160px;
    height: 600px;

    .user-center {
      height: 50px;
      background: #303f9f;
      color: #fff;
      text-align: center;
      line-height: 50px;
    }

    .chat-list {
      // padding-top: 20px;
      // padding-left: 20px;
    }
  }

  .main {
    flex: 1;
    height: 600px;
    background: #f2f2f2;
  }
}
</style>
