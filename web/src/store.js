import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import service from "@/utils/service";
Vue.use(Vuex);
let vue = null;
const state = {
  // 当前登录用户
  userInfo: {
    id: "",
    username: "",
    password: "",
    online: "",
    friends: "",
    unread: "",
  },
  WS: null,
  allUsers: [],
  applyList: [],
  newMsg: {},
};

const mutations = {
  setUser(state, value) {
    state.userInfo = Object.assign(state.userInfo, value);
  },
  setAllUser(state, value) {
    state.allUsers = value;
  },
  setWS(state, value) {
    console.log("修改WS对象", value);
    state.WS = value;
    // 保存在sessionStorage中
    window.WS = value;
    // sessionStorage.setItem("WS", JSON.stringify(value));
  },
  setApplyList(state, value) {
    state.applyList = value;
  },
  setNewMsg(state, value) {
    state.newMsg = value;
  },
};
const actions = {
  initWebsocket({ commit, state }, vueContext) {
    vue = vueContext;
    console.log("监听系统消息中");
    state.WS.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      // 收到新消息就更新用户的信息
      console.log("新消息:", data);
      if (data.type === "apply") {
        // 收到添加朋友申请
        service.fetchAudit({ userId: state.userInfo.id }).then((res) => {
          commit("setApplyList", res);
        });
      } else if (data.type === "approve") {
        // 收到审批通过申请
        service.fetchUser(state.userInfo.id).then((res) => {
          commit("setUser", res);
        });
        service.fetchAudit({ userId: state.userInfo.id }).then((res) => {
          commit("setApplyList", res);
        });
      } else if (data.type === "user") {
        // 收到有新用户注册广播
        service.fetchAllUser().then((res) => {
          commit("setAllUser", res);
        });
      } else if (data.type === "msg") {
        // 收到新消息
        commit("setNewMsg", data.data);
      } else if (data.type === "reject") {
        vueContext.$message({
          type: "warning",
          message: `你添加朋友${vue.getUsername(data.data)}的申请被拒绝`,
        });
      }
    };
  },
};
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export default store;
