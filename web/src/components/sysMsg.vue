<template>
  <div class="msg-list">
    <el-card
      v-for="item in list"
      class="msg-card"
      :class="{ active: item.id === selectId }"
      @click="selectFriends(item.id)"
      :key="item.id"
    >
      <div class="flex-div">
        <div>用户【{{ getUsername(item.applier) }}】申请添加您为朋友</div>
        <div class="group-btns fl-r">
          <div class="small-btn main-color" @click="handleApply(item, '1')">
            通过
          </div>
          <div class="small-btn minor-color" @click="handleApply(item, '-1')">
            拒绝
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import service from "../utils/service";
export default {
  data() {
    return {
      list: [],
      selectId: null,
      inputShow: false,
    };
  },
  watch: {
    $route: {
      deep: true,
      handler(oldVal, newVal) {
        this.list = [].concat(this.$route.query.list);
      },
    },
  },
  mounted() {
    this.list = [].concat(this.$route.query.list);
  },
  methods: {
    handleApply(item, status) {
      let sendObj = {
        userId: item.approver,
        friendId: item.applier,
        applyId: item.id,
        status: status,
      };
      service.setAudit(sendObj).then((res) => {
        this.$message({
          type: "success",
          message: "处理成功",
        });
        this.$router.push("/");
      });
    },
    selectFriends(fId) {
      this.selectId = fId;
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
      service.addFriend(sendObj).then((res) => {
        this.$message({
          type: "success",
          message: res.msg,
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.msg-list {
  height: 540px;
  overflow-y: auto;
  width: 80%;
  margin: 20px auto;

  .msg-card {
    background-color: #fcfcfc;
    margin-bottom: 20px;
    color: #333;

    &:hover {
      background-color: rgb(220, 220, 220);
    }

    &.active {
      background-color: #c4c4c4;
    }

    .flex-div {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
<style lang="stylus">
.msg-card {
  .el-card__body {
    padding: 10px;
  }
}
</style>
