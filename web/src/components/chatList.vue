<template>
  <div class="msglist">
    <div class="text-btn li-block" @click="inputShow = true">+添加朋友</div>
    <el-input
      v-model="value"
      size="small"
      class="add-input"
      v-show="inputShow"
      @keyup.enter.native="addFriend"
    ></el-input>
    <ul>
      <li
        v-for="item in friendsList"
        class="list-item"
        :class="{ active: item === selectId }"
        @click="selectFriends(item)"
        :key="item.id"
      >
        <div class="name">
          <span
            :class="{
              'unread-dot': newMsg.sender === item && item !== selectId,
            }"
            >{{ getUsername(item) }}</span
          >
        </div>
        <!-- <div class="list-left">
          <img class="avatar" width="42" height="42" :alt="item.user.name" :src="item.user.img">
        </div> -->
      </li>
    </ul>
  </div>
</template>

<script>
import service from "../utils/service";
export default {
  data() {
    return {
      value: "",
      list: [],
      selectId: null,
      inputShow: false,
    };
  },
  computed: {
    friendsList() {
      if (!this.$store.state.userInfo.friends) {
        return [];
      }
      return JSON.parse(this.$store.state.userInfo.friends);
    },
    newMsg() {
      return this.$store.state.newMsg;
    },
  },
  watch: {
    friendsList: {
      deep: true,
      handler(val, oldVal) {
        if (this.friendsList.length > 0) {
          this.selectFriends(this.friendsList[this.friendsList.length - 1]);
        } else {
          this.$router.push("404");
        }
      },
    },
    $route: {
      deep: true,
      handler(val, oldVal) {
        if (this.$route.name === "chat") {
          this.selectId = this.$route.query.id;
        }
      },
    },
  },
  mounted() {
    // if (this.friendsList.length > 0) {
    //   this.selectFriends(this.friendsList[0]);
    // } else {
    //   this.$router.push("404");
    // }
    this.selectId = this.$route.query.id || null;
  },
  methods: {
    selectFriends(id) {
      this.selectId = id;
      if (this.newMsg.sender === id) {
        this.$store.commit("setNewMsg", {});
      }
      this.$router.push({
        name: "chat",
        query: {
          id: id,
        },
      });
    },
    addFriend() {
      this.inputShow = false;
      if (!this.$store.state.userInfo.id) {
        this.$message({
          type: "error",
          message: "请先登录或注册",
        });
        return false;
      }
      let sendObj = {
        userId: this.$store.state.userInfo.id,
        friendName: this.value,
      };
      this.value = "";
      service
        .addFriend(sendObj)
        .then((res) => {
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.msg,
          });
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.msglist {
  overflow-y: auto;

  .li-block {
    height: 40px;
    line-height: 40px;
    margin-left: 20px;
  }

  .list-item {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    color: #303f9f;
    background-color: #e5eaf4;
    cursor: pointer;
    border-bottom:1px solid #fff;
    &:hover {
      background-color: #ff7963;
      color: #fff;
    }

    &.active {
      background-color: #ff7963;
      color: #fff;
    }

    .avatar {
      border-radius: 2px;
      margin-right: 12px;
    }

    .list-right {
      position: relative;
      flex: 1;
      margin-top: 4px;
    }

    .name {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      .unread-dot::after {
        margin-left:5px;
        content:'';
        display:inline-block;
        width:6px;
        height:6px;
        background-color :#f00;
        border-radius:100%;
        line-height:19px;
      }
    }

    .time {
      float: right;
      color: #999;
      font-size: 10px;
      vertical-align: top;
    }

    .lastmsg {
      position: absolute;
      font-size: 12px;
      width: 130px;
      height: 15px;
      line-height: 15px;
      color: #999;
      bottom: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
